// Admission Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadAdmissions();
    
    // Edit admission form submission
    document.getElementById('editAdmissionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateAdmission();
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
    
    if (sectionName === 'view-admissions') {
        loadAdmissions();
    }
}

function loadAdmissions() {
    fetch('/api/admissions')
        .then(response => response.json())
        .then(admissions => {
            const tbody = document.getElementById('admissionsTableBody');
            const totalAdmissions = document.getElementById('totalAdmissions');
            
            totalAdmissions.textContent = admissions.length;
            tbody.innerHTML = '';
            
            admissions.forEach(admission => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${admission[0]}</td>
                    <td>${admission[1]}</td>
                    <td>${admission[2]}</td>
                    <td>${admission[3]}</td>
                    <td>₹${parseFloat(admission[5]).toFixed(2)}</td>
                    <td><span class="status-${admission[6].toLowerCase()}">${admission[6]}</span></td>
                    <td>${admission[8]}</td>
                    <td>
                        <button class="btn btn-view" onclick="viewAdmissionDetails(${admission[0]})">View</button>
                        <button class="btn btn-edit" onclick="openEditAdmissionModal(${JSON.stringify(admission).replace(/"/g, '&quot;')})">Edit</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading admissions:', error);
            alert('Error loading admissions');
        });
}

function viewAdmissionDetails(admissionId) {
    fetch('/api/admissions')
        .then(response => response.json())
        .then(admissions => {
            const admission = admissions.find(a => a[0] === admissionId);
            if (admission) {
                const detailsContent = document.getElementById('admissionDetailsContent');
                detailsContent.innerHTML = `
                    <div class="admission-details">
                        <div class="detail-section">
                            <h4>Student Information</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <strong>Name:</strong> ${admission[1]}
                                </div>
                                <div class="detail-item">
                                    <strong>Course:</strong> ${admission[2]}
                                </div>
                                <div class="detail-item">
                                    <strong>Contact:</strong> ${admission[3]}
                                </div>
                                <div class="detail-item">
                                    <strong>Project:</strong> ${admission[4]}
                                </div>
                                <div class="detail-item">
                                    <strong>College:</strong> ${admission[8]}
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Fee Information</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <strong>Total Fees:</strong> ₹${parseFloat(admission[5]).toFixed(2)}
                                </div>
                                <div class="detail-item">
                                    <strong>Payment Status:</strong> <span class="status-${admission[6].toLowerCase()}">${admission[6]}</span>
                                </div>
                                <div class="detail-item">
                                    <strong>Payment Date:</strong> ${admission[7] || 'Not specified'}
                                </div>
                                <div class="detail-item">
                                    <strong>Registered On:</strong> ${new Date(admission[9]).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <button class="btn btn-primary" onclick="openEditAdmissionModal(${JSON.stringify(admission).replace(/"/g, '&quot;')})">Edit Details</button>
                            <button class="btn btn-secondary" onclick="closeDetailsModal()">Close</button>
                        </div>
                    </div>
                `;
                document.getElementById('admissionDetailsModal').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error loading admission details:', error);
            alert('Error loading admission details');
        });
}

function closeDetailsModal() {
    document.getElementById('admissionDetailsModal').style.display = 'none';
}

function openEditAdmissionModal(admission) {
    // Parse admission data if it's a string
    if (typeof admission === 'string') {
        admission = JSON.parse(admission.replace(/&quot;/g, '"'));
    }
    
    document.getElementById('editAdmissionId').value = admission[0];
    document.getElementById('editAdmissionName').value = admission[1];
    document.getElementById('editAdmissionCourse').value = admission[2];
    document.getElementById('editAdmissionContact').value = admission[3];
    document.getElementById('editAdmissionProject').value = admission[4];
    document.getElementById('editAdmissionFees').value = admission[5];
    document.getElementById('editAdmissionPaidStatus').value = admission[6];
    document.getElementById('editAdmissionPaidDate').value = admission[7] || '';
    document.getElementById('editAdmissionCollege').value = admission[8];
    
    // Close details modal if open
    closeDetailsModal();
    
    document.getElementById('editAdmissionModal').style.display = 'block';
}

function closeEditAdmissionModal() {
    document.getElementById('editAdmissionModal').style.display = 'none';
}

function updateAdmission() {
    const admissionId = document.getElementById('editAdmissionId').value;
    const updateData = {
        name: document.getElementById('editAdmissionName').value,
        course: document.getElementById('editAdmissionCourse').value,
        contact: document.getElementById('editAdmissionContact').value,
        project: document.getElementById('editAdmissionProject').value,
        total_fees: parseFloat(document.getElementById('editAdmissionFees').value),
        paid_status: document.getElementById('editAdmissionPaidStatus').value,
        paid_date: document.getElementById('editAdmissionPaidDate').value,
        college_name: document.getElementById('editAdmissionCollege').value
    };
    
    fetch(`/api/admissions/${admissionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Admission updated successfully!');
            closeEditAdmissionModal();
            loadAdmissions();
        } else {
            alert('Error updating admission');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating admission');
    });
}

// Close modals when clicking outside
window.onclick = function(event) {
    const detailsModal = document.getElementById('admissionDetailsModal');
    const editModal = document.getElementById('editAdmissionModal');
    
    if (event.target === detailsModal) {
        closeDetailsModal();
    }
    if (event.target === editModal) {
        closeEditAdmissionModal();
    }
}