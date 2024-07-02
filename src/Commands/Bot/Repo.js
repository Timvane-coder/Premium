const emojis = {
    info: '✨',           // Sparkling star emoji 
    repo: '📘',           // Blue book emoji
    star: '🌟',           // Glowing star emoji
    fork: '🔱',           // Trident emoji (symbolizing forks and power)
    contributors: '🤝',   // Handshake emoji 
    error: '🚨'           // Rotating light emoji
};

const fetch = require('node-fetch'); 

module.exports = {
    usage: ["repo"],
    desc: "Displays information about the bot's GitHub repository.",
    commandType: "Bot",
    isGroupOnly: false,
    isAdminOnly: false,
    isPrivateOnly: false,
    emoji: emojis.repo,

    async execute(sock, m) {
        try {
            const repoOwner = "hacxk"; 
            const repoName = "Buddy-MD";  
            const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
            const contributorsUrl = `${apiUrl}/contributors`;

            const [repoResponse, contributorsResponse] = await Promise.all([
                fetch(apiUrl),
                fetch(contributorsUrl)
            ]);

            const repoData = await repoResponse.json();
            const contributorsData = await contributorsResponse.json();

            const topContributors = contributorsData
                .slice(0, 3) // Show top 3 contributors
                .map(c => `[${c.login}](${c.html_url})`).join(", ");

            const repoInfoMessage = `
    ╔═══❖ *𝐁𝐮𝐝𝐝𝐲 𝐌𝐃 𝐑𝐞𝐩𝐨𝐬𝐢𝐭𝐨𝐫𝐲* ❖═══╗
**📘 Name:** [${repoData.name}](${repoData.html_url})
**✨ Description:** ${repoData.description || "No description available."}
**🌟 Stars:** ${repoData.stargazers_count}
**🔱 Forks:** ${repoData.forks_count}

**🤝 Top Contributors:** ${topContributors || "None yet"}

**✨ _Made with 💖 by_ ${repoData.owner.login}**

`;

            await buddy.reply(m, repoInfoMessage);
        } catch (error) {
            await buddy.react(m, emojis.error);
            await buddy.reply(m, "🚨 An error occurred while fetching repository information.");
            console.error("Error in 'repo' command:", error); 
        }
    }
};