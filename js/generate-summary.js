'use strict';

export function generateSummary(borrowingList) {
    // Borrower Details
    const borrowerID = document.querySelector('#borrower-id').value;
    const firstName = document.querySelector('#first-name').value;
    const middleInitial = document.querySelector('#middle-initial').value;
    const lastName = document.querySelector('#last-name').value;
    const email = document.querySelector('#email').value;
    const contactNumber = document.querySelector('#contact-number').value;
    const department = document.querySelector('#department').value;
    const designationDropdown = document.querySelector('#designation');
    const designation = designationDropdown.options[designationDropdown.selectedIndex].text;
    const designationID = designationDropdown.value;
    const courseDetails = document.querySelector('#course-details').value;
    const subject = document.querySelector('#subject').value;

    // Update Summary Fields
    document.querySelector('#summary-id').textContent = borrowerID;
    document.querySelector('#summary-fn').textContent = firstName;
    document.querySelector('#summary-mi').textContent = middleInitial;
    document.querySelector('#summary-ln').textContent = lastName;
    document.querySelector('#summary-email').textContent = email;
    document.querySelector('#summary-contact').textContent = contactNumber;
    document.querySelector('#summary-department').textContent = department;
    document.querySelector('#summary-designation').textContent = designation;
    document.querySelector('#summary-course').textContent = courseDetails;
    document.querySelector('#summary-subject').textContent = subject;
    // (Optional) If you want to show Borrower ID somewhere, you can also do:
    // document.querySelector('#summary-borrower-id').textContent = borrowerID;

    // Update Borrowing List Quantities
    const spinboxes = [...document.querySelectorAll('.spinbox > input')];
    spinboxes.shift(); // remove first element (template row)
    spinboxes.forEach((spinbox, index) => {
        borrowingList[index]['quantity'] = spinbox.value;
    });

    // Create Equipment List in Summary
    const summaryBl = document.querySelector('#equipment-list');
    removeAllChildNodes(summaryBl);
    borrowingList.forEach(equipment => {
        let summaryText = `${equipment['quantity']} x ${equipment['name']}`;
        summaryText += equipment['specification'] ? ` (${equipment['specification']})` : '';
        summaryText += equipment['description'] ? `, ${equipment['description']}` : '';

        const summaryEquipment = document.createElement('li');
        summaryEquipment.textContent = summaryText;
        summaryBl.appendChild(summaryEquipment);
    });

    // Generate UUID
    const borrowingID = generateUUID();

    // Create Final Summary Object
    const summary = {
        "id": borrowingID,
        "bid": borrowerID,
        "fn": firstName,
        "mi": middleInitial,
        "ln": lastName,
        "em": email,
        "cn": contactNumber,
        "dept": department,
        "des": designationID,
        "subj": subject,
        "bl": borrowingList.map(equipment => `${equipment.id}:${equipment.quantity}`)
    };

    // Show/Hide Course Details depending on Designation
    const courseDetailsElement = document.querySelector('#summary-course').closest('h3');
    const idSummaryLabel = document.querySelector('#summary-id').previousElementSibling;
    if (parseInt(designationID) === 1) {
        summary['cd'] = courseDetails;
        idSummaryLabel.textContent = 'Student ID: ';
        courseDetailsElement.classList.remove('hidden');
    } else if (parseInt(designationID) === 2) {
        idSummaryLabel.textContent = 'Faculty ID: ';
        courseDetailsElement.classList.add('hidden');
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
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
