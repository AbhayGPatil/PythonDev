// Admission Registration JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Admission registration form submission
    document.getElementById('admissionRegisterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        registerAdmission();
    });
});

function registerAdmission() {
    const formData = {
        name: document.getElementById('studentName').value,
        course: document.getElementById('studentCourse').value,
        contact: document.getElementById('studentContact').value,
        project: document.getElementById('studentProject').value,
        total_fees: parseFloat(document.getElementById('totalFees').value),
        paid_status: document.getElementById('paidStatus').value,
        paid_date: document.getElementById('paidDate').value,
        college_name: document.getElementById('collegeName').value
    };
    
    // Validation
    if (!formData.name || !formData.course || !formData.contact || !formData.project || 
        !formData.total_fees || !formData.paid_status || !formData.college_name) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (formData.total_fees <= 0) {
        alert('Total fees must be greater than 0');
        return;
    }
    
    fetch('/api/admissions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Admission registered successfully!');
            resetForm();
        } else {
            alert('Error registering admission');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error registering admission');
    });
}

function resetForm() {
    document.getElementById('admissionRegisterForm').reset();
    // Focus on first field for quick entry
    document.getElementById('studentName').focus();
}