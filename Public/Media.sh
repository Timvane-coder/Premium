
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Function to get the direct download link from Mediafire page
async function getDirectDownloadLink(mediafireLink) {
    try {
        // Fetch the Mediafire page HTML
        const response = await axios.get(mediafireLink);
        const html = response.data;

        // Parse the HTML using cheerio
        const $ = cheerio.load(html);

        // Mediafire direct download link is within a 'download_link' div, parse it
        const downloadLink = $('a[aria-label="Download file"]').attr('href');

        if (!downloadLink) {
            throw new Error('Failed to extract download link.');
        }

        return downloadLink;
    } catch (error) {
        console.error('Error getting direct link:', error);
        throw error;
    }
}

// Function to download the file from the direct link
async function downloadFile(url, filePath) {
    try {
        const writer = fs.createWriteStream(filePath);

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        // Pipe the response data (file) to a local file
        response.data.pipe(writer);

        // Return a promise to know when the download is finished
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
}

// Main function to handle the process
async function mediafireDownloader(mediafireLink, destinationFolder) {
    try {
        // Get the direct download link
        const directLink = await getDirectDownloadLink(mediafireLink);

        // Define the file path where the file will be saved
        const fileName = path.basename(directLink); // Extract file name from URL
        const filePath = path.join(destinationFolder, fileName);

        // Download the file from the direct link
        await downloadFile(directLink, filePath);

        console.log(`File downloaded successfully: ${filePath}`);
    } catch (error) {
        console.error('Error in Mediafire downloader:', error);
    }
}

// Example usage
const mediafireLink = 'https://www.mediafire.com/file/your_file_link'; // Replace with actual Mediafire link
const destinationFolder = './downloads'; // Make sure this folder exists

mediafireDownloader(mediafireLink, destinationFolder);
