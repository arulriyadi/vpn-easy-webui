#!/usr/bin/env python3
"""
LoggingManager - Module for centralized logging management
Integrated with WGDashboard for comprehensive activity tracking
"""

import os
import json
import sqlite3
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import subprocess

class LoggingManager:
    def __init__(self):
        self.log_db_path = "db/wgdashboard_log.db"
        self.system_log_paths = {
            'system': '/var/log/syslog',
            'auth': '/var/log/auth.log',
            'kern': '/var/log/kern.log',
            'wireguard': '/var/log/wireguard.log',
            'firewall': '/var/log/wgdashboard-firewall.log',
            'routing': '/var/log/wgdashboard-routes.log'
        }
        self.init_database()
    
    def init_database(self):
        """Initialize logging database"""
        try:
            os.makedirs(os.path.dirname(self.log_db_path), exist_ok=True)
            conn = sqlite3.connect(self.log_db_path)
            cursor = conn.cursor()
            
            # Create logs table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    level TEXT NOT NULL,
                    category TEXT NOT NULL,
                    message TEXT NOT NULL,
                    user TEXT,
                    ip_address TEXT,
                    details TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create index for better performance
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp)
            ''')
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_logs_category ON logs(category)
            ''')
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level)
            ''')
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            print(f"Error initializing logging database: {e}")
    
    def log_activity(self, level: str, category: str, message: str, user: str = None, 
                    ip_address: str = None, details: str = None):
        """Log an activity to database"""
        try:
            conn = sqlite3.connect(self.log_db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO logs (level, category, message, user, ip_address, details)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (level, category, message, user, ip_address, details))
            
            conn.commit()
            conn.close()
            
            # Also write to system log file
            self._write_to_system_log(level, category, message, user, ip_address)
            
        except Exception as e:
            print(f"Error logging activity: {e}")
    
    def _write_to_system_log(self, level: str, category: str, message: str, 
                           user: str = None, ip_address: str = None):
        """Write to system log file"""
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            log_entry = f"{timestamp} [{level.upper()}] {category}: {message}"
            if user:
                log_entry += f" (User: {user})"
            if ip_address:
                log_entry += f" (IP: {ip_address})"
            log_entry += "\n"
            
            # Write to application log file
            with open(f"/var/log/wgdashboard-{category.lower()}.log", "a") as f:
                f.write(log_entry)
                
        except Exception as e:
            print(f"Error writing to system log: {e}")
    
    def get_logs(self, limit: int = 100, offset: int = 0, 
                category: str = None, level: str = None, 
                start_date: str = None, end_date: str = None) -> List[Dict[str, Any]]:
        """Get logs from database with filtering"""
        try:
            conn = sqlite3.connect(self.log_db_path)
            cursor = conn.cursor()
            
            # Build query
            query = "SELECT * FROM logs WHERE 1=1"
            params = []
            
            if category:
                query += " AND category = ?"
                params.append(category)
            
            if level:
                query += " AND level = ?"
                params.append(level)
            
            if start_date:
                query += " AND timestamp >= ?"
                params.append(start_date)
            
            if end_date:
                query += " AND timestamp <= ?"
                params.append(end_date)
            
            query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            # Convert to list of dictionaries
            columns = [description[0] for description in cursor.description]
            logs = []
            for row in rows:
                log_dict = dict(zip(columns, row))
                # Parse details JSON if exists
                if log_dict.get('details'):
                    try:
                        log_dict['details'] = json.loads(log_dict['details'])
                    except:
                        pass
                logs.append(log_dict)
            
            conn.close()
            return logs
            
        except Exception as e:
            print(f"Error getting logs: {e}")
            return []
    
    def get_log_statistics(self) -> Dict[str, Any]:
        """Get logging statistics"""
        try:
            conn = sqlite3.connect(self.log_db_path)
            cursor = conn.cursor()
            
            stats = {}
            
            # Total logs
            cursor.execute("SELECT COUNT(*) FROM logs")
            stats['total_logs'] = cursor.fetchone()[0]
            
            # Logs by level
            cursor.execute("SELECT level, COUNT(*) FROM logs GROUP BY level")
            stats['by_level'] = dict(cursor.fetchall())
            
            # Logs by category
            cursor.execute("SELECT category, COUNT(*) FROM logs GROUP BY category")
            stats['by_category'] = dict(cursor.fetchall())
            
            # Recent activity (last 24 hours)
            yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute("SELECT COUNT(*) FROM logs WHERE timestamp >= ?", (yesterday,))
            stats['recent_activity'] = cursor.fetchone()[0]
            
            # Most active users
            cursor.execute("SELECT user, COUNT(*) FROM logs WHERE user IS NOT NULL GROUP BY user ORDER BY COUNT(*) DESC LIMIT 5")
            stats['active_users'] = dict(cursor.fetchall())
            
            conn.close()
            return stats
            
        except Exception as e:
            print(f"Error getting log statistics: {e}")
            return {}
    
    def get_system_logs(self, log_type: str = 'system', lines: int = 100) -> List[str]:
        """Get system log files"""
        try:
            log_path = self.system_log_paths.get(log_type)
            if not log_path or not os.path.exists(log_path):
                return []
            
            # Use tail command to get last N lines
            result = subprocess.run(['tail', '-n', str(lines), log_path], 
                                  capture_output=True, text=True, check=True)
            return result.stdout.strip().split('\n')
            
        except Exception as e:
            print(f"Error getting system logs: {e}")
            return []
    
    def clear_logs(self, category: str = None, days: int = None) -> Dict[str, Any]:
        """Clear logs from database"""
        try:
            conn = sqlite3.connect(self.log_db_path)
            cursor = conn.cursor()
            
            if days:
                # Clear logs older than specified days
                cutoff_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d %H:%M:%S")
                if category:
                    cursor.execute("DELETE FROM logs WHERE category = ? AND timestamp < ?", 
                                 (category, cutoff_date))
                else:
                    cursor.execute("DELETE FROM logs WHERE timestamp < ?", (cutoff_date,))
            else:
                # Clear all logs or by category
                if category:
                    cursor.execute("DELETE FROM logs WHERE category = ?", (category,))
                else:
                    cursor.execute("DELETE FROM logs")
            
            deleted_count = cursor.rowcount
            conn.commit()
            conn.close()
            
            return {
                'status': True,
                'message': f'Cleared {deleted_count} log entries',
                'deleted_count': deleted_count
            }
            
        except Exception as e:
            return {
                'status': False,
                'message': f'Error clearing logs: {e}',
                'deleted_count': 0
            }
    
    def export_logs(self, format: str = 'json', category: str = None, 
                   start_date: str = None, end_date: str = None) -> Dict[str, Any]:
        """Export logs in specified format"""
        try:
            logs = self.get_logs(limit=10000, category=category, 
                               start_date=start_date, end_date=end_date)
            
            if format == 'json':
                return {
                    'status': True,
                    'data': logs,
                    'format': 'json'
                }
            elif format == 'csv':
                # Convert to CSV format
                if not logs:
                    return {'status': True, 'data': '', 'format': 'csv'}
                
                csv_data = "timestamp,level,category,message,user,ip_address,details\n"
                for log in logs:
                    details = log.get('details', '')
                    if isinstance(details, dict):
                        details = json.dumps(details)
                    csv_data += f"{log['timestamp']},{log['level']},{log['category']},{log['message']},{log.get('user', '')},{log.get('ip_address', '')},{details}\n"
                
                return {
                    'status': True,
                    'data': csv_data,
                    'format': 'csv'
                }
            else:
                return {
                    'status': False,
                    'message': 'Unsupported export format'
                }
                
        except Exception as e:
            return {
                'status': False,
                'message': f'Error exporting logs: {e}'
            }

