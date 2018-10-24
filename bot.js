const Discord = require('discord.js');
const client = new Discord.Client();
let players = []; // list of alls gamers who has joined (game,user,channel)
let first = true; // first message
let isOpenned = false; // is players open ?

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

/**
 * Function to know if a user is already in queue
 * @return boolean 
 */

function isAlreadyInQueue(user) {
    for (var i = 0 ; i < players.length ; i++) {
        if ( players[i][1] == user ) {
            return players[i];
        }
    }
    
    return false;
}

/**
 * Function to delete a user 
 * @return boolean 
 */

function deletePlayer(user) {
    console.log(players);
    for (var i = 0 ; i < players.length ; i++) {
        if ( players[i][1] == user ) {
            players.splice(i);
            console.log(players);
        }
    }
    
    return true;
}


/**
 * Function add message for !join <id>
 */

function joinPlayer(codeParty, msg) {

    alreadyInQueue = isAlreadyInQueue(msg.author);

    //if bad sequences for codeParty (args != 3)
    if (codeParty[0].length != 3) {
        msg.author.send('Hey '+ msg.author +'! You sended a wrong code party ('+codeParty[0]+'). Please enter the 3 latest digit of your game');
    } else {
        //if not already in queue => register the player
        if (!alreadyInQueue) {
            players.push([
                codeParty,
                msg.author,
                msg.channel
            ]);
        } else {
            msg.author.send('Hey '+ msg.author +'! It\'s look like you are already in queue with the code party (*'+alreadyInQueue[0]+'*). It\'s an error? No panic. Just type `!rejoin <abc>` instead of `!join <abc>`');
        }
    }

    msg.delete()
        .then(message => console.log(`Deleted message from ${message.author.username}`))
        .catch(console.error);

}

/**
 * Function add message for !join <id>
 */

function rejoinPlayer(codeParty, msg) {

    alreadyInQueue = isAlreadyInQueue(msg.author);

    //if bad sequences for codeParty (args != 3)
    if (codeParty[0].length != 3) {
        msg.author.send('Hey '+ msg.author +'! You sent a wrong party code ('+codeParty[0]+'). Please enter the 3 latest alpha-num of your game');
    } else {
        //if already in queue => re-register the player
        if (alreadyInQueue) {

            oldRoom = alreadyInQueue[0];

            deletePlayer(msg.author);

            players.push([
                codeParty,
                msg.author,
                msg.channel
            ]);

        } else {
            msg.author.send('Hey '+ msg.author +'! It\'s look like you are not already in queue. Please type `!join <abc>` instead of `!rejoin <abc>`');
        }
    }

    msg.delete()
        .then(message => console.log(`Deleted message from ${message.author.username}`))
        .catch(console.error);

}

/**
 * Function count for players on same party
 */
function count(playersList) {
    playersList.sort();

    let games = []; // list of all games (game,count)

    var current = null;
    var cnt = 0;
    for (var i = 0; i < playersList.length; i++) {
        if (playersList[i][0][0] != current) {
            if (cnt > 0) {
                games.push([
                    playersList[i-1][0][0],
                    cnt
                ]);
            }
            current = playersList[i][0][0];
            cnt = 1;
        } else {            
            cnt++;
        }
    }
    if (cnt > 0) {
        games.push([
            current,
            cnt
        ]);
    }

    return games;

}

/**
 * Function to create the fields[] on the great format for embed
 */
function createFields(games) {
    fields = [];
    descr = "";

    console.log(games);

    for(var i = 0 ; i < games.length ; i++) {
        for (var j = 0 ; j < players.length ; j++) {

            if (games[i][0] == players[j][0]) 
                descr += players[j][1] +", ";

        }

        fields.push({ 
            name: "**" + games[i][0] + "** ( *" + games[i][1] +"* )",
            value: descr
        });

        descr = '';
    }

    return fields
}

/**
 * Function to close a game trigger by timeout
 * @param Channel channel 
 */
function closeGame(channel) {

    isOpenned = false;
    first = true;

    games = count(players);
    formattedFields = createFields(games);

    channel.send({embed: {
        color: 3447003,
        title: "Current servers:",
        //url: "http://google.com",
        //description: "This is a test embed to showcase what they look like and what they can do.",
        fields: formattedFields,
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "© ButterCorp"
        }
      }
    });

    console.log('[DEBUG] closeGame - Game over');

    while (players.length) { players.pop(); }

}

/**
 * catch event for a message beginning with "!"
 */
client.on('message', msg => {

    if (msg.content.indexOf("!") !== 0) return;
    const args = msg.content.slice("!".length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //console.log("[DEBUG] first : " + first + ", command : " + command, "args : " + args);

    if (command == "join" && args !== "" && args.length == 1) {
    
            joinPlayer(args, msg);

            if (first) {
                setTimeout( function() {
                    closeGame(msg.channel);
                }, 90000 );
            }

            first = false;
            isOpenned = true;

            //console.log("[DEBUG] first : " + first + ", isOpenned : " + isOpenned, "players : " + players);

    } else if (command == "rejoin" && args !== "" && args.length == 1) {
        rejoinPlayer(args, msg);
    }

    //if(isOpenned)     
});



client.login('NTA0MjY5OTI3Mjk3OTc0Mjgy.DrDDHg._dc9O-a2p5m1-oFW48ZAkJCDJ8o');