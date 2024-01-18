const fs = require('fs');
const path = require('path');

// Path to the file
const filePath = path.join(__dirname, 'currentOrderNumber.txt');



// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }    

    let currentOrderNumber = parseInt(data, 10) + 10;

    // Log the new order number
    console.log('New order number:', currentOrderNumber);

    // Write the new order number back to the file
    fs.writeFile(filePath, currentOrderNumber.toString(), 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing file:', writeErr);
            return;
        }

        console.log(`Updated order number to ${currentOrderNumber}`);
    });
});

