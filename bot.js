const Discord = require('discord.js');
const { Client, RichEmbed } = require('discord.js');
const client = new Discord.Client();
let games = []; // list of alls gamers+game+channel
let first = true; // first message
let isOpenned = false; // is games open ?

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

/**
 * Function add message for !join <id>
 */

function addPlayer(codeParty, msg) {
     
        games.push([
            codeParty,
            msg.author,
            msg.channel
        ]);

        msg.delete()
        .then(message => console.log(`Deleted message from ${message.author.username}`))
        .catch(console.error);

}

/**
 * Function to close a game trigger by timeout
 * @param Channel channel 
 */
function closeGame(channel) {

    isOpenned = false;
    first = true;

    const embed = new RichEmbed()
            .setTitle('Current servers:')
            .setColor(0x222aba)
            .setDescription(`${games}`);

    channel.send(embed);
    games = []; 

}

/**
 * catch event for a message beginning with "!"
 */
client.on('message', msg => {

    if (msg.content.indexOf("!") !== 0) return;
    const args = msg.content.slice("!".length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (first && command == "join") {
        if (args !== "" && args.length == 1) {

            first = false;
            isOpenned = true;
    
            addPlayer(args, msg);

            setTimeout( function() {
                closeGame(msg.channel);
            }, 9000 );

        console.log("[DEBUG] first : " + first + ", isOpenned : " + isOpenned, "games : " + games);

        }
    }

    //if(isOpenned)     
});



client.login('NTA0MjY5OTI3Mjk3OTc0Mjgy.DrDDHg._dc9O-a2p5m1-oFW48ZAkJCDJ8o');