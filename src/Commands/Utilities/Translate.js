const translate = require("@iamtraction/google-translate");

module.exports = {
    usage: ["translate", "tr"],
    desc: "Translate text to a specified language.",
    commandType: "Utilities",
    isGroupOnly: false,
    isAdminOnly: false,
    isPrivateOnly: false,
    emoji: "🌐",

    async execute(sock, m, args) {
        const { BOT_NAME, DEFAULT_TRANSLATION_LANG } = settings;

        let textToTranslate = args.join(" ").trim();
        const quotedText = 'en' + await buddy.getQuotedMessage(m);
        textToTranslate = quotedText || textToTranslate;

        if (textToTranslate.length === 0) {
            await buddy.reply(m, `
                Need help translating? 💬
                Just use this format:
                
                \`\`\`
                ${settings.PREFIX[0]}${this.usage[0]} <language code> <text>
                ${settings.PREFIX[0]}${this.usage[1]} <language code> <text>
                \`\`\`
                Example:
                *${settings.PREFIX[0]}${this.usage[0]} es Hello, how are you?*
                
                Or, if you want to use the default language (*${DEFAULT_TRANSLATION_LANG}*):
                
                \`\`\`
                ${settings.PREFIX[0]}${this.usage[0]} Hello, how are you?
                \`\`\`
                
                You can also reply to a message to translate it to the default language.
                
                I can translate to many languages! To see a list of supported language codes, visit: [https://cloud.google.com/translate/docs/languages](https://cloud.google.com/translate/docs/languages)
            `);
            return;
        }

        const parts = textToTranslate.split(' ');
        const firstToken = parts[0].toLowerCase();
        const isLanguageCode = firstToken.match(/^[a-z]{2}$/);
        const targetLang = isLanguageCode ? firstToken : DEFAULT_TRANSLATION_LANG;
        const text = isLanguageCode ? parts.slice(1).join(' ') : textToTranslate;

        try {
            const translation = await translate(text, { to: targetLang });

            const resultMessage = `
                ╭┉┉「 🌀 ${BOT_NAME} Translation 🌀 」┉┉╮
                
                ✨ *Original:*
                  ${text}
                
                ✨ *Translation (${targetLang.toUpperCase()}):*
                  ${translation.text}
                
                ╰┉┉┉┉┉┉[ 💗 ]┉┉┉┉┉┉╯
            `;
            await buddy.reply(m, resultMessage);

        } catch (error) {
            console.error("Error in translation:", error);
            if (error.code === 400 && error.message.includes("The language")) {
                await buddy.reply(m, `Translation failed. The language '${targetLang}' is not supported.`);
            } else {
                await buddy.reply(m, "Translation failed. Please try again later.");
            }
        }
    }
};
