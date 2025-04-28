'use strict';

export function validateForm() {
    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(error => error.classList.add('hidden'));

    let hasErrors = false;

    // Borrower ID Validation
    const borrowerId = document.getElementById('borrower-id').value.trim();
    const borrowerIdError = document.getElementById('borrower-id-error');
    if (!borrowerId) {
        borrowerIdError.textContent = "ID is required.";
        borrowerIdError.classList.remove('hidden');
        hasErrors = true;
    } else if (borrowerId.length > 30) {
        borrowerIdError.textContent = "ID must not exceed 30 characters.";
        borrowerIdError.classList.remove('hidden');
        hasErrors = true;
    }

    // First Name Validation
    const firstName = document.getElementById('first-name').value.trim();
    const firstNameError = document.getElementById('first-name-error');
    if (!firstName) {
        firstNameError.textContent = "First name is required.";
        firstNameError.classList.remove('hidden');
        hasErrors = true;
    } else if (firstName.length > 50) {
        firstNameError.textContent = "First name must not exceed 50 characters.";
        firstNameError.classList.remove('hidden');
        hasErrors = true;
    }

    // Middle Initial Validation
    const middleInitial = document.getElementById('middle-initial').value.trim();
    const middleInitialError = document.getElementById('middle-initial-error');
    if (middleInitial && middleInitial.length > 5) {
        middleInitialError.textContent = "Middle initial must not exceed 5 characters.";
        middleInitialError.classList.remove('hidden');
        hasErrors = true;
    }

    // Last Name Validation
    const lastName = document.getElementById('last-name').value.trim();
    const lastNameError = document.getElementById('last-name-error');
    if (!lastName) {
        lastNameError.textContent = "Last name is required.";
        lastNameError.classList.remove('hidden');
        hasErrors = true;
    } else if (lastName.length > 50) {
        lastNameError.textContent = "Last name must not exceed 50 characters.";
        lastNameError.classList.remove('hidden');
        hasErrors = true;
    }

    // Email Validation
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('email-error');
    if (!email) {
        emailError.textContent = "Email is required.";
        emailError.classList.remove('hidden');
        hasErrors = true;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        emailError.classList.remove('hidden');
        hasErrors = true;
    } else if (email.length > 320) {
        emailError.textContent = "Email must not exceed 320 characters.";
        emailError.classList.remove('hidden');
        hasErrors = true;
    }

    // Contact Number Validation
    const contactNo = document.getElementById('contact-number').value.trim();
    const contactNoError = document.getElementById('contact-number-error');
    if (!contactNo) {
        contactNoError.textContent = "Contact number is required.";
        contactNoError.classList.remove('hidden');
        hasErrors = true;
    } else if (!/^\d{7,15}$/.test(contactNo)) {
        contactNoError.textContent = "Please enter a valid contact number (7 to 15 digits).";
        contactNoError.classList.remove('hidden');
        hasErrors = true;
    }

    // Department Validation
    const department = document.getElementById('department').value.trim();
    const departmentError = document.getElementById('department-error');
    if (!department) {
        departmentError.textContent = "Department is required.";
        departmentError.classList.remove('hidden');
        hasErrors = true;
    } else if (department.length > 100) {
        departmentError.textContent = "Department must not exceed 100 characters.";
        departmentError.classList.remove('hidden');
        hasErrors = true;
    }

    // Designation Validation
    const designation = document.getElementById('designation').value;
    const designationError = document.getElementById('designation-error');
    if (!designation) {
        designationError.textContent = "Designation is required.";
        designationError.classList.remove('hidden');
        hasErrors = true;
    }

    // Course Details Validation
    const courseDetails = document.getElementById('course-details').value.trim();
    const courseDetailsError = document.getElementById('course-details-error');
    if (courseDetails && courseDetails.length > 50) {
        courseDetailsError.textContent = "Course details must not exceed 50 characters.";
        courseDetailsError.classList.remove('hidden');
        hasErrors = true;
    }

    // Subject Validation
    const subject = document.getElementById('subject').value.trim();
    const subjectError = document.getElementById('subject-error');
    if (!subject) {
        subjectError.textContent = "Subject is required.";
        subjectError.classList.remove('hidden');
        hasErrors = true;
    } else if (subject.length > 100) {
        subjectError.textContent = "Subject must not exceed 100 characters.";
        subjectError.classList.remove('hidden');
        hasErrors = true;
    }

    // If no errors, return true, else false
    return !hasErrors;
}
