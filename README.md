# IfutureTech Admin Management System

A comprehensive web-based admin panel for managing users, enquiries, and admissions for IfutureTech.

## Features

### 🔐 Authentication
- Secure login system with default admin credentials
- Session management
- User role-based permissions

### 👥 User Management
- Add new admin users with custom permissions
- View all admin users in a formatted table
- Edit user details and permissions
- Delete users (with confirmation)
- Permission levels: All Tabs, Enquiry & Admission, Enquiry Only, Admission Only, Users Only

### ❓ Enquiry Management
- Add new enquiries through popup modal
- Store enquiry details: Name, Course, Date, Contact
- View all enquiries in formatted table
- Automatic timestamps for tracking

### 🎓 Admission Management
- Detailed admission registration form
- Student information: Name, Course, Contact, Project, College
- Fee management: Total Fees, Payment Status (Full/Half/Pending), Payment Date
- View all admissions with detailed information
- Edit admission details with update functionality
- Comprehensive admission details view

### 📊 Dashboard
- Real-time statistics for Users, Enquiries, and Admissions
- Modern, responsive design
- Navigation tabs on the right sidebar
- Overview of system status

## Default Login Credentials

- **Username:** IfutureTech
- **Password:** Admin

## Installation and Setup

1. **Install Python Requirements:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Application:**
   ```bash
   python app.py
   ```

3. **Access the System:**
   - Open your web browser
   - Navigate to `http://localhost:5000`
   - Login with the default credentials

## Database

The system uses SQLite database (`admin_system.db`) which is automatically created on first run with the following tables:

- **users**: Admin users with login credentials and permissions
- **enquiries**: Student enquiry records
- **admissions**: Detailed admission records with fee information

## Technology Stack

- **Backend:** Flask (Python)
- **Frontend:** HTML5, CSS3, JavaScript
- **Database:** SQLite
- **Styling:** Modern CSS with responsive design
- **Authentication:** Session-based with password hashing

## User Interface

### Navigation
- **Certification Tab:** Placeholder for future certification management
- **Enquiry Tab:** Manage student enquiries
- **Admission Tab:** Handle admission registrations and management
- **Users Tab:** Admin user management

### Key Features
- Responsive design for mobile and desktop
- Modern UI with gradient backgrounds and smooth animations
- Modal popups for forms and detailed views
- Real-time data updates
- Status indicators with color coding

## Security Features

- Password hashing using SHA-256
- Session-based authentication
- SQL injection prevention with parameterized queries
- Input validation on both frontend and backend

## Permission System

Admins can set different permission levels for users:
- **All Tabs Access:** Full system access
- **Enquiry & Admission Only:** Limited to enquiry and admission management
- **Enquiry Only:** Only enquiry management
- **Admission Only:** Only admission management
- **Users Management Only:** Only user management

## File Structure

```
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/            # HTML templates
│   ├── login.html
│   ├── dashboard.html
│   ├── users.html
│   ├── enquiry.html
│   ├── admission.html
│   └── admission_register.html
├── static/
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   └── js/               # JavaScript files
│       ├── dashboard.js
│       ├── users.js
│       ├── enquiry.js
│       ├── admission.js
│       └── admission_register.js
└── admin_system.db       # SQLite database (created on first run)
```

## Usage Instructions

### Managing Users
1. Go to Users tab
2. Use "Add Users" to create new admin accounts
3. Use "View Users" to see all admins and manage them
4. Edit permissions, usernames, passwords as needed
5. Delete users with confirmation

### Managing Enquiries
1. Go to Enquiry tab
2. Click "Add Enquiry" to open the popup form
3. Fill in Name, Course, Date, and Contact information
4. Click "Done" to save to database
5. Use "View Enquiry" to see all enquiries in formatted table

### Managing Admissions
1. Go to Admission tab
2. Click "Register New Admission" for detailed registration form
3. Fill in all student and fee information
4. Click "Save Admission" to store in database
5. Use "View" to see all admissions
6. Click "View" on any admission to see detailed information
7. Click "Edit" to modify admission details

## Troubleshooting

### Common Issues

1. **Database Error on First Run:**
   - Make sure the application has write permissions in the directory
   - The database file will be created automatically

2. **Login Issues:**
   - Use exact credentials: Username: `IfutureTech`, Password: `Admin`
   - Check for caps lock and spacing

3. **Permission Errors:**
   - Ensure you have appropriate permissions set for your user account
   - Contact the main admin to update your permissions

4. **Data Not Loading:**
   - Check browser console for JavaScript errors
   - Refresh the page
   - Check network connectivity

## Future Enhancements

- Certification management module
- Email notifications for enquiries and admissions
- Advanced reporting and analytics
- File upload capabilities for documents
- Payment tracking integration
- Backup and restore functionality

## Support

For technical support or feature requests, please contact the IfutureTech development team.

---

© 2024 IfutureTech. All rights reserved.