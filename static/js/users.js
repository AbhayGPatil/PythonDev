// Users Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    
    // Add user form submission
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addUser();
    });
    
    // Edit user form submission
    document.getElementById('editUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateUser();
    });
});

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    if (sectionName === 'view-users') {
        loadUsers();
    }
}

function addUser() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const permissions = document.getElementById('permissions').value;
    
    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
            permissions: permissions
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('User added successfully!');
            document.getElementById('addUserForm').reset();
            loadUsers();
        } else {
            alert('Error: ' + (data.error || 'Failed to add user'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding user');
    });
}

function loadUsers() {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const tbody = document.getElementById('usersTableBody');
            const totalUsers = document.getElementById('totalUsers');
            
            totalUsers.textContent = users.length;
            tbody.innerHTML = '';
            
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user[0]}</td>
                    <td>${user[1]}</td>
                    <td>${user[2]}</td>
                    <td>${new Date(user[3]).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-edit" onclick="openEditModal(${user[0]}, '${user[1]}', '${user[2]}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteUser(${user[0]})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading users:', error);
            alert('Error loading users');
        });
}

function openEditModal(userId, username, permissions) {
    document.getElementById('editUserId').value = userId;
    document.getElementById('editUsername').value = username;
    document.getElementById('editPermissions').value = permissions;
    document.getElementById('editPassword').value = '';
    document.getElementById('editUserModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editUserModal').style.display = 'none';
}

function updateUser() {
    const userId = document.getElementById('editUserId').value;
    const username = document.getElementById('editUsername').value;
    const password = document.getElementById('editPassword').value;
    const permissions = document.getElementById('editPermissions').value;
    
    const updateData = {
        username: username,
        permissions: permissions
    };
    
    if (password) {
        updateData.password = password;
    }
    
    fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('User updated successfully!');
            closeEditModal();
            loadUsers();
        } else {
            alert('Error updating user');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating user');
    });
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/users/${userId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('User deleted successfully!');
                loadUsers();
            } else {
                alert('Error deleting user');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting user');
        });
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editUserModal');
    if (event.target === modal) {
        closeEditModal();
    }
}