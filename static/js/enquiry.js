// Enquiry Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadEnquiries();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('enquiryDate').value = today;
    
    // Enquiry form submission
    document.getElementById('enquiryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addEnquiry();
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
    
    if (sectionName === 'view-enquiry') {
        loadEnquiries();
    }
}

function openEnquiryModal() {
    document.getElementById('enquiryModal').style.display = 'block';
    // Reset form
    document.getElementById('enquiryForm').reset();
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('enquiryDate').value = today;
}

function closeEnquiryModal() {
    document.getElementById('enquiryModal').style.display = 'none';
}

function addEnquiry() {
    const name = document.getElementById('enquiryName').value;
    const course = document.getElementById('enquiryCourse').value;
    const date = document.getElementById('enquiryDate').value;
    const contact = document.getElementById('enquiryContact').value;
    
    fetch('/api/enquiries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            course: course,
            date: date,
            contact: contact
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Enquiry added successfully!');
            closeEnquiryModal();
            loadEnquiries();
        } else {
            alert('Error adding enquiry');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding enquiry');
    });
}

function loadEnquiries() {
    fetch('/api/enquiries')
        .then(response => response.json())
        .then(enquiries => {
            const tbody = document.getElementById('enquiriesTableBody');
            const totalEnquiries = document.getElementById('totalEnquiries');
            
            totalEnquiries.textContent = enquiries.length;
            tbody.innerHTML = '';
            
            enquiries.forEach(enquiry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${enquiry[0]}</td>
                    <td>${enquiry[1]}</td>
                    <td>${enquiry[2]}</td>
                    <td>${enquiry[3]}</td>
                    <td>${enquiry[4]}</td>
                    <td>${new Date(enquiry[5]).toLocaleDateString()}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading enquiries:', error);
            alert('Error loading enquiries');
        });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('enquiryModal');
    if (event.target === modal) {
        closeEnquiryModal();
    }
}