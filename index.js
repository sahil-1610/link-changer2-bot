const express = require("express");
const dotenv = require("dotenv");
const createBot = require("./Bot");

// Load environment variables
dotenv.config();

const app = express();

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running ...",
    });
});

// Remove app.listen and instead export the app
module.exports = app;

// Bot setup
const token = process.env.TOKEN;
const requiredChannelId = process.env.REQUIRED_CHANNEL_ID;
const logsChannelId = process.env.LOGS_CHANNEL_ID;

createBot(token, requiredChannelId, logsChannelId);
