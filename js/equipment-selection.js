'use strict';

import { redirectTo } from './redirect.js';

document.addEventListener('DOMContentLoaded', ()=>{
    let btnBack = document.querySelector('#btn-back');
    btnBack.addEventListener('click', ()=>{
        redirectTo('./borrower-details.html');
    })
})