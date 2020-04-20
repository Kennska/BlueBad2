const Discord = require('discord.js');
const config = require('./config.json');
const bot = new Discord.Client({ disableEveryone: true });
const fs = require("fs")
bot.commands = new Discord.Collection();


//IMPORTANT: Remember to use nodemon index.js in cmd.exe to auto update!


fs.readdir("./commands", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    })
})

bot.categories = fs.readdirSync("./commands/");


//Puts the bot online
bot.on('ready', () => {
    console.log('This bot is online!');
    //Basicually makes it say it's doing something
    bot.user.setActivity("Arcane World", { type: "WATCHING" });
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefixes = JSON.parse(fs.readFileSync(`./prefixes.json`, `utf8`));

    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefixes: config.prefix
        };
    }

    let prefix = prefixes[message.guild.id].prefixes;


    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args)
})



bot.login(config.token)