# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.6] - 2025-09-10

### Fixed
- **Dark Mode Text Visibility - Comprehensive CSS Solution**
  - Added comprehensive CSS rules for all text elements in dark mode
  - Force white text for all headings (h1-h6), paragraphs, spans, and divs
  - Target container-fluid, row, and col-12 elements
  - Complete coverage for all HTML text elements
  - Enhanced visibility for all management pages
  - Comprehensive solution for Firewall, Routing, and Logging Management
  - Ensure complete text visibility across all pages

## [2.0.5] - 2025-09-10

### Fixed
- **Dark Mode Text Visibility - Simple CSS Approach**
  - Added simple CSS rules to force white text for dark mode in management pages
  - Target text-muted, card-body, card-header, and table elements
  - Use CSS-only approach without modifying Vue component structure
  - Ensure all text elements are visible in dark mode
  - Fix for Firewall Management, Routing Management, and Logging Management pages
  - Rollback problematic changes that caused blank pages
  - Simple and stable solution for dark mode text visibility

## [2.0.3] - 2025-09-10

### Fixed
- **Dark Mode Text Visibility - Force White Text**
  - Changed all dark mode text colors to white for better visibility
  - Simplified color scheme: white text for dark mode, dark text for light mode
  - Updated navbar.vue with white text for nav-link and sidebar-heading
  - Updated dashboard.css with white text for all dark mode elements
  - Ensured all text elements are clearly visible in dark mode
  - Improved visibility and contrast in dark mode
  - Consistent white text across all sidebar elements

## [2.0.2] - 2025-09-10

### Fixed
- **Dark Mode Text Visibility Issues**
  - Fixed text still appearing dark in dark mode (based on user feedback)
  - Added stronger CSS selectors with higher specificity
  - Forced text color inheritance for all nav-link elements
  - Added !important declarations to override conflicting styles
  - Improved CSS specificity with .navbar-container[data-bs-theme] selectors
  - Ensured all text elements inherit proper colors in dark mode

## [2.0.1] - 2025-09-10

### Fixed
- **Theme Support Improvements**
  - Fixed logo brightness adjustment for dark/light mode compatibility
  - Improved sidebar text styling for better theme visibility
  - Enhanced nav-link styling for both dark and light themes
  - Added comprehensive CSS rules for theme-specific styling
  - Improved text contrast and visibility in all theme modes
  - Better icon and text color inheritance for sidebar elements

### Technical Improvements
- **Frontend Styling**
  - Enhanced theme-specific CSS selectors
  - Improved dynamic styling based on `data-bs-theme` attribute
  - Better color contrast ratios for accessibility
  - Optimized sidebar heading styling for both themes

## [2.0.0] - 2025-09-10

### Added
- **Comprehensive Logging Management System**
  - New `LoggingManager.py` module for centralized logging functionality
  - SQLite-based logging database with activity tracking
  - Real-time activity logging for all system operations
  - Log filtering and search capabilities
  - Log statistics dashboard with metrics
  - System log file viewer (syslog, auth.log, kern.log, dmesg, firewall, routing, WireGuard)
  - Log export functionality (JSON/CSV formats)
  - Log clearing and maintenance tools

- **New Frontend Components**
  - `logging.vue` - Complete logging management UI
  - Log statistics cards with real-time data
  - Advanced filtering interface (level, category, date range)
  - System log viewer with line-by-line display
  - Export functionality with format selection
  - Log clearing modal with confirmation

- **Enhanced API Endpoints**
  - `GET /api/logs` - Retrieve activity logs with filtering
  - `GET /api/logs/statistics` - Get logging statistics and metrics
  - `GET /api/logs/system/{type}` - Access system log files
  - `POST /api/logs/clear` - Clear logs from database
  - `GET /api/logs/export` - Export logs in various formats

- **Integration Features**
  - Activity logging for firewall operations (add, delete, reload rules)
  - Activity logging for routing operations (add, delete routes)
  - Activity logging for authentication (login, logout, failed attempts)
  - Activity logging for WireGuard operations (toggle, delete configurations)
  - Centralized logging integration in all existing modules

- **Navigation Enhancement**
  - New "Logging Management" menu item in sidebar
  - Updated router configuration for `/logging` route
  - Bootstrap Icons integration for logging menu

- **Documentation Updates**
  - Updated README.md with logging features
  - Added logging API endpoints documentation
  - Updated file structure documentation
  - Enhanced troubleshooting section

- **Development Tools**
  - `demo_logging.py` - Testing script for logging functionality
  - Enhanced `start.sh` with logging system validation
  - Updated build process with Node.js 18 support

### Changed
- **Frontend Build System**
  - Updated to Node.js 18.20.8 for Vite compatibility
  - Rebuilt all frontend assets with new logging components
  - Updated package dependencies and build configuration

- **Backend Architecture**
  - Enhanced `FirewallManager.py` with logging integration
  - Enhanced `RouteManager.py` with logging integration
  - Updated `dashboard.py` with comprehensive logging endpoints
  - Improved error handling and logging throughout

- **Configuration**
  - Updated `wg-dashboard.ini` with logging system settings
  - Enhanced `start.sh` with logging system checks
  - Improved system validation and dependency checking

### Technical Improvements
- **Database Integration**
  - SQLite database for persistent logging storage
  - Optimized queries for log retrieval and statistics
  - Automatic database schema creation and migration

- **Performance Enhancements**
  - Efficient log filtering and pagination
  - Optimized frontend asset loading
  - Improved API response times

- **Security Enhancements**
  - Secure log access with authentication
  - Input validation for all logging endpoints
  - Protection against log injection attacks

### Fixed
- **Build System Issues**
  - Fixed Node.js version compatibility issues
  - Resolved Vite build errors with outdated Node.js
  - Fixed frontend asset generation problems

- **Frontend Issues**
  - Fixed missing logging menu in sidebar
  - Resolved routing configuration issues
  - Fixed asset loading problems

### Dependencies
- **Updated**
  - Node.js: 12.22.9 → 18.20.8
  - npm: 8.5.1 → 10.8.2
  - All frontend build tools updated for compatibility

- **Added**
  - NVM (Node Version Manager) for Node.js management
  - Enhanced logging dependencies

## [1.0.0] - Previous Release

### Features
- WireGuard VPN Management
- Firewall Rules Management (iptables)
- Routing Table Management
- System Status Monitoring
- Web-based Dashboard Interface

### Technical Stack
- Python Flask backend
- Vue.js 3 frontend
- SQLite database
- Bootstrap 5 UI framework
- Gunicorn WSGI server

---

## Installation & Usage

### Quick Start
```bash
git clone https://github.com/arulriyadi/WGdasboard-fw.git
cd WGdasboard-fw
./start.sh
```

### Access
- **URL**: http://localhost:10081
- **Credentials**: admin / admin
- **Features**: WireGuard, Firewall, Routing, **Logging Management**

### New Logging Features
1. **Activity Logs**: View all system activities with filtering
2. **Statistics**: Real-time logging metrics and analytics
3. **System Logs**: Access to system log files
4. **Export**: Download logs in JSON/CSV format
5. **Maintenance**: Clear old logs and manage storage

---

## Breaking Changes
- None in this release - fully backward compatible

## Migration Notes
- No migration required - logging system is automatically initialized
- Existing configurations remain unchanged
- All previous features continue to work as before

## Support
- GitHub Issues: [Report Issues](https://github.com/arulriyadi/WGdasboard-fw/issues)
- Documentation: See README.md for detailed setup instructions
- Logging System: Use demo_logging.py for testing logging functionality
