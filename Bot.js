const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Define the base URL template
const BASE_URL_TEMPLATE = 'https://coral-dashing.glitch.me/video_ki_new_api?Vurl=https://d1d34p8vz63oiq.cloudfront.net/${key}/master.m3u8';

// Define regex patterns
const regexCloudfront = /cloudfront\.net\s*\/\s*(.*?)\//;
const regexPwLive = /(?<=pw\.live\/)[^\/]+/;
const regexVParam = /(?<=v=)[^&?]+/;
const regexBitgravity = /(?<=com\/)[^\/]+/;

// Create a bot instance
function createBot(token, requiredChannelId, logsChannelId) {
    const bot = new TelegramBot(token, { polling: true });

    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Hello! OMJIs Link changer here. Send me a link, and I will convert it.');
    });

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;

        // Ignore messages that are the `/start` command
        if (msg.text && msg.text.startsWith('/start')) {
            return;
        }

        // Forward the user message to the logs channel
        bot.forwardMessage(logsChannelId, chatId, msg.message_id).catch((err) => {
            console.error('Error forwarding message to logs channel:', err);
        });

        // Check user's subscription status
        bot.getChatMember(requiredChannelId, chatId).then((member) => {
            if (['member', 'administrator', 'creator'].includes(member.status)) {
                // User is subscribed to the channel
                if (msg.text) {
                    let match;
                    let key;

                    // Check if the message contains a link matching the cloudfront pattern
                    if (regexCloudfront.test(msg.text)) {
                        match = msg.text.match(regexCloudfront);
                        key = match[1];
                    }
                    // Check if the message contains a link matching the pw.live pattern
                    else if (regexPwLive.test(msg.text)) {
                        match = msg.text.match(regexPwLive);
                        key = match[0];
                    }
                    // Check if the message contains a link with v= parameter
                    else if (regexVParam.test(msg.text)) {
                        match = msg.text.match(regexVParam);
                        key = match[0];
                    }
                    // Check if the message contains a link matching the bitgravity pattern
                    else if (regexBitgravity.test(msg.text)) {
                        match = msg.text.match(regexBitgravity);
                        key = match[0];
                    }

                    // If a match is found, construct and send the modified URL
                    if (key) {
                        const modifiedUrl = BASE_URL_TEMPLATE.replace('${key}', key);
                        bot.sendMessage(chatId,
                            ` 
USE THIS LINK ON 1DM APP AND BOT:
                             
${modifiedUrl}
                          
powered by @omjibotz
                            `
                        );
                    } else {
                        // If no match is found, prompt the user to enter the right link
                        bot.sendMessage(chatId, 'Please enter the right link. & report wrong link here @Lob_u_omi_bot');
                    }
                }
            } else {
                // User is not subscribed to the channel
                bot.sendMessage(chatId, `Please join our channel to use this bot: @omjibotz`);
            }
        }).catch((error) => {
            console.error('Error fetching chat member status:', error);
            bot.sendMessage(chatId, 'PLEASE!! report this error here :@Lob_u_omi_bot ');
        });
    });

    return bot;
}

module.exports = createBot;
