const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const PersistentCollection = require('djs-collection-persistent');
const table = new PersistentCollection({
	name: "table"
})
const nbAuthor = new PersistentCollection({
	name: "nbAuthor"
})
const config = require("./botconfig.json")

//let cookie = JSON.parse(fs.readFileSync("./cookie.json", "utf8"));
//const fs = require("fs");

bot.on("ready", async() =>{

	try {
		let link = await bot.generateInvite(["ADMINISTRATOR"]);
			console.log(link);
		} catch(e) {
		console.log(e.stack);
		}
	bot.user.setGame("sauver des princesses");
	bot.user.setStatus("idle");

});

bot.on('message', message => {
	if(message.content.startsWith(config.prefix + "lorem")){
	message.channel.send("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
	var authorMsg = message.author.username;
	var nbAuthors = nbAuthor.get("nbAuthor");
	var verif = 0;
	for(i=0 ; i<=nbAuthors ; i++)
	{
		
		if (table.get("user"+i)==authorMsg) {
			verif = 1;
			break;
		}

	}
		if(verif == 0){
			table.set("user"+i, authorMsg);
			console.log(table.get("user"+i));
			nbAuthors++
			nbAuthor.set("nbAuthor", nbAuthors);
		}

}

	if (message.content.startsWith(config.prefix+"set")) {
		for(i=0; i<10; i++){

			table.set("user"+i, 0);
		}
	}

	if (message.content.startsWith(config.prefix+"clear")) {
		for(i=0; i<10; i++){

			table.clear("user"+i);
		}
	}

	if(message.content.startsWith(config.prefix + "who")){
		var newTableAuthor = Array();
		var user = "";
		var nbAuthors = nbAuthor.get("nbAuthor");
		for(i=0; i<=nbAuthors; i++){

			user = table.get("user"+i)
			newTableAuthor.push(user)
		}
		message.channel.send("Personnes ayant utilisé la commande : " + newTableAuthor);
	}

	if (message.content.startsWith(config.prefix + "test")) {
		var tableAuthor = table.get("loremAuteur");
		//console.log(Array(table);
	}
});


bot.login(config.token)
