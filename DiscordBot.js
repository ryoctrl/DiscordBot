const Discord = require('discord.js');

class DiscordBot {
    constructor(token, prefix, commands, debug) {
        this.prefix = prefix;
        this.commands = commands;
        this.debug = debug || false;
        this.bindMethods();
        this.init(token);
    }

    init(token) {
        const client = new Discord.Client();
        client.on('ready', this.ready.bind(this));
        client.on('message', this.message.bind(this));
        client.login(token);
        this.client = client;
    }

    bindMethods() {
        this.ready.bind(this);
        this.message.bind(this);
        this._invokeCommand.bind(this);
        this._checkPrefix.bind(this);
    }

    ready() {
        const client = this.client;
        console.log(`Logged in as ${client.user.tag}!`);
    }

    _checkPrefix (messageText) {
        const prefix = this.prefix;
        return messageText.startsWith(prefix);
    }

    _invokeCommand(message, command, args) {
        const commandFunction = this.commands[command];
        if(!commandFunction || typeof(commandFunction) !== 'function') return;
        commandFunction(message, args);
    }

    message(message) {
        if(message.author.bot) return;
        if(this.debug && message.channel.name !== 'test') return;

        const messageText = message.content;
        if(!this._checkPrefix(messageText)) return;

        let inputCommands = messageText.split(' ');
        if(inputCommands.length === 1) return;

        this._invokeCommand(message, inputCommands[1], inputCommands.slice(2));
    }
}

module.exports = DiscordBot
