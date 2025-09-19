#!/usr/bin/env python3
"""
RouteManager - Module for managing IP routing table
Integrated with WGDashboard for comprehensive network management
"""

import subprocess
import json
import os
import re
from typing import List, Dict, Any, Optional
from datetime import datetime

class RouteManager:
    def __init__(self):
        self.routes_file_ubuntu = "/etc/network/routes"
        self.routes_file_centos = "/etc/sysconfig/static-routes"
        self.log_file = "/var/log/wgdashboard-routes.log"
        
    def log_message(self, message: str):
        """Log routing operations"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"{timestamp} - {message}\n"
        try:
            with open(self.log_file, "a") as f:
                f.write(log_entry)
        except:
            pass  # Ignore logging errors
    
    def get_routes(self) -> List[Dict[str, Any]]:
        """Get current routing table"""
        try:
            # Get routing table
            result = subprocess.run(['ip', 'route', 'show'], capture_output=True, text=True, check=True)
            routes = []
            
            for line_num, line in enumerate(result.stdout.strip().split('\n'), 1):
                if line.strip():
                    route_data = {
                        'id': line_num,
                        'raw': line.strip(),
                        'route': line.strip()
                    }
                    
                    # Parse route components
                    parts = line.strip().split()
                    
                    # Parse destination
                    if parts:
                        route_data['destination'] = parts[0]
                    
                    # Parse gateway
                    if 'via' in parts:
                        via_index = parts.index('via')
                        if via_index + 1 < len(parts):
                            route_data['gateway'] = parts[via_index + 1]
                    
                    # Parse interface
                    if 'dev' in parts:
                        dev_index = parts.index('dev')
                        if dev_index + 1 < len(parts):
                            route_data['interface'] = parts[dev_index + 1]
                    
                    # Parse metric
                    if 'metric' in parts:
                        metric_index = parts.index('metric')
                        if metric_index + 1 < len(parts):
                            route_data['metric'] = parts[metric_index + 1]
                    
                    # Parse source
                    if 'src' in parts:
                        src_index = parts.index('src')
                        if src_index + 1 < len(parts):
                            route_data['source'] = parts[src_index + 1]
                    
                    routes.append(route_data)
            
            self.log_message(f"Retrieved {len(routes)} routes")
            return routes
            
        except subprocess.CalledProcessError as e:
            self.log_message(f"Error getting routes: {e}")
            return []
        except Exception as e:
            self.log_message(f"Unexpected error getting routes: {e}")
            return []
    
    def add_route(self, route_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a new route"""
        try:
            # Build ip route command
            cmd = ['ip', 'route', 'add']
            
            # Add destination
            if 'destination' in route_data and route_data['destination']:
                cmd.append(route_data['destination'])
            
            # Add gateway
            if 'gateway' in route_data and route_data['gateway']:
                cmd.extend(['via', route_data['gateway']])
            
            # Add interface
            if 'interface' in route_data and route_data['interface']:
                cmd.extend(['dev', route_data['interface']])
            
            # Add metric
            if 'metric' in route_data and route_data['metric']:
                cmd.extend(['metric', route_data['metric']])
            
            # Add source
            if 'source' in route_data and route_data['source']:
                cmd.extend(['src', route_data['source']])
            
            # Execute command
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # Save routes
            self.save_routes()
            
            self.log_message(f"Added route: {' '.join(cmd)}")
            return {
                'status': True,
                'message': 'Route added successfully',
                'route': ' '.join(cmd)
            }
            
        except subprocess.CalledProcessError as e:
            error_msg = f"Error adding route: {e.stderr}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
        except Exception as e:
            error_msg = f"Unexpected error adding route: {e}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
    
    def delete_route(self, route_id: int) -> Dict[str, Any]:
        """Delete a route by ID"""
        try:
            routes = self.get_routes()
            if route_id < 1 or route_id > len(routes):
                return {
                    'status': False,
                    'message': 'Invalid route ID'
                }
            
            route = routes[route_id - 1]
            route_parts = route['raw'].split()
            
            # Build delete command
            delete_cmd = ['ip', 'route', 'del'] + route_parts
            
            # Execute delete command
            result = subprocess.run(delete_cmd, capture_output=True, text=True, check=True)
            
            # Save routes
            self.save_routes()
            
            self.log_message(f"Deleted route: {' '.join(delete_cmd)}")
            return {
                'status': True,
                'message': 'Route deleted successfully'
            }
            
        except subprocess.CalledProcessError as e:
            error_msg = f"Error deleting route: {e.stderr}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
        except Exception as e:
            error_msg = f"Unexpected error deleting route: {e}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
    
    def save_routes(self) -> bool:
        """Save current routes to file"""
        try:
            # Determine which file to use based on system
            if os.path.exists('/etc/debian_version'):
                routes_file = self.routes_file_ubuntu
            else:
                routes_file = self.routes_file_centos
            
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(routes_file), exist_ok=True)
            
            # Get current routes
            result = subprocess.run(['ip', 'route', 'show'], capture_output=True, text=True, check=True)
            
            # Filter out default routes and system routes
            routes = []
            for line in result.stdout.strip().split('\n'):
                line = line.strip()
                if line and not line.startswith('default') and not line.startswith('link'):
                    routes.append(line)
            
            # Save routes
            with open(routes_file, 'w') as f:
                f.write("# Static routes managed by WGDashboard\n")
                f.write("# Generated on: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n\n")
                for route in routes:
                    f.write(route + "\n")
            
            self.log_message(f"Routes saved to {routes_file}")
            return True
            
        except Exception as e:
            self.log_message(f"Error saving routes: {e}")
            return False
    
    def get_system_info(self) -> Dict[str, Any]:
        """Get system information"""
        try:
            info = {}
            
            # Get network interfaces
            result = subprocess.run(['ip', 'link', 'show'], capture_output=True, text=True, check=True)
            interfaces = []
            for line in result.stdout.strip().split('\n'):
                if ': ' in line and not line.startswith(' '):
                    parts = line.split(': ')
                    if len(parts) >= 2:
                        interfaces.append({
                            'name': parts[1].strip(),
                            'index': parts[0].strip()
                        })
            info['interfaces'] = interfaces
            
            # Get system info
            info['hostname'] = os.uname().nodename
            info['uptime'] = self._get_uptime()
            info['memory'] = self._get_memory_info()
            info['cpu'] = self._get_cpu_info()
            
            return info
            
        except Exception as e:
            self.log_message(f"Error getting system info: {e}")
            return {}
    
    def _get_uptime(self) -> str:
        """Get system uptime"""
        try:
            with open('/proc/uptime', 'r') as f:
                uptime_seconds = float(f.read().split()[0])
                days = int(uptime_seconds // 86400)
                hours = int((uptime_seconds % 86400) // 3600)
                minutes = int((uptime_seconds % 3600) // 60)
                return f"{days}d {hours}h {minutes}m"
        except:
            return "Unknown"
    
    def _get_memory_info(self) -> Dict[str, Any]:
        """Get memory information"""
        try:
            with open('/proc/meminfo', 'r') as f:
                meminfo = {}
                for line in f:
                    if ':' in line:
                        key, value = line.split(':', 1)
                        meminfo[key.strip()] = value.strip()
                
                total = int(meminfo.get('MemTotal', '0 kB').split()[0])
                available = int(meminfo.get('MemAvailable', '0 kB').split()[0])
                used = total - available
                
                return {
                    'total': total,
                    'used': used,
                    'available': available,
                    'percentage': round((used / total) * 100, 1) if total > 0 else 0
                }
        except:
            return {'total': 0, 'used': 0, 'available': 0, 'percentage': 0}
    
    def _get_cpu_info(self) -> Dict[str, Any]:
        """Get CPU information"""
        try:
            with open('/proc/cpuinfo', 'r') as f:
                cpuinfo = f.read()
                cores = cpuinfo.count('processor')
                model = "Unknown"
                for line in cpuinfo.split('\n'):
                    if line.startswith('model name'):
                        model = line.split(':')[1].strip()
                        break
                
                return {
                    'cores': cores,
                    'model': model
                }
        except:
            return {'cores': 0, 'model': 'Unknown'}



