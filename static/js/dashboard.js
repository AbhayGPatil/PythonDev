// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
});

function loadStats() {
    // Load user count
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            document.getElementById('userCount').textContent = users.length;
        })
        .catch(error => {
            console.error('Error loading user count:', error);
            document.getElementById('userCount').textContent = 'Error';
        });

    // Load enquiry count
    fetch('/api/enquiries')
        .then(response => response.json())
        .then(enquiries => {
            document.getElementById('enquiryCount').textContent = enquiries.length;
        })
        .catch(error => {
            console.error('Error loading enquiry count:', error);
            document.getElementById('enquiryCount').textContent = 'Error';
        });

    // Load admission count
    fetch('/api/admissions')
        .then(response => response.json())
        .then(admissions => {
            document.getElementById('admissionCount').textContent = admissions.length;
        })
        .catch(error => {
            console.error('Error loading admission count:', error);
            document.getElementById('admissionCount').textContent = 'Error';
        });
}

function loadSection(section) {
    if (section === 'certification') {
        alert('Certification section is not yet implemented. Please use the other tabs for now.');
    }
}