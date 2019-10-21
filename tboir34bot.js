const fs = require('fs');
const Discord = require('discord.js');
 const client = new Discord.Client();

// file system setup
const gPath = 'gcount.txt';
const mutePath = 'mutes.txt';
// role menu setup
const roleMenuChannel = '621437874998345748';
const roleMenu = '';
const teamMenu = '';

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 client.user.setActivity("with hopes", {type: "PLAYING"});
// getting role menus ready
 client.channels.get(roleMenuChannel).fetchMessage(roleMenu)
 .catch(console.error);
 client.channels.get(roleMenuChannel).fetchMessage(teamMenu)
 .catch(console.error);
});

// rolebot
async function role(rct, usr, action) {
 if (usr.bot === true) return;
 let role = false;
 if (rct.message.id === roleMenu) {
  switch (rct.emoji.id) {
// superPeach - misc pass
   case '620365612773933087':
    role = '507324837413257216';
    break;
// uwu - rp pass
   case '465823816594227245':
    role = '507321320808382465';
    break;
   default:
    break;
  }
 } else if (rct.message.id === teamMenu) {
  if (action === 'add' && (await teamCheck(rct, usr))) return;
  switch (rct.emoji.id) {
// thigh, tummy, pussy, tits, ass, dick, in that order
   case '456696654599290892':
    role = '507319175686127617';
    break;
   case '456696691458965506':
    role = '507324803187867658';
    break;
   case '456696636375171075':
    role = '507318167744544778';
    break;
   case '456696674367176710':
    role = '507318208030703634';
    break;
   case '456696593601658881':
    role = '507319147064197120';
    break;
   case '456696618406641668':
    role = '507319211639570442';
    break;
   default:
    break;
  }
 }
 if (role === false) return;
 if (action === 'add') {
  let mbr = rct.message.guild.fetchMember(usr)
   .catch(console.error);
  mbr.addRole(role)
   .catch(console.error);
 }
 if (action === 'remove') {
  let mbr = rct.message.guild.fetchMember(usr)
   .catch(console.error);
  mbr.removeRole(role)
   .catch(console.error);
 }
}

// check for other team roles
async function teamCheck(rct, usr) {
 let mbr = await rct.message.guild.fetchMember(usr)
  .catch(console.error);
 let result = mbr.roles.every(role => {
  return ((role.id !== '507319175686127617') && (role.id !== '507324803187867658') && (role.id !== '507318167744544778') && (role.id !== '507318208030703634') && (role.id !== '507319147064197120') && (role.id !== '507319211639570442'));
 });
 result = !result;
 return result;
}

// the actual events
client.on('messageReactionAdd', (rct, usr) => role(rct, usr, 'add'));
client.on('messageReactionRemove', (rct, usr) => role(rct, usr, 'remove'));

// for G command and its variants
function increaseGCount(msg, entry) {
 fs.readFile(gPath, 'utf8', (err, data) => {
  if (err) throw err;
  
  let write;
  write = Number(data) + 1;
  
  fs.writeFile(gPath, write, err => {
   if (err) throw err;
   
   if (write % 100 === 0) {
    console.log(write + ' Gs reached! - ' + msg.createdAt);
    msg.channel.send(entry + '\n' + write + ' total Gs given!')
    .catch(console.error);
   } else {
    msg.channel.send(entry)
    .catch(console.error);
   }
  });
 });
}

// .hush
client.on('message', msg => {
 if (/^\.hush/.test(msg.content)) {
  if (msg.member.roles.find(rol => ((rol.id === '507317774272430090') || (rol.id === '507320094808997888')))) {
   msg.channel.send('This feature isn\'t actually ready yet, I got really tired of a single bug, expect a patch tommorow :(')
    .catch(console.error);
  }
 }
});

// fun command interpreter
client.on('message', msg => {
 if (msg.author.bot === true) return;
 if (msg.channel.id !== '482244470851764234') return;
 switch (msg.content) {
  case 'roll':
   msg.channel.send(Math.floor(Math.random() * 100)+1)
    .catch(console.error);
   break;
  case 'g':
   increaseGCount(msg, 'g');
   break;
  case 'G':
   increaseGCount(msg, 'G');
   break;
  case '🇬':
   increaseGCount(msg, '🇬');
   break;
  case 'Ǵ':
   increaseGCount(msg, 'Ǵ');
   break;
  case 'ǵ':
   increaseGCount(msg, 'ǵ');
   break;
  case 'Ğ':
   increaseGCount(msg, 'Ğ');
   break;
  case 'ğ':
   increaseGCount(msg, 'ğ');
   break;
  case 'Ĝ':
   increaseGCount(msg, 'Ĝ');
   break;
  case 'ĝ':
   increaseGCount(msg, 'ĝ');
   break;
  case 'Ǧ':
   increaseGCount(msg, 'Ǧ');
   break;
  case 'ǧ':
   increaseGCount(msg, 'ǧ');
   break;
  case 'Ġ':
   increaseGCount(msg, 'Ġ');
   break;
  case 'ġ':
   increaseGCount(msg, 'ġ');
   break;
  case 'Ģ':
   increaseGCount(msg, 'Ģ');
   break;
  case 'ģ':
   increaseGCount(msg, 'ģ');
   break;
  case 'Ḡ':
   increaseGCount(msg, 'Ḡ');
   break;
  case 'ḡ':
   increaseGCount(msg, 'ḡ');
   break;
  case 'Ǥ':
   increaseGCount(msg, 'Ǥ');
   break;
  case 'ǥ':
   increaseGCount(msg, 'ǥ');
   break;
  case 'Ɠ':
   increaseGCount(msg, 'Ɠ');
   break;
  case 'ɠ':
   increaseGCount(msg, 'ɠ');
   break;
  case 'ᶃ':
   increaseGCount(msg, 'ᶃ');
   break;
  case 'ɢ':
   increaseGCount(msg, 'ɢ');
   break;
  case 'Ｇ':
   increaseGCount(msg, 'Ｇ');
   break;
  case 'ｇ':
   increaseGCount(msg, 'ｇ');
   break;
  default:
   break;
 }
});

// link filter definitions
const goodLink = /\.(png|jpg|jpeg|mp4|webm|gif|com|net|org|be)/;

// link filter
client.on('message', msg => {
 if (msg.author.bot === true) return;
 if ((msg.channel.id !== '277254470315016202') && ((msg.channel.id !== '455835089000202260') && (msg.channel.id !== '440881355711184906'))) return;
 if (msg.attachments.size > 0 || goodLink.test(msg.content.toLowerCase())) {
  return;
 } else {
  msg.delete()
   .catch(console.error);
 }
});

// crash fix
client.on('error', err => {
 throw err;
});

client.login('INSERT_ACCESS_TOKEN_HERE');

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
