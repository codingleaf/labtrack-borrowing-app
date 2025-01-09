'use strict';

export function showSummary(borrowingList) {
    // Borrower Details
    const firstName = document.querySelector('#first-name').value;
    const lastName = document.querySelector('#last-name').value;
    const email = document.querySelector('#email').value;
    const contactNumber = document.querySelector('#contact-number').value;

    const spinboxes = [...document.querySelectorAll('.spinbox > input')];
    spinboxes.shift() // remove first element (from row template)
    spinboxes.forEach((spinbox, index) => {
        borrowingList[index]['quantity'] = spinbox.value;
    })

    console.log(firstName, lastName, email, contactNumber, borrowingList)
}