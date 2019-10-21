const fs = require('fs');
const Discord = require('discord.js');
 const client = new Discord.Client();

const filepath = 'gcount.txt';

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 client.user.setActivity("g", {type: "PLAYING"});
});

// for G command and its variants
function increaseGCount(msg, entry) {
 fs.readFile(filepath, 'utf8', (err, data) => {
  if (err) throw err;
  
  let write;
  write = Number(data) + 1;
  
  fs.writeFile(filepath, write, err => {
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

// command interpreter
client.on('message', msg => {
 if (msg.author.bot === true) return;
 if (msg.channel.id !== '482244470851764234') return;
 switch (msg.content) {
  case 'g':
   increaseGCount(msg, 'g');
   break;
  case 'G':
   increaseGCount(msg, 'G');
   break;
  case 'roll':
   msg.channel.send(Math.floor(Math.random() * 100)+1)
    .catch(console.error);
   break;
  default:
   break;
 }
});

// link filter definitions
let goodLink = /\.(png|jpg|jpeg|mp4|webm|gif|com|net|org|be)/;

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
>add /hush
 >hush a person with duration and reason, put them on a list with a timestamp
 >unhush when the time has been exceeded
 >record the hush in the hush log
 >tell the person hush length and reason in the timeout channel

>remove the role channel entirely in favor of the bot recognizing phrases asking to be on a team or change a team or access a pass
 >you can only have one team role
 >the other roles are accessible freely
 >the bot doesn't glitch out when looking at admins that have more than one team role
 >the bot recognizes team leaders in some shape or form

>more G commands
*/

// APRIL FOOL'S
// If reused, replace areas in all caps.
/*
nWord = /(nigga|nigger)/;

client.on('message', msg => {
 if (msg.author.bot === true) return;
 if (nWord.test(msg.content.toLowerCase())) {
  if (msg.member.roles.find(val => val.id === 'N_WORD_PASS_ROLE')) {
   return
  } else {
   msg.delete()
    .catch(console.error);
   msg.member.addRole('PUNISHMENT_ROLE')
    .catch(console.error);
  };
 };
});
*/
