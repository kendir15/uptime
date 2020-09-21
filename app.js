const express = require('express');
const app = express();
const http = require('http');
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me`);
}, 60000 * 5);

const db = require("quick.db");
const discord = require("discord.js");
const client = new discord.Client({ disableEveryone: true });
client.login("NzQ1NTc0MDA2MzY2OTI4OTM3.Xzzv5w.fP-spjhHyrt411P173_amLE8pIM");
const fetch = require("node-fetch");
const fs = require('fs')

setInterval(() => {
  var links = db.get("linkler");
  if(!links) return;
  var linkA = links.map(c => c.url)
  linkA.forEach(link => {
    try {
      fetch(link)
    } catch(e) { 
      //console.log("" + e) 
    };
  })
}, 60000)

client.on("ready", () => {
client.user.setActivity(`!ekle | DM'den kullan!`, { url: 'https://twitch.tv/BySenius', type: 'STREAMING' });
console.log("Bot aktif!")
if(!Array.isArray(db.get("linkler"))) {
db.set("linkler", [])
}
})

/*client.on("message", message => {
  if(message.author.bot) return;
    var spl = message.content.split(" ");
  if(spl[0] == "!yardım") {
let embed = new discord.MessageEmbed()
.setColor('RANDOM')
.setTitle(`Komutlar`)
.setDescription(`
\`!yardım\` - Yardım menüsünü görüntüler.
\`!ekle\` - Belirttiğiniz bağlantıyı sisteme ekler.
\`!say\` - Sistemdeki bağlantı sayısını gösterir.
`)
return message.channel.send(embed);
    }
 
})*/

client.on("message", message => {
  if(message.author.bot) return;
  var spl = message.content.split(" ");
  if(spl[0] == "!say") {
  var link = spl[1]
 message.channel.send(`:up: Toplam \`${db.get("linkler").length}\` bot **aktif!**`)
}})

client.on("message", message => {
  if(message.author.bot) return;
  var spl = message.content.split(" ");
  if(spl[0] == "!ekle") {
    message.delete();
        if (message.channel.type !== "dm") return message.channel.send(":x: Bu komutu botun özelinde **kullanmalısın!**")
        //if(message.channel.id !== "740977037992263753") return message.channel.send(":x: Bu komutu sadece <#740977037992263753> kanalında kullanabilirsin!")
  var link = spl[1]
  fetch(link).then(() => {
    if(db.get("linkler").map(z => z.url).includes(link)) return message.channel.send(":x: Bot zaten aktif **tutuluyor!**")
    message.channel.send(":white_check_mark: Bot **eklendi!**")
    db.push("linkler", { url: link, owner: message.author.id})
  }).catch(e => {
    //return message.channel.send("Hata: " + e)
    return message.channel.send(":x: Glitch show linki **giriniz!**")
  })
  }
})

client.on("message", async message => {

  if(!message.content.startsWith("!eval")) return;
  if(!["660130948524015617","660130948524015617"].includes(message.author.id)) return;
  var args = message.content.split("!eval")[1]
  if(!args) return message.channel.send(":warning: Kod?")
  
      const code = args
    
    
      function clean(text) {
          if (typeof text !== 'string')
              text = require('util').inspect(text, { depth: 3 })
          text = text
              .replace(/`/g, '`' + String.fromCharCode(8203))
              .replace(/@/g, '@' + String.fromCharCode(8203))
          return text;
      };
  
      var evalEmbed = ""
      try {
          var evaled = await clean(await eval(await code));
          if (evaled.constructor.name === 'Promise') evalEmbed = `\`\`\`\n${evaled}\n\`\`\``
          else evalEmbed = `\`\`\`js\n${evaled}\n\`\`\``
          
  if(evaled.length < 1900) { 
     message.channel.send(`\`\`\`js\n${evaled}\`\`\``);
  } else {
    var hast = await require("hastebin-gen")(evaled, { url: "https://hasteb.in" } )
  message.channel.send(hast)
  }
      } catch (err) {
          message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
      }
  })
  
