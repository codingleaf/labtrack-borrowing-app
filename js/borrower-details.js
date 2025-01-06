'use strict';

import { redirectTo } from './redirect.js';

document.addEventListener('DOMContentLoaded', ()=>{
    let btnBack = document.querySelector('#btn-back');
    btnBack.addEventListener('click', ()=>{
        redirectTo('../index.html');
    })

    let btnNext = document.querySelector('#btn-next');
    btnNext.addEventListener('click', ()=>{
        redirectTo('./equipment-selection.html')
    })
})