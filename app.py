from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import sqlite3
import hashlib
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = 'ifuturetech_admin_secret_key_2024'

# Database initialization
def init_db():
    conn = sqlite3.connect('admin_system.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            permissions TEXT DEFAULT 'all',
            created_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create enquiries table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS enquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            course TEXT NOT NULL,
            date TEXT NOT NULL,
            contact TEXT NOT NULL,
            created_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create admissions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            course TEXT NOT NULL,
            contact TEXT NOT NULL,
            project TEXT NOT NULL,
            total_fees REAL NOT NULL,
            paid_status TEXT NOT NULL,
            paid_date TEXT,
            college_name TEXT NOT NULL,
            created_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert default admin user if not exists
    cursor.execute('SELECT * FROM users WHERE username = ?', ('IfutureTech',))
    if not cursor.fetchone():
        hashed_password = hashlib.sha256('Admin'.encode()).hexdigest()
        cursor.execute('INSERT INTO users (username, password, permissions) VALUES (?, ?, ?)', 
                      ('IfutureTech', hashed_password, 'all'))
    
    conn.commit()
    conn.close()

# Authentication decorator
def login_required(f):
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        conn = sqlite3.connect('admin_system.db')
        cursor = conn.cursor()
        cursor.execute('SELECT id, username, permissions FROM users WHERE username = ? AND password = ?', 
                      (username, hashed_password))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            session['user_id'] = user[0]
            session['username'] = user[1]
            session['permissions'] = user[2]
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', error='Invalid credentials')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', username=session['username'])

# Users Management Routes
@app.route('/users')
@login_required
def users():
    return render_template('users.html')

@app.route('/api/users', methods=['GET'])
@login_required
def get_users():
    conn = sqlite3.connect('admin_system.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, username, permissions, created_date FROM users')
    users = cursor.fetchall()
    conn.close()
    return jsonify(users)

@app.route('/api/users', methods=['POST'])
@login_required
def add_user():
    data = request.json
    username = data['username']
    password = data['password']
    permissions = data['permissions']
    
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    conn = sqlite3.connect('admin_system.db')
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO users (username, password, permissions) VALUES (?, ?, ?)', 
                      (username, hashed_password, permissions))
        conn.commit()
        return jsonify({'success': True})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'error': 'Username already exists'})
    finally:
        conn.close()

@app.route('/api/users/<int:user_id>', methods=['PUT'])
@login_required
def update_user(user_id):
    data = request.json
    
    conn = sqlite3.connect('admin_system.db')
    cursor = conn.cursor()
    
    if 'password' in data and data['password']:
        hashed_password = hashlib.sha256(data['password'].encode()).hexdigest()
        cursor.execute('UPDATE users SET username = ?, password = ?, permissions = ? WHERE id = ?', 
                      (data['username'], hashed_password, data['permissions'], user_id))
    else:
        cursor.execute('UPDATE users SET username = ?, permissions = ? WHERE id = ?', 
                      (data['username'], data['permissions'], user_id))
    
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    conn = sqlite3.connect('admin_system.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# Enquiry Management Routes
@app.route('/enquiry')
@login_required
def enquiry():
    return render_template('enquiry.html')

@app.route('/api/enquiries', methods=['GET'])
@login_required
def get_enquiries():
    conn = sqlite3.connect('admin_system.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM enquiries ORDER BY created_date DESC')
    enquiries = cursor.fetchall()
    conn.close()
    return jsonify(enquiries)

@app.route('/api/enquiries', methods=['POST'])
@login_required
def add_enquiry():
    data = request.json
    
    conn = sqlite3.connect('admin_system.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO enquiries (name, course, date, contact) VALUES (?, ?, ?, ?)', 
                  (data['name'], data['course'], data['date'], data['contact']))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# Admission Management Routes
@app.route('/admission')
@login_required
def admission():
    return render_template('admission.html')

@app.route('/admission/register')
@login_required
def admission_register():
    return render_template('admission_register.html')

@app.route('/api/admissions', methods=['GET'])
@login_required
def get_admissions():
    conn = sqlite3.connect('admin_system.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM admissions ORDER BY created_date DESC')
    admissions = cursor.fetchall()
    conn.close()
    return jsonify(admissions)

@app.route('/api/admissions', methods=['POST'])
@login_required
def add_admission():
    data = request.json
    
    conn = sqlite3.connect('admin_system.db')
    cursor = conn.cursor()
    cursor.execute('''INSERT INTO admissions 
                     (name, course, contact, project, total_fees, paid_status, paid_date, college_name) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)''', 
                  (data['name'], data['course'], data['contact'], data['project'], 
                   data['total_fees'], data['paid_status'], data['paid_date'], data['college_name']))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/admissions/<int:admission_id>', methods=['PUT'])
@login_required
def update_admission(admission_id):
    data = request.json
    
    conn = sqlite3.connect('admin_system.db')
    cursor = conn.cursor()
    cursor.execute('''UPDATE admissions SET 
                     name = ?, course = ?, contact = ?, project = ?, 
                     total_fees = ?, paid_status = ?, paid_date = ?, college_name = ?
                     WHERE id = ?''', 
                  (data['name'], data['course'], data['contact'], data['project'], 
                   data['total_fees'], data['paid_status'], data['paid_date'], 
                   data['college_name'], admission_id))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)