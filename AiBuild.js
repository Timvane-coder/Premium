const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs').promises;
const path = require('path');
const { performance } = require('perf_hooks');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const os = require('os');
const { execSync } = require('child_process');
const crypto = require('crypto');
const chokidar = require('chokidar');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const API_KEY = process.env.API_KEY || 'AIzaSyB0i2lIksuFBjgzW21yoHL4OZSsGrLvVvw';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const PROJECT_FOLDER = './';
const SRC_FOLDER = path.join('./src');
const SCRIPT_PATH = __filename;
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;
const MAX_WORKERS = os.cpus().length;
const AUTO_UPGRADE_INTERVAL = 3; // Auto-upgrade every 3 iterations
const AUTO_DEPLOY_INTERVAL = 5; // Auto-deploy every 5 iterations
const PERFORMANCE_THRESHOLD = 0.9; // 90% performance improvement required for script upgrade

const logger = {
    info: (message) => console.log(`[INFO] ${message}`),
    success: (message) => console.log(`[SUCCESS] ${message}`),
    error: (message) => console.error(`[ERROR] ${message}`),
    warning: (message) => console.warn(`[WARNING] ${message}`)
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retry = async (fn, maxRetries, initialDelay) => {
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            const delay = Math.min(initialDelay * Math.pow(2, attempt), MAX_RETRY_DELAY);
            logger.warning(`Retry attempt ${attempt + 1}/${maxRetries}. Waiting ${delay}ms before next attempt. ${error}`);
            await sleep(delay);
        }
    }
    throw lastError;
};

const generateInitialPrompt = () => `
You are an AI Whatsapp bot developer tasked with creating a modern, responsive, and functional bot. Create the initial structure for a bot with the following requirements:



Create the necessary file structure inside the 'src' folder, including but not limited to:

Provide the content for each file using the following format:

\`\`\`create_file:./website_project/src/path/to/file.ext
// File content here
\`\`\`

Ensure all files are properly linked and work together cohesively. Be creative and implement modern design patterns and functionality. Include a package.json file with necessary dependencies and scripts.
`;

const generateEnhancementPrompt = (fileContents, iteration) => `
You are an AI with exceptional web development skills. Your task is to enhance the following website files to create an even more advanced, modern, responsive, and functional website. This is iteration ${iteration}, so make significant improvements over the previous version. Focus on:

1. Improving the overall architecture and code organization
2. Enhancing component reusability and modularity
3. Optimizing performance and load times (implement code splitting, lazy loading, and memoization)
4. Implementing advanced features and interactivity (e.g., animations, infinite scrolling, virtual lists)
5. Enhancing the UI/UX design (implement dark mode, skeleton loading, and micro-interactions)
6. Improving accessibility and SEO (add ARIA attributes, implement structured data)
7. Adding more comprehensive unit, integration, and end-to-end tests
8. Implementing proper error handling, logging, and monitoring (integrate with services like Sentry)
9. Enhancing the build process and deployment pipeline
10. Implementing advanced state management techniques (e.g., using Redux Toolkit or Recoil)
11. Enhancing PWA (Progressive Web App) capabilities
12. Implementing advanced caching strategies and offline support
13. Adding real-time features using WebSockets or Server-Sent Events
14. Implementing advanced data visualization using libraries like D3.js
15. Enhancing security measures (e.g., implementing CSP, adding rate limiting)

Here are the current file contents:

${fileContents}

Provide the enhanced content for each file, or create new files as needed, using this format:

\`\`\`create_file:./website_project/src/path/to/file.ext
// Enhanced or new file content here
\`\`\`

You can modify existing files, create new ones, or delete unnecessary ones. Ensure all files are properly linked and work together cohesively. Be creative and implement cutting-edge web development techniques.
`;

const generateScriptUpgradePrompt = (currentScript) => `
You are an AI tasked with improving a Node.js script that generates and enhances websites using AI. Your goal is to make the script more efficient, robust, and feature-rich. Here's the current script:

${currentScript}

Enhance this script by focusing on the following areas:

1. Improve error handling and recovery mechanisms
2. Enhance the multi-threading capabilities for better performance
3. Implement more advanced caching strategies for API calls and file operations
4. Add new features that could improve the website generation process
5. Optimize the code for better readability and maintainability
6. Implement more advanced logging and monitoring capabilities
7. Enhance the AI prompts to generate even better website code
8. Improve the build and test processes
9. Add new automation features to reduce manual intervention
10. Implement version control integration (e.g., Git) for generated websites

Provide the entire enhanced script. Ensure that all functionality from the original script is preserved unless explicitly improved or replaced. The script should be a complete, runnable Node.js program.
`;

const processAIResponse = async (response) => {
    const matches = response.matchAll(/```create_file:(.+?)\n([\s\S]+?)```/g);
    const fileOperations = [];

    for (const match of matches) {
        const [, filePath, fileContent] = match;
        const fullPath = path.join(process.cwd(), filePath);
        fileOperations.push(
            fs.mkdir(path.dirname(fullPath), { recursive: true })
                .then(() => fs.writeFile(fullPath, fileContent.trim()))
                .then(() => logger.success(`Created/Updated file: ${fullPath}`))
        );
    }

    await Promise.all(fileOperations);
};

const getFileContents = async (folder) => {
    const files = await fs.readdir(folder, { recursive: true });
    let contents = '';
    const readPromises = files.map(async (file) => {
        const filePath = path.join(folder, file);
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
            const content = await fs.readFile(filePath, 'utf-8');
            return `File: ${file}\n\n${content}\n\n`;
        }
        return '';
    });
    const fileContents = await Promise.all(readPromises);
    return fileContents.join('');
};

const processWebsite = async (iteration) => {
    logger.info(`Processing website (Iteration ${iteration})...`);
    try {
        let prompt;
        if (iteration === 1) {
            prompt = generateInitialPrompt();
        } else {
            const fileContents = await getFileContents(SRC_FOLDER);
            prompt = generateEnhancementPrompt(fileContents, iteration);
        }

        const result = await retry(async () => {
            const response = await model.generateContent(prompt);
            return response.response.text();
        }, MAX_RETRIES, INITIAL_RETRY_DELAY);

        await processAIResponse(result);
        logger.success(`Enhanced website (Iteration ${iteration}) saved to ${SRC_FOLDER}`);
        return true;
    } catch (error) {
        logger.error(`Error processing website (Iteration ${iteration}): ${error.message}`);
        return false;
    }
};

const upgradeScript = async () => {
    logger.info('Upgrading script...');
    try {
        const currentScript = await fs.readFile(SCRIPT_PATH, 'utf-8');
        const prompt = generateScriptUpgradePrompt(currentScript);

        const result = await retry(async () => {
            const response = await model.generateContent(prompt);
            if (response.response.text) {
                console.log('Response Error')
            }
            return response.response.text;
        }, MAX_RETRIES, INITIAL_RETRY_DELAY);

        const updatedScript = result.replace(/```javascript\n|\n```/g, '');
        const tempScriptPath = `${SCRIPT_PATH}.new`;
        await fs.writeFile(tempScriptPath, updatedScript);

        // Validate the new script
        try {
            require(tempScriptPath);
            await fs.rename(tempScriptPath, SCRIPT_PATH);
            logger.success('Script upgraded successfully');
            process.exit(0); // Restart the process to use the new script
        } catch (error) {
            logger.error(`Error validating new script: ${error.message}`);
            await fs.unlink(tempScriptPath);
        }
    } catch (error) {
        logger.error(`Error upgrading script: ${error.message}`);
    }
};

const runLinters = async () => {
    try {
        logger.info('Running linters...');
        await exec('npx eslint . --fix', { cwd: PROJECT_FOLDER });
        await exec('npx prettier --write .', { cwd: PROJECT_FOLDER });
        logger.success('Linting completed successfully');
    } catch (error) {
        logger.error(`Error running linters: ${error.message}`);
    }
};

const runTests = async () => {
    try {
        logger.info('Running tests...');
        await exec('npm test', { cwd: PROJECT_FOLDER });
        logger.success('Tests completed successfully');
    } catch (error) {
        logger.error(`Error running tests: ${error.message}`);
    }
};

const buildProject = async () => {
    try {
        logger.info('Building project...');
        await exec('npm run build', { cwd: PROJECT_FOLDER });
        logger.success('Build completed successfully');
    } catch (error) {
        logger.error(`Error building project: ${error.message}`);
    }
};

const createGitRepo = async () => {
    try {
        logger.info('Initializing Git repository...');
        await exec('git init', { cwd: PROJECT_FOLDER });
        await exec('git add .', { cwd: PROJECT_FOLDER });
        await exec('git commit -m "Initial commit"', { cwd: PROJECT_FOLDER });
        logger.success('Git repository initialized');
    } catch (error) {
        logger.error(`Error initializing Git repository: ${error.message}`);
    }
};

const commitChanges = async (iteration) => {
    try {
        logger.info('Committing changes...');
        await exec('git add .', { cwd: PROJECT_FOLDER });
        await exec(`git commit -m "Update from iteration ${iteration}"`, { cwd: PROJECT_FOLDER });
        logger.success('Changes committed');
    } catch (error) {
        logger.error(`Error committing changes: ${error.message}`);
    }
};

const deployWebsite = async () => {
    try {
        logger.info('Deploying website...');
        // Add your deployment logic here (e.g., deploying to Vercel, Netlify, or your preferred hosting platform)
        // Example: await exec('vercel --prod', { cwd: PROJECT_FOLDER });
        logger.success('Website deployed successfully');
    } catch (error) {
        logger.error(`Error deploying website: ${error.message}`);
    }
};

const watchForChanges = () => {
    const watcher = chokidar.watch(PROJECT_FOLDER, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
    });

    watcher
        .on('add', path => logger.info(`File ${path} has been added`))
        .on('change', path => logger.info(`File ${path} has been changed`))
        .on('unlink', path => logger.info(`File ${path} has been removed`));
};

const processWebsiteIteratively = async () => {
    const startTime = performance.now();
    let iteration = 1;

    try {
        await fs.mkdir(SRC_FOLDER, { recursive: true });
        await createGitRepo();

        while (true) {
            const success = await processWebsite(iteration);
            if (!success) break;

            await runLinters();
            await runTests();
            await buildProject();
            await commitChanges(iteration);

            if (iteration % AUTO_UPGRADE_INTERVAL === 0) {
                await upgradeScript();
            }

            if (iteration % AUTO_DEPLOY_INTERVAL === 0) {
                await deployWebsite();
            }

            iteration++;
        }

    } catch (error) {
        logger.error(`Error processing website: ${error.message}`);
    } finally {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        logger.success(`Processing completed in ${duration.toFixed(2)} seconds`);
    }
};

if (isMainThread) {
    processWebsiteIteratively().catch(error => logger.error(`Unhandled error: ${error.message}`));
    watchForChanges();
} else {
    // Worker thread code
    parentPort.on('message', async (message) => {
        if (message.type === 'process') {
            const result = await processWebsite(message.iteration);
            parentPort.postMessage({ type: 'result', success: result });
        }
    });
}

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});