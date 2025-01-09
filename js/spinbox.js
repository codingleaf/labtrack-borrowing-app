'use strict';

export class Spinbox {
    constructor(element) {
        this.spinbox = element;
        this.input = this.spinbox.querySelector('.spinbox-input');
        this.incrementButton = this.spinbox.querySelector('.spinbox-increment');
        this.decrementButton = this.spinbox.querySelector('.spinbox-decrement');
        this.intervalID;
        this.init();
    }
  
    init() {
        this.incrementButton.addEventListener('click', () => this.changeValue(1));
        this.decrementButton.addEventListener('click', () => this.changeValue(-1));

        // Add event listeners for both mouse and touch events
        this.incrementButton.addEventListener('mousedown', () => this.startChange(1));
        this.incrementButton.addEventListener('touchstart', () => this.startChange(1));
        this.decrementButton.addEventListener('mousedown', () => this.startChange(-1));
        this.decrementButton.addEventListener('touchstart', () => this.startChange(-1));

        // Stop the action on mouseup, touchend, or when the user moves away
        this.incrementButton.addEventListener('mouseup', () => this.stopChange());
        this.incrementButton.addEventListener('mouseleave', () => this.stopChange());
        this.incrementButton.addEventListener('touchend', () => this.stopChange());
        this.decrementButton.addEventListener('mouseup', () => this.stopChange());
        this.decrementButton.addEventListener('mouseleave', () => this.stopChange());
        this.decrementButton.addEventListener('touchend', () => this.stopChange());

        this.input.addEventListener('input', () => this.validateValue());

        this.input.addEventListener('blur', () => {
            if (this.input.value === '') {
                this.input.value = this.input.min;
            }
        })
    }

    stopChange() {
        clearInterval(this.intervalID);
    }

    // Start the increment/decrement action
    startChange(delta) {
        this.intervalID = setInterval(() => {
            this.changeValue(delta);  // Increase value by 1
        }, 100);  // Adjust the speed (in milliseconds)
    }

    changeValue(delta) {
        const currentValue = parseInt(this.input.value, 10) || 0;
        const minValue = parseInt(this.input.min, 10) || -Infinity;
        const maxValue = parseInt(this.input.max, 10) || Infinity;

        let newValue = currentValue + delta;
        newValue = Math.max(minValue, Math.min(maxValue, newValue));
        this.input.value = newValue;
    }
  
    validateValue() {
        if (this.input.value === '') {
            return;
        }

        // Keep only valid numeric characters (integer only)
        const currentValue = this.input.value.replace(/[^0-9]/g, '');

        // Update the input value with the filtered value (which removes invalid characters)
        this.input.value = currentValue;
    
        // Parse the value to an integer
        const parsedValue = parseInt(currentValue, 10) || 0;
    
        // Get the min and max values
        const minValue = parseInt(this.input.min, 10) || -Infinity;
        const maxValue = parseInt(this.input.max, 10) || Infinity;
    
        // Ensure the value is within the valid range
        const validValue = Math.max(minValue, Math.min(maxValue, parsedValue));
    
        // If the parsed value has changed (i.e., it was valid), update the input value
        if (parsedValue !== validValue) {
            this.input.value = validValue;
        }
    }
}