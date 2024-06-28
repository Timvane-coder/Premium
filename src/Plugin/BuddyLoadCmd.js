const fs = require('fs');
const path = require('path');

let commands = {};
let debounceTimeout = null;
const debounceTime = 1000; // Debounce time in milliseconds (adjust as needed)

function loadCommands(commandDir) {
    const files = fs.readdirSync(commandDir);

    for (const file of files) {
        const filePath = path.join(commandDir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            loadCommands(filePath); // Recursively load from subdirectories
        } else if (file.endsWith('.js')) {
            loadCommand(filePath);
        }
    }

    // Watch for changes in the command directory
    fs.watch(commandDir, { recursive: true }, (event, filename) => {
        if (filename && filename.endsWith('.js')) {
            const filePath = path.join(commandDir, filename);
            console.log(`\x1b[33m[HOT RELOAD] Detected change in ${filePath}\x1b[0m`); // Yellow color

            // Clear the require cache for the changed file
            delete require.cache[require.resolve(filePath)];

            // Debounce the reload or load
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            debounceTimeout = setTimeout(() => {
                loadCommand(filePath);
                debounceTimeout = null;
            }, debounceTime);
        }
    });
}

function loadCommand(filePath) {
    try {
        const command = require(filePath);
        commands[command.usage] = command;
        console.log(`\x1b[32mLoaded command: ${command.usage}\x1b[0m`); // Green color
    } catch (error) {
        console.error(`\x1b[31mError loading command from ${filePath}:\x1b[0m`, error); // Red color
    }
}

module.exports = { commands, loadCommands };
