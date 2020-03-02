const fs = require('fs');
const Discord = require('discord.js');
  const client = new Discord.Client();

// database setup
const dataPath = 'isaacdata.txt';

// secret setup
let mainGuild = '255491840063700992';

let database = JSON.parse(fs.readFileSync(dataPath, 'utf8')); // add error handling and initialization SOON
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
const secretRole = '678520543074320396';

// role menu setup - might just get this to be set and read into a file later
const roleMenuChannel = '621437874998345748';
const roleMenu = '';
const teamMenu = '';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("with the silenced", {type: "PLAYING"});
// caching role menus (note: this only works if no more than 200 messages are in the channel with the role menu)
  if (roleMenu) {
    client.channels.cache.get(roleMenuChannel).messages.fetch(roleMenu)
      .catch(console.error);
  }
  if (teamMenu) {
    client.channels.cache.get(roleMenuChannel).messages.fetch(teamMenu)
      .catch(console.error);
  }
  if (logChannelID) {
    logChannel = client.channels.cache.get(logChannelID);
  }
  if (mainGuild) {
    mainGuild = client.guilds.cache.get(mainGuild);
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
  let mbr = await rct.message.guild.members.fetch(usr)
    .catch(console.error);
  if (rct.message.id === roleMenu) {
    switch (rct.emoji.id) { // holy crap, replace this with an array using .find()
      case '': // Insert Emoji ID
        role = ''; // Insert corresponding role ID
        break;
    }
  } else if (rct.message.id === teamMenu) {
    if (action === 'add' && !(mbr.roles.cache.every(role => {return ((role.id !== '') && (role.id !== '') && (role.id !== ''));}))) return; // replace the team role check with something more concise
    switch (rct.emoji.id) {
      case '':
        role = '';
        break;
    }
  }
  if (role === null) return;
  if (action === 'add') {
    mbr.roles.add(role)
      .catch(console.error);
  }
  if (action === 'remove') {
    mbr.roles.add(role)
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
    let hushedMember = await originMessage.guild.members.fetch(userID);
    let timeToUnhush = Date.now() + hushDuration;
    database.hushes.push([userID, timeToUnhush]);
    hushedMember.roles.add(hushRole)
      .catch(console.error);
    originMessage.channel.send(`${hushedMember.user.username}#${hushedMember.user.discriminator} has been hushed for ${hushDurationRaw} for ${hushReason}.`)
      .catch(console.error);
    logChannel.send(`${hushedMember.user.username}#${hushedMember.user.discriminator} has been hushed for ${hushDurationRaw} for ${hushReason}.`)
      .catch(console.error);
    console.log(`${hushedMember.user.username}#${hushedMember.user.discriminator} has been hushed for ${hushDurationRaw} for ${hushReason}.`);
  } catch(error) {
    return Promise.reject('Invalid user ID!');
  }
}

// unhush
async function unhush(usrID) {
  try {
    let memberToUnhush = await mainGuild.members.fetch(usrID); // change this to support multiguilds later, lol
    memberToUnhush.roles.remove(hushRole)
      .catch(console.error);
  } catch(error) {
    return Promise.reject('Couldn\'t find a user to unhush in r/TBoIr34! Check manually!');
  }
}

// autocheck hushes
function checkHushes() {
  database.hushes.forEach((hush, index) => {
    if (Date.now() >= hush[1]) {
      unhush(hush[0], index)
        .catch(error => console.log(error));
      database.hushes.splice(index, 1);
    }
  });
}

// check hushed users
function manuallyCheckHush(msg) {
  let reqHush = database.hushes.find(hush => (hush[0] === msg.author.id));
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
  } else if (msg.member.roles.cache.has(hushRole)) {
    msg.channel.send('Oops! Stray hush removed.')
      .catch(console.error);
    msg.member.roles.remove(hushRole)
      .catch(console.error);
  }
}

// secret
async function swapSecretOwner() {
  if (database.currentSecretOwner !== undefined) {
    await mainGuild.members.fetch(database.currentSecretOwner)
      .then((oldSecretOwner) => {
        oldSecretOwner.roles.remove(secretRole)
          .catch(console.error);
      })
      .catch(() => console.log('Couldn\'t find the current secret owner, remove it manually!'));
  }
  let newSecretOwner = mainGuild.members.cache.random();
  newSecretOwner.roles.add(secretRole)
    .catch(console.error);
  database.currentSecretOwner = newSecretOwner.user.id;
  console.log(`Passed secret to ${newSecretOwner.user.username}#${newSecretOwner.user.discriminator}.`);
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
      return;
    }
  }
  if (msg.author.bot === true) return;
  // potential DM support
  if (msg.channel.type !== 'text') {
    return;
  }
  // failsafe
  if (msg.member === undefined || msg.member === null) {
    console.log('Something went wrong! Message data:');
    console.log(msg);
    return;
  }
  // admin command interpreter
  if (msg.member.roles.has('507317774272430090')) {
    if (/^\:hush(\ .+)?$/.test(msg.content.toLowerCase())) {
      let hushCom = msg.content.split(/\ +/g);
      if (hushCom.length < 3) {
        msg.channel.send('Syntax: :hush <mention or userID> <duration i.e. 30m, 2d12h> <hush reason>')
          .catch(console.error);
        return;
      } else if (!(/^(<@!?)?\d+(>)?$/.test(hushCom[1]) && /^(\d+(s|m|h|d|w))+$/.test(hushCom[2]))) {
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
      return;
    }
    if (/^\:unhush(\ .+)?$/.test(msg.content.toLowerCase())) {
      let unhushCom = msg.content.split(/\ +/g);
      if (unhushCom.length < 2) {
        msg.channel.send('Syntax: :unhush <mention or userID>')
          .catch(console.error);
        return;
      } else if (!(/^(<@!?)?\d+(>)?$/.test(unhushCom[1]))) {
        msg.channel.send('Syntax: :unhush <mention or userID>')
          .catch(console.error);
        return;
      }
      let userIDToUnhush = hushCom[1].match(/\d+/).join('');
      let success = false;
      database.hushes.forEach((hush, index) => {
        if (userIDToUnhush === hush[0]) {
          success = true;
          msg.channel.send('Unhushed.')
            .catch(console.error);
          unhush(hush[0], index)
            .catch(error => console.log(error));
          database.hushes.splice(index, 1);
        }
      });
      if (success === false) {
        msg.channel.send('Didn\'t find anyone hushed with that ID. Try :checkhush.')
          .catch(console.error);
      }
      return;
    }
    switch (msg.content.toLowerCase()) {
      case ':save':
        saveDatabase();
        console.log('Saved the database manually.');
        msg.channel.send('Saved the database manually.')
          .catch(console.error);
        break;
      case ':logdb':
        console.log(database);
        break;
      case ':manualswap':
        swapSecretOwner();
        break;
      case ':cachemembers':
        msg.guild.members.fetch();
        msg.channel.send('Cached. WARNING: USE THIS SPARINGLY.')
          .catch(console.error);
        break;
    }
  }
  // check hush
  if (msg.content.toLowerCase() === ':checkhush') {
    manuallyCheckHush(msg.channel);
    return;
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
      msg.channel.send(`${Math.floor(Math.random() * 100)+1}`)
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
  swapSecretOwner();
  saveDatabase();
}

var clockTimerID = setInterval(clock, 600000);

client.login('INSERT_ACCESS_TOKEN_HERE');

/*
UPDATE NEGATIVE NINE PATCH X:
>add :hushextend and :hushreduce

UPDATE NEGATIVE EIGHT:
>rewrite the command interpreter to be simpler (less if-else/switch-case statements)
>add :req or :request
  >store a request w/ owner
  >has rate limit per person
  >only owner or mods can delete requests
  >requests can be fulfilled by anyone with :req done ...
    >fulfilled requests are invisible and have the person who filled it's name added
    >invisible fulfillment leaderboard - important this remains invisible! :)
  >request search
    >very basic regex search, nothing phenomenal here

UPDATE NEGATIVE SEVEN:
UPDATE NEGATIVE SIX:
UPDATE NEGATIVE FIVE:
UPDATE NEGATIVE FOUR:
UPDATE NEGATIVE THREE:
UPDATE NEGATIVE TWO:
UPDATE NEGATIVE ONE:
UPDATE ZERO:
*/