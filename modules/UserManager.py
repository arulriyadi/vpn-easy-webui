#!/usr/bin/env python3
"""
UserManager.py - User Management Module for WGDashboard
Handles user authentication, CRUD operations, and user management
"""

import os
import sqlite3
import hashlib
import secrets
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import logging

class UserManager:
    def __init__(self, db_path: str = "db/users.db"):
        """
        Initialize UserManager with database connection
        
        Args:
            db_path: Path to SQLite database file
        """
        self.db_path = db_path
        self.logger = logging.getLogger(__name__)
        self._init_database()
    
    def _init_database(self):
        """Initialize database tables if they don't exist"""
        try:
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Create users table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL,
                        email TEXT,
                        full_name TEXT,
                        role TEXT DEFAULT 'user',
                        is_active BOOLEAN DEFAULT 1,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        last_login TIMESTAMP,
                        login_attempts INTEGER DEFAULT 0,
                        locked_until TIMESTAMP,
                        mfa_secret TEXT,
                        mfa_enabled BOOLEAN DEFAULT 0
                    )
                ''')
                
                # Create user_sessions table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS user_sessions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER,
                        session_token TEXT UNIQUE NOT NULL,
                        ip_address TEXT,
                        user_agent TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        expires_at TIMESTAMP,
                        is_active BOOLEAN DEFAULT 1,
                        FOREIGN KEY (user_id) REFERENCES users (id)
                    )
                ''')
                
                # Create user_permissions table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS user_permissions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER,
                        permission TEXT NOT NULL,
                        granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users (id)
                    )
                ''')
                
                conn.commit()
                
                # Create default admin user if no users exist
                self._create_default_admin()
                
        except Exception as e:
            self.logger.error(f"Error initializing database: {e}")
            raise
    
    def _create_default_admin(self):
        """Create default admin user if no users exist"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM users")
                count = cursor.fetchone()[0]
                
                if count == 0:
                    # Create default admin user
                    admin_password = "admin"
                    password_hash = self._hash_password(admin_password)
                    
                    cursor.execute('''
                        INSERT INTO users (username, password_hash, email, full_name, role, is_active)
                        VALUES (?, ?, ?, ?, ?, ?)
                    ''', ("admin", password_hash, "admin@localhost", "Administrator", "admin", 1))
                    
                    # Grant all permissions to admin
                    user_id = cursor.lastrowid
                    permissions = [
                        "dashboard_access", "user_management", "firewall_management",
                        "routing_management", "logging_management", "system_status",
                        "wireguard_management", "settings_management"
                    ]
                    
                    for permission in permissions:
                        cursor.execute('''
                            INSERT INTO user_permissions (user_id, permission)
                            VALUES (?, ?)
                        ''', (user_id, permission))
                    
                    conn.commit()
                    self.logger.info("Default admin user created")
                    
        except Exception as e:
            self.logger.error(f"Error creating default admin: {e}")
    
    def _hash_password(self, password: str) -> str:
        """Hash password using SHA-256 with salt"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}:{password_hash}"
    
    def _verify_password(self, password: str, password_hash: str) -> bool:
        """Verify password against hash"""
        try:
            salt, hash_part = password_hash.split(':')
            return hashlib.sha256((password + salt).encode()).hexdigest() == hash_part
        except:
            return False
    
    def authenticate_user(self, username: str, password: str, ip_address: str = None, user_agent: str = None) -> Dict:
        """
        Authenticate user with username and password
        
        Args:
            username: Username
            password: Password
            ip_address: Client IP address
            user_agent: Client user agent
            
        Returns:
            Dict with authentication result
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Get user data
                cursor.execute('''
                    SELECT id, username, password_hash, role, is_active, login_attempts, locked_until
                    FROM users WHERE username = ?
                ''', (username,))
                
                user = cursor.fetchone()
                
                if not user:
                    return {"success": False, "message": "Invalid username or password"}
                
                user_id, db_username, password_hash, role, is_active, login_attempts, locked_until = user
                
                # Check if user is active
                if not is_active:
                    return {"success": False, "message": "Account is disabled"}
                
                # Check if account is locked
                if locked_until and datetime.now() < datetime.fromisoformat(locked_until):
                    return {"success": False, "message": "Account is temporarily locked"}
                
                # Verify password
                if not self._verify_password(password, password_hash):
                    # Increment login attempts
                    new_attempts = login_attempts + 1
                    lock_until = None
                    
                    if new_attempts >= 5:  # Lock after 5 failed attempts
                        lock_until = datetime.now() + timedelta(minutes=30)
                    
                    cursor.execute('''
                        UPDATE users SET login_attempts = ?, locked_until = ?
                        WHERE id = ?
                    ''', (new_attempts, lock_until, user_id))
                    conn.commit()
                    
                    return {"success": False, "message": "Invalid username or password"}
                
                # Reset login attempts on successful login
                cursor.execute('''
                    UPDATE users SET login_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP
                    WHERE id = ?
                ''', (user_id,))
                
                # Create session
                session_token = secrets.token_urlsafe(32)
                expires_at = datetime.now() + timedelta(hours=24)
                
                cursor.execute('''
                    INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at)
                    VALUES (?, ?, ?, ?, ?)
                ''', (user_id, session_token, ip_address, user_agent, expires_at))
                
                conn.commit()
                
                return {
                    "success": True,
                    "user_id": user_id,
                    "username": db_username,
                    "role": role,
                    "session_token": session_token,
                    "expires_at": expires_at.isoformat()
                }
                
        except Exception as e:
            self.logger.error(f"Authentication error: {e}")
            return {"success": False, "message": "Authentication failed"}
    
    def validate_session(self, session_token: str) -> Dict:
        """
        Validate session token
        
        Args:
            session_token: Session token to validate
            
        Returns:
            Dict with validation result
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute('''
                    SELECT s.user_id, s.expires_at, u.username, u.role, u.is_active
                    FROM user_sessions s
                    JOIN users u ON s.user_id = u.id
                    WHERE s.session_token = ? AND s.is_active = 1
                ''', (session_token,))
                
                session = cursor.fetchone()
                
                if not session:
                    return {"valid": False, "message": "Invalid session"}
                
                user_id, expires_at, username, role, is_active = session
                
                # Check if session is expired
                if datetime.now() > datetime.fromisoformat(expires_at):
                    # Deactivate expired session
                    cursor.execute('''
                        UPDATE user_sessions SET is_active = 0 WHERE session_token = ?
                    ''', (session_token,))
                    conn.commit()
                    return {"valid": False, "message": "Session expired"}
                
                # Check if user is still active
                if not is_active:
                    return {"valid": False, "message": "User account disabled"}
                
                return {
                    "valid": True,
                    "user_id": user_id,
                    "username": username,
                    "role": role
                }
                
        except Exception as e:
            self.logger.error(f"Session validation error: {e}")
            return {"valid": False, "message": "Session validation failed"}
    
    def logout_user(self, session_token: str) -> bool:
        """
        Logout user by deactivating session
        
        Args:
            session_token: Session token to deactivate
            
        Returns:
            bool: Success status
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    UPDATE user_sessions SET is_active = 0 WHERE session_token = ?
                ''', (session_token,))
                conn.commit()
                return True
        except Exception as e:
            self.logger.error(f"Logout error: {e}")
            return False
    
    def create_user(self, username: str, password: str, email: str = None, full_name: str = None, role: str = "user") -> Dict:
        """
        Create new user
        
        Args:
            username: Username
            password: Password
            email: Email address
            full_name: Full name
            role: User role (admin, user)
            
        Returns:
            Dict with creation result
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Check if username already exists
                cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
                if cursor.fetchone():
                    return {"success": False, "message": "Username already exists"}
                
                # Hash password
                password_hash = self._hash_password(password)
                
                # Create user
                cursor.execute('''
                    INSERT INTO users (username, password_hash, email, full_name, role, is_active)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (username, password_hash, email, full_name, role, 1))
                
                user_id = cursor.lastrowid
                
                # Grant default permissions based on role
                default_permissions = ["dashboard_access"]
                if role == "admin":
                    default_permissions.extend([
                        "user_management", "firewall_management", "routing_management",
                        "logging_management", "system_status", "wireguard_management", "settings_management"
                    ])
                
                for permission in default_permissions:
                    cursor.execute('''
                        INSERT INTO user_permissions (user_id, permission)
                        VALUES (?, ?)
                    ''', (user_id, permission))
                
                conn.commit()
                
                return {"success": True, "user_id": user_id, "message": "User created successfully"}
                
        except Exception as e:
            self.logger.error(f"User creation error: {e}")
            return {"success": False, "message": "Failed to create user"}
    
    def get_users(self) -> List[Dict]:
        """
        Get all users
        
        Returns:
            List of user dictionaries
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT id, username, email, full_name, role, is_active, created_at, last_login
                    FROM users ORDER BY created_at DESC
                ''')
                
                users = []
                for row in cursor.fetchall():
                    users.append({
                        "id": row[0],
                        "username": row[1],
                        "email": row[2],
                        "full_name": row[3],
                        "role": row[4],
                        "is_active": bool(row[5]),
                        "created_at": row[6],
                        "last_login": row[7]
                    })
                
                return users
                
        except Exception as e:
            self.logger.error(f"Get users error: {e}")
            return []
    
    def update_user(self, user_id: int, **kwargs) -> Dict:
        """
        Update user information
        
        Args:
            user_id: User ID
            **kwargs: Fields to update
            
        Returns:
            Dict with update result
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Build update query
                allowed_fields = ["email", "full_name", "role", "is_active"]
                update_fields = []
                values = []
                
                for field, value in kwargs.items():
                    if field in allowed_fields:
                        update_fields.append(f"{field} = ?")
                        values.append(value)
                
                if not update_fields:
                    return {"success": False, "message": "No valid fields to update"}
                
                # Add password update if provided
                if "password" in kwargs:
                    password_hash = self._hash_password(kwargs["password"])
                    update_fields.append("password_hash = ?")
                    values.append(password_hash)
                
                update_fields.append("updated_at = CURRENT_TIMESTAMP")
                values.append(user_id)
                
                query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?"
                cursor.execute(query, values)
                
                if cursor.rowcount == 0:
                    return {"success": False, "message": "User not found"}
                
                conn.commit()
                return {"success": True, "message": "User updated successfully"}
                
        except Exception as e:
            self.logger.error(f"User update error: {e}")
            return {"success": False, "message": "Failed to update user"}
    
    def delete_user(self, user_id: int) -> Dict:
        """
        Delete user
        
        Args:
            user_id: User ID to delete
            
        Returns:
            Dict with deletion result
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Check if user exists
                cursor.execute("SELECT username FROM users WHERE id = ?", (user_id,))
                user = cursor.fetchone()
                
                if not user:
                    return {"success": False, "message": "User not found"}
                
                # Prevent deletion of last admin
                cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = 1")
                admin_count = cursor.fetchone()[0]
                
                cursor.execute("SELECT role FROM users WHERE id = ?", (user_id,))
                user_role = cursor.fetchone()[0]
                
                if user_role == "admin" and admin_count <= 1:
                    return {"success": False, "message": "Cannot delete the last admin user"}
                
                # Delete user and related data
                cursor.execute("DELETE FROM user_permissions WHERE user_id = ?", (user_id,))
                cursor.execute("DELETE FROM user_sessions WHERE user_id = ?", (user_id,))
                cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
                
                conn.commit()
                return {"success": True, "message": f"User {user[0]} deleted successfully"}
                
        except Exception as e:
            self.logger.error(f"User deletion error: {e}")
            return {"success": False, "message": "Failed to delete user"}
    
    def get_user_permissions(self, user_id: int) -> List[str]:
        """
        Get user permissions
        
        Args:
            user_id: User ID
            
        Returns:
            List of permission strings
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT permission FROM user_permissions WHERE user_id = ?
                ''', (user_id,))
                
                return [row[0] for row in cursor.fetchall()]
                
        except Exception as e:
            self.logger.error(f"Get permissions error: {e}")
            return []
    
    def grant_permission(self, user_id: int, permission: str) -> bool:
        """
        Grant permission to user
        
        Args:
            user_id: User ID
            permission: Permission to grant
            
        Returns:
            bool: Success status
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT OR IGNORE INTO user_permissions (user_id, permission)
                    VALUES (?, ?)
                ''', (user_id, permission))
                conn.commit()
                return True
        except Exception as e:
            self.logger.error(f"Grant permission error: {e}")
            return False
    
    def revoke_permission(self, user_id: int, permission: str) -> bool:
        """
        Revoke permission from user
        
        Args:
            user_id: User ID
            permission: Permission to revoke
            
        Returns:
            bool: Success status
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    DELETE FROM user_permissions WHERE user_id = ? AND permission = ?
                ''', (user_id, permission))
                conn.commit()
                return True
        except Exception as e:
            self.logger.error(f"Revoke permission error: {e}")
            return False
    
    def get_user_statistics(self) -> Dict:
        """
        Get user statistics
        
        Returns:
            Dict with user statistics
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Total users
                cursor.execute("SELECT COUNT(*) FROM users")
                total_users = cursor.fetchone()[0]
                
                # Active users
                cursor.execute("SELECT COUNT(*) FROM users WHERE is_active = 1")
                active_users = cursor.fetchone()[0]
                
                # Admin users
                cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'admin'")
                admin_users = cursor.fetchone()[0]
                
                # Recent logins (last 24 hours)
                cursor.execute('''
                    SELECT COUNT(*) FROM users WHERE last_login > datetime('now', '-1 day')
                ''')
                recent_logins = cursor.fetchone()[0]
                
                # Active sessions
                cursor.execute('''
                    SELECT COUNT(*) FROM user_sessions 
                    WHERE is_active = 1 AND expires_at > datetime('now')
                ''')
                active_sessions = cursor.fetchone()[0]
                
                return {
                    "total_users": total_users,
                    "active_users": active_users,
                    "admin_users": admin_users,
                    "recent_logins": recent_logins,
                    "active_sessions": active_sessions
                }
                
        except Exception as e:
            self.logger.error(f"Get statistics error: {e}")
            return {}
