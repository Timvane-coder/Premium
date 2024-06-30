const fs = require('fs');
const path = require('path');
require('../../Config'); // Load initial config

let commands = {};
let debounceTimeouts = {};
const debounceTime = 1000;
const configPath = path.resolve(__dirname, '../../Config.js');

function loadCommands(commandDir) {
  const commandWatcher = fs.watch(commandDir, { recursive: true }, (event, filename) => {
    if (filename) {
      const filePath = path.join(commandDir, filename);
      if (filename.endsWith('.js')) {
        handleFileChange(event, filePath);
      } else {
        console.log(`\x1b[36m[INFO] Ignored file change for non-JavaScript file: ${filePath}\x1b[0m`);
      }
    }
  });

  fs.watchFile(configPath, (curr, prev) => handleConfigChange(curr, prev, configPath));

  process.on('SIGINT', () => {
    commandWatcher.close();
    fs.unwatchFile(configPath);
    console.log('Watchers closed.');
    process.exit();
  });

  function handleFileChange(event, filePath) {
    clearTimeout(debounceTimeouts[filePath]);
    debounceTimeouts[filePath] = setTimeout(() => reloadCommand(filePath), debounceTime);
  }

  function handleConfigChange(curr, prev, configPath) {
    if (curr.mtime !== prev.mtime) {
      clearTimeout(debounceTimeouts[configPath]);
      debounceTimeouts[configPath] = setTimeout(() => reloadConfig(configPath), debounceTime);
    }
  }

  loadAllCommands(commandDir);
}

function loadAllCommands(commandDir) {
  const files = fs.readdirSync(commandDir);

  for (const file of files) {
    const filePath = path.join(commandDir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      loadAllCommands(filePath);
    } else if (file.endsWith('.js')) {
      reloadCommand(filePath);
    } else {
      console.log(`\x1b[36m[INFO] Ignored non-JavaScript file during initial load: ${filePath}\x1b[0m`);
    }
  }
}

function reloadCommand(filePath) {
  console.log(`\x1b[33m[HOT RELOAD] Detected change in ${filePath}\x1b[0m`);
  try {
    delete require.cache[require.resolve(filePath)];
    const command = require(filePath);
    if (command.usage) {
      commands[command.usage] = command;
      console.log(`\x1b[32mReloaded command: ${command.usage}\x1b[0m`);
    } else {
      console.log(`\x1b[31mSkipped: ${filePath} does not export 'usage'.\x1b[0m`);
    }
  } catch (error) {
    console.error(`\x1b[31mError loading command from ${filePath}:\x1b[0m`, error);
  }
}

function reloadConfig(configPath) {
  console.log(`\x1b[33m[HOT RELOAD] Detected change in ${configPath}\x1b[0m`);
  try {
    delete require.cache[require.resolve(configPath)];
    require(configPath);
    console.log(`\x1b[32mReloaded config: ${configPath}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31mError reloading config from ${configPath}:\x1b[0m`, error);
  }
}

module.exports = { commands, loadCommands };
