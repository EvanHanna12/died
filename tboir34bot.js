const fs = require('fs');
const Discord = require('discord.js');
  const client = new Discord.Client();

// database setup
const dataPath = 'isaacdata.txt';

let database = JSON.parse(fs.readFileSync(dataPath, 'utf8')); // possibly change to async? // add error handling and initialization SOON
function saveDatabase() {
  let newDatabase = JSON.stringify(database);
  fs.writeFile(dataPath, newDatabase, 'utf8', (err) => {
    if (err) throw err;
  });
}

const botChannel = '267047410604310530';
const logChannelID = '472484924839034880';
let logChannel = null;

const hushRole = '533813599072944148';

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
  if (logChannelID) {
    logChannel = client.channels.get(logChannelID);
    console.log('Got logChannel.');
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
  let role = null;
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
  if (role === null) return;
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

// hush users
async function hushUser(originMessage, userID, hushDuration, hushDurationRaw, hushReason) {
  try {
    let hushedMember = await originMessage.guild.fetchMember(userID);
    let timeToUnhush = Date.now() + hushDuration;
    database.hushes.push([hushedMember, timeToUnhush]);
    hushedMember.addRole(hushRole)
      .catch(console.error);
    originMessage.channel.send(`${hushedMember.user.username}#${hushedMember.user.discriminator} has been hushed for ${hushDurationRaw} for ${hushReason}.`)
      .catch(console.error);
    logChannel.send(`${hushedMember.user.username}#${hushedMember.user.discriminator} has been hushed for ${hushDurationRaw} for ${hushReason}.`)
      .catch(console.error);
  } catch(error) {
    return Promise.reject('Invalid user ID!');
  }
}

// check stray hushed users
function manuallyCheckHush(msg) {
  let reqHush = database.hushes.find(hush => (hush[0].id === msg.member.id));
  if (reqHush) {
    if (Date.now() < reqHush[1]) {
      let specificHushTimeLeft = Math.ceil((reqHush[1] - Date.now())/60000);
      if (specificHushTimeLeft === 1) {
        msg.channel.send(`You have less than a minute remaining.`)
          .catch(console.error);
        return;
      } else {
        msg.channel.send(`You have ${specificHushTimeLeft} minutes remaining.`)
          .catch(console.error);
        return;
      }
    } else {
      checkHushes();
      return;
    }
  } else if (msg.member.roles.find(rol => (rol.id === hushRole))) {
    msg.channel.send('Oops! Stray hush removed.')
      .catch(console.error);
    msg.member.removeRole(hushRole)
      .catch(console.error);
  }
}

// autocheck hushes
function checkHushes() {
  database.hushes.forEach((hush, index) => {
    if (Date.now() >= hush[1]) {
      hush[0].removeRole(hushRole)
       .catch(console.error);
      database.hushes.splice(index, 1);
    }
  });
}

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
  // potential DM support
  if ((msg.channel.type === 'dm') || (msg.channel.type === 'group')) {
    return;
  }
  // admin command interpreter
  if (msg.member.roles.find(rol => (rol.id === '507317774272430090'))) {
    if (/^\:hush\ /.test(msg.content)) {
      let hushCom = msg.content.split(/\ +/g);
      if (hushCom.length < 3) {
        msg.channel.send('Syntax: :hush <mention or userID> <duration i.e. 30m, 2d12h> <hush reason>')
          .catch(console.error);
        return;
      } else if (!(/^(<@!)?\d+(>)?$/.test(hushCom[1]) && /^(\d+(s|m|h|d|w))+$/.test(hushCom[2]))) {
        console.log(hushCom);
        console.log(hushCom.join(', '));
        msg.channel.send('Syntax: :hush <mention or userID> <duration i.e. 30m, 2d12h> <hush reason>')
          .catch(console.error);
        return;
      }
      let userIDToHush = hushCom[1].match(/\d+/).join('');
      let hushDurationUnparsed = hushCom[2].match(/\d+(?:m|h|d|w)/g);
      let hushDuration = hushDurationUnparsed.reduce((sum, lengthByte) => {
        let segmentedByte = lengthByte.match(/(?:\d+|m|h|d|w)/g);
        switch (segmentedByte[1]) {
          case 'm':
            return sum + (segmentedByte[0] * 60000);
          case 'h':
            return sum + (segmentedByte[0] * 3600000);
          case 'd':
            return sum + (segmentedByte[0] * 86400000);
          case 'w':
            return sum + (segmentedByte[0] * 604800000);
        }
      }, 0);
      let hushReason = null;
      if (hushCom[3]) {
        hushReason = hushCom.slice(3).join(' ');
        switch (hushReason) {
          case 'r1':
            hushReason = 'doxxing or otherwise revealing personal information pertaining to someone else';
            break;
          case 'r2':
            hushReason = 'being unkind';
            break;
          case 'r3':
            hushReason = 'spamming or derailing';
            break;
          case 'r4':
            hushReason = 'posting content that disturbs people or is otherwise against Discord ToS';
            break;
          case 'r5':
            hushReason = 'intentionally posting in the wrong channel';
            break;
          case 'r6':
            hushReason = 'harassing people for their kinks';
            break;
          case 'r7':
            hushReason = 'getting too political';
            break;
        }
      }
      hushUser(msg, userIDToHush, hushDuration, hushCom[2], hushReason)
        .catch((error) => {
          msg.channel.send(error)
            .catch(console.error);
        });
    }
    switch (msg.content) {
      case ':save':
        saveDatabase();
        console.log('Saved the database manually.');
        msg.channel.send('Saved the database manually.')
          .catch(console.error);
        break;
      case ':logdb':
        console.log(database);
        break;
    }
  }
  // check hush
  if (msg.content === ':checkhush') {
    manuallyCheckHush(msg);
  }
  // fun command interpreter
  if (msg.channel.id !== botChannel) return;
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
  switch (msg.content) {
    case ':roll':
      msg.channel.send(Math.floor(Math.random() * 100)+1)
        .catch(console.error);
      break;
    case ':muffin':
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
  checkHushes();
  // swap secret room user
  saveDatabase();
}

var clockTimerID = setInterval(clock, 600000);

client.login('INSERT_ACCESS_TOKEN_HERE');

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