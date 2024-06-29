const fs = require('fs');
const path = require('path');

let commands = {};
require('../../Config'); // Load initial config
let debounceTimeouts = {};
const debounceTime = 1000;
const configPath = path.resolve(__dirname, '../../Config.js'); // Define configPath globally

function loadCommands(commandDir) {
  const files = fs.readdirSync(commandDir);

  for (const file of files) {
    const filePath = path.join(commandDir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      loadCommands(filePath);
    } else if (file.endsWith('.js')) {
      loadCommand(filePath);
    }
  }

  // Watch for changes in both command directory and Config.js
  const commandWatcher = fs.watch(commandDir, { recursive: true }, (event, filename) => handleFileChange(event, filename, commandDir));
  fs.watchFile(configPath, (curr, prev) => handleConfigChange(curr, prev, configPath)); // Watch config file

  function handleFileChange(event, filename, commandDir) {
    if (filename) {
      const filePath = path.join(commandDir, filename);

      if (debounceTimeouts[filePath]) {
        clearTimeout(debounceTimeouts[filePath]);
      }

      debounceTimeouts[filePath] = setTimeout(() => {
        console.log(`\x1b[33m[HOT RELOAD] Detected change in ${filePath}\x1b[0m`);
        try {
          delete require.cache[require.resolve(filePath)];
          loadCommand(filePath);
        } catch (error) {
          console.error(`\x1b[31mError loading command from ${filePath}:\x1b[0m`, error);
        }

        delete debounceTimeouts[filePath];
      }, debounceTime);
    }
  }

  function handleConfigChange(curr, prev, configPath) {
    if (curr.mtime !== prev.mtime) {
      if (debounceTimeouts[configPath]) {
        clearTimeout(debounceTimeouts[configPath]);
      }

      debounceTimeouts[configPath] = setTimeout(() => {
        console.log(`\x1b[33m[HOT RELOAD] Detected change in ${configPath}\x1b[0m`);
        try {
          delete require.cache[require.resolve(configPath)];
          require(configPath); // Reload config
          console.log(`\x1b[32mReloaded config: ${configPath}\x1b[0m`);
        } catch (error) {
          console.error(`\x1b[31mError reloading config from ${configPath}:\x1b[0m`, error);
        }

        delete debounceTimeouts[configPath];
      }, debounceTime);
    }
  }

  // Close watchers on process exit to prevent leaks
  process.on('SIGINT', () => {
    commandWatcher.close();
    fs.unwatchFile(configPath);
    console.log('Watchers closed.');
    process.exit();
  });
}

function loadCommand(filePath) {
  try {
    const command = require(filePath);
    commands[command.usage] = command;
    console.log(`\x1b[32mLoaded command: ${command.usage}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31mError loading command from ${filePath}:\x1b[0m`, error);
  }
}

module.exports = { commands, loadCommands };
