'use strict';

export function generateQR(data, appIconURL) {
    const jsonString = JSON.stringify(data);
    console.log(jsonString);

    const qrCode = document.querySelector('#qr-code');

    // Clear previous QR code
    qrCode.innerHTML = '';

    // Generate the QR code and append it to the container
    QRCode.toCanvas(jsonString, { width: 500 }, function (err, canvas) {
        if (err) {
            console.error('Error generating QR code:', err);
        } else {
            const ctx = canvas.getContext('2d');
            const iconSize = canvas.width * 0.15; // Icon is 20% of the QR code size
            const iconX = (canvas.width - iconSize) / 2; // Center horizontally
            const iconY = (canvas.height - iconSize) / 2; // Center vertically

            // Load the app icon image
            const appIcon = new Image();
            appIcon.src = appIconURL;
            appIcon.onload = function () {
                // Draw the app icon in the center of the QR code
                ctx.drawImage(appIcon, iconX, iconY, iconSize, iconSize);

                // Convert the updated canvas to an image
                const dataURL = canvas.toDataURL('image/png'); // Converts to PNG format
                const img = document.createElement('img');
                img.src = dataURL;
                img.alt = 'qr code';

                // Add a download link
                const downloadLink = document.querySelector('#link-download-qr');
                downloadLink.href = dataURL;
                downloadLink.download = 'labtrack-qr-code.png'; // Default file name

                // Append the image and download link to the container
                qrCode.appendChild(img);

                // Remove the canvas
                canvas.remove();
            };
        }
    });
}
