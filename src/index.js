const Discord = require('discord.js');
const Dotnv = require('dotenv');
const fs = require('fs');
const path = require('path');

Dotnv.config();

const Bot = new Discord.Client();
Bot.commands = new Discord.Collection();
Bot.queues = new Map();

const commandFiles = fs.readdirSync(path.join(__dirname,"/commands")).filter((filename) => filename.endsWith(".js"));

for(var filename of commandFiles) {
    const command = require(`./commands/${filename}`);
    Bot.commands.set(command.name,command);
}

Bot.login(process.env.TOKEN);

Bot.on("ready", function() {
    console.log(`Robô ${Bot.user.username} está pronto para uso!`);
})

Bot.on("message", (msg) => {
    if(!msg.content.startsWith(process.env.PREFIX) || msg.author.Bot) return;

    const args = msg.content.slice(process.env.PREFIX.length).split(" ");
    const command = args.shift();

    try {
    Bot.commands.get(command).execute(Bot,msg,args);
    } catch(e) {
        return msg.reply("Ops!");
    }

})