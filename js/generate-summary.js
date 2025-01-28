'use strict';

export function generateSummary(borrowingList) {
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

    document.querySelector('#summary-fn').textContent = firstName;
    document.querySelector('#summary-ln').textContent = lastName;
    document.querySelector('#summary-email').textContent = email;
    document.querySelector('#summary-contact').textContent = contactNumber;

    const summaryBl = document.querySelector('#equipment-list');
    removeAllChildNodes(summaryBl);
    borrowingList.forEach(equipment => {
        let summaryText = `${equipment['quantity']} x ${equipment['name']}`;
        summaryText += equipment['specification'] ? ` (${equipment['specification']})` : '';
        summaryText += equipment['description'] ? `, ${equipment['description']}` : '';

        const summaryEquipment = document.createElement('li');
        summaryEquipment.textContent = summaryText;
        summaryBl.appendChild(summaryEquipment);
    })

    // generate UUID
    const borrowingID = generateUUID();

    const summary = {
        "borrowingID": borrowingID,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "contactNumber": contactNumber,
        "borrowingList": borrowingList,
    }
    
    console.log(summary);
    return summary;
}

function generateUUID() {
    const uuid = crypto.randomUUID();
    const timestamp = Date.now();
    return `${uuid}-${timestamp}`;
}

function removeAllChildNodes(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}