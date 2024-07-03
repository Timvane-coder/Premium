const fs = require('fs');
const path = require('path');

// Log file path
const logFilePath = path.join(__dirname, 'buddy.log');

// Utility function to format current timestamp
function getTimestamp() {
    return new Date().toISOString().replace('T', ' ').replace(/\..+/, '');
}

// Function to write logs to a file
function writeLogToFile(message) {
    const logMessage = `[${getTimestamp()}] ${message}\n`;
    fs.appendFileSync(logFilePath, logMessage, { encoding: 'utf8' });
}

// Function to log information
async function logCommand(message, ...args) {
    const chalk = (await import('chalk')).default;
    const formattedMessage = `[${getTimestamp()}] ${chalk.blue('ℹ️')} ${chalk.green(message)} ${args.length ? JSON.stringify(args) : ''}`;
    console.log(formattedMessage);
  //  writeLogToFile(formattedMessage);
}

// Function to log warnings
function logWarning(message, ...args) {
    const formattedMessage = `[${getTimestamp()}] ${chalk.yellow('⚠️')} ${chalk.yellow(message)} ${args.length ? JSON.stringify(args) : ''}`;
    console.warn(formattedMessage);
    writeLogToFile(formattedMessage);
}

// Function to log errors
async function logError(message, ...args) {
    const chalk = (await import('chalk')).default;
    const formattedMessage = `[${getTimestamp()}] ${chalk.red('❌')} ${chalk.red(message)} ${args.length ? JSON.stringify(args) : ''}`;
    console.error(formattedMessage);
  //  writeLogToFile(formattedMessage);
}

// Function to log success messages
function logSuccess(message, ...args) {
    const formattedMessage = `[${getTimestamp()}] ${chalk.green('✅')} ${chalk.green(message)} ${args.length ? JSON.stringify(args) : ''}`;
    console.log(formattedMessage);
    writeLogToFile(formattedMessage);
}

// Override console.log to use the log functions
const originalConsoleLog = console.log;
console.log = (...args) => logCommand(...args);

const originalConsoleWarn = console.warn;
console.warn = (...args) => logWarning(...args);

const originalConsoleError = console.error;
console.error = (...args) => logError(...args);

const originalConsoleInfo = console.info;
console.info = (...args) => logSuccess(...args);

// Exporting logger functions
module.exports = {
    logCommand,
    logWarning,
    logError,
    logSuccess,
};
