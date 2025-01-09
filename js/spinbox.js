'use strict';

export class Spinbox {
    constructor(element) {
        this.spinbox = element;
        this.input = this.spinbox.querySelector('.spinbox-input');
        this.incrementButton = this.spinbox.querySelector('.spinbox-increment');
        this.decrementButton = this.spinbox.querySelector('.spinbox-decrement');

        this.init();
    }
  
    init() {
        this.incrementButton.addEventListener('click', () => this.changeValue(1));
        this.decrementButton.addEventListener('click', () => this.changeValue(-1));
 
        let intervalId;

        // For holding the button for rapid increment
        this.incrementButton.addEventListener('mousedown', () => {
            intervalId = setInterval(() => {
                this.changeValue(1);  // Increase value by 1
            }, 100);  // Adjust the speed (in milliseconds)
        });

        // For holding the button for rapid decrement
        this.decrementButton.addEventListener('mousedown', () => {
            intervalId = setInterval(() => {
                this.changeValue(-1);  // Decrease value by 1
            }, 100);  // Adjust the speed (in milliseconds)
        });

        // Stop rapid change when the button is released
        document.addEventListener('mouseup', () => {
            clearInterval(intervalId);
        });

        // Stop rapid change if the mouse leaves the button
        this.incrementButton.addEventListener('mouseleave', () => {
            clearInterval(intervalId);
        });
        this.decrementButton.addEventListener('mouseleave', () => {
            clearInterval(intervalId);
        });

        this.input.addEventListener('input', () => this.validateValue());

        this.input.addEventListener('blur', () => {
            if (this.input.value === '') {
                this.input.value = this.input.min;
            }
        })
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