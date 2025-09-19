import random, shutil, sqlite3, configparser, hashlib, ipaddress, json, os, secrets, subprocess
import time, re, urllib.error, uuid, bcrypt, psutil, pyotp, threading
from uuid import uuid4
from zipfile import ZipFile
from datetime import datetime, timedelta
from typing import Any
from jinja2 import Template
from flask import Flask, request, render_template, session, send_file
from json import JSONEncoder
from flask_cors import CORS
from icmplib import ping, traceroute
from flask.json.provider import DefaultJSONProvider
from itertools import islice
from Utilities import (
    RegexMatch, GetRemoteEndpoint, StringToBoolean,
    ValidateIPAddressesWithRange, ValidateDNSAddress,
    GenerateWireguardPublicKey, GenerateWireguardPrivateKey
)
from packaging import version
from modules.Email import EmailSender
from modules.Log import Log
from modules.DashboardLogger import DashboardLogger
from modules.PeerJobLogger import PeerJobLogger
from modules.PeerJob import PeerJob
from modules.SystemStatus import SystemStatus
from modules.FirewallManager import FirewallManager
from modules.RouteManager import RouteManager
from modules.LoggingManager import LoggingManager
from modules.UserManager import UserManager
from modules.RBACManager import RBACManager
from modules.OrganizationManager import OrganizationManager
from modules.EnhancedRBACManager import EnhancedRBACManager
SystemStatus = SystemStatus()
FirewallManager = FirewallManager()
RouteManager = RouteManager()
LoggingManager = LoggingManager()
UserManager = UserManager(db_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db', 'users.db'))
RBACManager = RBACManager(db_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db', 'rbac.db'))
OrganizationManager = OrganizationManager(db_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db', 'organization.db'))
enhanced_rbac_manager = EnhancedRBACManager(db_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db', 'rbac.db'))

DASHBOARD_VERSION = 'v4.2.5'

CONFIGURATION_PATH = os.getenv('CONFIGURATION_PATH', '.')
DB_PATH = os.path.join(CONFIGURATION_PATH, 'db')
if not os.path.isdir(DB_PATH):
    os.mkdir(DB_PATH)
DASHBOARD_CONF = os.path.join(CONFIGURATION_PATH, 'wg-dashboard.ini')
UPDATE = None
app = Flask("WGDashboard", template_folder=os.path.abspath("./static/app/dist"))
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 5206928
app.secret_key = secrets.token_urlsafe(32)

class CustomJsonEncoder(DefaultJSONProvider):
    def __init__(self, app):
        super().__init__(app)

    def default(self, o):
        if callable(getattr(o, "toJson", None)):
            return o.toJson()
        return super().default(self)
app.json = CustomJsonEncoder(app)

'''
Response Object
'''
def ResponseObject(status=True, message=None, data=None, status_code = 200) -> Flask.response_class:
    response = Flask.make_response(app, {
        "status": status,
        "message": message,
        "data": data
    })
    response.status_code = status_code
    response.content_type = "application/json"
    return response       

"""
Peer Jobs
"""
class PeerJobs:
    def __init__(self):
        self.Jobs: list[PeerJob] = []
        self.jobdb = sqlite3.connect(os.path.join(CONFIGURATION_PATH, 'db', 'wgdashboard_job.db'),
                                     check_same_thread=False)
        self.jobdb.row_factory = sqlite3.Row
        self.__createPeerJobsDatabase()
        self.__getJobs()

    def __getJobs(self):
        self.Jobs.clear()
        with self.jobdb:
            jobdbCursor = self.jobdb.cursor()
            jobs = jobdbCursor.execute("SELECT * FROM PeerJobs WHERE ExpireDate IS NULL").fetchall()
            for job in jobs:
                self.Jobs.append(PeerJob(
                    job['JobID'], job['Configuration'], job['Peer'], job['Field'], job['Operator'], job['Value'],
                    job['CreationDate'], job['ExpireDate'], job['Action']))
    
    def getAllJobs(self, configuration: str = None):
        if configuration is not None:
            with self.jobdb:
                jobdbCursor = self.jobdb.cursor()
                jobs = jobdbCursor.execute(
                    f"SELECT * FROM PeerJobs WHERE Configuration = ?", (configuration, )).fetchall()
                j = []
                for job in jobs:
                    j.append(PeerJob(
                        job['JobID'], job['Configuration'], job['Peer'], job['Field'], job['Operator'], job['Value'],
                        job['CreationDate'], job['ExpireDate'], job['Action']))
                return j
        return []

    def __createPeerJobsDatabase(self):
        with self.jobdb:
            jobdbCursor = self.jobdb.cursor()
        
            existingTable = jobdbCursor.execute("SELECT name from sqlite_master where type='table'").fetchall()
            existingTable = [t['name'] for t in existingTable]
    
            if "PeerJobs" not in existingTable:
                jobdbCursor.execute('''
                CREATE TABLE PeerJobs (JobID VARCHAR NOT NULL, Configuration VARCHAR NOT NULL, Peer VARCHAR NOT NULL,
                Field VARCHAR NOT NULL, Operator VARCHAR NOT NULL, Value VARCHAR NOT NULL, CreationDate DATETIME,
                ExpireDate DATETIME, Action VARCHAR NOT NULL, PRIMARY KEY (JobID))
                ''')
                self.jobdb.commit()

    def toJson(self):
        return [x.toJson() for x in self.Jobs]

    def searchJob(self, Configuration: str, Peer: str):
        return list(filter(lambda x: x.Configuration == Configuration and x.Peer == Peer, self.Jobs))
    
    def searchJobById(self, JobID):
        return list(filter(lambda x: x.JobID == JobID, self.Jobs))
    
    def saveJob(self, Job: PeerJob) -> tuple[bool, list] | tuple[bool, str]:
        try:
            with self.jobdb:
                jobdbCursor = self.jobdb.cursor()
                if len(self.searchJobById(Job.JobID)) == 0:
                    jobdbCursor.execute('''
                    INSERT INTO PeerJobs VALUES (?, ?, ?, ?, ?, ?, strftime('%Y-%m-%d %H:%M:%S','now'), NULL, ?)
                    ''', (Job.JobID, Job.Configuration, Job.Peer, Job.Field, Job.Operator, Job.Value, Job.Action,))
                    JobLogger.log(Job.JobID, Message=f"Job is created if {Job.Field} {Job.Operator} {Job.Value} then {Job.Action}")
                else:
                    currentJob = jobdbCursor.execute('SELECT * FROM PeerJobs WHERE JobID = ?', (Job.JobID, )).fetchone()
                    if currentJob is not None:
                        jobdbCursor.execute('''
                            UPDATE PeerJobs SET Field = ?, Operator = ?, Value = ?, Action = ? WHERE JobID = ?
                            ''', (Job.Field, Job.Operator, Job.Value, Job.Action, Job.JobID))
                        JobLogger.log(Job.JobID, 
                                      Message=f"Job is updated from if {currentJob['Field']} {currentJob['Operator']} {currentJob['value']} then {currentJob['Action']}; to if {Job.Field} {Job.Operator} {Job.Value} then {Job.Action}")
                
                self.jobdb.commit()
                self.__getJobs()
            return True, list(
                filter(lambda x: x.Configuration == Job.Configuration and x.Peer == Job.Peer and x.JobID == Job.JobID,
                       self.Jobs))
        except Exception as e:
            return False, str(e)

    def deleteJob(self, Job: PeerJob) -> tuple[bool, list] | tuple[bool, str]:
        try:
            if (len(str(Job.CreationDate))) == 0:
                return False, "Job does not exist"
            with self.jobdb:
                jobdbCursor = self.jobdb.cursor()
                jobdbCursor.execute('''
                    UPDATE PeerJobs SET ExpireDate = strftime('%Y-%m-%d %H:%M:%S','now') WHERE JobID = ?
                ''', (Job.JobID,))
                self.jobdb.commit()
            JobLogger.log(Job.JobID, Message=f"Job is removed due to being deleted or finshed.")
            self.__getJobs()
            return True, list(
                filter(lambda x: x.Configuration == Job.Configuration and x.Peer == Job.Peer and x.JobID == Job.JobID,
                       self.Jobs))
        except Exception as e:
            return False, str(e)
        
    def updateJobConfigurationName(self, ConfigurationName: str, NewConfigurationName: str) -> tuple[bool, str] | tuple[bool, None]:
        try:
            with self.jobdb:
                jobdbCursor = self.jobdb.cursor()
                jobdbCursor.execute('''
                        UPDATE PeerJobs SET Configuration = ? WHERE Configuration = ?
                    ''', (NewConfigurationName, ConfigurationName, ))
                self.jobdb.commit()
            self.__getJobs()
            return True, None
        except Exception as e:
            return False, str(e)
        
    
    def runJob(self):
        needToDelete = []
        self.__getJobs()
        for job in self.Jobs:
            c = WireguardConfigurations.get(job.Configuration)
            if c is not None:
                f, fp = c.searchPeer(job.Peer)
                if f:
                    if job.Field in ["total_receive", "total_sent", "total_data"]:
                        s = job.Field.split("_")[1]
                        x: float = getattr(fp, f"total_{s}") + getattr(fp, f"cumu_{s}")
                        y: float = float(job.Value)
                    else:
                        x: datetime = datetime.now()
                        y: datetime = datetime.strptime(job.Value, "%Y-%m-%d %H:%M:%S")
                    runAction: bool = self.__runJob_Compare(x, y, job.Operator)
                    if runAction:
                        s = False
                        if job.Action == "restrict":
                            s = c.restrictPeers([fp.id]).get_json()
                        elif job.Action == "delete":
                            s = c.deletePeers([fp.id]).get_json()
                
                        if s['status'] is True:
                            JobLogger.log(job.JobID, s["status"], 
                                          f"Peer {fp.id} from {c.Name} is successfully {job.Action}ed."
                            )
                            needToDelete.append(job)
                        else:
                            JobLogger.log(job.JobID, s["status"],
                                          f"Peer {fp.id} from {c.Name} failed {job.Action}ed."
                            )
                else:
                    JobLogger.log(job.JobID, False,
                      f"Somehow can't find this peer {job.Peer} from {c.Name} failed {job.Action}ed."
                    )
            else:
                JobLogger.log(job.JobID, False,
                  f"Somehow can't find this peer {job.Peer} from {job.Configuration} failed {job.Action}ed."
                )
        for j in needToDelete:
            self.deleteJob(j)

    def __runJob_Compare(self, x: float | datetime, y: float | datetime, operator: str):
        if operator == "eq":
            return x == y
        if operator == "neq":
            return x != y
        if operator == "lgt":
            return x > y
        if operator == "lst":
            return x < y
        
"""
Peer Share Link
"""
class PeerShareLink:
    def __init__(self, ShareID:str, Configuration: str, Peer: str, ExpireDate: datetime, ShareDate: datetime):
        self.ShareID = ShareID
        self.Peer = Peer
        self.Configuration = Configuration
        self.ShareDate = ShareDate
        self.ExpireDate = ExpireDate
        
    
    def toJson(self):
        return {
            "ShareID": self.ShareID,
            "Peer": self.Peer,
            "Configuration": self.Configuration,
            "ExpireDate": self.ExpireDate
        }

"""
Peer Share Links
"""
class PeerShareLinks:
    def __init__(self):
        self.Links: list[PeerShareLink] = []
        existingTables = sqlSelect("SELECT name FROM sqlite_master WHERE type='table' and name = 'PeerShareLinks'").fetchall()
        if len(existingTables) == 0:
            sqlUpdate(
                """
                    CREATE TABLE PeerShareLinks (
                        ShareID VARCHAR NOT NULL PRIMARY KEY, Configuration VARCHAR NOT NULL, Peer VARCHAR NOT NULL,
                        ExpireDate DATETIME,
                        SharedDate DATETIME DEFAULT (datetime('now', 'localtime'))
                    )
                """
            )
        self.__getSharedLinks()
    def __getSharedLinks(self):
        self.Links.clear()
        allLinks = sqlSelect("SELECT * FROM PeerShareLinks WHERE ExpireDate IS NULL OR ExpireDate > datetime('now', 'localtime')").fetchall()
        for link in allLinks:
            self.Links.append(PeerShareLink(*link))
    
    def getLink(self, Configuration: str, Peer: str) -> list[PeerShareLink]:
        return list(filter(lambda x : x.Configuration == Configuration and x.Peer == Peer, self.Links))
    
    def getLinkByID(self, ShareID: str) -> list[PeerShareLink]:
        self.__getSharedLinks()
        return list(filter(lambda x : x.ShareID == ShareID, self.Links))
    
    def addLink(self, Configuration: str, Peer: str, ExpireDate: datetime = None) -> tuple[bool, str]:
        try:
            newShareID = str(uuid.uuid4())
            if len(self.getLink(Configuration, Peer)) > 0:
                sqlUpdate("UPDATE PeerShareLinks SET ExpireDate = datetime('now', 'localtime') WHERE Configuration = ? AND Peer = ?", (Configuration, Peer, ))
            sqlUpdate("INSERT INTO PeerShareLinks (ShareID, Configuration, Peer, ExpireDate) VALUES (?, ?, ?, ?)", (newShareID, Configuration, Peer, ExpireDate, ))
            self.__getSharedLinks()
        except Exception as e:
            return False, str(e)
        return True, newShareID
    
    def updateLinkExpireDate(self, ShareID, ExpireDate: datetime = None) -> tuple[bool, str]:
        sqlUpdate("UPDATE PeerShareLinks SET ExpireDate = ? WHERE ShareID = ?;", (ExpireDate, ShareID, ))
        self.__getSharedLinks()
        return True, ""

"""
WireGuard Configuration
""" 
class WireguardConfiguration:
    class InvalidConfigurationFileException(Exception):
        def __init__(self, m):
            self.message = m

        def __str__(self):
            return self.message

    def __init__(self, name: str = None, data: dict = None, backup: dict = None, startup: bool = False, wg: bool = True):
        
        
        self.__parser: configparser.ConfigParser = configparser.RawConfigParser(strict=False)
        self.__parser.optionxform = str
        self.__configFileModifiedTime = None
        
        self.Status: bool = False
        self.Name: str = ""
        self.PrivateKey: str = ""
        self.PublicKey: str = ""
        
        self.ListenPort: str = ""
        self.Address: str = ""
        self.DNS: str = ""
        self.Table: str = ""
        self.MTU: str = ""
        self.PreUp: str = ""
        self.PostUp: str = ""
        self.PreDown: str = ""
        self.PostDown: str = ""
        self.SaveConfig: bool = True
        self.Name = name
        self.Protocol = "wg" if wg else "awg"
        self.configPath = os.path.join(self.__getProtocolPath(), f'{self.Name}.conf') if wg else os.path.join(DashboardConfig.GetConfig("Server", "awg_conf_path")[1], f'{self.Name}.conf')
        
        if name is not None:
            if data is not None and "Backup" in data.keys():
                db = self.__importDatabase(
                    os.path.join(
                        self.__getProtocolPath(),
                        'WGDashboard_Backup',
                        data["Backup"].replace(".conf", ".sql")))
            else:
                self.createDatabase()
            
            self.__parseConfigurationFile()
            self.__initPeersList()
            
        else:
            self.Name = data["ConfigurationName"]
            self.configPath = os.path.join(self.__getProtocolPath(), f'{self.Name}.conf')
            
            for i in dir(self):
                if str(i) in data.keys():
                    if isinstance(getattr(self, i), bool):
                        setattr(self, i, StringToBoolean(data[i]))
                    else:
                        setattr(self, i, str(data[i]))
            
            self.__parser["Interface"] = {
                "PrivateKey": self.PrivateKey,
                "Address": self.Address,
                "ListenPort": self.ListenPort,
                "PreUp": f"{self.PreUp}",
                "PreDown": f"{self.PreDown}",
                "PostUp": f"{self.PostUp}",
                "PostDown": f"{self.PostDown}",
                "SaveConfig": "true"
            }
            
            if self.Protocol == 'awg':
                self.__parser["Interface"]["Jc"] = self.Jc
                self.__parser["Interface"]["Jc"] = self.Jc 
                self.__parser["Interface"]["Jmin"] = self.Jmin
                self.__parser["Interface"]["Jmax"] = self.Jmax
                self.__parser["Interface"]["S1"] = self.S1 
                self.__parser["Interface"]["S2"] = self.S2 
                self.__parser["Interface"]["H1"] = self.H1 
                self.__parser["Interface"]["H2"] = self.H2 
                self.__parser["Interface"]["H3"] = self.H3 
                self.__parser["Interface"]["H4"] = self.H4 
                
            if "Backup" not in data.keys():
                self.createDatabase()
                with open(self.configPath, "w+") as configFile:
                    self.__parser.write(configFile)
                    print(f"[WGDashboard] Configuration file {self.configPath} created")
                self.__initPeersList()

        if not os.path.exists(os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup')):
            os.mkdir(os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup'))
        
        print(f"[WGDashboard] Initialized Configuration: {name}")    
        if self.getAutostartStatus() and not self.getStatus() and startup:
            self.toggleConfiguration()
            print(f"[WGDashboard] Autostart Configuration: {name}")
                           
    def __getProtocolPath(self):
        return DashboardConfig.GetConfig("Server", "wg_conf_path")[1] if self.Protocol == "wg" \
            else DashboardConfig.GetConfig("Server", "awg_conf_path")[1]
    
    def __initPeersList(self):
        self.Peers: list[Peer] = []
        self.getPeersList()
        self.getRestrictedPeersList()
        
    def getRawConfigurationFile(self):
        return open(self.configPath, 'r').read()
    
    def updateRawConfigurationFile(self, newRawConfiguration):
        backupStatus, backup = self.backupConfigurationFile()
        if not backupStatus:
            return False, "Cannot create backup"
    
        if self.Status:
            self.toggleConfiguration()
        
        with open(self.configPath, 'w') as f:
            f.write(newRawConfiguration)
        
        status, err = self.toggleConfiguration()
        if not status:
            restoreStatus = self.restoreBackup(backup['filename'])
            print(f"Restore status: {restoreStatus}")
            self.toggleConfiguration()
            return False, err
        return True, None
            
    def __parseConfigurationFile(self):
        with open(self.configPath, 'r') as f:
            original = [l.rstrip("\n") for l in f.readlines()]
            try:
                start = original.index("[Interface]")
                # Clean
                for i in range(start, len(original)):
                    if original[i] == "[Peer]":
                        break
                    split = re.split(r'\s*=\s*', original[i], 1)
                    if len(split) == 2:
                        key = split[0]
                        if key in dir(self):
                            if isinstance(getattr(self, key), bool):
                                setattr(self, key, False)
                            else:
                                setattr(self, key, "")

                # Set
                for i in range(start, len(original)):
                    if original[i] == "[Peer]":
                        break
                    split = re.split(r'\s*=\s*', original[i], 1)
                    if len(split) == 2:
                        key = split[0]
                        value = split[1]
                        if key in dir(self):
                            if isinstance(getattr(self, key), bool):
                                setattr(self, key, StringToBoolean(value))
                            else:
                                if len(getattr(self, key)) > 0:
                                    if key not in ["PostUp", "PostDown", "PreUp", "PreDown"]:
                                        setattr(self, key, f"{getattr(self, key)}, {value}")
                                    else:
                                        setattr(self, key, f"{getattr(self, key)}; {value}")
                                else:
                                    setattr(self, key, value)  
            except ValueError as e:
                raise self.InvalidConfigurationFileException(
                        "[Interface] section not found in " + self.configPath)
            if self.PrivateKey:
                self.PublicKey = self.__getPublicKey()
            self.Status = self.getStatus()
    
    def __dropDatabase(self):
        existingTables = [self.Name, f'{self.Name}_restrict_access', f'{self.Name}_transfer', f'{self.Name}_deleted']        
        # existingTables = sqlSelect(f"SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '{self.Name}%'").fetchall()
        for t in existingTables:
            sqlUpdate("DROP TABLE '%s'" % t)

        # existingTables = sqlSelect(f"SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '{self.Name}%'").fetchall()

    def createDatabase(self, dbName = None):
        if dbName is None:
            dbName = self.Name
        
        existingTables = sqlSelect("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
        existingTables = [t['name'] for t in existingTables]
        if dbName not in existingTables:
            sqlUpdate(
                """
                CREATE TABLE '%s'(
                    id VARCHAR NOT NULL, private_key VARCHAR NULL, DNS VARCHAR NULL, 
                    endpoint_allowed_ip VARCHAR NULL, name VARCHAR NULL, total_receive FLOAT NULL, 
                    total_sent FLOAT NULL, total_data FLOAT NULL, endpoint VARCHAR NULL, 
                    status VARCHAR NULL, latest_handshake VARCHAR NULL, allowed_ip VARCHAR NULL, 
                    cumu_receive FLOAT NULL, cumu_sent FLOAT NULL, cumu_data FLOAT NULL, mtu INT NULL, 
                    keepalive INT NULL, remote_endpoint VARCHAR NULL, preshared_key VARCHAR NULL,
                    PRIMARY KEY (id)
                )
                """ % dbName
            )
        if f'{dbName}_restrict_access' not in existingTables:
            sqlUpdate(
                """
                CREATE TABLE '%s_restrict_access' (
                    id VARCHAR NOT NULL, private_key VARCHAR NULL, DNS VARCHAR NULL, 
                    endpoint_allowed_ip VARCHAR NULL, name VARCHAR NULL, total_receive FLOAT NULL, 
                    total_sent FLOAT NULL, total_data FLOAT NULL, endpoint VARCHAR NULL, 
                    status VARCHAR NULL, latest_handshake VARCHAR NULL, allowed_ip VARCHAR NULL, 
                    cumu_receive FLOAT NULL, cumu_sent FLOAT NULL, cumu_data FLOAT NULL, mtu INT NULL, 
                    keepalive INT NULL, remote_endpoint VARCHAR NULL, preshared_key VARCHAR NULL,
                    PRIMARY KEY (id)
                )
                """ % dbName
            )
        if f'{dbName}_transfer' not in existingTables:
            sqlUpdate(
                """
                CREATE TABLE '%s_transfer' (
                    id VARCHAR NOT NULL, total_receive FLOAT NULL,
                    total_sent FLOAT NULL, total_data FLOAT NULL,
                    cumu_receive FLOAT NULL, cumu_sent FLOAT NULL, cumu_data FLOAT NULL, time DATETIME
                )
                """ % dbName
            )
        if f'{dbName}_deleted' not in existingTables:
            sqlUpdate(
                """
                CREATE TABLE '%s_deleted' (
                    id VARCHAR NOT NULL, private_key VARCHAR NULL, DNS VARCHAR NULL, 
                    endpoint_allowed_ip VARCHAR NULL, name VARCHAR NULL, total_receive FLOAT NULL, 
                    total_sent FLOAT NULL, total_data FLOAT NULL, endpoint VARCHAR NULL, 
                    status VARCHAR NULL, latest_handshake VARCHAR NULL, allowed_ip VARCHAR NULL, 
                    cumu_receive FLOAT NULL, cumu_sent FLOAT NULL, cumu_data FLOAT NULL, mtu INT NULL, 
                    keepalive INT NULL, remote_endpoint VARCHAR NULL, preshared_key VARCHAR NULL,
                    PRIMARY KEY (id)
                )
                """ % dbName
            )
            
    def __dumpDatabase(self):
        for line in sqldb.iterdump():
            if (line.startswith(f"INSERT INTO \"{self.Name}\"") 
                    or line.startswith(f'INSERT INTO "{self.Name}_restrict_access"')
                    or line.startswith(f'INSERT INTO "{self.Name}_transfer"')
                    or line.startswith(f'INSERT INTO "{self.Name}_deleted"')
            ):
                yield line
                
    def __importDatabase(self, sqlFilePath) -> bool:
        self.__dropDatabase()
        self.createDatabase()
        if not os.path.exists(sqlFilePath):
            return False
        with open(sqlFilePath, 'r') as f:
            for l in f.readlines():
                l = l.rstrip("\n")
                if len(l) > 0:
                    sqlUpdate(l)
        return True
        
    def __getPublicKey(self) -> str:
        return GenerateWireguardPublicKey(self.PrivateKey)[1]

    def getStatus(self) -> bool:
        self.Status = self.Name in psutil.net_if_addrs().keys()
        return self.Status
    
    def getAutostartStatus(self):
        s, d = DashboardConfig.GetConfig("WireGuardConfiguration", "autostart")
        return self.Name in d

    def getRestrictedPeers(self):
        self.RestrictedPeers = []
        restricted = sqlSelect("SELECT * FROM '%s_restrict_access'" % self.Name).fetchall()
        for i in restricted:
            self.RestrictedPeers.append(Peer(i, self))
            
    def configurationFileChanged(self) :
        mt = os.path.getmtime(self.configPath)
        changed = self.__configFileModifiedTime is None or self.__configFileModifiedTime != mt
        self.__configFileModifiedTime = mt
        return changed
        
    def getPeers(self):
        if self.configurationFileChanged():
            self.Peers = []
            with open(self.configPath, 'r') as configFile:
                p = []
                pCounter = -1
                content = configFile.read().split('\n')
                try:
                    peerStarts = content.index("[Peer]")
                    content = content[peerStarts:]
                    for i in content:
                        if not RegexMatch("#(.*)", i) and not RegexMatch(";(.*)", i):
                            if i == "[Peer]":
                                pCounter += 1
                                p.append({})
                                p[pCounter]["name"] = ""
                            else:
                                if len(i) > 0:
                                    split = re.split(r'\s*=\s*', i, 1)
                                    if len(split) == 2:
                                        p[pCounter][split[0]] = split[1]
                        
                        if RegexMatch("#Name# = (.*)", i):
                            split = re.split(r'\s*=\s*', i, 1)
                            if len(split) == 2:
                                p[pCounter]["name"] = split[1]
                    
                    for i in p:
                        if "PublicKey" in i.keys():
                            checkIfExist = sqlSelect("SELECT * FROM '%s' WHERE id = ?" % self.Name,
                                                          ((i['PublicKey']),)).fetchone()
                            if checkIfExist is None:
                                newPeer = {
                                    "id": i['PublicKey'],
                                    "private_key": "",
                                    "DNS": DashboardConfig.GetConfig("Peers", "peer_global_DNS")[1],
                                    "endpoint_allowed_ip": DashboardConfig.GetConfig("Peers", "peer_endpoint_allowed_ip")[
                                        1],
                                    "name": i.get("name"),
                                    "total_receive": 0,
                                    "total_sent": 0,
                                    "total_data": 0,
                                    "endpoint": "N/A",
                                    "status": "stopped",
                                    "latest_handshake": "N/A",
                                    "allowed_ip": i.get("AllowedIPs", "N/A"),
                                    "cumu_receive": 0,
                                    "cumu_sent": 0,
                                    "cumu_data": 0,
                                    "traffic": [],
                                    "mtu": DashboardConfig.GetConfig("Peers", "peer_mtu")[1],
                                    "keepalive": DashboardConfig.GetConfig("Peers", "peer_keep_alive")[1],
                                    "remote_endpoint": DashboardConfig.GetConfig("Peers", "remote_endpoint")[1],
                                    "preshared_key": i["PresharedKey"] if "PresharedKey" in i.keys() else ""
                                }
                                sqlUpdate(
                                    """
                                    INSERT INTO '%s'
                                        VALUES (:id, :private_key, :DNS, :endpoint_allowed_ip, :name, :total_receive, :total_sent, 
                                        :total_data, :endpoint, :status, :latest_handshake, :allowed_ip, :cumu_receive, :cumu_sent, 
                                        :cumu_data, :mtu, :keepalive, :remote_endpoint, :preshared_key);
                                    """ % self.Name
                                    , newPeer)
                                self.Peers.append(Peer(newPeer, self))
                            else:
                                sqlUpdate("UPDATE '%s' SET allowed_ip = ? WHERE id = ?" % self.Name,
                                               (i.get("AllowedIPs", "N/A"), i['PublicKey'],))
                                self.Peers.append(Peer(checkIfExist, self))
                except Exception as e:
                    if __name__ == '__main__':
                        print(f"[WGDashboard] {self.Name} Error: {str(e)}")
        else:
            self.Peers.clear()
            checkIfExist = sqlSelect("SELECT * FROM '%s'" % self.Name).fetchall()
            for i in checkIfExist:
                self.Peers.append(Peer(i, self))
            
    def addPeers(self, peers: list) -> tuple[bool, dict]:
        result = {
            "message": None,
            "peers": []
        }
        try:
            for i in peers:
                newPeer = {
                    "id": i['id'],
                    "private_key": i['private_key'],
                    "DNS": i['DNS'],
                    "endpoint_allowed_ip": i['endpoint_allowed_ip'],
                    "name": i['name'],
                    "total_receive": 0,
                    "total_sent": 0,
                    "total_data": 0,
                    "endpoint": "N/A",
                    "status": "stopped",
                    "latest_handshake": "N/A",
                    "allowed_ip": i.get("allowed_ip", "N/A"),
                    "cumu_receive": 0,
                    "cumu_sent": 0,
                    "cumu_data": 0,
                    "traffic": [],
                    "mtu": i['mtu'],
                    "keepalive": i['keepalive'],
                    "remote_endpoint": DashboardConfig.GetConfig("Peers", "remote_endpoint")[1],
                    "preshared_key": i["preshared_key"]
                }
                sqlUpdate(
                    """
                    INSERT INTO '%s'
                        VALUES (:id, :private_key, :DNS, :endpoint_allowed_ip, :name, :total_receive, :total_sent, 
                        :total_data, :endpoint, :status, :latest_handshake, :allowed_ip, :cumu_receive, :cumu_sent, 
                        :cumu_data, :mtu, :keepalive, :remote_endpoint, :preshared_key);
                    """ % self.Name
                    , newPeer)
            for p in peers:
                presharedKeyExist = len(p['preshared_key']) > 0
                rd = random.Random()
                uid = str(uuid.UUID(int=rd.getrandbits(128), version=4))
                if presharedKeyExist:
                    with open(uid, "w+") as f:
                        f.write(p['preshared_key'])
                
                subprocess.check_output(f"{self.Protocol} set {self.Name} peer {p['id']} allowed-ips {p['allowed_ip'].replace(' ', '')}{f' preshared-key {uid}' if presharedKeyExist else ''}",
                                        shell=True, stderr=subprocess.STDOUT)
                if presharedKeyExist:
                    os.remove(uid)
            subprocess.check_output(
                f"{self.Protocol}-quick save {self.Name}", shell=True, stderr=subprocess.STDOUT)
            self.getPeersList()
            for p in peers:
                p = self.searchPeer(p['id'])
                if p[0]:
                    result['peers'].append(p[1])
            return True, result
        except Exception as e:
            result['message'] = str(e)
            return False, result
        
    def searchPeer(self, publicKey):
        for i in self.Peers:
            if i.id == publicKey:
                return True, i
        return False, None

    def allowAccessPeers(self, listOfPublicKeys):
        if not self.getStatus():
            self.toggleConfiguration()
        
        for i in listOfPublicKeys:
            p = sqlSelect("SELECT * FROM '%s_restrict_access' WHERE id = ?" % self.Name, (i,)).fetchone()
            if p is not None:
                sqlUpdate("INSERT INTO '%s' SELECT * FROM '%s_restrict_access' WHERE id = ?"
                               % (self.Name, self.Name,), (p['id'],))
                sqlUpdate("DELETE FROM '%s_restrict_access' WHERE id = ?"
                               % self.Name, (p['id'],))
                
                presharedKeyExist = len(p['preshared_key']) > 0
                rd = random.Random()
                uid = str(uuid.UUID(int=rd.getrandbits(128), version=4))
                if presharedKeyExist:
                    with open(uid, "w+") as f:
                        f.write(p['preshared_key'])
                        
                subprocess.check_output(f"{self.Protocol} set {self.Name} peer {p['id']} allowed-ips {p['allowed_ip'].replace(' ', '')}{f' preshared-key {uid}' if presharedKeyExist else ''}",
                                        shell=True, stderr=subprocess.STDOUT)
                if presharedKeyExist: os.remove(uid)
            else:
                return ResponseObject(False, "Failed to allow access of peer " + i)
        if not self.__wgSave():
            return ResponseObject(False, "Failed to save configuration through WireGuard")

        self.getPeers()
        return ResponseObject(True, "Allow access successfully")

    def restrictPeers(self, listOfPublicKeys):
        numOfRestrictedPeers = 0
        numOfFailedToRestrictPeers = 0
        if not self.getStatus():
            self.toggleConfiguration()
        for p in listOfPublicKeys:
            found, pf = self.searchPeer(p)
            if found:
                try:
                    subprocess.check_output(f"{self.Protocol} set {self.Name} peer {pf.id} remove",
                                            shell=True, stderr=subprocess.STDOUT)
                    sqlUpdate("INSERT INTO '%s_restrict_access' SELECT * FROM '%s' WHERE id = ?" %
                                   (self.Name, self.Name,), (pf.id,))
                    sqlUpdate("UPDATE '%s_restrict_access' SET status = 'stopped' WHERE id = ?" %
                                   (self.Name,), (pf.id,))
                    sqlUpdate("DELETE FROM '%s' WHERE id = ?" % self.Name, (pf.id,))
                    numOfRestrictedPeers += 1
                except Exception as e:
                    numOfFailedToRestrictPeers += 1

        if not self.__wgSave():
            return ResponseObject(False, "Failed to save configuration through WireGuard")

        self.getPeers()

        if numOfRestrictedPeers == len(listOfPublicKeys):
            return ResponseObject(True, f"Restricted {numOfRestrictedPeers} peer(s)")
        return ResponseObject(False,
                              f"Restricted {numOfRestrictedPeers} peer(s) successfully. Failed to restrict {numOfFailedToRestrictPeers} peer(s)")
        pass

    def deletePeers(self, listOfPublicKeys):
        numOfDeletedPeers = 0
        numOfFailedToDeletePeers = 0
        if not self.getStatus():
            self.toggleConfiguration()
        for p in listOfPublicKeys:
            found, pf = self.searchPeer(p)
            if found:
                try:
                    subprocess.check_output(f"{self.Protocol} set {self.Name} peer {pf.id} remove",
                                            shell=True, stderr=subprocess.STDOUT)
                    sqlUpdate("DELETE FROM '%s' WHERE id = ?" % self.Name, (pf.id,))
                    numOfDeletedPeers += 1
                except Exception as e:
                    numOfFailedToDeletePeers += 1

        if not self.__wgSave():
            return ResponseObject(False, "Failed to save configuration through WireGuard")

        self.getPeers()
        
        if numOfDeletedPeers == 0 and numOfFailedToDeletePeers == 0:
            return ResponseObject(False, "No peer(s) to delete found", responseCode=404)

        if numOfDeletedPeers == len(listOfPublicKeys):
            return ResponseObject(True, f"Deleted {numOfDeletedPeers} peer(s)")
        return ResponseObject(False,
                              f"Deleted {numOfDeletedPeers} peer(s) successfully. Failed to delete {numOfFailedToDeletePeers} peer(s)")

    def __wgSave(self) -> tuple[bool, str] | tuple[bool, None]:
        try:
            subprocess.check_output(f"{self.Protocol}-quick save {self.Name}", shell=True, stderr=subprocess.STDOUT)
            return True, None
        except subprocess.CalledProcessError as e:
            return False, str(e)

    def getPeersLatestHandshake(self):
        if not self.getStatus():
            self.toggleConfiguration()
        try:
            latestHandshake = subprocess.check_output(f"{self.Protocol} show {self.Name} latest-handshakes",
                                                      shell=True, stderr=subprocess.STDOUT)
        except subprocess.CalledProcessError:
            return "stopped"
        latestHandshake = latestHandshake.decode("UTF-8").split()
        count = 0
        now = datetime.now()
        time_delta = timedelta(minutes=2)
        for _ in range(int(len(latestHandshake) / 2)):
            minus = now - datetime.fromtimestamp(int(latestHandshake[count + 1]))
            if minus < time_delta:
                status = "running"
            else:
                status = "stopped"
            if int(latestHandshake[count + 1]) > 0:
                sqlUpdate("UPDATE '%s' SET latest_handshake = ?, status = ? WHERE id= ?" % self.Name
                              , (str(minus).split(".", maxsplit=1)[0], status, latestHandshake[count],))
            else:
                sqlUpdate("UPDATE '%s' SET latest_handshake = 'No Handshake', status = ? WHERE id= ?" % self.Name
                              , (status, latestHandshake[count],))
            count += 2
    
    def getPeersTransfer(self):
        if not self.getStatus():
            self.toggleConfiguration()
        try:
            data_usage = subprocess.check_output(f"{self.Protocol} show {self.Name} transfer",
                                                 shell=True, stderr=subprocess.STDOUT)
            data_usage = data_usage.decode("UTF-8").split("\n")
            data_usage = [p.split("\t") for p in data_usage]
            for i in range(len(data_usage)):
                if len(data_usage[i]) == 3:
                    cur_i = sqlSelect(
                        "SELECT total_receive, total_sent, cumu_receive, cumu_sent, status FROM '%s' WHERE id= ? "
                        % self.Name, (data_usage[i][0],)).fetchone()
                    if cur_i is not None:
                        cur_i = dict(cur_i)
                        total_sent = cur_i['total_sent']
                        total_receive = cur_i['total_receive']
                        cur_total_sent = float(data_usage[i][2]) / (1024 ** 3)
                        cur_total_receive = float(data_usage[i][1]) / (1024 ** 3)
                        cumulative_receive = cur_i['cumu_receive'] + total_receive
                        cumulative_sent = cur_i['cumu_sent'] + total_sent
                        if total_sent <= cur_total_sent and total_receive <= cur_total_receive:
                            total_sent = cur_total_sent
                            total_receive = cur_total_receive
                        else:
                            sqlUpdate(
                                "UPDATE '%s' SET cumu_receive = ?, cumu_sent = ?, cumu_data = ? WHERE id = ?" %
                                self.Name, (cumulative_receive, cumulative_sent,
                                            cumulative_sent + cumulative_receive,
                                            data_usage[i][0],))
                            total_sent = 0
                            total_receive = 0
                        _, p = self.searchPeer(data_usage[i][0])
                        if p.total_receive != total_receive or p.total_sent != total_sent:
                            sqlUpdate(
                                "UPDATE '%s' SET total_receive = ?, total_sent = ?, total_data = ? WHERE id = ?"
                                % self.Name, (total_receive, total_sent,
                                              total_receive + total_sent, data_usage[i][0],))
        except Exception as e:
            print(f"[WGDashboard] {self.Name} Error: {str(e)} {str(e.__traceback__)}")

    def getPeersEndpoint(self):
        if not self.getStatus():
            self.toggleConfiguration()
        try:
            data_usage = subprocess.check_output(f"{self.Protocol} show {self.Name} endpoints",
                                                 shell=True, stderr=subprocess.STDOUT)
        except subprocess.CalledProcessError:
            return "stopped"
        data_usage = data_usage.decode("UTF-8").split()
        count = 0
        for _ in range(int(len(data_usage) / 2)):
            sqlUpdate("UPDATE '%s' SET endpoint = ? WHERE id = ?" % self.Name
                          , (data_usage[count + 1], data_usage[count],))
            count += 2

    def toggleConfiguration(self) -> [bool, str]:
        self.getStatus()
        if self.Status:
            try:
                check = subprocess.check_output(f"{self.Protocol}-quick down {self.Name}",
                                                shell=True, stderr=subprocess.STDOUT)
            except subprocess.CalledProcessError as exc:
                return False, str(exc.output.strip().decode("utf-8"))
        else:
            try:
                check = subprocess.check_output(f"{self.Protocol}-quick up {self.Name}", shell=True, stderr=subprocess.STDOUT)
            except subprocess.CalledProcessError as exc:
                return False, str(exc.output.strip().decode("utf-8"))
        self.__parseConfigurationFile()
        self.getStatus()
        return True, None

    def getPeersList(self):
        self.getPeers()
        return self.Peers

    def getRestrictedPeersList(self) -> list:
        self.getRestrictedPeers()
        return self.RestrictedPeers

    def toJson(self):
        self.Status = self.getStatus()
        return {
            "Status": self.Status,
            "Name": self.Name,
            "PrivateKey": self.PrivateKey,
            "PublicKey": self.PublicKey,
            "Address": self.Address,
            "ListenPort": self.ListenPort,
            "PreUp": self.PreUp,
            "PreDown": self.PreDown,
            "PostUp": self.PostUp,
            "PostDown": self.PostDown,
            "SaveConfig": self.SaveConfig,
            "DataUsage": {
                "Total": sum(list(map(lambda x: x.cumu_data + x.total_data, self.Peers))),
                "Sent": sum(list(map(lambda x: x.cumu_sent + x.total_sent, self.Peers))),
                "Receive": sum(list(map(lambda x: x.cumu_receive + x.total_receive, self.Peers)))
            },
            "ConnectedPeers": len(list(filter(lambda x: x.status == "running", self.Peers))),
            "TotalPeers": len(self.Peers),
            "Protocol": self.Protocol,
            "Table": self.Table,
        }
    
    def backupConfigurationFile(self) -> tuple[bool, dict[str, str]]:
        if not os.path.exists(os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup')):
            os.mkdir(os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup'))
        time = datetime.now().strftime("%Y%m%d%H%M%S")
        shutil.copy(
            self.configPath,
            os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup', f'{self.Name}_{time}.conf')
        )
        with open(os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup', f'{self.Name}_{time}.sql'), 'w+') as f:
            for l in self.__dumpDatabase():
                f.write(l + "\n")
        
        return True, {
            "filename": f'{self.Name}_{time}.conf',
            "backupDate": datetime.now().strftime("%Y%m%d%H%M%S")
        }
                     
    def getBackups(self, databaseContent: bool = False) -> list[dict[str: str, str: str, str: str]]:
        backups = []
        
        directory = os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup')
        files = [(file, os.path.getctime(os.path.join(directory, file)))
                 for file in os.listdir(directory) if os.path.isfile(os.path.join(directory, file))]
        files.sort(key=lambda x: x[1], reverse=True)
        
        for f, ct in files:
            if RegexMatch(f"^({self.Name})_(.*)\\.(conf)$", f):
                s = re.search(f"^({self.Name})_(.*)\\.(conf)$", f)
                date = s.group(2)
                d = {
                    "filename": f,
                    "backupDate": date,
                    "content": open(os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup', f), 'r').read()
                }
                if f.replace(".conf", ".sql") in list(os.listdir(directory)):
                    d['database'] = True
                    if databaseContent:
                        d['databaseContent'] = open(os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup', f.replace(".conf", ".sql")), 'r').read()
                backups.append(d)
        
        return backups
    
    def restoreBackup(self, backupFileName: str) -> bool:
        backups = list(map(lambda x : x['filename'], self.getBackups()))
        if backupFileName not in backups:
            return False
        if self.Status:
            self.toggleConfiguration()
        target = os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup', backupFileName)
        targetSQL = os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup', backupFileName.replace(".conf", ".sql"))
        if not os.path.exists(target):
            return False
        targetContent = open(target, 'r').read()
        try:
            with open(self.configPath, 'w') as f:
                f.write(targetContent)
        except Exception as e:
            return False
        self.__parseConfigurationFile()
        self.__dropDatabase()
        self.__importDatabase(targetSQL)
        self.__initPeersList()
        return True
    
    def deleteBackup(self, backupFileName: str) -> bool:
        backups = list(map(lambda x : x['filename'], self.getBackups()))
        if backupFileName not in backups:
            return False
        try:
            os.remove(os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup', backupFileName))
        except Exception as e:
            return False
        return True
    
    def downloadBackup(self, backupFileName: str) -> tuple[bool, str] | tuple[bool, None]:
        backup = list(filter(lambda x : x['filename'] == backupFileName, self.getBackups()))
        if len(backup) == 0:
            return False, None
        zip = f'{str(uuid.UUID(int=random.Random().getrandbits(128), version=4))}.zip'
        with ZipFile(os.path.join('download', zip), 'w') as zipF:
            zipF.write(
                os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup', backup[0]['filename']),
                os.path.basename(os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup', backup[0]['filename']))
            )
            if backup[0]['database']:
                zipF.write(
                    os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup', backup[0]['filename'].replace('.conf', '.sql')),
                    os.path.basename(os.path.join(self.__getProtocolPath(), 'WGDashboard_Backup', backup[0]['filename'].replace('.conf', '.sql')))
                )
        
        return True, zip

    def updateConfigurationSettings(self, newData: dict) -> tuple[bool, str]:
        if self.Status:
            self.toggleConfiguration()
        original = []
        dataChanged = False
        with open(self.configPath, 'r') as f:
            original = [l.rstrip("\n") for l in f.readlines()]
            allowEdit = ["Address", "PreUp", "PostUp", "PreDown", "PostDown", "ListenPort", "Table"]
            if self.Protocol == 'awg':
                allowEdit += ["Jc", "Jmin", "Jmax", "S1", "S2", "H1", "H2", "H3", "H4"]
            start = original.index("[Interface]")
            try:
                end = original.index("[Peer]")
            except ValueError as e:
                end = len(original)
            new = ["[Interface]"]
            peerFound = False
            for line in range(start, end):
                split = re.split(r'\s*=\s*', original[line], 1)
                if len(split) == 2:
                    if split[0] not in allowEdit:
                        new.append(original[line])
            for key in allowEdit:
                new.insert(1, f"{key} = {str(newData[key]).strip()}")
            new.append("")
            for line in range(end, len(original)):
                new.append(original[line])            
            self.backupConfigurationFile()
            with open(self.configPath, 'w') as f:
                f.write("\n".join(new))
                
        status, msg = self.toggleConfiguration()        
        if not status:
            return False, msg
        for i in allowEdit:
            if isinstance(getattr(self, i), bool):
                setattr(self, i, _strToBool(newData[i]))
            else:
                setattr(self, i, str(newData[i]))
        return True, ""
    
    def deleteConfiguration(self):
        if self.getStatus():
            self.toggleConfiguration()
        os.remove(self.configPath)
        self.__dropDatabase()
        return True
    
    def renameConfiguration(self, newConfigurationName) -> tuple[bool, str]:
        if newConfigurationName in WireguardConfigurations.keys():
            return False, "Configuration name already exist"
        try:
            if self.getStatus():
                self.toggleConfiguration()
            self.createDatabase(newConfigurationName)
            sqlUpdate(f'INSERT INTO "{newConfigurationName}" SELECT * FROM "{self.Name}"')
            sqlUpdate(f'INSERT INTO "{newConfigurationName}_restrict_access" SELECT * FROM "{self.Name}_restrict_access"')
            sqlUpdate(f'INSERT INTO "{newConfigurationName}_deleted" SELECT * FROM "{self.Name}_deleted"')
            sqlUpdate(f'INSERT INTO "{newConfigurationName}_transfer" SELECT * FROM "{self.Name}_transfer"')
            AllPeerJobs.updateJobConfigurationName(self.Name, newConfigurationName)
            shutil.copy(
                self.configPath,
                os.path.join(self.__getProtocolPath(), f'{newConfigurationName}.conf')
            )
            self.deleteConfiguration()
        except Exception as e:
            return False, str(e)
        return True, None
    
    def getNumberOfAvailableIP(self):
        if len(self.Address) < 0:
            return False, None
        existedAddress = set()
        availableAddress = {}
        for p in self.Peers + self.getRestrictedPeersList():
            peerAllowedIP = p.allowed_ip.split(',')
            for pip in peerAllowedIP:
                ppip = pip.strip().split('/')
                if len(ppip) == 2:
                    try:
                        check = ipaddress.ip_network(ppip[0])
                        existedAddress.add(check)
                    except Exception as e:
                        print(f"[WGDashboard] Error: {self.Name} peer {p.id} have invalid ip")
        configurationAddresses = self.Address.split(',')
        for ca in configurationAddresses:
            ca = ca.strip()
            caSplit = ca.split('/')
            try:
                if len(caSplit) == 2:
                    network = ipaddress.ip_network(ca, False)
                    existedAddress.add(ipaddress.ip_network(caSplit[0]))
                    availableAddress[ca] = network.num_addresses
                    for p in existedAddress:
                        if p.version == network.version and p.subnet_of(network):
                            availableAddress[ca] -= 1                    
            except Exception as e:
                print(e)
                print(f"[WGDashboard] Error: Failed to parse IP address {ca} from {self.Name}")
        return True, availableAddress
    
    def getAvailableIP(self, threshold = 255):
        if len(self.Address) < 0:
            return False, None
        existedAddress = set()
        availableAddress = {}
        for p in self.Peers + self.getRestrictedPeersList():
            peerAllowedIP = p.allowed_ip.split(',')
            for pip in peerAllowedIP:
                ppip = pip.strip().split('/')
                if len(ppip) == 2:
                    try:
                        check = ipaddress.ip_network(ppip[0])
                        existedAddress.add(check.compressed)
                    except Exception as e:
                        print(f"[WGDashboard] Error: {self.Name} peer {p.id} have invalid ip")
        configurationAddresses = self.Address.split(',')
        for ca in configurationAddresses:
            ca = ca.strip()
            caSplit = ca.split('/')
            try:
                if len(caSplit) == 2:
                    network = ipaddress.ip_network(ca, False)
                    existedAddress.add(ipaddress.ip_network(caSplit[0]).compressed)
                    if threshold == -1:
                        availableAddress[ca] = filter(lambda ip : ip not in existedAddress,
                                map(lambda iph : ipaddress.ip_network(iph).compressed, network.hosts()))
                    else:
                        availableAddress[ca] = list(islice(filter(lambda ip : ip not in existedAddress,
                                map(lambda iph : ipaddress.ip_network(iph).compressed, network.hosts())), threshold))
            except Exception as e:
                print(e)
                print(f"[WGDashboard] Error: Failed to parse IP address {ca} from {self.Name}")
        print("Generated IP")
        return True, availableAddress

    def getRealtimeTrafficUsage(self):
        stats = psutil.net_io_counters(pernic=True, nowrap=True)
        if self.Name in stats.keys():
            stat = stats[self.Name]
            recv1 = stat.bytes_recv
            sent1 = stat.bytes_sent
            time.sleep(1)
            stats = psutil.net_io_counters(pernic=True, nowrap=True)
            if self.Name in stats.keys():
                stat = stats[self.Name]
                recv2 = stat.bytes_recv
                sent2 = stat.bytes_sent
                net_in = round((recv2 - recv1) / 1024 / 1024, 3)
                net_out = round((sent2 - sent1) / 1024 / 1024, 3)
                return {
                    "sent": net_out,
                    "recv": net_in
                }
            else:
                return { "sent": 0, "recv": 0 }
        else:
            return { "sent": 0, "recv": 0 }
            
"""
AmneziaWG Configuration
"""
class AmneziaWireguardConfiguration(WireguardConfiguration):
    def __init__(self, name: str = None, data: dict = None, backup: dict = None, startup: bool = False):
        self.Jc = ""
        self.Jmin = ""
        self.Jmax = ""
        self.S1 = ""
        self.S2 = ""
        self.H1 = ""
        self.H2 = ""
        self.H3 = ""
        self.H4 = ""
        
        super().__init__(name, data, backup, startup, wg=False)

    def toJson(self):
        self.Status = self.getStatus()
        return {
            "Status": self.Status,
            "Name": self.Name,
            "PrivateKey": self.PrivateKey,
            "PublicKey": self.PublicKey,
            "Address": self.Address,
            "ListenPort": self.ListenPort,
            "PreUp": self.PreUp,
            "PreDown": self.PreDown,
            "PostUp": self.PostUp,
            "PostDown": self.PostDown,
            "SaveConfig": self.SaveConfig,
            "DataUsage": {
                "Total": sum(list(map(lambda x: x.cumu_data + x.total_data, self.Peers))),
                "Sent": sum(list(map(lambda x: x.cumu_sent + x.total_sent, self.Peers))),
                "Receive": sum(list(map(lambda x: x.cumu_receive + x.total_receive, self.Peers)))
            },
            "ConnectedPeers": len(list(filter(lambda x: x.status == "running", self.Peers))),
            "TotalPeers": len(self.Peers),
            "Table": self.Table,
            "Protocol": self.Protocol,
            "Jc": self.Jc,
            "Jmin": self.Jmin,
            "Jmax": self.Jmax,
            "S1": self.S1,
            "S2": self.S2,
            "H1": self.H1,
            "H2": self.H2,
            "H3": self.H3,
            "H4": self.H4
        }

    def createDatabase(self, dbName = None):
        if dbName is None:
            dbName = self.Name

        existingTables = sqlSelect("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
        existingTables = [t['name'] for t in existingTables]
        if dbName not in existingTables:
            sqlUpdate(
                """
                CREATE TABLE '%s'(
                    id VARCHAR NOT NULL, private_key VARCHAR NULL, DNS VARCHAR NULL, advanced_security VARCHAR NULL,
                    endpoint_allowed_ip VARCHAR NULL, name VARCHAR NULL, total_receive FLOAT NULL, 
                    total_sent FLOAT NULL, total_data FLOAT NULL, endpoint VARCHAR NULL, 
                    status VARCHAR NULL, latest_handshake VARCHAR NULL, allowed_ip VARCHAR NULL, 
                    cumu_receive FLOAT NULL, cumu_sent FLOAT NULL, cumu_data FLOAT NULL, mtu INT NULL, 
                    keepalive INT NULL, remote_endpoint VARCHAR NULL, preshared_key VARCHAR NULL,
                    PRIMARY KEY (id)
                )
                """ % dbName
            )

        if f'{dbName}_restrict_access' not in existingTables:
            sqlUpdate(
                """
                CREATE TABLE '%s_restrict_access' (
                    id VARCHAR NOT NULL, private_key VARCHAR NULL, DNS VARCHAR NULL, advanced_security VARCHAR NULL, 
                    endpoint_allowed_ip VARCHAR NULL, name VARCHAR NULL, total_receive FLOAT NULL, 
                    total_sent FLOAT NULL, total_data FLOAT NULL, endpoint VARCHAR NULL, 
                    status VARCHAR NULL, latest_handshake VARCHAR NULL, allowed_ip VARCHAR NULL, 
                    cumu_receive FLOAT NULL, cumu_sent FLOAT NULL, cumu_data FLOAT NULL, mtu INT NULL, 
                    keepalive INT NULL, remote_endpoint VARCHAR NULL, preshared_key VARCHAR NULL,
                    PRIMARY KEY (id)
                )
                """ % dbName
            )
        if f'{dbName}_transfer' not in existingTables:
            sqlUpdate(
                """
                CREATE TABLE '%s_transfer' (
                    id VARCHAR NOT NULL, total_receive FLOAT NULL,
                    total_sent FLOAT NULL, total_data FLOAT NULL,
                    cumu_receive FLOAT NULL, cumu_sent FLOAT NULL, cumu_data FLOAT NULL, time DATETIME
                )
                """ % dbName
            )
        if f'{dbName}_deleted' not in existingTables:
            sqlUpdate(
                """
                CREATE TABLE '%s_deleted' (
                    id VARCHAR NOT NULL, private_key VARCHAR NULL, DNS VARCHAR NULL, advanced_security VARCHAR NULL,
                    endpoint_allowed_ip VARCHAR NULL, name VARCHAR NULL, total_receive FLOAT NULL, 
                    total_sent FLOAT NULL, total_data FLOAT NULL, endpoint VARCHAR NULL, 
                    status VARCHAR NULL, latest_handshake VARCHAR NULL, allowed_ip VARCHAR NULL, 
                    cumu_receive FLOAT NULL, cumu_sent FLOAT NULL, cumu_data FLOAT NULL, mtu INT NULL, 
                    keepalive INT NULL, remote_endpoint VARCHAR NULL, preshared_key VARCHAR NULL,
                    PRIMARY KEY (id)
                )
                """ % dbName
            )

    def getPeers(self):
        if self.configurationFileChanged():
            self.Peers = []
            with open(self.configPath, 'r') as configFile:
                p = []
                pCounter = -1
                content = configFile.read().split('\n')
                try:
                    peerStarts = content.index("[Peer]")
                    content = content[peerStarts:]
                    for i in content:
                        if not RegexMatch("#(.*)", i) and not RegexMatch(";(.*)", i):
                            if i == "[Peer]":
                                pCounter += 1
                                p.append({})
                                p[pCounter]["name"] = ""
                            else:
                                if len(i) > 0:
                                    split = re.split(r'\s*=\s*', i, 1)
                                    if len(split) == 2:
                                        p[pCounter][split[0]] = split[1]

                        if RegexMatch("#Name# = (.*)", i):
                            split = re.split(r'\s*=\s*', i, 1)
                            if len(split) == 2:
                                p[pCounter]["name"] = split[1]

                    for i in p:
                        if "PublicKey" in i.keys():
                            checkIfExist = sqlSelect("SELECT * FROM '%s' WHERE id = ?" % self.Name,
                                                     ((i['PublicKey']),)).fetchone()
                            if checkIfExist is None:
                                newPeer = {
                                    "id": i['PublicKey'],
                                    "advanced_security": i.get('AdvancedSecurity', 'off'),
                                    "private_key": "",
                                    "DNS": DashboardConfig.GetConfig("Peers", "peer_global_DNS")[1],
                                    "endpoint_allowed_ip": DashboardConfig.GetConfig("Peers", "peer_endpoint_allowed_ip")[
                                        1],
                                    "name": i.get("name"),
                                    "total_receive": 0,
                                    "total_sent": 0,
                                    "total_data": 0,
                                    "endpoint": "N/A",
                                    "status": "stopped",
                                    "latest_handshake": "N/A",
                                    "allowed_ip": i.get("AllowedIPs", "N/A"),
                                    "cumu_receive": 0,
                                    "cumu_sent": 0,
                                    "cumu_data": 0,
                                    "traffic": [],
                                    "mtu": DashboardConfig.GetConfig("Peers", "peer_mtu")[1],
                                    "keepalive": DashboardConfig.GetConfig("Peers", "peer_keep_alive")[1],
                                    "remote_endpoint": DashboardConfig.GetConfig("Peers", "remote_endpoint")[1],
                                    "preshared_key": i["PresharedKey"] if "PresharedKey" in i.keys() else ""
                                }
                                sqlUpdate(
                                    """
                                    INSERT INTO '%s'
                                        VALUES (:id, :private_key, :DNS, :advanced_security, :endpoint_allowed_ip, :name, :total_receive, :total_sent, 
                                        :total_data, :endpoint, :status, :latest_handshake, :allowed_ip, :cumu_receive, :cumu_sent, 
                                        :cumu_data, :mtu, :keepalive, :remote_endpoint, :preshared_key);
                                    """ % self.Name
                                    , newPeer)
                                self.Peers.append(AmneziaWGPeer(newPeer, self))
                            else:
                                sqlUpdate("UPDATE '%s' SET allowed_ip = ? WHERE id = ?" % self.Name,
                                          (i.get("AllowedIPs", "N/A"), i['PublicKey'],))
                                self.Peers.append(AmneziaWGPeer(checkIfExist, self))
                except Exception as e:
                    if __name__ == '__main__':
                        print(f"[WGDashboard] {self.Name} Error: {str(e)}")
        else:
            self.Peers.clear()
            checkIfExist = sqlSelect("SELECT * FROM '%s'" % self.Name).fetchall()
            for i in checkIfExist:
                self.Peers.append(AmneziaWGPeer(i, self))

    def addPeers(self, peers: list) -> tuple[bool, dict]:
        result = {
            "message": None,
            "peers": []
        }
        try:
            for i in peers:
                newPeer = {
                    "id": i['id'],
                    "private_key": i['private_key'],
                    "DNS": i['DNS'],
                    "endpoint_allowed_ip": i['endpoint_allowed_ip'],
                    "name": i['name'],
                    "total_receive": 0,
                    "total_sent": 0,
                    "total_data": 0,
                    "endpoint": "N/A",
                    "status": "stopped",
                    "latest_handshake": "N/A",
                    "allowed_ip": i.get("allowed_ip", "N/A"),
                    "cumu_receive": 0,
                    "cumu_sent": 0,
                    "cumu_data": 0,
                    "traffic": [],
                    "mtu": i['mtu'],
                    "keepalive": i['keepalive'],
                    "remote_endpoint": DashboardConfig.GetConfig("Peers", "remote_endpoint")[1],
                    "preshared_key": i["preshared_key"],
                    "advanced_security": i['advanced_security']
                }
                sqlUpdate(
                    """
                    INSERT INTO '%s'
                        VALUES (:id, :private_key, :DNS, :advanced_security, :endpoint_allowed_ip, :name, :total_receive, :total_sent, 
                        :total_data, :endpoint, :status, :latest_handshake, :allowed_ip, :cumu_receive, :cumu_sent, 
                        :cumu_data, :mtu, :keepalive, :remote_endpoint, :preshared_key);
                    """ % self.Name
                    , newPeer)
            for p in peers:
                presharedKeyExist = len(p['preshared_key']) > 0
                rd = random.Random()
                uid = str(uuid.UUID(int=rd.getrandbits(128), version=4))
                if presharedKeyExist:
                    with open(uid, "w+") as f:
                        f.write(p['preshared_key'])

                subprocess.check_output(
                    f"{self.Protocol} set {self.Name} peer {p['id']} allowed-ips {p['allowed_ip'].replace(' ', '')}{f' preshared-key {uid}' if presharedKeyExist else ''}",
                                        shell=True, stderr=subprocess.STDOUT)
                if presharedKeyExist:
                    os.remove(uid)
            subprocess.check_output(
                f"{self.Protocol}-quick save {self.Name}", shell=True, stderr=subprocess.STDOUT)
            self.getPeersList()
            for p in peers:
                p = self.searchPeer(p['id'])
                if p[0]:
                    result['peers'].append(p[1])
            return True, result
        except Exception as e:
            result['message'] = str(e)
            return False, result

    def getRestrictedPeers(self):
        self.RestrictedPeers = []
        restricted = sqlSelect("SELECT * FROM '%s_restrict_access'" % self.Name).fetchall()
        for i in restricted:
            self.RestrictedPeers.append(AmneziaWGPeer(i, self))
    
"""
Peer
"""      
class Peer:
    def __init__(self, tableData, configuration: WireguardConfiguration):
        self.configuration = configuration
        self.id = tableData["id"]
        self.private_key = tableData["private_key"]
        self.DNS = tableData["DNS"]
        self.endpoint_allowed_ip = tableData["endpoint_allowed_ip"]
        self.name = tableData["name"]
        self.total_receive = tableData["total_receive"]
        self.total_sent = tableData["total_sent"]
        self.total_data = tableData["total_data"]
        self.endpoint = tableData["endpoint"]
        self.status = tableData["status"]
        self.latest_handshake = tableData["latest_handshake"]
        self.allowed_ip = tableData["allowed_ip"]
        self.cumu_receive = tableData["cumu_receive"]
        self.cumu_sent = tableData["cumu_sent"]
        self.cumu_data = tableData["cumu_data"]
        self.mtu = tableData["mtu"]
        self.keepalive = tableData["keepalive"]
        self.remote_endpoint = tableData["remote_endpoint"]
        self.preshared_key = tableData["preshared_key"]
        self.jobs: list[PeerJob] = []
        self.ShareLink: list[PeerShareLink] = []
        self.getJobs()
        self.getShareLink()

    def toJson(self):
        self.getJobs()
        self.getShareLink()
        return self.__dict__

    def __repr__(self):
        return str(self.toJson())

    def updatePeer(self, name: str, private_key: str,
                   preshared_key: str,
                   dns_addresses: str, allowed_ip: str, endpoint_allowed_ip: str, mtu: int,
                   keepalive: int) -> ResponseObject:
        if not self.configuration.getStatus():
            self.configuration.toggleConfiguration()

        existingAllowedIps = [item for row in list(
            map(lambda x: [q.strip() for q in x.split(',')],
                map(lambda y: y.allowed_ip,
                    list(filter(lambda k: k.id != self.id, self.configuration.getPeersList()))))) for item in row]

        if allowed_ip in existingAllowedIps:
            return ResponseObject(False, "Allowed IP already taken by another peer")
        if not ValidateIPAddressesWithRange(endpoint_allowed_ip):
            return ResponseObject(False, f"Endpoint Allowed IPs format is incorrect")
        if len(dns_addresses) > 0 and not ValidateDNSAddress(dns_addresses):
            return ResponseObject(False, f"DNS format is incorrect")
        if mtu < 0 or mtu > 1460:
            return ResponseObject(False, "MTU format is not correct")
        if keepalive < 0:
            return ResponseObject(False, "Persistent Keepalive format is not correct")
        if len(private_key) > 0:
            pubKey = GenerateWireguardPublicKey(private_key)
            if not pubKey[0] or pubKey[1] != self.id:
                return ResponseObject(False, "Private key does not match with the public key")
        try:
            rd = random.Random()
            uid = str(uuid.UUID(int=rd.getrandbits(128), version=4))
            pskExist = len(preshared_key) > 0
            
            if pskExist:
                with open(uid, "w+") as f:
                    f.write(preshared_key)
            newAllowedIPs = allowed_ip.replace(" ", "")
            updateAllowedIp = subprocess.check_output(
                f"{self.configuration.Protocol} set {self.configuration.Name} peer {self.id} allowed-ips {newAllowedIPs} {f'preshared-key {uid}' if pskExist else 'preshared-key /dev/null'}",
                shell=True, stderr=subprocess.STDOUT)
            
            if pskExist: os.remove(uid)     
            if len(updateAllowedIp.decode().strip("\n")) != 0:
                return ResponseObject(False,
                                      "Update peer failed when updating Allowed IPs")
            saveConfig = subprocess.check_output(f"{self.configuration.Protocol}-quick save {self.configuration.Name}",
                                                 shell=True, stderr=subprocess.STDOUT)
            if f"wg showconf {self.configuration.Name}" not in saveConfig.decode().strip('\n'):
                return ResponseObject(False,
                                      "Update peer failed when saving the configuration")
            sqlUpdate(
                '''UPDATE '%s' SET name = ?, private_key = ?, DNS = ?, endpoint_allowed_ip = ?, mtu = ?, 
                keepalive = ?, preshared_key = ? WHERE id = ?''' % self.configuration.Name,
                (name, private_key, dns_addresses, endpoint_allowed_ip, mtu,
                 keepalive, preshared_key, self.id,)
            )
            return ResponseObject()
        except subprocess.CalledProcessError as exc:
            return ResponseObject(False, exc.output.decode("UTF-8").strip())

    def downloadPeer(self) -> dict[str, str]:
        filename = self.name
        if len(filename) == 0:
            filename = "UntitledPeer"
        filename = "".join(filename.split(' '))
        filename = f"{filename}"
        illegal_filename = [".", ",", "/", "?", "<", ">", "\\", ":", "*", '|' '\"', "com1", "com2", "com3",
                            "com4", "com5", "com6", "com7", "com8", "com9", "lpt1", "lpt2", "lpt3", "lpt4",
                            "lpt5", "lpt6", "lpt7", "lpt8", "lpt9", "con", "nul", "prn"]
        for i in illegal_filename:
            filename = filename.replace(i, "")
        
        finalFilename = ""
        for i in filename:
            if re.match("^[a-zA-Z0-9_=+.-]$", i):
                finalFilename += i

        peerConfiguration = f'''[Interface]
PrivateKey = {self.private_key}
Address = {self.allowed_ip}
MTU = {str(self.mtu)}
'''
        if len(self.DNS) > 0:
            peerConfiguration += f"DNS = {self.DNS}\n"
        
        peerConfiguration += f'''
[Peer]
PublicKey = {self.configuration.PublicKey}
AllowedIPs = {self.endpoint_allowed_ip}
Endpoint = {DashboardConfig.GetConfig("Peers", "remote_endpoint")[1]}:{self.configuration.ListenPort}
PersistentKeepalive = {str(self.keepalive)}
'''
        if len(self.preshared_key) > 0:
            peerConfiguration += f"PresharedKey = {self.preshared_key}\n"
        return {
            "fileName": finalFilename,
            "file": peerConfiguration
        }

    def getJobs(self):
        self.jobs = AllPeerJobs.searchJob(self.configuration.Name, self.id)

    def getShareLink(self):
        self.ShareLink = AllPeerShareLinks.getLink(self.configuration.Name, self.id)
        
    def resetDataUsage(self, type):
        try:
            if type == "total":
                sqlUpdate("UPDATE '%s' SET total_data = 0, cumu_data = 0, total_receive = 0, cumu_receive = 0, total_sent = 0, cumu_sent = 0  WHERE id = ?" % self.configuration.Name, (self.id, ))
                self.total_data = 0
                self.total_receive = 0
                self.total_sent = 0
                self.cumu_data = 0
                self.cumu_sent = 0
                self.cumu_receive = 0
            elif type == "receive":
                sqlUpdate("UPDATE '%s' SET total_receive = 0, cumu_receive = 0 WHERE id = ?" % self.configuration.Name, (self.id, ))
                self.cumu_receive = 0
                self.total_receive = 0
            elif type == "sent":
                sqlUpdate("UPDATE '%s' SET total_sent = 0, cumu_sent = 0 WHERE id = ?" % self.configuration.Name, (self.id, ))
                self.cumu_sent = 0
                self.total_sent = 0
            else:
                return False
        except Exception as e:
            print(e)
            return False
        
        return True
    
class AmneziaWGPeer(Peer):
    def __init__(self, tableData, configuration: AmneziaWireguardConfiguration):
        self.advanced_security = tableData["advanced_security"]
        super().__init__(tableData, configuration)

    def downloadPeer(self) -> dict[str, str]:
        filename = self.name
        if len(filename) == 0:
            filename = "UntitledPeer"
        filename = "".join(filename.split(' '))
        filename = f"{filename}_{self.configuration.Name}"
        illegal_filename = [".", ",", "/", "?", "<", ">", "\\", ":", "*", '|' '\"', "com1", "com2", "com3",
                            "com4", "com5", "com6", "com7", "com8", "com9", "lpt1", "lpt2", "lpt3", "lpt4",
                            "lpt5", "lpt6", "lpt7", "lpt8", "lpt9", "con", "nul", "prn"]
        for i in illegal_filename:
            filename = filename.replace(i, "")

        finalFilename = ""
        for i in filename:
            if re.match("^[a-zA-Z0-9_=+.-]$", i):
                finalFilename += i

        peerConfiguration = f'''[Interface]
PrivateKey = {self.private_key}
Address = {self.allowed_ip}
MTU = {str(self.mtu)}
Jc = {self.configuration.Jc}
Jmin = {self.configuration.Jmin}
Jmax = {self.configuration.Jmax}
S1 = {self.configuration.S1}
S2 = {self.configuration.S2}
H1 = {self.configuration.H1}
H2 = {self.configuration.H2}
H3 = {self.configuration.H3}
H4 = {self.configuration.H4}
'''
        if len(self.DNS) > 0:
            peerConfiguration += f"DNS = {self.DNS}\n"
        peerConfiguration += f'''
[Peer]
PublicKey = {self.configuration.PublicKey}
AllowedIPs = {self.endpoint_allowed_ip}
Endpoint = {DashboardConfig.GetConfig("Peers", "remote_endpoint")[1]}:{self.configuration.ListenPort}
PersistentKeepalive = {str(self.keepalive)}
'''
        if len(self.preshared_key) > 0:
            peerConfiguration += f"PresharedKey = {self.preshared_key}\n"
        return {
            "fileName": finalFilename,
            "file": peerConfiguration
        }

    def updatePeer(self, name: str, private_key: str,
                   preshared_key: str,
                   dns_addresses: str, allowed_ip: str, endpoint_allowed_ip: str, mtu: int,
                   keepalive: int, advanced_security: str) -> ResponseObject:
        if not self.configuration.getStatus():
            self.configuration.toggleConfiguration()

        existingAllowedIps = [item for row in list(
            map(lambda x: [q.strip() for q in x.split(',')],
                map(lambda y: y.allowed_ip,
                    list(filter(lambda k: k.id != self.id, self.configuration.getPeersList()))))) for item in row]

        if allowed_ip in existingAllowedIps:
            return ResponseObject(False, "Allowed IP already taken by another peer")
        if not ValidateIPAddressesWithRange(endpoint_allowed_ip):
            return ResponseObject(False, f"Endpoint Allowed IPs format is incorrect")
        if len(dns_addresses) > 0 and not ValidateDNSAddress(dns_addresses):
            return ResponseObject(False, f"DNS format is incorrect")
        if mtu < 0 or mtu > 1460:
            return ResponseObject(False, "MTU format is not correct")
        if keepalive < 0:
            return ResponseObject(False, "Persistent Keepalive format is not correct")
        if advanced_security != "on" and advanced_security != "off":
            return ResponseObject(False, "Advanced Security can only be on or off")
        if len(private_key) > 0:
            pubKey = GenerateWireguardPublicKey(private_key)
            if not pubKey[0] or pubKey[1] != self.id:
                return ResponseObject(False, "Private key does not match with the public key")
        try:
            rd = random.Random()
            uid = str(uuid.UUID(int=rd.getrandbits(128), version=4))
            pskExist = len(preshared_key) > 0

            if pskExist:
                with open(uid, "w+") as f:
                    f.write(preshared_key)
            newAllowedIPs = allowed_ip.replace(" ", "")
            updateAllowedIp = subprocess.check_output(
                f"{self.configuration.Protocol} set {self.configuration.Name} peer {self.id} allowed-ips {newAllowedIPs} {f'preshared-key {uid}' if pskExist else 'preshared-key /dev/null'}",
                shell=True, stderr=subprocess.STDOUT)

            if pskExist: os.remove(uid)

            if len(updateAllowedIp.decode().strip("\n")) != 0:
                return ResponseObject(False,
                                      "Update peer failed when updating Allowed IPs")
            saveConfig = subprocess.check_output(f"{self.configuration.Protocol}-quick save {self.configuration.Name}",
                                                 shell=True, stderr=subprocess.STDOUT)
            if f"wg showconf {self.configuration.Name}" not in saveConfig.decode().strip('\n'):
                return ResponseObject(False,
                                      "Update peer failed when saving the configuration")
            sqlUpdate(
                '''UPDATE '%s' SET name = ?, private_key = ?, DNS = ?, endpoint_allowed_ip = ?, mtu = ?, 
                keepalive = ?, preshared_key = ?, advanced_security = ?  WHERE id = ?''' % self.configuration.Name,
                (name, private_key, dns_addresses, endpoint_allowed_ip, mtu,
                 keepalive, preshared_key, advanced_security, self.id,)
            )
            return ResponseObject()
        except subprocess.CalledProcessError as exc:
            return ResponseObject(False, exc.output.decode("UTF-8").strip())
    
"""
Dashboard API Key
"""
class DashboardAPIKey:
    def __init__(self, Key: str, CreatedAt: str, ExpiredAt: str):
        self.Key = Key
        self.CreatedAt = CreatedAt
        self.ExpiredAt = ExpiredAt
    
    def toJson(self):
        return self.__dict__

"""
Dashboard Configuration
"""
class DashboardConfig:

    def __init__(self):
        if not os.path.exists(DASHBOARD_CONF):
            open(DASHBOARD_CONF, "x")
        self.__config = configparser.RawConfigParser(strict=False)
        self.__config.read_file(open(DASHBOARD_CONF, "r+"))
        self.hiddenAttribute = ["totp_key", "auth_req"]
        self.__default = {
            "Account": {
                "username": "admin",
                "password": "admin",
                "enable_totp": "false",
                "totp_verified": "false",
                "totp_key": pyotp.random_base32()
            },
            "Server": {
                "wg_conf_path": "/etc/wireguard",
                "awg_conf_path": "/etc/amnezia/amneziawg",
                "app_prefix": "",
                "app_ip": "0.0.0.0",
                "app_port": "10086",
                "auth_req": "true",
                "version": DASHBOARD_VERSION,
                "dashboard_refresh_interval": "60000",
                "dashboard_peer_list_display": "grid",
                "dashboard_sort": "status",
                "dashboard_theme": "dark",
                "dashboard_api_key": "false",
                "dashboard_language": "en"
            },
            "Peers": {
                "peer_global_DNS": "1.1.1.1",
                "peer_endpoint_allowed_ip": "0.0.0.0/0",
                "peer_display_mode": "grid",
                "remote_endpoint": GetRemoteEndpoint(),
                "peer_MTU": "1420",
                "peer_keep_alive": "21"
            },
            "Other": {
                "welcome_session": "true"
            },
            "Database":{
                "type": "sqlite"
            },
            "Email":{
                "server": "",
                "port": "",
                "encryption": "",
                "username": "",
                "email_password": "",
                "send_from": "",
                "email_template": ""
            },
            "WireGuardConfiguration": {
                "autostart": ""
            }
        }

        for section, keys in self.__default.items():
            for key, value in keys.items():
                exist, currentData = self.GetConfig(section, key)
                if not exist:
                    self.SetConfig(section, key, value, True)
        self.__createAPIKeyTable()
        self.DashboardAPIKeys = self.__getAPIKeys()
        self.APIAccessed = False
        self.SetConfig("Server", "version", DASHBOARD_VERSION)
    
    def __createAPIKeyTable(self):
        existingTable = sqlSelect("SELECT name FROM sqlite_master WHERE type='table' AND name = 'DashboardAPIKeys'").fetchall()
        if len(existingTable) == 0:
            sqlUpdate("CREATE TABLE DashboardAPIKeys (Key VARCHAR NOT NULL PRIMARY KEY, CreatedAt DATETIME NOT NULL DEFAULT (datetime('now', 'localtime')), ExpiredAt VARCHAR)")
    
    def __getAPIKeys(self) -> list[DashboardAPIKey]:
        keys = sqlSelect("SELECT * FROM DashboardAPIKeys WHERE ExpiredAt IS NULL OR ExpiredAt > datetime('now', 'localtime') ORDER BY CreatedAt DESC").fetchall()
        fKeys = []
        for k in keys:
            
            fKeys.append(DashboardAPIKey(*k))
        return fKeys
    
    def createAPIKeys(self, ExpiredAt = None):
        newKey = secrets.token_urlsafe(32)
        sqlUpdate('INSERT INTO DashboardAPIKeys (Key, ExpiredAt) VALUES (?, ?)', (newKey, ExpiredAt,))
        
        self.DashboardAPIKeys = self.__getAPIKeys()
        
    def deleteAPIKey(self, key):
        sqlUpdate("UPDATE DashboardAPIKeys SET ExpiredAt = datetime('now', 'localtime') WHERE Key = ?", (key, ))
        self.DashboardAPIKeys = self.__getAPIKeys()
    
    def __configValidation(self, section : str, key: str, value: Any) -> [bool, str]:
        if (type(value) is str and len(value) == 0 
                and section not in ['Email', 'WireGuardConfiguration'] and 
                (section == 'Peer' and key == 'peer_global_dns')):
            return False, "Field cannot be empty!"
        if section == "Peers" and key == "peer_global_dns" and len(value) > 0:
            return ValidateDNSAddress(value)
        if section == "Peers" and key == "peer_endpoint_allowed_ip":
            value = value.split(",")
            for i in value:
                i = i.strip()
                try:
                    ipaddress.ip_network(i, strict=False)
                except Exception as e:
                    return False, str(e)
        if section == "Server" and key == "wg_conf_path":
            if not os.path.exists(value):
                return False, f"{value} is not a valid path"
        if section == "Account" and key == "password":
            if self.GetConfig("Account", "password")[0]:
                if not self.__checkPassword(
                        value["currentPassword"], self.GetConfig("Account", "password")[1].encode("utf-8")):
                    return False, "Current password does not match."
                if value["newPassword"] != value["repeatNewPassword"]:
                    return False, "New passwords does not match"
        return True, ""

    def generatePassword(self, plainTextPassword: str):
        return bcrypt.hashpw(plainTextPassword.encode("utf-8"), bcrypt.gensalt())

    def __checkPassword(self, plainTextPassword: str, hashedPassword: bytes):
        return bcrypt.checkpw(plainTextPassword.encode("utf-8"), hashedPassword)

    def SetConfig(self, section: str, key: str, value: any, init: bool = False) -> [bool, str]:
        if key in self.hiddenAttribute and not init:
            return False, None

        if not init:
            valid, msg = self.__configValidation(section, key, value)
            if not valid:
                return False, msg

        if section == "Account" and key == "password":
            if not init:
                value = self.generatePassword(value["newPassword"]).decode("utf-8")
            else:
                value = self.generatePassword(value).decode("utf-8")
                
        if section == "Email" and key == "email_template":
            value = value.encode('unicode_escape').decode('utf-8')

        if section == "Server" and key == "wg_conf_path":
            if not os.path.exists(value):
                return False, "Path does not exist"

        if section not in self.__config:
            if init:
                self.__config[section] = {}
            else:
                return False, "Section does not exist"
        
        if ((key not in self.__config[section].keys() and init) or 
                (key in self.__config[section].keys())):
            if type(value) is bool:
                if value:
                    self.__config[section][key] = "true"
                else:
                    self.__config[section][key] = "false"
            elif type(value) in [int, float]:
                self.__config[section][key] = str(value)
            elif type(value) is list:
                self.__config[section][key] = "||".join(value).strip("||")
            else:
                self.__config[section][key] = value
            return self.SaveConfig(), ""
        else:
            return False, f"{key} does not exist under {section}"
        return True, ""

    def SaveConfig(self) -> bool:
        try:
            with open(DASHBOARD_CONF, "w+", encoding='utf-8') as configFile:
                self.__config.write(configFile)
            return True
        except Exception as e:
            return False

    def GetConfig(self, section, key) -> [bool, any]:
        if section not in self.__config:
            return False, None

        if key not in self.__config[section]:
            return False, None

        if section == "Email" and key == "email_template":
            return True, self.__config[section][key].encode('utf-8').decode('unicode_escape')
        
        if section == "WireGuardConfiguration" and key == "autostart":
            return True, list(filter(lambda x: len(x) > 0, self.__config[section][key].split("||")))

        if self.__config[section][key] in ["1", "yes", "true", "on"]:
            return True, True

        if self.__config[section][key] in ["0", "no", "false", "off"]:
            return True, False
        

        return True, self.__config[section][key]

    def toJson(self) -> dict[str, dict[Any, Any]]:
        the_dict = {}

        for section in self.__config.sections():
            the_dict[section] = {}
            for key, val in self.__config.items(section):
                if key not in self.hiddenAttribute:
                    the_dict[section][key] = self.GetConfig(section, key)[1]
        return the_dict


"""
Database Connection Functions
"""

sqldb = sqlite3.connect(os.path.join(CONFIGURATION_PATH, 'db', 'wgdashboard.db'), check_same_thread=False)
sqldb.row_factory = sqlite3.Row

def sqlSelect(statement: str, paramters: tuple = ()) -> sqlite3.Cursor:
    result = []
    try:
        cursor = sqldb.cursor()
        result = cursor.execute(statement, paramters)
    except Exception as error:
        print("[WGDashboard] SQLite Error:" + str(error) + " | Statement: " + statement)
    return result

def sqlUpdate(statement: str, paramters: tuple = ()) -> sqlite3.Cursor:
    sqldb = sqlite3.connect(os.path.join(CONFIGURATION_PATH, 'db', 'wgdashboard.db'))
    sqldb.row_factory = sqlite3.Row
    cursor = sqldb.cursor()
    with sqldb:
        cursor = sqldb.cursor()
        try:
            statement = statement.rstrip(';')
            s = f'BEGIN TRANSACTION;{statement};END TRANSACTION;'
            cursor.execute(statement, paramters)
            # sqldb.commit()
        except Exception as error:
            print("[WGDashboard] SQLite Error:" + str(error) + " | Statement: " + statement)
    sqldb.close()

DashboardConfig = DashboardConfig()
EmailSender = EmailSender(DashboardConfig)
_, APP_PREFIX = DashboardConfig.GetConfig("Server", "app_prefix")
cors = CORS(app, resources={rf"{APP_PREFIX}/api/*": {
    "origins": "*",
    "methods": "DELETE, POST, GET, OPTIONS",
    "allow_headers": ["Content-Type", "wg-dashboard-apikey"]
}})

'''
API Routes
'''

@app.before_request
def auth_req():
    if request.method.lower() == 'options':
        return ResponseObject(True)        

    DashboardConfig.APIAccessed = False
    if "api" in request.path:
        if str(request.method) == "GET":
            DashboardLogger.log(str(request.url), str(request.remote_addr), Message=str(request.args))
        elif str(request.method) == "POST":
            DashboardLogger.log(str(request.url), str(request.remote_addr), Message=f"Request Args: {str(request.args)} Body:{str(request.get_json())}")
        
    
    authenticationRequired = DashboardConfig.GetConfig("Server", "auth_req")[1]
    d = request.headers
    if authenticationRequired:
        apiKey = d.get('wg-dashboard-apikey')
        apiKeyEnabled = DashboardConfig.GetConfig("Server", "dashboard_api_key")[1]
        if apiKey is not None and len(apiKey) > 0 and apiKeyEnabled:
            apiKeyExist = len(list(filter(lambda x : x.Key == apiKey, DashboardConfig.DashboardAPIKeys))) == 1
            DashboardLogger.log(str(request.url), str(request.remote_addr), Message=f"API Key Access: {('true' if apiKeyExist else 'false')} - Key: {apiKey}")
            if not apiKeyExist:
                DashboardConfig.APIAccessed = False
                response = Flask.make_response(app, {
                    "status": False,
                    "message": "API Key does not exist",
                    "data": None
                })
                response.content_type = "application/json"
                response.status_code = 401
                return response
            DashboardConfig.APIAccessed = True
        else:
            DashboardConfig.APIAccessed = False
            whiteList = [
                '/static/', 'validateAuthentication', 'authenticate',
                'getDashboardTheme', 'getDashboardVersion', 'sharePeer/get', 'isTotpEnabled', 'locale',
                '/fileDownload', 'users', 'users/statistics', 'systemStatus', 'firewall/nat',
                'rbac/groups', 'rbac/policies', 'rbac/peers',
                'organizations', 'organization/subnets', 'organization/users',
                'enhanced-rbac/groups', 'enhanced-rbac/peers', 'enhanced-rbac/organizations',
                'enhanced-rbac/groups/*/vpn-assignment', 'enhanced-rbac/groups/*/vpn-subnets', 
                'enhanced-rbac/groups/vpn-servers/*', 'enhanced-rbac/groups/*/users',
                'enhanced-rbac/groups/*/peers-summary', 'users/*/groups', 'users/*/vpn-peer',
                'users/*/vpn-config', 'users/*/vpn-peers', 'wireguard-configurations',
                'getAvailableIPs'
            ]
            
            if ("username" not in session 
                    and (f"{(APP_PREFIX if len(APP_PREFIX) > 0 else '')}/" != request.path 
                    and f"{(APP_PREFIX if len(APP_PREFIX) > 0 else '')}" != request.path)
                    and len(list(filter(lambda x : x not in request.path, whiteList))) == len(whiteList)
            ):
                response = Flask.make_response(app, {
                    "status": False,
                    "message": "Unauthorized access.",
                    "data": None
                })
                response.content_type = "application/json"
                response.status_code = 401
                return response

@app.route(f'{APP_PREFIX}/api/handshake', methods=["GET", "OPTIONS"])
def API_Handshake():
    return ResponseObject(True)

@app.get(f'{APP_PREFIX}/api/validateAuthentication')
def API_ValidateAuthentication():
    token = request.cookies.get("authToken")
    if DashboardConfig.GetConfig("Server", "auth_req")[1]:
        if token is None or token == "" or "username" not in session or session["username"] != token:
            return ResponseObject(False, "Invalid authentication.")
    return ResponseObject(True)

@app.get(f'{APP_PREFIX}/api/requireAuthentication')
def API_RequireAuthentication():
    return ResponseObject(data=DashboardConfig.GetConfig("Server", "auth_req")[1])

@app.post(f'{APP_PREFIX}/api/authenticate')
def API_AuthenticateLogin():
    data = request.get_json()
    if not DashboardConfig.GetConfig("Server", "auth_req")[1]:
        return ResponseObject(True, DashboardConfig.GetConfig("Other", "welcome_session")[1])
    
    if DashboardConfig.APIAccessed:
        authToken = hashlib.sha256(f"{request.headers.get('wg-dashboard-apikey')}{datetime.now()}".encode()).hexdigest()
        session['username'] = authToken
        resp = ResponseObject(True, DashboardConfig.GetConfig("Other", "welcome_session")[1])
        resp.set_cookie("authToken", authToken)
        session.permanent = True
        return resp
    valid = bcrypt.checkpw(data['password'].encode("utf-8"),
                           DashboardConfig.GetConfig("Account", "password")[1].encode("utf-8"))
    totpEnabled = DashboardConfig.GetConfig("Account", "enable_totp")[1]
    totpValid = False
    if totpEnabled:
        totpValid = pyotp.TOTP(DashboardConfig.GetConfig("Account", "totp_key")[1]).now() == data['totp']

    if (valid
            and data['username'] == DashboardConfig.GetConfig("Account", "username")[1]
            and ((totpEnabled and totpValid) or not totpEnabled)
    ):
        authToken = hashlib.sha256(f"{data['username']}{datetime.now()}".encode()).hexdigest()
        session['username'] = authToken
        resp = ResponseObject(True, DashboardConfig.GetConfig("Other", "welcome_session")[1])
        resp.set_cookie("authToken", authToken)
        session.permanent = True
        DashboardLogger.log(str(request.url), str(request.remote_addr), Message=f"Login success: {data['username']}")
        # Log to centralized logging system
        LoggingManager.log_activity(
            level='info',
            category='authentication',
            message=f'User login successful: {data["username"]}',
            user=data['username'],
            ip_address=request.remote_addr
        )
        return resp
    DashboardLogger.log(str(request.url), str(request.remote_addr), Message=f"Login failed: {data['username']}")
    # Log failed login attempt
    LoggingManager.log_activity(
        level='warning',
        category='authentication',
        message=f'Failed login attempt: {data["username"]}',
        user=data['username'],
        ip_address=request.remote_addr
    )
    if totpEnabled:
        return ResponseObject(False, "Sorry, your username, password or OTP is incorrect.")
    else:
        return ResponseObject(False, "Sorry, your username or password is incorrect.")

@app.get(f'{APP_PREFIX}/api/signout')
def API_SignOut():
    # Log signout activity
    username = session.get('username', 'unknown')
    LoggingManager.log_activity(
        level='info',
        category='authentication',
        message=f'User signout: {username}',
        user=username,
        ip_address=request.remote_addr
    )
    resp = ResponseObject(True, "")
    resp.delete_cookie("authToken")
    session.clear()
    return resp

@app.route(f'{APP_PREFIX}/api/getWireguardConfigurations', methods=["GET"])
def API_getWireguardConfigurations():
    InitWireguardConfigurationsList()
    return ResponseObject(data=[wc for wc in WireguardConfigurations.values()])

@app.route(f'{APP_PREFIX}/api/addWireguardConfiguration', methods=["POST"])
def API_addWireguardConfiguration():
    data = request.get_json()
    requiredKeys = [
        "ConfigurationName", "Address", "ListenPort", "PrivateKey", "Protocol"
    ]
    for i in requiredKeys:
        if i not in data.keys():
            return ResponseObject(False, "Please provide all required parameters.")
    
    if data.get("Protocol") not in ProtocolsEnabled():
        return ResponseObject(False, "Please provide a valid protocol: wg / awg.")

    # Check duplicate names, ports, address
    for i in WireguardConfigurations.values():
        if i.Name == data['ConfigurationName']:
            return ResponseObject(False,
                                  f"Already have a configuration with the name \"{data['ConfigurationName']}\"",
                                  "ConfigurationName")

        if str(i.ListenPort) == str(data["ListenPort"]):
            return ResponseObject(False,
                                  f"Already have a configuration with the port \"{data['ListenPort']}\"",
                                  "ListenPort")

        if i.Address == data["Address"]:
            return ResponseObject(False,
                                  f"Already have a configuration with the address \"{data['Address']}\"",
                                  "Address")

    if "Backup" in data.keys():
        path = {
            "wg": DashboardConfig.GetConfig("Server", "wg_conf_path")[1],
            "awg": DashboardConfig.GetConfig("Server", "awg_conf_path")[1]
        }
     
        if (os.path.exists(os.path.join(path['wg'], 'WGDashboard_Backup', data["Backup"])) and
                os.path.exists(os.path.join(path['wg'], 'WGDashboard_Backup', data["Backup"].replace('.conf', '.sql')))):
            protocol = "wg"
        elif (os.path.exists(os.path.join(path['awg'], 'WGDashboard_Backup', data["Backup"])) and
              os.path.exists(os.path.join(path['awg'], 'WGDashboard_Backup', data["Backup"].replace('.conf', '.sql')))):
            protocol = "awg"
        else:
            return ResponseObject(False, "Backup does not exist")
        
        shutil.copy(
            os.path.join(path[protocol], 'WGDashboard_Backup', data["Backup"]),
            os.path.join(path[protocol], f'{data["ConfigurationName"]}.conf')
        )
        WireguardConfigurations[data['ConfigurationName']] = WireguardConfiguration(data=data, name=data['ConfigurationName']) if protocol == 'wg' else AmneziaWireguardConfiguration(data=data, name=data['ConfigurationName'])
    else:
        WireguardConfigurations[data['ConfigurationName']] = WireguardConfiguration(data=data) if data.get('Protocol') == 'wg' else AmneziaWireguardConfiguration(data=data)
    return ResponseObject()

@app.get(f'{APP_PREFIX}/api/toggleWireguardConfiguration')
def API_toggleWireguardConfiguration():
    configurationName = request.args.get('configurationName')
    if configurationName is None or len(
            configurationName) == 0 or configurationName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Please provide a valid configuration name", status_code=404)
    toggleStatus, msg = WireguardConfigurations[configurationName].toggleConfiguration()
    
    # Log the activity
    action = "started" if WireguardConfigurations[configurationName].Status else "stopped"
    LoggingManager.log_activity(
        level='info',
        category='wireguard',
        message=f'WireGuard configuration {action}: {configurationName}',
        user=request.remote_addr,
        ip_address=request.remote_addr
    )
    
    return ResponseObject(toggleStatus, msg, WireguardConfigurations[configurationName].Status)

@app.post(f'{APP_PREFIX}/api/updateWireguardConfiguration')
def API_updateWireguardConfiguration():
    data = request.get_json()
    requiredKeys = ["Name"]
    for i in requiredKeys:
        if i not in data.keys():
            return ResponseObject(False, "Please provide these following field: " + ", ".join(requiredKeys))
    name = data.get("Name")
    if name not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist", status_code=404)
    
    status, msg = WireguardConfigurations[name].updateConfigurationSettings(data)
    
    return ResponseObject(status, message=msg, data=WireguardConfigurations[name])

@app.get(f'{APP_PREFIX}/api/getWireguardConfigurationRawFile')
def API_GetWireguardConfigurationRawFile():
    configurationName = request.args.get('configurationName')
    if configurationName is None or len(
            configurationName) == 0 or configurationName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Please provide a valid configuration name", status_code=404)
    
    return ResponseObject(data={
        "path": WireguardConfigurations[configurationName].configPath,
        "content": WireguardConfigurations[configurationName].getRawConfigurationFile()
    })

@app.post(f'{APP_PREFIX}/api/updateWireguardConfigurationRawFile')
def API_UpdateWireguardConfigurationRawFile():
    data = request.get_json()
    configurationName = data.get('configurationName')
    rawConfiguration = data.get('rawConfiguration')
    if configurationName is None or len(
            configurationName) == 0 or configurationName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Please provide a valid configuration name")
    if rawConfiguration is None or len(rawConfiguration) == 0:
        return ResponseObject(False, "Please provide content")
    
    status, err = WireguardConfigurations[configurationName].updateRawConfigurationFile(rawConfiguration)

    return ResponseObject(status=status, message=err)

@app.post(f'{APP_PREFIX}/api/deleteWireguardConfiguration')
def API_deleteWireguardConfiguration():
    data = request.get_json()
    if "ConfigurationName" not in data.keys() or data.get("ConfigurationName") is None or data.get("ConfigurationName") not in WireguardConfigurations.keys():
        return ResponseObject(False, "Please provide the configuration name you want to delete", status_code=404)
    status = WireguardConfigurations[data.get("ConfigurationName")].deleteConfiguration()
    if status:
        # Log the activity
        LoggingManager.log_activity(
            level='info',
            category='wireguard',
            message=f'WireGuard configuration deleted: {data.get("ConfigurationName")}',
            user=request.remote_addr,
            ip_address=request.remote_addr
        )
        WireguardConfigurations.pop(data.get("ConfigurationName"))
    return ResponseObject(status)

@app.post(f'{APP_PREFIX}/api/renameWireguardConfiguration')
def API_renameWireguardConfiguration():
    data = request.get_json()
    keys = ["ConfigurationName", "NewConfigurationName"]
    for k in keys:
        if (k not in data.keys() or data.get(k) is None or len(data.get(k)) == 0 or 
                (k == "ConfigurationName" and data.get(k) not in WireguardConfigurations.keys())): 
            return ResponseObject(False, "Please provide the configuration name you want to rename", status_code=404)
        
    status, message = WireguardConfigurations[data.get("ConfigurationName")].renameConfiguration(data.get("NewConfigurationName"))
    if status:
        WireguardConfigurations.pop(data.get("ConfigurationName"))
        WireguardConfigurations[data.get("NewConfigurationName")] = WireguardConfiguration(data.get("NewConfigurationName"))
    return ResponseObject(status, message)

@app.get(f'{APP_PREFIX}/api/getWireguardConfigurationRealtimeTraffic')
def API_getWireguardConfigurationRealtimeTraffic():
    configurationName = request.args.get('configurationName')
    if configurationName is None or configurationName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist", status_code=404)
    return ResponseObject(data=WireguardConfigurations[configurationName].getRealtimeTrafficUsage())

@app.get(f'{APP_PREFIX}/api/getWireguardConfigurationBackup')
def API_getWireguardConfigurationBackup():
    configurationName = request.args.get('configurationName')
    if configurationName is None or configurationName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist",  status_code=404)
    return ResponseObject(data=WireguardConfigurations[configurationName].getBackups())

@app.get(f'{APP_PREFIX}/api/getAllWireguardConfigurationBackup')
def API_getAllWireguardConfigurationBackup():
    data = {
        "ExistingConfigurations": {},
        "NonExistingConfigurations": {}
    }
    existingConfiguration = WireguardConfigurations.keys()
    for i in existingConfiguration:
        b = WireguardConfigurations[i].getBackups(True)
        if len(b) > 0:
            data['ExistingConfigurations'][i] = WireguardConfigurations[i].getBackups(True)
            
    for protocol in ProtocolsEnabled():
        directory = os.path.join(DashboardConfig.GetConfig("Server", f"{protocol}_conf_path")[1], 'WGDashboard_Backup')
        files = [(file, os.path.getctime(os.path.join(directory, file)))
                 for file in os.listdir(directory) if os.path.isfile(os.path.join(directory, file))]
        files.sort(key=lambda x: x[1], reverse=True)
    
        for f, ct in files:
            if RegexMatch(r"^(.*)_(.*)\.(conf)$", f):
                s = re.search(r"^(.*)_(.*)\.(conf)$", f)
                name = s.group(1)
                if name not in existingConfiguration:
                    if name not in data['NonExistingConfigurations'].keys():
                        data['NonExistingConfigurations'][name] = []
                    
                    date = s.group(2)
                    d = {
                        "protocol": protocol,
                        "filename": f,
                        "backupDate": date,
                        "content": open(os.path.join(DashboardConfig.GetConfig("Server", f"{protocol}_conf_path")[1], 'WGDashboard_Backup', f), 'r').read()
                    }
                    if f.replace(".conf", ".sql") in list(os.listdir(directory)):
                        d['database'] = True
                        d['databaseContent'] = open(os.path.join(DashboardConfig.GetConfig("Server", f"{protocol}_conf_path")[1], 'WGDashboard_Backup', f.replace(".conf", ".sql")), 'r').read()
                    data['NonExistingConfigurations'][name].append(d)
    return ResponseObject(data=data)

@app.get(f'{APP_PREFIX}/api/createWireguardConfigurationBackup')
def API_createWireguardConfigurationBackup():
    configurationName = request.args.get('configurationName')
    if configurationName is None or configurationName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist",  status_code=404)
    return ResponseObject(status=WireguardConfigurations[configurationName].backupConfigurationFile()[0], 
                          data=WireguardConfigurations[configurationName].getBackups())

@app.post(f'{APP_PREFIX}/api/deleteWireguardConfigurationBackup')
def API_deleteWireguardConfigurationBackup():
    data = request.get_json()
    if ("ConfigurationName" not in data.keys() or 
            "BackupFileName" not in data.keys() or
            len(data['ConfigurationName']) == 0 or 
            len(data['BackupFileName']) == 0):
        return ResponseObject(False, 
        "Please provide configurationName and backupFileName in body",  status_code=400)
    configurationName = data['ConfigurationName']
    backupFileName = data['BackupFileName']
    if configurationName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist", status_code=404)
    
    status = WireguardConfigurations[configurationName].deleteBackup(backupFileName)
    return ResponseObject(status=status, message=(None if status else 'Backup file does not exist'), 
                          status_code = (200 if status else 404))

@app.get(f'{APP_PREFIX}/api/downloadWireguardConfigurationBackup')
def API_downloadWireguardConfigurationBackup():
    configurationName = request.args.get('configurationName')
    backupFileName = request.args.get('backupFileName')
    if configurationName is None or configurationName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist", status_code=404)
    status, zip = WireguardConfigurations[configurationName].downloadBackup(backupFileName)
    return ResponseObject(status, data=zip, status_code=(200 if status else 404))

@app.post(f'{APP_PREFIX}/api/restoreWireguardConfigurationBackup')
def API_restoreWireguardConfigurationBackup():
    data = request.get_json()
    if ("ConfigurationName" not in data.keys() or
            "BackupFileName" not in data.keys() or
            len(data['ConfigurationName']) == 0 or
            len(data['BackupFileName']) == 0):
        return ResponseObject(False,
                              "Please provide ConfigurationName and BackupFileName in body", status_code=400)
    configurationName = data['ConfigurationName']
    backupFileName = data['BackupFileName']
    if configurationName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist", status_code=404)
    
    status = WireguardConfigurations[configurationName].restoreBackup(backupFileName)
    return ResponseObject(status=status, message=(None if status else 'Restore backup failed'))
    
@app.get(f'{APP_PREFIX}/api/getDashboardConfiguration')
def API_getDashboardConfiguration():
    return ResponseObject(data=DashboardConfig.toJson())

@app.post(f'{APP_PREFIX}/api/updateDashboardConfigurationItem')
def API_updateDashboardConfigurationItem():
    data = request.get_json()
    if "section" not in data.keys() or "key" not in data.keys() or "value" not in data.keys():
        return ResponseObject(False, "Invalid request.")
    valid, msg = DashboardConfig.SetConfig(
        data["section"], data["key"], data['value'])
    if not valid:
        return ResponseObject(False, msg)
    if data['section'] == "Server":
        if data['key'] == 'wg_conf_path':
            WireguardConfigurations.clear()
            WireguardConfigurations.clear()
            InitWireguardConfigurationsList()            
    return ResponseObject(True, data=DashboardConfig.GetConfig(data["section"], data["key"])[1])

@app.get(f'{APP_PREFIX}/api/getDashboardAPIKeys')
def API_getDashboardAPIKeys():
    if DashboardConfig.GetConfig('Server', 'dashboard_api_key'):
        return ResponseObject(data=DashboardConfig.DashboardAPIKeys)
    return ResponseObject(False, "WGDashboard API Keys function is disabled")

@app.post(f'{APP_PREFIX}/api/newDashboardAPIKey')
def API_newDashboardAPIKey():
    data = request.get_json()
    if DashboardConfig.GetConfig('Server', 'dashboard_api_key'):
        try:
            if data['NeverExpire']:
                expiredAt = None
            else:
                expiredAt = datetime.strptime(data['ExpiredAt'], '%Y-%m-%d %H:%M:%S')
            DashboardConfig.createAPIKeys(expiredAt)
            return ResponseObject(True, data=DashboardConfig.DashboardAPIKeys)
        except Exception as e:
            return ResponseObject(False, str(e))
    return ResponseObject(False, "Dashboard API Keys function is disbaled")

@app.post(f'{APP_PREFIX}/api/deleteDashboardAPIKey')
def API_deleteDashboardAPIKey():
    data = request.get_json()
    if DashboardConfig.GetConfig('Server', 'dashboard_api_key'):
        if len(data['Key']) > 0 and len(list(filter(lambda x : x.Key == data['Key'], DashboardConfig.DashboardAPIKeys))) > 0:
            DashboardConfig.deleteAPIKey(data['Key'])
            return ResponseObject(True, data=DashboardConfig.DashboardAPIKeys)
        else:
            return ResponseObject(False, "API Key does not exist", status_code=404)
    return ResponseObject(False, "Dashboard API Keys function is disbaled")
    
@app.post(f'{APP_PREFIX}/api/updatePeerSettings/<configName>')
def API_updatePeerSettings(configName):
    data = request.get_json()
    id = data['id']
    if len(id) > 0 and configName in WireguardConfigurations.keys():
        name = data['name']
        private_key = data['private_key']
        dns_addresses = data['DNS']
        allowed_ip = data['allowed_ip']
        endpoint_allowed_ip = data['endpoint_allowed_ip']
        preshared_key = data['preshared_key']
        mtu = data['mtu']
        keepalive = data['keepalive']
        wireguardConfig = WireguardConfigurations[configName]
        foundPeer, peer = wireguardConfig.searchPeer(id)
        if foundPeer:
            if wireguardConfig.Protocol == 'wg':
                return peer.updatePeer(name, private_key, preshared_key, dns_addresses,
                                       allowed_ip, endpoint_allowed_ip, mtu, keepalive)
            
            return peer.updatePeer(name, private_key, preshared_key, dns_addresses,
                allowed_ip, endpoint_allowed_ip, mtu, keepalive, "off")
            
    return ResponseObject(False, "Peer does not exist")

@app.post(f'{APP_PREFIX}/api/resetPeerData/<configName>')
def API_resetPeerData(configName):
    data = request.get_json()
    id = data['id']
    type = data['type']
    if len(id) == 0 or configName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration/Peer does not exist")
    wgc = WireguardConfigurations.get(configName)
    foundPeer, peer = wgc.searchPeer(id)
    if not foundPeer:
        return ResponseObject(False, "Configuration/Peer does not exist")
    
    resetStatus = peer.resetDataUsage(type)
    if resetStatus:
        wgc.restrictPeers([id])
        wgc.allowAccessPeers([id])
    
    return ResponseObject(status=resetStatus)

@app.post(f'{APP_PREFIX}/api/deletePeers/<configName>')
def API_deletePeers(configName: str) -> ResponseObject:
    data = request.get_json()
    peers = data['peers']
    if configName in WireguardConfigurations.keys():
        if len(peers) == 0:
            return ResponseObject(False, "Please specify one or more peers", status_code=400)
        configuration = WireguardConfigurations.get(configName)
        return configuration.deletePeers(peers)

    return ResponseObject(False, "Configuration does not exist", status_code=404)

@app.post(f'{APP_PREFIX}/api/restrictPeers/<configName>')
def API_restrictPeers(configName: str) -> ResponseObject:
    data = request.get_json()
    peers = data['peers']
    if configName in WireguardConfigurations.keys():
        if len(peers) == 0:
            return ResponseObject(False, "Please specify one or more peers")
        configuration = WireguardConfigurations.get(configName)
        return configuration.restrictPeers(peers)
    return ResponseObject(False, "Configuration does not exist", status_code=404)

@app.post(f'{APP_PREFIX}/api/sharePeer/create')
def API_sharePeer_create():
    data: dict[str, str] = request.get_json()
    Configuration = data.get('Configuration')
    Peer = data.get('Peer')
    ExpireDate = data.get('ExpireDate')
    if Configuration is None or Peer is None:
        return ResponseObject(False, "Please specify configuration and peers")
    activeLink = AllPeerShareLinks.getLink(Configuration, Peer)
    if len(activeLink) > 0:
        return ResponseObject(True, 
                              "This peer is already sharing. Please view data for shared link.",
                                data=activeLink[0]
        )
    status, message = AllPeerShareLinks.addLink(Configuration, Peer, ExpireDate)
    if not status:
        return ResponseObject(status, message)
    return ResponseObject(data=AllPeerShareLinks.getLinkByID(message))

@app.post(f'{APP_PREFIX}/api/sharePeer/update')
def API_sharePeer_update():
    data: dict[str, str] = request.get_json()
    ShareID: str = data.get("ShareID")
    ExpireDate: str = data.get("ExpireDate")
    
    if ShareID is None:
        return ResponseObject(False, "Please specify ShareID")
    
    if len(AllPeerShareLinks.getLinkByID(ShareID)) == 0:
        return ResponseObject(False, "ShareID does not exist")
    
    status, message = AllPeerShareLinks.updateLinkExpireDate(ShareID, ExpireDate)
    if not status:
        return ResponseObject(status, message)
    return ResponseObject(data=AllPeerShareLinks.getLinkByID(ShareID))

@app.get(f'{APP_PREFIX}/api/sharePeer/get')
def API_sharePeer_get():
    data = request.args
    ShareID = data.get("ShareID")
    if ShareID is None or len(ShareID) == 0:
        return ResponseObject(False, "Please provide ShareID")
    link = AllPeerShareLinks.getLinkByID(ShareID)
    if len(link) == 0:
        return ResponseObject(False, "This link is either expired to invalid")
    l = link[0]
    if l.Configuration not in WireguardConfigurations.keys():
        return ResponseObject(False, "The peer you're looking for does not exist")
    c = WireguardConfigurations.get(l.Configuration)
    fp, p = c.searchPeer(l.Peer)
    if not fp:
        return ResponseObject(False, "The peer you're looking for does not exist")
    
    return ResponseObject(data=p.downloadPeer())
    
@app.post(f'{APP_PREFIX}/api/allowAccessPeers/<configName>')
def API_allowAccessPeers(configName: str) -> ResponseObject:
    data = request.get_json()
    peers = data['peers']
    if configName in WireguardConfigurations.keys():
        if len(peers) == 0:
            return ResponseObject(False, "Please specify one or more peers")
        configuration = WireguardConfigurations.get(configName)
        return configuration.allowAccessPeers(peers)
    return ResponseObject(False, "Configuration does not exist")

@app.post(f'{APP_PREFIX}/api/addPeers/<configName>')
def API_addPeers(configName):
    if configName in WireguardConfigurations.keys():
        try:
            data: dict = request.get_json()

            bulkAdd: bool = data.get("bulkAdd", False)
            bulkAddAmount: int = data.get('bulkAddAmount', 0)
            preshared_key_bulkAdd: bool = data.get('preshared_key_bulkAdd', False)

            public_key: str = data.get('public_key', "")
            allowed_ips: list[str] = data.get('allowed_ips', [])
            allowed_ips_validation: bool = data.get('allowed_ips_validation', True)
            
            endpoint_allowed_ip: str = data.get('endpoint_allowed_ip', DashboardConfig.GetConfig("Peers", "peer_endpoint_allowed_ip")[1])
            dns_addresses: str = data.get('DNS', DashboardConfig.GetConfig("Peers", "peer_global_DNS")[1])
            mtu: int = data.get('mtu', int(DashboardConfig.GetConfig("Peers", "peer_MTU")[1]))
            keep_alive: int = data.get('keepalive', int(DashboardConfig.GetConfig("Peers", "peer_keep_alive")[1]))
            preshared_key: str = data.get('preshared_key', "")            
    
            if type(mtu) is not int or mtu < 0 or mtu > 1460:
                mtu = int(DashboardConfig.GetConfig("Peers", "peer_MTU")[1])
            if type(keep_alive) is not int or keep_alive < 0:
                keep_alive = int(DashboardConfig.GetConfig("Peers", "peer_keep_alive")[1])
            config = WireguardConfigurations.get(configName)
            if not config.getStatus():
                config.toggleConfiguration()
            ipStatus, availableIps = config.getAvailableIP(-1)
            ipCountStatus, numberOfAvailableIPs = config.getNumberOfAvailableIP()
            defaultIPSubnet = list(availableIps.keys())[0]
            if bulkAdd:
                if type(preshared_key_bulkAdd) is not bool:
                    preshared_key_bulkAdd = False
                if type(bulkAddAmount) is not int or bulkAddAmount < 1:
                    return ResponseObject(False, "Please specify amount of peers you want to add")
                if not ipStatus:
                    return ResponseObject(False, "No more available IP can assign")
                if len(availableIps.keys()) == 0:
                    return ResponseObject(False, "This configuration does not have any IP address available")
                if bulkAddAmount > sum(list(numberOfAvailableIPs.values())):
                    return ResponseObject(False,
                            f"The maximum number of peers can add is {sum(list(numberOfAvailableIPs.values()))}")
                keyPairs = []
                addedCount = 0
                for subnet in availableIps.keys():
                    for ip in availableIps[subnet]:
                        newPrivateKey = GenerateWireguardPrivateKey()[1]
                        addedCount += 1
                        keyPairs.append({
                            "private_key": newPrivateKey,
                            "id": GenerateWireguardPublicKey(newPrivateKey)[1],
                            "preshared_key": (GenerateWireguardPrivateKey()[1] if preshared_key_bulkAdd else ""),
                            "allowed_ip": ip,
                            "name": f"BulkPeer_{(addedCount + 1)}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                            "DNS": dns_addresses,
                            "endpoint_allowed_ip": endpoint_allowed_ip,
                            "mtu": mtu,
                            "keepalive": keep_alive,
                            "advanced_security": "off"
                        })
                        if addedCount == bulkAddAmount:
                            break
                    if addedCount == bulkAddAmount:
                        break
                if len(keyPairs) == 0 or (bulkAdd and len(keyPairs) != bulkAddAmount):
                    return ResponseObject(False, "Generating key pairs by bulk failed")
                status, result = config.addPeers(keyPairs)
                return ResponseObject(status=status, message=result['message'], data=result['peers'])
    
            else:
                if config.searchPeer(public_key)[0] is True:
                    return ResponseObject(False, f"This peer already exist")
                name = data.get("name", "")
                private_key = data.get("private_key", "")

                if len(public_key) == 0:
                    if len(private_key) == 0:
                        private_key = GenerateWireguardPrivateKey()[1]
                        public_key = GenerateWireguardPublicKey(private_key)[1]
                    else:
                        public_key = GenerateWireguardPublicKey(private_key)[1]
                else:
                    if len(private_key) > 0:
                        genPub = GenerateWireguardPublicKey(private_key)[1]
                        # Check if provided pubkey match provided private key
                        if public_key != genPub:
                            return ResponseObject(False, "Provided Public Key does not match provided Private Key")
                        
                # if len(public_key) == 0 and len(private_key) == 0:
                #     private_key = GenerateWireguardPrivateKey()[1]
                #     public_key = GenerateWireguardPublicKey(private_key)[1]
                # elif len(public_key) == 0 and len(private_key) > 0:
                #     public_key = GenerateWireguardPublicKey(private_key)[1]
                
                
                if len(allowed_ips) == 0:
                    if ipStatus:
                        for subnet in availableIps.keys():
                            for ip in availableIps[subnet]:
                                allowed_ips = [ip]
                                break
                            break  
                    else:
                        return ResponseObject(False, "No more available IP can assign") 

                if allowed_ips_validation:
                    for i in allowed_ips:
                        found = False
                        for subnet in availableIps.keys():
                            network = ipaddress.ip_network(subnet, False)
                            ap = ipaddress.ip_network(i)
                            if network.version == ap.version and ap.subnet_of(network):
                                found = True
                        
                        if not found:
                            return ResponseObject(False, f"This IP is not available: {i}")

                status, result = config.addPeers([
                    {
                        "name": name,
                        "id": public_key,
                        "private_key": private_key,
                        "allowed_ip": ','.join(allowed_ips),
                        "preshared_key": preshared_key,
                        "endpoint_allowed_ip": endpoint_allowed_ip,
                        "DNS": dns_addresses,
                        "mtu": mtu,
                        "keepalive": keep_alive,
                        "advanced_security": "off"
                    }]
                )
                return ResponseObject(status=status, message=result['message'], data=result['peers'])
        except Exception as e:
            print(e, str(e.__traceback__))
            return ResponseObject(False, "Add peers failed. Please see data for specific issue")

    return ResponseObject(False, "Configuration does not exist")

@app.get(f"{APP_PREFIX}/api/downloadPeer/<configName>")
def API_downloadPeer(configName):
    data = request.args
    if configName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist")
    configuration = WireguardConfigurations[configName]
    peerFound, peer = configuration.searchPeer(data['id'])
    if len(data['id']) == 0 or not peerFound:
        return ResponseObject(False, "Peer does not exist")
    return ResponseObject(data=peer.downloadPeer())

@app.get(f"{APP_PREFIX}/api/downloadAllPeers/<configName>")
def API_downloadAllPeers(configName):
    if configName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist")
    configuration = WireguardConfigurations[configName]
    peerData = []
    untitledPeer = 0
    for i in configuration.Peers:
        file = i.downloadPeer()
        if file["fileName"] == "UntitledPeer":
            file["fileName"] = str(untitledPeer) + "_" + file["fileName"]
            untitledPeer += 1
        peerData.append(file)
    return ResponseObject(data=peerData)

@app.get(f"{APP_PREFIX}/api/getAvailableIPs/<configName>")
def API_getAvailableIPs(configName):
    if configName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist")
    status, ips = WireguardConfigurations.get(configName).getAvailableIP()
    return ResponseObject(status=status, data=ips)

@app.get(f"{APP_PREFIX}/api/getNumberOfAvailableIPs/<configName>")
def API_getNumberOfAvailableIPs(configName):
    if configName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist")
    status, ips = WireguardConfigurations.get(configName).getNumberOfAvailableIP()
    return ResponseObject(status=status, data=ips)

@app.get(f'{APP_PREFIX}/api/getWireguardConfigurationInfo')
def API_getConfigurationInfo():
    configurationName = request.args.get("configurationName")
    if not configurationName or configurationName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Please provide configuration name")
    return ResponseObject(data={
        "configurationInfo": WireguardConfigurations[configurationName],
        "configurationPeers": WireguardConfigurations[configurationName].getPeersList(),
        "configurationRestrictedPeers": WireguardConfigurations[configurationName].getRestrictedPeersList()
    })

@app.get(f'{APP_PREFIX}/api/getDashboardTheme')
def API_getDashboardTheme():
    return ResponseObject(data=DashboardConfig.GetConfig("Server", "dashboard_theme")[1])

@app.get(f'{APP_PREFIX}/api/getDashboardVersion')
def API_getDashboardVersion():
    return ResponseObject(data=DashboardConfig.GetConfig("Server", "version")[1])

@app.post(f'{APP_PREFIX}/api/savePeerScheduleJob')
def API_savePeerScheduleJob():
    data = request.json
    if "Job" not in data.keys():
        return ResponseObject(False, "Please specify job")
    job: dict = data['Job']
    if "Peer" not in job.keys() or "Configuration" not in job.keys():
        return ResponseObject(False, "Please specify peer and configuration")
    configuration = WireguardConfigurations.get(job['Configuration'])
    if configuration is None:
        return ResponseObject(False, "Configuration does not exist")
    f, fp = configuration.searchPeer(job['Peer'])
    if not f:
        return ResponseObject(False, "Peer does not exist")
    
    
    s, p = AllPeerJobs.saveJob(PeerJob(
        job['JobID'], job['Configuration'], job['Peer'], job['Field'], job['Operator'], job['Value'],
        job['CreationDate'], job['ExpireDate'], job['Action']))
    if s:
        return ResponseObject(s, data=p)
    return ResponseObject(s, message=p)

@app.post(f'{APP_PREFIX}/api/deletePeerScheduleJob')
def API_deletePeerScheduleJob():
    data = request.json
    if "Job" not in data.keys():
        return ResponseObject(False, "Please specify job")
    job: dict = data['Job']
    if "Peer" not in job.keys() or "Configuration" not in job.keys():
        return ResponseObject(False, "Please specify peer and configuration")
    configuration = WireguardConfigurations.get(job['Configuration'])
    if configuration is None:
        return ResponseObject(False, "Configuration does not exist")
    f, fp = configuration.searchPeer(job['Peer'])
    if not f:
        return ResponseObject(False, "Peer does not exist")

    s, p = AllPeerJobs.deleteJob(PeerJob(
        job['JobID'], job['Configuration'], job['Peer'], job['Field'], job['Operator'], job['Value'],
        job['CreationDate'], job['ExpireDate'], job['Action']))
    if s:
        return ResponseObject(s, data=p)
    return ResponseObject(s, message=p)

@app.get(f'{APP_PREFIX}/api/getPeerScheduleJobLogs/<configName>')
def API_getPeerScheduleJobLogs(configName):
    if configName not in WireguardConfigurations.keys():
        return ResponseObject(False, "Configuration does not exist")
    data = request.args.get("requestAll")
    requestAll = False
    if data is not None and data == "true":
        requestAll = True
    return ResponseObject(data=JobLogger.getLogs(requestAll, configName))

'''
File Download
'''
@app.get(f'{APP_PREFIX}/fileDownload')
def API_download():
    file = request.args.get('file')
    if file is None or len(file) == 0:
        return ResponseObject(False, "Please specify a file")
    if os.path.exists(os.path.join('download', file)):
        return send_file(os.path.join('download', file), as_attachment=True)
    else:
        return ResponseObject(False, "File does not exist")


'''
Tools
'''

@app.get(f'{APP_PREFIX}/api/ping/getAllPeersIpAddress')
def API_ping_getAllPeersIpAddress():
    ips = {}
    for c in WireguardConfigurations.values():
        cips = {}
        for p in c.Peers:
            allowed_ip = p.allowed_ip.replace(" ", "").split(",")
            parsed = []
            for x in allowed_ip:
                try:
                    ip = ipaddress.ip_network(x, strict=False)
                except ValueError as e:
                    print(f"{p.id} - {c.Name}")
                if len(list(ip.hosts())) == 1:
                    parsed.append(str(ip.hosts()[0]))
            endpoint = p.endpoint.replace(" ", "").replace("(none)", "")
            if len(p.name) > 0:
                cips[f"{p.name} - {p.id}"] = {
                    "allowed_ips": parsed,
                    "endpoint": endpoint
                }
            else:
                cips[f"{p.id}"] = {
                    "allowed_ips": parsed,
                    "endpoint": endpoint
                }
        ips[c.Name] = cips
    return ResponseObject(data=ips)

import requests

@app.get(f'{APP_PREFIX}/api/ping/execute')
def API_ping_execute():
    if "ipAddress" in request.args.keys() and "count" in request.args.keys():
        ip = request.args['ipAddress']
        count = request.args['count']
        try:
            if ip is not None and len(ip) > 0 and count is not None and count.isnumeric():
                result = ping(ip, count=int(count), source=None)
                data = {
                    "address": result.address,
                    "is_alive": result.is_alive,
                    "min_rtt": result.min_rtt,
                    "avg_rtt": result.avg_rtt,
                    "max_rtt": result.max_rtt,
                    "package_sent": result.packets_sent,
                    "package_received": result.packets_received,
                    "package_loss": result.packet_loss,
                    "geo": None
                }
                try:
                    r = requests.get(f"http://ip-api.com/json/{result.address}?field=city")
                    data['geo'] = r.json()
                except Exception as e:
                    pass
                return ResponseObject(data=data)
            return ResponseObject(False, "Please specify an IP Address (v4/v6)")
        except Exception as exp:
            return ResponseObject(False, exp)
    return ResponseObject(False, "Please provide ipAddress and count")


@app.get(f'{APP_PREFIX}/api/traceroute/execute')
def API_traceroute_execute():
    if "ipAddress" in request.args.keys() and len(request.args.get("ipAddress")) > 0:
        ipAddress = request.args.get('ipAddress')
        try:
            tracerouteResult = traceroute(ipAddress, timeout=1, max_hops=64)
            result = []
            for hop in tracerouteResult:
                if len(result) > 1:
                    skipped = False
                    for i in range(result[-1]["hop"] + 1, hop.distance):
                        result.append(
                            {
                                "hop": i,
                                "ip": "*",
                                "avg_rtt": "*",
                                "min_rtt": "*",
                                "max_rtt": "*"
                            }
                        )
                        skip = True
                    if skipped: continue
                result.append(
                    {
                        "hop": hop.distance,
                        "ip": hop.address,
                        "avg_rtt": hop.avg_rtt,
                        "min_rtt": hop.min_rtt,
                        "max_rtt": hop.max_rtt
                    })
            try:
                r = requests.post(f"http://ip-api.com/batch?fields=city,country,lat,lon,query",
                                  data=json.dumps([x['ip'] for x in result]))
                d = r.json()
                for i in range(len(result)):
                    result[i]['geo'] = d[i]  
            except Exception as e:
                return ResponseObject(data=result, message="Failed to request IP address geolocation")
            return ResponseObject(data=result)
        except Exception as exp:
            return ResponseObject(False, exp)
    else:
        return ResponseObject(False, "Please provide ipAddress")

@app.get(f'{APP_PREFIX}/api/getDashboardUpdate')
def API_getDashboardUpdate():
    import urllib.request as req
    try:
        r = req.urlopen("https://api.github.com/repos/donaldzou/WGDashboard/releases/latest", timeout=5).read()
        data = dict(json.loads(r))
        tagName = data.get('tag_name')
        htmlUrl = data.get('html_url')
        if tagName is not None and htmlUrl is not None:
            if version.parse(tagName) > version.parse(DASHBOARD_VERSION):
                return ResponseObject(message=f"{tagName} is now available for update!", data=htmlUrl)
            else:
                return ResponseObject(message="You're on the latest version")
        return ResponseObject(False)
    except Exception as e:
        return ResponseObject(False, f"Request to GitHub API failed.")

'''
Sign Up
'''

@app.get(f'{APP_PREFIX}/api/isTotpEnabled')
def API_isTotpEnabled():
    return (
        ResponseObject(data=DashboardConfig.GetConfig("Account", "enable_totp")[1] and DashboardConfig.GetConfig("Account", "totp_verified")[1]))


@app.get(f'{APP_PREFIX}/api/Welcome_GetTotpLink')
def API_Welcome_GetTotpLink():
    if not DashboardConfig.GetConfig("Account", "totp_verified")[1]:
        DashboardConfig.SetConfig("Account", "totp_key", pyotp.random_base32(), True)
        return ResponseObject(
            data=pyotp.totp.TOTP(DashboardConfig.GetConfig("Account", "totp_key")[1]).provisioning_uri(
                issuer_name="WGDashboard"))
    return ResponseObject(False)


@app.post(f'{APP_PREFIX}/api/Welcome_VerifyTotpLink')
def API_Welcome_VerifyTotpLink():
    data = request.get_json()
    totp = pyotp.TOTP(DashboardConfig.GetConfig("Account", "totp_key")[1]).now()
    if totp == data['totp']:
        DashboardConfig.SetConfig("Account", "totp_verified", "true")
        DashboardConfig.SetConfig("Account", "enable_totp", "true")
    return ResponseObject(totp == data['totp'])

@app.post(f'{APP_PREFIX}/api/Welcome_Finish')
def API_Welcome_Finish():
    data = request.get_json()
    if DashboardConfig.GetConfig("Other", "welcome_session")[1]:
        if data["username"] == "":
            return ResponseObject(False, "Username cannot be blank.")

        if data["newPassword"] == "" or len(data["newPassword"]) < 8:
            return ResponseObject(False, "Password must be at least 8 characters")

        updateUsername, updateUsernameErr = DashboardConfig.SetConfig("Account", "username", data["username"])
        updatePassword, updatePasswordErr = DashboardConfig.SetConfig("Account", "password",
                                                                      {
                                                                          "newPassword": data["newPassword"],
                                                                          "repeatNewPassword": data["repeatNewPassword"],
                                                                          "currentPassword": "admin"
                                                                      })
        if not updateUsername or not updatePassword:
            return ResponseObject(False, f"{updateUsernameErr},{updatePasswordErr}".strip(","))

        DashboardConfig.SetConfig("Other", "welcome_session", False)
    return ResponseObject()

class Locale:
    def __init__(self):
        self.localePath = './static/locale/'
        self.activeLanguages = {}
        with open(os.path.join(f"{self.localePath}active_languages.json"), "r") as f:
            self.activeLanguages = sorted(json.loads(''.join(f.readlines())), key=lambda x : x['lang_name'])
        
    def getLanguage(self) -> dict | None:
        currentLanguage = DashboardConfig.GetConfig("Server", "dashboard_language")[1]
        if currentLanguage == "en":
            return None
        if os.path.exists(os.path.join(f"{self.localePath}{currentLanguage}.json")):
            with open(os.path.join(f"{self.localePath}{currentLanguage}.json"), "r") as f:
                return dict(json.loads(''.join(f.readlines())))
        else:
            return None
    
    def updateLanguage(self, lang_id):
        if not os.path.exists(os.path.join(f"{self.localePath}{lang_id}.json")):
            DashboardConfig.SetConfig("Server", "dashboard_language", "en")
        else:
            DashboardConfig.SetConfig("Server", "dashboard_language", lang_id)
        
Locale = Locale()

@app.get(f'{APP_PREFIX}/api/locale')
def API_Locale_CurrentLang():    
    return ResponseObject(data=Locale.getLanguage())

@app.get(f'{APP_PREFIX}/api/locale/available')
def API_Locale_Available():
    return ResponseObject(data=Locale.activeLanguages)
        
@app.post(f'{APP_PREFIX}/api/locale/update')
def API_Locale_Update():
    data = request.get_json()
    if 'lang_id' not in data.keys():
        return ResponseObject(False, "Please specify a lang_id")
    Locale.updateLanguage(data['lang_id'])
    return ResponseObject(data=Locale.getLanguage())

@app.get(f'{APP_PREFIX}/api/email/ready')
def API_Email_Ready():
    return ResponseObject(EmailSender.ready())

@app.post(f'{APP_PREFIX}/api/email/send')
def API_Email_Send():
    data = request.get_json()
    if "Receiver" not in data.keys():
        return ResponseObject(False, "Please at least specify receiver")
    body = data.get('Body', '')
    download = None
    if ("ConfigurationName" in data.keys() 
            and "Peer" in data.keys()):
        if data.get('ConfigurationName') in WireguardConfigurations.keys():
            configuration = WireguardConfigurations.get(data.get('ConfigurationName'))
            attachmentName = ""
            if configuration is not None:
                fp, p = configuration.searchPeer(data.get('Peer'))
                if fp:
                    template = Template(body)
                    download = p.downloadPeer()
                    body = template.render(peer=p.toJson(), configurationFile=download)
                    if data.get('IncludeAttachment', False):
                        u = str(uuid4())
                        attachmentName = f'{u}.conf'
                        with open(os.path.join('./attachments', attachmentName,), 'w+') as f:
                            f.write(download['file'])   
                        
    
    s, m = EmailSender.send(data.get('Receiver'), data.get('Subject', ''), body,  
                            data.get('IncludeAttachment', False), (attachmentName if download else ''))
    return ResponseObject(s, m)

@app.post(f'{APP_PREFIX}/api/email/previewBody')
def API_Email_PreviewBody():
    data = request.get_json()
    body = data.get('Body', '')
    if len(body) == 0:
        return ResponseObject(False, "Nothing to preview") 
    if ("ConfigurationName" not in data.keys() 
            or "Peer" not in data.keys() or data.get('ConfigurationName') not in WireguardConfigurations.keys()):
        return ResponseObject(False, "Please specify configuration and peer")
    
    configuration = WireguardConfigurations.get(data.get('ConfigurationName'))
    fp, p = configuration.searchPeer(data.get('Peer'))
    if not fp:
        return ResponseObject(False, "Peer does not exist")

    try:
        template = Template(body)
        download = p.downloadPeer()
        body = template.render(peer=p.toJson(), configurationFile=download)
        return ResponseObject(data=body)
    except Exception as e:
        return ResponseObject(False, message=str(e))

@app.get(f'{APP_PREFIX}/api/systemStatus')
def API_SystemStatus():
    return ResponseObject(data=SystemStatus)

@app.get(f'{APP_PREFIX}/api/protocolsEnabled')
def API_ProtocolsEnabled():
    return ResponseObject(data=ProtocolsEnabled())

@app.get(f'{APP_PREFIX}/')
def index():
    return render_template('index.html')

def peerInformationBackgroundThread():
    global WireguardConfigurations
    print(f"[WGDashboard] Background Thread #1 Started", flush=True)
    time.sleep(10)
    while True:
        with app.app_context():
            try:
                curKeys = list(WireguardConfigurations.keys())
                for name in curKeys:
                    if name in WireguardConfigurations.keys() and WireguardConfigurations.get(name) is not None:
                        c = WireguardConfigurations.get(name)
                        if c.getStatus():
                            c.getPeersTransfer()
                            c.getPeersLatestHandshake()
                            c.getPeersEndpoint()
                            c.getPeersList()
                            c.getRestrictedPeersList()
            except Exception as e:
                print(f"[WGDashboard] Background Thread #1 Error: {str(e)}", flush=True)
        time.sleep(10)

def peerJobScheduleBackgroundThread():
    with app.app_context():
        print(f"[WGDashboard] Background Thread #2 Started", flush=True)
        time.sleep(10)
        while True:
            AllPeerJobs.runJob()
            time.sleep(180)

def gunicornConfig():
    _, app_ip = DashboardConfig.GetConfig("Server", "app_ip")
    _, app_port = DashboardConfig.GetConfig("Server", "app_port")
    return app_ip, app_port

def ProtocolsEnabled() -> list[str]:
    from shutil import which
    protocols = []
    if which('awg') is not None and which('awg-quick') is not None:
        protocols.append("awg")
    if which('wg') is not None and which('wg-quick') is not None:
        protocols.append("wg")
    return protocols
    
def InitWireguardConfigurationsList(startup: bool = False):
    if os.path.exists(DashboardConfig.GetConfig("Server", "wg_conf_path")[1]):
        confs = os.listdir(DashboardConfig.GetConfig("Server", "wg_conf_path")[1])
        confs.sort()
        for i in confs:
            if RegexMatch("^(.{1,}).(conf)$", i):
                i = i.replace('.conf', '')
                try:
                    if i in WireguardConfigurations.keys():
                        if WireguardConfigurations[i].configurationFileChanged():
                            WireguardConfigurations[i] = WireguardConfiguration(i)
                    else:
                        WireguardConfigurations[i] = WireguardConfiguration(i, startup=startup)
                except WireguardConfiguration.InvalidConfigurationFileException as e:
                    print(f"{i} have an invalid configuration file.")

    if "awg" in ProtocolsEnabled():
        confs = os.listdir(DashboardConfig.GetConfig("Server", "awg_conf_path")[1])
        confs.sort()
        for i in confs:
            if RegexMatch("^(.{1,}).(conf)$", i):
                i = i.replace('.conf', '')
                try:
                    if i in WireguardConfigurations.keys():
                        if WireguardConfigurations[i].configurationFileChanged():
                            WireguardConfigurations[i] = AmneziaWireguardConfiguration(i)
                    else:
                        WireguardConfigurations[i] = AmneziaWireguardConfiguration(i, startup=startup)
                except WireguardConfigurations.InvalidConfigurationFileException as e:
                    print(f"{i} have an invalid configuration file.")

AllPeerShareLinks: PeerShareLinks = PeerShareLinks()
AllPeerJobs: PeerJobs = PeerJobs()
JobLogger: PeerJobLogger = PeerJobLogger(CONFIGURATION_PATH, AllPeerJobs)
DashboardLogger: DashboardLogger = DashboardLogger(CONFIGURATION_PATH)
_, app_ip = DashboardConfig.GetConfig("Server", "app_ip")
_, app_port = DashboardConfig.GetConfig("Server", "app_port")
_, WG_CONF_PATH = DashboardConfig.GetConfig("Server", "wg_conf_path")

WireguardConfigurations: dict[str, WireguardConfiguration] = {}
AmneziaWireguardConfigurations: dict[str, AmneziaWireguardConfiguration] = {}
InitWireguardConfigurationsList(startup=True)

# =============================================================================
# FIREWALL MANAGEMENT API ENDPOINTS
# =============================================================================

@app.route(f'{APP_PREFIX}/api/firewall/rules', methods=["GET"])
def API_getFirewallRules():
    """Get current firewall rules"""
    try:
        rules = FirewallManager.get_firewall_rules()
        return ResponseObject(True, "Firewall rules retrieved successfully", rules)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving firewall rules: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/firewall/rules', methods=["POST"])
def API_addFirewallRule():
    """Add a new firewall rule"""
    try:
        data = request.get_json()
        if not data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        result = FirewallManager.add_firewall_rule(data)
        if result['status']:
            # Log the activity
            LoggingManager.log_activity(
                level='info',
                category='firewall',
                message=f'Firewall rule added: {data.get("chain", "unknown")} -> {data.get("target", "unknown")}',
                user=request.remote_addr,
                ip_address=request.remote_addr,
                details=json.dumps(data)
            )
            return ResponseObject(True, result['message'], result)
        else:
            return ResponseObject(False, result['message'], status_code=400)
    except Exception as e:
        return ResponseObject(False, f"Error adding firewall rule: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/firewall/rules/<int:rule_id>', methods=["DELETE"])
def API_deleteFirewallRule(rule_id):
    """Delete a firewall rule by ID"""
    try:
        result = FirewallManager.delete_firewall_rule(rule_id)
        if result['status']:
            # Log the activity
            LoggingManager.log_activity(
                level='info',
                category='firewall',
                message=f'Firewall rule deleted: ID {rule_id}',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, result['message'])
        else:
            return ResponseObject(False, result['message'], status_code=400)
    except Exception as e:
        return ResponseObject(False, f"Error deleting firewall rule: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/firewall/reorder', methods=["PUT"])
def API_reorderFirewallRules():
    """Reorder firewall rules"""
    try:
        data = request.get_json()
        if not data or 'rules' not in data:
            return ResponseObject(False, "No rules data provided", status_code=400)
        
        result = FirewallManager.reorder_firewall_rules(data['rules'])
        if result['status']:
            # Log the activity
            LoggingManager.log_activity(
                level='info',
                category='firewall',
                message=f'Firewall rules reordered: {len(data["rules"])} rules updated',
                user=request.remote_addr,
                ip_address=request.remote_addr,
                details=json.dumps(data)
            )
            return ResponseObject(True, result['message'], result)
        else:
            return ResponseObject(False, result['message'], status_code=400)
    except Exception as e:
        return ResponseObject(False, f"Error reordering firewall rules: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/firewall/reload', methods=["POST"])
def API_reloadFirewallRules():
    """Reload firewall rules from file"""
    try:
        result = FirewallManager.reload_firewall_rules()
        if result['status']:
            # Log the activity
            LoggingManager.log_activity(
                level='info',
                category='firewall',
                message='Firewall rules reloaded from file',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, result['message'])
        else:
            return ResponseObject(False, result['message'], status_code=400)
    except Exception as e:
        return ResponseObject(False, f"Error reloading firewall rules: {str(e)}", status_code=500)

# =============================================================================
# NAT MANAGEMENT API ENDPOINTS
# =============================================================================

@app.route(f'{APP_PREFIX}/api/firewall/nat', methods=["GET"])
def API_getNatRules():
    """Get current NAT rules"""
    try:
        rules = FirewallManager.get_nat_rules()
        return ResponseObject(True, "NAT rules retrieved successfully", rules)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving NAT rules: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/firewall/nat', methods=["POST"])
def API_addNatRule():
    """Add a new NAT rule"""
    try:
        data = request.get_json()
        if not data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        result = FirewallManager.add_nat_rule(data)
        if result['status']:
            # Log the activity
            LoggingManager.log_activity(
                level='info',
                category='firewall',
                message=f'NAT rule added: {data.get("chain", "unknown")} {data.get("target", "unknown")}',
                user=request.remote_addr,
                ip_address=request.remote_addr,
                details=json.dumps(data)
            )
            return ResponseObject(True, result['message'], result)
        else:
            return ResponseObject(False, result['message'], status_code=400)
    except Exception as e:
        return ResponseObject(False, f"Error adding NAT rule: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/firewall/nat/<int:rule_id>', methods=["DELETE"])
def API_deleteNatRule(rule_id):
    """Delete a NAT rule by ID"""
    try:
        result = FirewallManager.delete_nat_rule(rule_id)
        if result['status']:
            # Log the activity
            LoggingManager.log_activity(
                level='info',
                category='firewall',
                message=f'NAT rule deleted: ID {rule_id}',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, result['message'])
        else:
            return ResponseObject(False, result['message'], status_code=400)
    except Exception as e:
        return ResponseObject(False, f"Error deleting NAT rule: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/firewall/nat/reorder', methods=["PUT"])
def API_reorderNatRules():
    """Reorder NAT rules"""
    try:
        data = request.get_json()
        if not data or 'rules' not in data:
            return ResponseObject(False, "No rules data provided", status_code=400)
        
        result = FirewallManager.reorder_nat_rules(data['rules'])
        if result['status']:
            LoggingManager.log_activity(
                level='info',
                category='firewall',
                message=f'NAT rules reordered: {len(data["rules"])} rules updated',
                user=request.remote_addr,
                ip_address=request.remote_addr,
                details=json.dumps(data)
            )
            return ResponseObject(True, result['message'], result)
        else:
            return ResponseObject(False, result['message'], status_code=400)
    except Exception as e:
        return ResponseObject(False, f"Error reordering NAT rules: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/firewall/nat/reload', methods=["POST"])
def API_reloadNatRules():
    """Reload NAT rules from file"""
    try:
        result = FirewallManager.reload_nat_rules()
        if result['status']:
            # Log the activity
            LoggingManager.log_activity(
                level='info',
                category='firewall',
                message='NAT rules reloaded from file',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, result['message'])
        else:
            return ResponseObject(False, result['message'], status_code=400)
    except Exception as e:
        return ResponseObject(False, f"Error reloading NAT rules: {str(e)}", status_code=500)

# =============================================================================
# ROUTING MANAGEMENT API ENDPOINTS
# =============================================================================

@app.route(f'{APP_PREFIX}/api/routes', methods=["GET"])
def API_getRoutes():
    """Get current routing table"""
    try:
        routes = RouteManager.get_routes()
        return ResponseObject(True, "Routes retrieved successfully", routes)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving routes: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/routes', methods=["POST"])
def API_addRoute():
    """Add a new route"""
    try:
        data = request.get_json()
        if not data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        result = RouteManager.add_route(data)
        if result['status']:
            # Log the activity
            LoggingManager.log_activity(
                level='info',
                category='routing',
                message=f'Route added: {data.get("destination", "unknown")} via {data.get("gateway", "unknown")}',
                user=request.remote_addr,
                ip_address=request.remote_addr,
                details=json.dumps(data)
            )
            return ResponseObject(True, result['message'], result)
        else:
            return ResponseObject(False, result['message'], status_code=400)
    except Exception as e:
        return ResponseObject(False, f"Error adding route: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/routes/<int:route_id>', methods=["DELETE"])
def API_deleteRoute(route_id):
    """Delete a route by ID"""
    try:
        result = RouteManager.delete_route(route_id)
        if result['status']:
            # Log the activity
            LoggingManager.log_activity(
                level='info',
                category='routing',
                message=f'Route deleted: ID {route_id}',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, result['message'])
        else:
            return ResponseObject(False, result['message'], status_code=400)
    except Exception as e:
        return ResponseObject(False, f"Error deleting route: {str(e)}", status_code=500)

# Logging Management API Endpoints
@app.route(f'{APP_PREFIX}/api/logs', methods=["GET"])
def API_getLogs():
    """Get logs with filtering options"""
    try:
        # Get query parameters
        limit = request.args.get('limit', 100, type=int)
        offset = request.args.get('offset', 0, type=int)
        category = request.args.get('category')
        level = request.args.get('level')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        logs = LoggingManager.get_logs(
            limit=limit,
            offset=offset,
            category=category,
            level=level,
            start_date=start_date,
            end_date=end_date
        )
        
        return ResponseObject(True, "Logs retrieved successfully", logs)
        
    except Exception as e:
        return ResponseObject(False, f"Error getting logs: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/logs/statistics', methods=["GET"])
def API_getLogStatistics():
    """Get logging statistics"""
    try:
        stats = LoggingManager.get_log_statistics()
        return ResponseObject(True, "Log statistics retrieved successfully", stats)
        
    except Exception as e:
        return ResponseObject(False, f"Error getting log statistics: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/logs/system/<log_type>', methods=["GET"])
def API_getSystemLogs(log_type):
    """Get system log files"""
    try:
        lines = request.args.get('lines', 100, type=int)
        logs = LoggingManager.get_system_logs(log_type=log_type, lines=lines)
        return ResponseObject(True, f"System {log_type} logs retrieved successfully", logs)
        
    except Exception as e:
        return ResponseObject(False, f"Error getting system logs: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/logs/clear', methods=["POST"])
def API_clearLogs():
    """Clear logs from database"""
    try:
        data = request.get_json() or {}
        category = data.get('category')
        days = data.get('days', type=int)
        
        result = LoggingManager.clear_logs(category=category, days=days)
        
        if result['status']:
            # Log the activity
            LoggingManager.log_activity(
                level='info',
                category='system',
                message=f'Logs cleared: category={category}, days={days}',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, result['message'], result)
        else:
            return ResponseObject(False, result['message'], status_code=400)
            
    except Exception as e:
        return ResponseObject(False, f"Error clearing logs: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/logs/export', methods=["GET"])
def API_exportLogs():
    """Export logs in specified format"""
    try:
        format_type = request.args.get('format', 'json')
        category = request.args.get('category')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        result = LoggingManager.export_logs(
            format=format_type,
            category=category,
            start_date=start_date,
            end_date=end_date
        )
        
        if result['status']:
            # Log the activity
            LoggingManager.log_activity(
                level='info',
                category='system',
                message=f'Logs exported: format={format_type}, category={category}',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, "Logs exported successfully", result)
        else:
            return ResponseObject(False, result['message'], status_code=400)
            
    except Exception as e:
        return ResponseObject(False, f"Error exporting logs: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/system/info', methods=["GET"])
def API_getSystemInfo():
    """Get system information"""
    try:
        info = RouteManager.get_system_info()
        return ResponseObject(True, "System info retrieved successfully", info)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving system info: {str(e)}", status_code=500)

# ============================================================================
# USER MANAGEMENT API ENDPOINTS
# ============================================================================

@app.route(f'{APP_PREFIX}/api/users', methods=["GET"])
def API_getUsers():
    """Get all users"""
    try:
        users = UserManager.get_users()
        return ResponseObject(True, "Users retrieved successfully", users)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving users: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users', methods=["POST"])
def API_createUser():
    """Create new user"""
    try:
        data = request.get_json()
        if not data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        full_name = data.get('full_name')
        role = data.get('role', 'user')
        
        if not username or not password:
            return ResponseObject(False, "Username and password are required", status_code=400)
        
        result = UserManager.create_user(
            username=username,
            password=password,
            email=email,
            full_name=full_name,
            role=role
        )
        
        if result['success']:
            # Auto-assign user to default group based on role
            user_id = result.get('user_id')
            if user_id:
                try:
                    # Get default group for user role
                    default_group_result = enhanced_rbac_manager.get_default_group_for_role(role)
                    if default_group_result['status']:
                        default_group_id = default_group_result['data']['id']
                        
                        # Auto-assign user to group and generate VPN peer
                        assignment_result = enhanced_rbac_manager.assign_user_to_group(
                            user_id, default_group_id, data.get('manual_ip')
                        )
                        if assignment_result['status']:
                            result['vpn_assignment'] = assignment_result
                            result['auto_assigned_group'] = default_group_result['data']['name']
                        else:
                            result['vpn_assignment_error'] = assignment_result['message']
                    else:
                        result['vpn_assignment_error'] = default_group_result['message']
                except Exception as e:
                    result['vpn_assignment_error'] = f"Auto-assignment failed: {str(e)}"
            
            # Log user creation
            LoggingManager.log_activity(
                level='info',
                category='user_management',
                message=f'User created: {username} (role: {role})',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, result['message'], result)
        else:
            return ResponseObject(False, result['message'], status_code=400)
            
    except Exception as e:
        return ResponseObject(False, f"Error creating user: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users/<int:user_id>', methods=["PUT"])
def API_updateUser(user_id):
    """Update user"""
    try:
        data = request.get_json()
        if not data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        # Remove fields that shouldn't be updated directly
        update_data = {k: v for k, v in data.items() if k in ['email', 'full_name', 'role', 'is_active', 'password']}
        
        if not update_data:
            return ResponseObject(False, "No valid fields to update", status_code=400)
        
        result = UserManager.update_user(user_id, **update_data)
        
        if result['success']:
            # Log user update
            LoggingManager.log_activity(
                level='info',
                category='user_management',
                message=f'User updated: ID {user_id}',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, result['message'], result)
        else:
            return ResponseObject(False, result['message'], status_code=400)
            
    except Exception as e:
        return ResponseObject(False, f"Error updating user: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users/<int:user_id>', methods=["DELETE"])
def API_deleteUser(user_id):
    """Delete user and cleanup VPN peers"""
    try:
        # 1. Cleanup VPN peers before deleting user
        try:
            # Get user groups to cleanup VPN peers
            user_groups_result = enhanced_rbac_manager.get_user_groups(user_id)
            if user_groups_result['status'] and user_groups_result['data']:
                for group in user_groups_result['data']:
                    group_id = group['group_id']
                    # Remove user from group and cleanup VPN peer
                    cleanup_result = enhanced_rbac_manager.remove_user_from_group(user_id, group_id)
                    if cleanup_result['status']:
                        print(f"[API] Cleaned up VPN peer for user {user_id} from group {group_id}")
                    else:
                        print(f"[API] Warning: Failed to cleanup VPN peer for user {user_id} from group {group_id}: {cleanup_result['message']}")
        except Exception as cleanup_error:
            print(f"[API] Warning: VPN peer cleanup failed for user {user_id}: {str(cleanup_error)}")
        
        # 2. Delete user from database
        result = UserManager.delete_user(user_id)
        
        if result['success']:
            # Log user deletion
            LoggingManager.log_activity(
                level='warning',
                category='user_management',
                message=f'User deleted: ID {user_id}',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, result['message'], result)
        else:
            return ResponseObject(False, result['message'], status_code=400)
            
    except Exception as e:
        return ResponseObject(False, f"Error deleting user: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users/<int:user_id>/permissions', methods=["GET"])
def API_getUserPermissions(user_id):
    """Get user permissions"""
    try:
        permissions = UserManager.get_user_permissions(user_id)
        return ResponseObject(True, "User permissions retrieved successfully", permissions)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving user permissions: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users/<int:user_id>/permissions', methods=["POST"])
def API_grantPermission(user_id):
    """Grant permission to user"""
    try:
        data = request.get_json()
        if not data or 'permission' not in data:
            return ResponseObject(False, "Permission is required", status_code=400)
        
        permission = data['permission']
        success = UserManager.grant_permission(user_id, permission)
        
        if success:
            # Log permission grant
            LoggingManager.log_activity(
                level='info',
                category='user_management',
                message=f'Permission granted: {permission} to user ID {user_id}',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, "Permission granted successfully")
        else:
            return ResponseObject(False, "Failed to grant permission", status_code=400)
            
    except Exception as e:
        return ResponseObject(False, f"Error granting permission: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users/<int:user_id>/permissions/<permission>', methods=["DELETE"])
def API_revokePermission(user_id, permission):
    """Revoke permission from user"""
    try:
        success = UserManager.revoke_permission(user_id, permission)
        
        if success:
            # Log permission revocation
            LoggingManager.log_activity(
                level='info',
                category='user_management',
                message=f'Permission revoked: {permission} from user ID {user_id}',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, "Permission revoked successfully")
        else:
            return ResponseObject(False, "Failed to revoke permission", status_code=400)
            
    except Exception as e:
        return ResponseObject(False, f"Error revoking permission: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users/statistics', methods=["GET"])
def API_getUserStatistics():
    """Get user statistics"""
    try:
        stats = UserManager.get_user_statistics()
        return ResponseObject(True, "User statistics retrieved successfully", stats)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving user statistics: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users/authenticate', methods=["POST"])
def API_authenticateUser():
    """Authenticate user (for future OpenVPN integration)"""
    try:
        data = request.get_json()
        if not data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return ResponseObject(False, "Username and password are required", status_code=400)
        
        result = UserManager.authenticate_user(
            username=username,
            password=password,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
        
        if result['success']:
            # Log successful authentication
            LoggingManager.log_activity(
                level='info',
                category='authentication',
                message=f'User authenticated: {username}',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(True, "Authentication successful", result)
        else:
            # Log failed authentication
            LoggingManager.log_activity(
                level='warning',
                category='authentication',
                message=f'Authentication failed: {username} - {result["message"]}',
                user=request.remote_addr,
                ip_address=request.remote_addr
            )
            return ResponseObject(False, result['message'], status_code=401)
            
    except Exception as e:
        return ResponseObject(False, f"Error authenticating user: {str(e)}", status_code=500)

# ===== RBAC MANAGEMENT API ENDPOINTS =====

@app.route(f'{APP_PREFIX}/api/rbac/groups', methods=["GET"])
def API_getRBACGroups():
    """Get all RBAC groups"""
    try:
        groups = RBACManager.get_all_groups()
        return ResponseObject(True, "RBAC groups retrieved successfully", groups)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving RBAC groups: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/groups', methods=["POST"])
def API_createRBACGroup():
    """Create new RBAC group"""
    try:
        data = request.get_json()
        if not data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        name = data.get('name')
        description = data.get('description', '')
        color = data.get('color', '#007bff')
        
        if not name:
            return ResponseObject(False, "Group name is required", status_code=400)
        
        result = RBACManager.create_group(name, description, color)
        return ResponseObject(result['status'], result['message'], result)
        
    except Exception as e:
        return ResponseObject(False, f"Error creating RBAC group: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/groups/<int:group_id>', methods=["PUT"])
def API_updateRBACGroup(group_id):
    """Update RBAC group"""
    try:
        data = request.get_json()
        if not data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        name = data.get('name')
        description = data.get('description', '')
        color = data.get('color', '#007bff')
        
        if not name:
            return ResponseObject(False, "Group name is required", status_code=400)
        
        result = RBACManager.update_group(group_id, name, description, color)
        return ResponseObject(result['status'], result['message'], result)
        
    except Exception as e:
        return ResponseObject(False, f"Error updating RBAC group: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/groups/<int:group_id>', methods=["DELETE"])
def API_deleteRBACGroup(group_id):
    """Delete RBAC group"""
    try:
        result = enhanced_rbac_manager.delete_group(group_id)
        return ResponseObject(result['status'], result['message'], result)
    except Exception as e:
        return ResponseObject(False, f"Error deleting RBAC group: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/groups/<int:group_id>/peers', methods=["GET"])
def API_getGroupPeers(group_id):
    """Get peers assigned to a group"""
    try:
        peers = RBACManager.get_group_peers(group_id)
        return ResponseObject(True, "Group peers retrieved successfully", peers)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving group peers: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/groups/<int:group_id>/peers', methods=["POST"])
def API_assignPeerToGroup(group_id):
    """Assign peer to group"""
    try:
        data = request.get_json()
        if not data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        peer_name = data.get('peer_name')
        peer_ip = data.get('peer_ip', '')
        
        if not peer_name:
            return ResponseObject(False, "Peer name is required", status_code=400)
        
        result = RBACManager.assign_peer_to_group(group_id, peer_name, peer_ip)
        return ResponseObject(result['status'], result['message'], result)
        
    except Exception as e:
        return ResponseObject(False, f"Error assigning peer to group: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/groups/<int:group_id>/peers/<peer_name>', methods=["DELETE"])
def API_removePeerFromGroup(group_id, peer_name):
    """Remove peer from group"""
    try:
        result = RBACManager.remove_peer_from_group(group_id, peer_name)
        return ResponseObject(result['status'], result['message'], result)
    except Exception as e:
        return ResponseObject(False, f"Error removing peer from group: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/groups/<int:group_id>/policies/filter', methods=["GET"])
def API_getGroupFilterPolicies(group_id):
    """Get filter policies for a group"""
    try:
        policies = RBACManager.get_group_filter_policies(group_id)
        return ResponseObject(True, "Filter policies retrieved successfully", policies)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving filter policies: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/groups/<int:group_id>/policies/filter', methods=["POST"])
def API_addFilterPolicy(group_id):
    """Add filter policy to group"""
    try:
        data = request.get_json()
        if not data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        destination = data.get('destination')
        action = data.get('action')
        protocol = data.get('protocol', 'any')
        port = data.get('port', '')
        priority = data.get('priority', 100)
        
        if not destination or not action:
            return ResponseObject(False, "Destination and action are required", status_code=400)
        
        if action not in ['ACCEPT', 'DROP']:
            return ResponseObject(False, "Action must be ACCEPT or DROP", status_code=400)
        
        result = RBACManager.add_filter_policy(group_id, destination, action, protocol, port, priority)
        return ResponseObject(result['status'], result['message'], result)
        
    except Exception as e:
        return ResponseObject(False, f"Error adding filter policy: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/groups/<int:group_id>/policies/nat', methods=["GET"])
def API_getGroupNATPolicies(group_id):
    """Get NAT policies for a group"""
    try:
        policies = RBACManager.get_group_nat_policies(group_id)
        return ResponseObject(True, "NAT policies retrieved successfully", policies)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving NAT policies: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/groups/<int:group_id>/policies/nat', methods=["POST"])
def API_addNATPolicy(group_id):
    """Add NAT policy to group"""
    try:
        data = request.get_json()
        if not data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        destination = data.get('destination')
        action = data.get('action')
        translated_ip = data.get('translated_ip', '')
        translated_port = data.get('translated_port', '')
        priority = data.get('priority', 100)
        
        if not destination or not action:
            return ResponseObject(False, "Destination and action are required", status_code=400)
        
        if action not in ['MASQUERADE', 'SNAT', 'DNAT', 'REDIRECT']:
            return ResponseObject(False, "Action must be MASQUERADE, SNAT, DNAT, or REDIRECT", status_code=400)
        
        result = RBACManager.add_nat_policy(group_id, destination, action, translated_ip, translated_port, priority)
        return ResponseObject(result['status'], result['message'], result)
        
    except Exception as e:
        return ResponseObject(False, f"Error adding NAT policy: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/policies/filter/<int:policy_id>', methods=["DELETE"])
def API_deleteFilterPolicy(policy_id):
    """Delete filter policy"""
    try:
        result = RBACManager.delete_filter_policy(policy_id)
        return ResponseObject(result['status'], result['message'], result)
    except Exception as e:
        return ResponseObject(False, f"Error deleting filter policy: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/policies/nat/<int:policy_id>', methods=["DELETE"])
def API_deleteNATPolicy(policy_id):
    """Delete NAT policy"""
    try:
        result = RBACManager.delete_nat_policy(policy_id)
        return ResponseObject(result['status'], result['message'], result)
    except Exception as e:
        return ResponseObject(False, f"Error deleting NAT policy: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/peers/available', methods=["GET"])
def API_getAvailablePeers():
    """Get available WireGuard peers for assignment"""
    try:
        peers = RBACManager.get_available_peers()
        return ResponseObject(True, "Available peers retrieved successfully", peers)
    except Exception as e:
        return ResponseObject(False, f"Error retrieving available peers: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/rbac/rules/regenerate', methods=["POST"])
def API_regenerateRBACRules():
    """Regenerate all RBAC firewall rules"""
    try:
        RBACManager.regenerate_all_rules()
        return ResponseObject(True, "RBAC rules regenerated successfully", None)
    except Exception as e:
        return ResponseObject(False, f"Error regenerating RBAC rules: {str(e)}", status_code=500)

# Organization Management API Endpoints

@app.route(f'{APP_PREFIX}/api/organizations', methods=["GET"])
def API_getOrganizations():
    """Get all organizations"""
    try:
        result = OrganizationManager.get_all_organizations()
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching organizations: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/organizations', methods=["POST"])
def API_createOrganization():
    """Create a new organization"""
    try:
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        color = data.get('color', '#007bff')
        
        if not name:
            return ResponseObject(False, "Organization name is required", status_code=400)
        
        result = OrganizationManager.create_organization(name, description, color)
        return ResponseObject(result['status'], result['message'], result.get('id'))
    except Exception as e:
        return ResponseObject(False, f"Error creating organization: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/organizations/<int:org_id>', methods=["GET"])
def API_getOrganization(org_id):
    """Get organization details with subnets"""
    try:
        result = OrganizationManager.get_organization(org_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching organization: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/organizations/<int:org_id>', methods=["PUT"])
def API_updateOrganization(org_id):
    """Update organization details"""
    try:
        data = request.get_json()
        result = OrganizationManager.update_organization(
            org_id,
            name=data.get('name'),
            description=data.get('description'),
            color=data.get('color')
        )
        return ResponseObject(result['status'], result['message'])
    except Exception as e:
        return ResponseObject(False, f"Error updating organization: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/organizations/<int:org_id>', methods=["DELETE"])
def API_deleteOrganization(org_id):
    """Delete organization"""
    try:
        result = OrganizationManager.delete_organization(org_id)
        return ResponseObject(result['status'], result['message'])
    except Exception as e:
        return ResponseObject(False, f"Error deleting organization: {str(e)}", status_code=500)

# Organization Subnet Management

@app.route(f'{APP_PREFIX}/api/organizations/<int:org_id>/subnets', methods=["POST"])
def API_addSubnetToOrganization(org_id):
    """Add a subnet to an organization"""
    try:
        data = request.get_json()
        subnet_cidr = data.get('subnet_cidr')
        description = data.get('description')
        is_primary = data.get('is_primary', False)
        
        if not subnet_cidr:
            return ResponseObject(False, "Subnet CIDR is required", status_code=400)
        
        result = OrganizationManager.add_subnet_to_organization(org_id, subnet_cidr, description, is_primary)
        return ResponseObject(result['status'], result['message'])
    except Exception as e:
        return ResponseObject(False, f"Error adding subnet: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/organization/subnets/<int:subnet_id>', methods=["PUT"])
def API_updateSubnet(subnet_id):
    """Update subnet details"""
    try:
        data = request.get_json()
        result = OrganizationManager.update_subnet(
            subnet_id,
            subnet_cidr=data.get('subnet_cidr'),
            description=data.get('description'),
            is_primary=data.get('is_primary')
        )
        return ResponseObject(result['status'], result['message'])
    except Exception as e:
        return ResponseObject(False, f"Error updating subnet: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/organization/subnets/<int:subnet_id>', methods=["DELETE"])
def API_deleteSubnet(subnet_id):
    """Delete a subnet"""
    try:
        result = OrganizationManager.delete_subnet(subnet_id)
        return ResponseObject(result['status'], result['message'])
    except Exception as e:
        return ResponseObject(False, f"Error deleting subnet: {str(e)}", status_code=500)

# User-Organization Management

@app.route(f'{APP_PREFIX}/api/organizations/<int:org_id>/users', methods=["GET"])
def API_getOrganizationUsers(org_id):
    """Get all users in an organization"""
    try:
        result = OrganizationManager.get_organization_users(org_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching organization users: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/organization/users/<int:user_id>', methods=["GET"])
def API_getUserOrganizations(user_id):
    """Get all organizations for a user"""
    try:
        result = OrganizationManager.get_user_organizations(user_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching user organizations: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/organization/users/<int:user_id>/organizations', methods=["POST"])
def API_assignUserToOrganization():
    """Assign a user to an organization"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        org_id = data.get('organization_id')
        
        if not user_id or not org_id:
            return ResponseObject(False, "User ID and Organization ID are required", status_code=400)
        
        result = OrganizationManager.assign_user_to_organization(user_id, org_id)
        return ResponseObject(result['status'], result['message'])
    except Exception as e:
        return ResponseObject(False, f"Error assigning user to organization: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/organization/users/<int:user_id>/organizations/<int:org_id>', methods=["DELETE"])
def API_removeUserFromOrganization(user_id, org_id):
    """Remove a user from an organization"""
    try:
        result = OrganizationManager.remove_user_from_organization(user_id, org_id)
        return ResponseObject(result['status'], result['message'])
    except Exception as e:
        return ResponseObject(False, f"Error removing user from organization: {str(e)}", status_code=500)

# Routing Integration

@app.route(f'{APP_PREFIX}/api/organization/users/<int:user_id>/subnets', methods=["GET"])
def API_getUserSubnets(user_id):
    """Get all subnets for organizations that a user belongs to"""
    try:
        result = OrganizationManager.get_user_subnets(user_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching user subnets: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/organization/subnets/all', methods=["GET"])
def API_getAllOrganizationSubnets():
    """Get all subnets from all organizations for routing purposes"""
    try:
        result = OrganizationManager.get_all_organization_subnets()
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching all organization subnets: {str(e)}", status_code=500)

# ==================== ENHANCED RBAC API ENDPOINTS ====================

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups', methods=["GET"])
def API_getEnhancedGroups():
    """Get all groups with organization and peer counts"""
    try:
        result = enhanced_rbac_manager.get_all_groups()
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching enhanced groups: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups', methods=["POST"])
def API_createEnhancedGroup():
    """Create a new group"""
    try:
        data = request.get_json()
        result = enhanced_rbac_manager.create_group(
            name=data.get('name'),
            description=data.get('description', ''),
            color=data.get('color', '#007bff')
        )
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error creating enhanced group: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/organizations', methods=["GET"])
def API_getGroupOrganizations(group_id):
    """Get organizations attached to a group"""
    try:
        result = enhanced_rbac_manager.get_group_organizations(group_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching group organizations: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/organizations/<int:org_id>', methods=["POST"])
def API_attachGroupToOrganization(group_id, org_id):
    """Attach group to organization"""
    try:
        result = enhanced_rbac_manager.attach_group_to_organization(group_id, org_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error attaching group to organization: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/organizations/<int:org_id>', methods=["DELETE"])
def API_detachGroupFromOrganization(group_id, org_id):
    """Detach group from organization"""
    try:
        result = enhanced_rbac_manager.detach_group_from_organization(group_id, org_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error detaching group from organization: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/effective-policies', methods=["GET"])
def API_getGroupEffectivePolicies(group_id):
    """Get effective policies for a group (inherited + overridden)"""
    try:
        result = enhanced_rbac_manager.get_effective_policies_for_group(group_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching effective policies: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/filter-policies', methods=["POST"])
def API_addGroupFilterPolicy(group_id):
    """Add filter policy to group"""
    try:
        data = request.get_json()
        result = enhanced_rbac_manager.add_group_filter_policy(
            group_id=group_id,
            organization_id=data.get('organization_id'),
            destination=data.get('destination'),
            action=data.get('action'),
            protocol=data.get('protocol', 'any'),
            port=data.get('port'),
            priority=data.get('priority', 100),
            is_override=data.get('is_override', False)
        )
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error adding filter policy: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/nat-policies', methods=["POST"])
def API_addGroupNatPolicy(group_id):
    """Add NAT policy to group"""
    try:
        data = request.get_json()
        result = enhanced_rbac_manager.add_group_nat_policy(
            group_id=group_id,
            organization_id=data.get('organization_id'),
            destination=data.get('destination'),
            action=data.get('action'),
            translated_ip=data.get('translated_ip'),
            translated_port=data.get('translated_port'),
            priority=data.get('priority', 100),
            is_override=data.get('is_override', False)
        )
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error adding NAT policy: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/peers/<string:peer_name>/effective-access', methods=["GET"])
def API_getPeerEffectiveAccess(peer_name):
    """Get effective access for a peer"""
    try:
        result = enhanced_rbac_manager.calculate_effective_access(peer_name)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error calculating effective access: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/peers/<string:peer_name>/effective-access', methods=["POST"])
def API_savePeerEffectiveAccess(peer_name):
    """Save calculated effective access for a peer"""
    try:
        data = request.get_json()
        result = enhanced_rbac_manager.save_effective_access(peer_name, data)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error saving effective access: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/organizations/<int:org_id>/available-groups', methods=["GET"])
def API_getAvailableGroupsForOrganization(org_id):
    """Get groups not yet attached to an organization"""
    try:
        result = enhanced_rbac_manager.get_available_groups_for_organization(org_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching available groups: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/available-organizations', methods=["GET"])
def API_getAvailableOrganizationsForGroup(group_id):
    """Get organizations not yet attached to a group"""
    try:
        result = enhanced_rbac_manager.get_available_organizations_for_group(group_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching available organizations: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/vpn-assignment', methods=["GET"])
def API_getGroupVpnAssignment(group_id):
    """Get VPN assignment for a group"""
    try:
        result = enhanced_rbac_manager.get_group_vpn_assignment(group_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching group VPN assignment: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/vpn-assignment', methods=["PUT"])
def API_updateGroupVpnAssignment(group_id):
    """Update VPN assignment for a group"""
    try:
        vpn_data = request.get_json()
        if not vpn_data:
            return ResponseObject(False, "No data provided", status_code=400)
        
        result = enhanced_rbac_manager.update_group_vpn_assignment(group_id, vpn_data)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error updating group VPN assignment: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/vpn-subnets', methods=["GET"])
def API_getGroupVpnSubnets(group_id):
    """Get all subnets from attached organizations for VPN routing"""
    try:
        result = enhanced_rbac_manager.get_group_vpn_subnets(group_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching group VPN subnets: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/vpn-servers/<server_name>', methods=["GET"])
def API_getGroupsByVpnServer(server_name):
    """Get all groups assigned to a specific VPN server"""
    try:
        result = enhanced_rbac_manager.get_groups_by_vpn_server(server_name)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching groups by VPN server: {str(e)}", status_code=500)

# ==================== USER GROUP ASSIGNMENT API ENDPOINTS ====================

@app.route(f'{APP_PREFIX}/api/users/<int:user_id>/groups', methods=["POST"])
def API_assignUserToGroup(user_id):
    """Assign user to RBAC group and auto-generate VPN peer"""
    try:
        data = request.get_json()
        if not data or 'group_id' not in data:
            return ResponseObject(False, "Group ID is required", status_code=400)
        
        group_id = data['group_id']
        manual_ip = data.get('manual_ip')
        result = enhanced_rbac_manager.assign_user_to_group(user_id, group_id, manual_ip)
        return ResponseObject(result['status'], result['message'], result.get('peer'))
    except Exception as e:
        return ResponseObject(False, f"Error assigning user to group: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users/<int:user_id>/groups/<int:group_id>', methods=["DELETE"])
def API_removeUserFromGroup(user_id, group_id):
    """Remove user from group and cleanup VPN peer"""
    try:
        result = enhanced_rbac_manager.remove_user_from_group(user_id, group_id)
        return ResponseObject(result['status'], result['message'])
    except Exception as e:
        return ResponseObject(False, f"Error removing user from group: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users/<int:user_id>/groups', methods=["GET"])
def API_getUserGroups(user_id):
    """Get all groups user belongs to with VPN peer status"""
    try:
        result = enhanced_rbac_manager.get_user_groups(user_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching user groups: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/users', methods=["GET"])
def API_getGroupUsers(group_id):
    """Get all users in group with their VPN peer status"""
    try:
        result = enhanced_rbac_manager.get_group_users(group_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching group users: {str(e)}", status_code=500)

# ==================== VPN PEER MANAGEMENT API ENDPOINTS ====================

@app.route(f'{APP_PREFIX}/api/users/<int:user_id>/vpn-peer', methods=["POST"])
def API_generateVpnPeer(user_id):
    """Generate VPN peer configuration for user"""
    try:
        data = request.get_json()
        if not data or 'group_id' not in data:
            return ResponseObject(False, "Group ID is required", status_code=400)
        
        group_id = data['group_id']
        result = enhanced_rbac_manager.generate_vpn_peer_for_user(user_id, group_id)
        return ResponseObject(result['status'], result['message'], result)
    except Exception as e:
        return ResponseObject(False, f"Error generating VPN peer: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users/<int:user_id>/vpn-config', methods=["GET"])
def API_downloadVpnConfig(user_id):
    """Download VPN configuration file for user"""
    try:
        # Get user's VPN peers
        result = enhanced_rbac_manager.get_user_vpn_peers(user_id)
        if not result['status'] or not result['data']:
            return ResponseObject(False, "No VPN peers found for user", status_code=404)
        
        # For now, return peer info (in real implementation, generate actual config file)
        peers = result['data']
        config_data = {
            'user_id': user_id,
            'peers': peers,
            'config_generated': True
        }
        
        return ResponseObject(True, "VPN config retrieved successfully", config_data)
    except Exception as e:
        return ResponseObject(False, f"Error downloading VPN config: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/users/<int:user_id>/vpn-peers', methods=["GET"])
def API_getUserVpnPeers(user_id):
    """Get all VPN peers for a user"""
    try:
        result = enhanced_rbac_manager.get_user_vpn_peers(user_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching user VPN peers: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/enhanced-rbac/groups/<int:group_id>/peers-summary', methods=["GET"])
def API_getGroupPeersSummary(group_id):
    """Get VPN peers summary for a group"""
    try:
        result = enhanced_rbac_manager.get_group_peers_summary(group_id)
        return ResponseObject(result['status'], result['message'], result.get('data'))
    except Exception as e:
        return ResponseObject(False, f"Error fetching group peers summary: {str(e)}", status_code=500)

@app.route(f'{APP_PREFIX}/api/wireguard-configurations', methods=["GET"])
def API_getWireguardConfigurationsForVpn():
    """Get available WireGuard configurations for VPN assignment"""
    try:
        # Use existing WireGuard configurations data
        InitWireguardConfigurationsList()
        configurations = []
        for wc in WireguardConfigurations.values():
            configurations.append({
                'name': wc.Name,
                'display_name': f'WireGuard {wc.Name}',
                'type': 'wireguard',
                'status': 'Active' if wc.Status else 'Inactive',
                'peers_count': len(wc.Peers) if hasattr(wc, 'Peers') else 0
            })
        
        return ResponseObject(True, "WireGuard configurations retrieved successfully", configurations)
    except Exception as e:
        return ResponseObject(False, f"Error fetching WireGuard configurations: {str(e)}", status_code=500)

def startThreads():
    bgThread = threading.Thread(target=peerInformationBackgroundThread, daemon=True)
    bgThread.start()
    scheduleJobThread = threading.Thread(target=peerJobScheduleBackgroundThread, daemon=True)
    scheduleJobThread.start()

if __name__ == "__main__":
    startThreads()
    app.run(host=app_ip, debug=False, port=app_port)
