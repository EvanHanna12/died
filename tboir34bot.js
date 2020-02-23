const fs = require('fs');
const Discord = require('discord.js');
  const client = new Discord.Client();

// database setup
const dataPath = 'isaacdata.txt';

let database = JSON.parse(fs.readFileSync(dataPath, 'utf8')); // possibly change to async? // add error handling
function saveDatabase() {
  let newDatabase = JSON.stringify(database);
  fs.writeFile(dataPath, newDatabase, 'utf8', (err) => {
    if (err) throw err;
  });
}

const botChannel = '267047410604310530';
const logChannel = '472484924839034880';

// role menu setup - might just get this to be set and read into a file later
const roleMenuChannel = '621437874998345748';
const roleMenu = '';
const teamMenu = '';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("with the silenced", {type: "PLAYING"});
// caching role menus (note: this only works if no more than 200 messages are in the channel with the role menu)
  if (roleMenu) {
    client.channels.get(roleMenuChannel).fetchMessage(roleMenu)
      .catch(console.error);
  }
  if (teamMenu) {
    client.channels.get(roleMenuChannel).fetchMessage(teamMenu)
      .catch(console.error);
  }
});

// connection crash "fix"
client.on('error', err => {
  throw err;
});

//////// TEMP DISABLED ////////

// roles
async function role(rct, usr, action) {
  if (usr.bot === true) return;
  let role = false;
  let mbr = await rct.message.guild.fetchMember(usr)
    .catch(console.error);
  if (rct.message.id === roleMenu) {
    switch (rct.emoji.id) { // holy crap, replace this with an array using .find()
      case '': // Insert Emoji ID
        role = ''; // Insert corresponding role ID
        break;
    }
  } else if (rct.message.id === teamMenu) {
    if (action === 'add' && !(mbr.roles.every(role => {return ((role.id !== '') && (role.id !== '') && (role.id !== ''));}))) return; // replace the team role check with something more concise
    switch (rct.emoji.id) {
      case '':
        role = '';
        break;
    }
  }
  if (role === false) return;
  if (action === 'add') {
    mbr.addRole(role)
      .catch(console.error);
  }
  if (action === 'remove') {
    mbr.removeRole(role)
      .catch(console.error);
  }
}

if (roleMenu || teamMenu) {
  client.on('messageReactionAdd', (rct, usr) => role(rct, usr, 'add'));
  client.on('messageReactionRemove', (rct, usr) => role(rct, usr, 'remove'));
} else {
  console.log('Rolebot disabled.');
}

//////// END DISABLED ZONE ////////

// link filter definitions
const goodLink = /\.(png|jpg|jpeg|mp4|webm|gif|com|net|org|be)/;
// g definitions
const loneG = /^(g|G|🇬|Ǵ|ǵ|Ğ|ğ|Ĝ|ĝ|Ǧ|ǧ|Ġ|ġ|Ģ|ģ|Ḡ|ḡ|Ǥ|ǥ|Ɠ|ɠ|ᶃ|ɢ|Ｇ|ｇ){1}$/;

client.on('message', msg => {
  // link filter
  if ((msg.channel.id === '277254470315016202') || (msg.channel.id === '440881355711184906')) {
    if (msg.attachments.size > 0 || goodLink.test(msg.content.toLowerCase())) {
      return;
    } else {
      msg.delete()
        .catch(console.error);
    }
  }

  if (msg.author.bot === true) return;
  // admin command interpreter
  if (msg.member.roles.find(rol => (rol.id === '507317774272430090'))) {
    if (/^\.hush/.test(msg.content)) { // .hush
      // INSERT_HUSH_COMMAND
      /*
      Syntax: .hush <user> <duration> <reason>
      */
    }
    switch (msg.content) {
      case '.save':
        saveDatabase();
        console.log('Saved the database manually.');
        msg.channel.send('Saved the database manually.')
          .catch(console.error);
        break;
    }
  }
  
  if (msg.channel.id !== botChannel) return;
  // g
  if (loneG.test(msg.content)) {
    database.gcount++;
    let toSend = msg.content;
    if (database.gcount % 100 === 0) {
      console.log(`${database.gcount}` + ' Gs reached! - ' + msg.createdAt);
      toSend = toSend + '\n' + `${database.gcount}` + ' total Gs given!';
    }
    msg.channel.send(toSend)
      .catch(console.error);
    return;
  }
  // fun command interpreter
  switch (msg.content) {
    case '.roll':
      msg.channel.send(Math.floor(Math.random() * 100)+1)
        .catch(console.error);
      break;
    case '.muffin':
      msg.channel.send('<a:muffin:534165693638377472>')
        .catch(console.error);
      break;
    case 'Cleveland Brown':
      msg.channel.send(`My name is Cleveland Brown\nAnd I am proud to be\nRight back in my hometown\nWith my new family\nThere's old friends\nAnd new friends\nAnd even a bear\nThrough good times\nAnd bad times\nIt's true love we share\nAnd so I found a place\nWhere everyone will know\nMy happy mustached face\nThis is The Cleveland Show!`)
        .catch(console.error);
      break;
    default:
      break;
  }
});

function clock() {
  // check hushed people
  // swap secret room user
  saveDatabase();
}

var clockTimerID = setInterval(clock, 600000);

client.login('INSERT_ACCESS_KEY_HERE');

/*
UPDATE NEGATIVE TEN:
>add .hush
  >hush a person with duration and reason, put them on a list with a timestamp
  >unhush when the time has been exceeded
  >record the hush in the hush log
  >tell the person hush length and reason in the timeout channel
*/

/*
UPDATE NEGATIVE NINE:
>add the secret room
*/

/*
UPDATE NEGATIVE EIGHT:
>add .req or .request
  >store a request w/ owner
  >has rate limit per person
    >will function similarly to .hush
  >only owner or mods can delete requests
  >requests can be fulfilled by anyone with .req done ...
    >fulfilled requests are invisible and have the person who filled it's name added
    >invisible fulfillment leaderboard - important this remains invisible! :)
  >request search
    >very basic regex search, nothing phenomenal here
*/

// APRIL FOOL'S
// If reused, replace areas in all caps.

/*
const nWord = /(nigga|nigger)/;

client.on('message', msg => {
  if (msg.author.bot === true) return;
  if (nWord.test(msg.content.toLowerCase())) {
    if (msg.member.roles.find(rol => rol.id === 'N_WORD_PASS_ROLE')) {
      return;
    } else {
      msg.delete()
        .catch(console.error);
      msg.member.addRole('PUNISHMENT_ROLE')
        .catch(console.error);
    }
  }
});
*/