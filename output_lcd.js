// Import the module
const LCD = require('raspberrypi-liquid-crystal');

// Instantiate the LCD object on bus 1 address 27 with 16 chars width and 2 lines
const lcd = new LCD(1, 0x27, 16, 2);
// Init the lcd (must be done before calling any other methods)
lcd.beginSync();
// Clear any previously displayed content
lcd.clearSync();
// Display text multiline
lcd.printLineSync(0, 'Hello, world!');
lcd.printLineSync(1, 'I output LCD.');
