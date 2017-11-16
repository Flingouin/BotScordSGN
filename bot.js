const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const PersistentCollection = require('djs-collection-persistent');
const table = new PersistentCollection({
	name: "table"
})
const nbAuthor = new PersistentCollection({
	name: "nbAuthor"
})
const ticket = new PersistentCollection({
	name: "ticket"
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


//System Ticket
	if(message.content.startsWith(config.prefix + "treset ")){
		ticket.set("idTicket", 1);
		message.channel.send("Tous les tickets ont été supprimé et le compteur remis à 0");
	}

	if(message.content.startsWith(config.prefix + "ticket"))
	{
		var msg = message.content;
		var msglength = msg.length;
		var pos = msg.search("!ticket");
		var idAuthor = message.author.id;
		var Author = message.author.tag;
		var idTicket = ticket.get("idTicket");
		msg = msg.slice(pos+7, msglength) + "\n";

		ticket.set("TicketIdAuthor" + idTicket, idAuthor);
		ticket.set("TicketAuthor"+ idTicket, Author);
		ticket.set("TicketMsg" + idTicket, msg)


		message.channel.send("Votre ticket a bien été pris en compte monseigneur. Il porte le numéro " + idTicket);
		idTicket++;
		ticket.set("idTicket", idTicket)

	}

	if(message.content.startsWith(config.prefix + "tget "))
	{
		if (message.member.roles.has("373199648254328834")) {

			var nbTicket = 0;
			for(i=1; i<=ticket.get("idTicket"); i++)
			{
				if(ticket.get("TicketMsg"+i)== null)//verif si les ticket trouver ne sont pas vide
				{

				}else{
				nbTicket++;
			}
			}
			if(nbTicket == -1){nbTicket=0;} // si pas de ticket = 0
			message.channel.send("Il y a " + nbTicket + " doléance(s) ouverte.")
			for(i=1; i<ticket.get("idTicket"); i++)
			{
				if(ticket.get("TicketMsg"+i) != null){
					message.channel.send("",{
						embed: {
							title: "Doléance " + i.toString(),
							description: ticket.get("TicketMsg"+i)+"\n"+ticket.get("TicketAuthor"+i),
							color: 0xff9900,
						}
					});
				}
			}
		}else{
			message.channel.send("Vous n'êtes pas mon maître !")
		}
	}


	if(message.content.startsWith(config.prefix +"tr "))
	{
		var msg = message.content;
		var ticketId = msg.split(" ");
		var ticketlth = ticketId.length;
		var msgfinal = "";
		var msglth =0;
		msg = ticketId.splice(2,ticketlth);
		msglth = msg.length;
		ticketId = ticketId.splice(1,1);
		ticketId = parseInt(ticketId);
		for(i=0; i<msglth; i++)
		{
			var msg2 = msg[i] + " ";
			msgfinal = msgfinal + msg2;
		}
		var msgUser = ticket.get("TicketMsg"+ticketId);
		var author = ticket.get("TicketAuthor"+ticketId);
		var msgReturn = msgUser +"\n\n" + msgfinal;
		ticket.set("TicketMsg" + ticketId, msgReturn + " " + message.author.tag +"\n");

	}


	if(message.content.startsWith(config.prefix + "tclose "))
	{
		var msg = message.content;
		var ticketId = msg.split(" ");
		var ticketlth = ticketId.length;
		ticketId = ticketId.splice(1,1);
		ticketId = parseInt(ticketId);
		ticket.delete("TicketIdAuthor" + ticketId);
		ticket.delete("TicketAuthor"+ ticketId);
		ticket.delete("TicketMsg" + ticketId);
	}

});


bot.login(config.token)
