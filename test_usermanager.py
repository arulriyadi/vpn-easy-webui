#!/usr/bin/env python3
"""
Test script untuk UserManager
"""

import sys
import os
sys.path.append('.')

from modules.UserManager import UserManager

def test_user_manager():
    print("Testing UserManager...")
    
    # Test dengan path absolut
    db_path = os.path.abspath("db/users.db")
    print(f"Database path: {db_path}")
    print(f"Database exists: {os.path.exists(db_path)}")
    
    try:
        um = UserManager(db_path)
        print("UserManager initialized successfully")
        
        # Test get users
        users = um.get_users()
        print(f"Users found: {len(users)}")
        for user in users:
            print(f"  - {user['username']} ({user['role']})")
        
        # Test get statistics
        stats = um.get_user_statistics()
        print(f"Statistics: {stats}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_user_manager()
