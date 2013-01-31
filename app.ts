///<reference path='node.d.ts'/>
///<reference path='bot.ts'/>
import fs = module('fs');
var bot:Bot = require('./bot');

var config = JSON.parse(<string>fs.readFileSync(__dirname + '/config.json', 'utf-8'));
bot.main(config);

