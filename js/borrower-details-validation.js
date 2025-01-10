'use strict';

export function validateForm() {
    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(error => error.classList.remove('error-visible'));

    let hasErrors = false;

    // First Name Validation
    const firstName = document.getElementById('first-name').value.trim();
    const firstNameError = document.getElementById('first-name-error');
    if (!firstName) {
        firstNameError.textContent = "First name is required.";
        firstNameError.classList.add('error-visible');
        hasErrors = true;
    } else if (firstName.length > 50) {
        firstNameError.textContent = "First name must not exceed 50 characters.";
        firstNameError.classList.add('error-visible');
        hasErrors = true;
    }

    // Last Name Validation
    const lastName = document.getElementById('last-name').value.trim();
    const lastNameError = document.getElementById('last-name-error');
    if (!lastName) {
        lastNameError.textContent = "Last name is required.";
        lastNameError.classList.add('error-visible');
        hasErrors = true;
    } else if (lastName.length > 50) {
        lastNameError.textContent = "Last name must not exceed 50 characters.";
        lastNameError.classList.add('error-visible');
        hasErrors = true;
    }

    // Email Validation
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('email-error');
    if (!email) {
        emailError.textContent = "Email is required.";
        emailError.classList.add('error-visible');
        hasErrors = true;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        emailError.classList.add('error-visible');
        hasErrors = true;
    } else if (email.length > 320) {
        emailError.textContent = "Email must not exceed 320 characters.";
        emailError.classList.add('error-visible');
        hasErrors = true;
    }

    // Contact Number Validation
    const contactNo = document.getElementById('contact-number').value.trim();
    const contactNoError = document.getElementById('contact-number-error');
    if (!contactNo) {
        contactNoError.textContent = "Contact number is required.";
        contactNoError.classList.add('error-visible');
        hasErrors = true;
    } else if (!/^\d{7,15}$/.test(contactNo)) {
        contactNoError.textContent = "Please enter a valid contact number (7 to 15 digits).";
        contactNoError.classList.add('error-visible');
        hasErrors = true;
    }

    // If no errors, you can proceed with form submission
    if (!hasErrors) {
        return true;
    } else {
        return false;
    }
}
