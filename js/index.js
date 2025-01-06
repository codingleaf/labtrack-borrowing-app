'use strict';

import { redirectTo } from './redirect.js';

document.addEventListener('DOMContentLoaded', ()=>{
    let btnStartBorrowing = document.querySelector('#btn-start-borrowing');
    btnStartBorrowing.addEventListener('click', ()=>{
        redirectTo('pages/borrower-details.html');
    })
})