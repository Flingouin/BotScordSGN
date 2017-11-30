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

const player = new PersistentCollection({
	name: "player"
})
const config = require("./botconfig.json")
//let cookie = JSON.parse(fs.readFileSync("./cookie.json", "utf8"));
//const fs = require("fs");
var idMsgCheck = null;
var idUsers = null;

bot.on("ready", async() =>{

	try
		{
			let link = await bot.generateInvite(["ADMINISTRATOR"]);
			console.log(link);
		}
	catch(e)
		{
			console.log(e.stack);
		}
	bot.user.setGame("sauver des princesses");
	bot.user.setStatus("dnd");

});

bot.on('message', message => {
	if(message.content.startsWith(config.prefix + "lorem")){
		message.channel.send("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
		var authorMsg = message.author.username;
		var nbAuthors = nbAuthor.get("nbAuthor");
		var verif = 0;
		for(i=0 ; i<=nbAuthors ; i++)
		{
			if (table.get("user"+i)==authorMsg)
			{
				verif = 1;
				break;
			}
		}
		if(verif == 0)
			{
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
		for(i=0; i<=nbAuthors; i++)
			{
				user = table.get("user"+i)
				newTableAuthor.push(user)
			}
		message.channel.send("Personnes ayant utilisé la commande : " + newTableAuthor);
	}





//System Ticket
	if(message.content.startsWith(config.prefix + "treset")){ //reset les tickets
		for (i=-1;i<=idTicket;i++)
			{
				ticket.delete("TicketMsg"+i,"");
				ticket.delete("TicketAuthor"+i, "");
				ticket.delete("TicketIdAuthor"+i);
			}
		ticket.set("idTicket", 0);
		message.channel.send("Tous les tickets ont été supprimé et le compteur remis à 0");
	}

	if(message.content.startsWith(config.prefix + "ticket "))//créer un ticket
	{
		var msg = message.content;
		var msglength = msg.length;
		var pos = msg.search("!ticket");
		var idAuthor = message.author.id;
		var Author = message.author.tag;
		var idTicket = ticket.get("idTicket");
		var verif = 0;
		msg = msg.slice(pos+7, msglength) + "\n";
		for(i=0; i<idTicket;i++)
		{
			console.log(ticket.get("TicketIdAuthor"+i));
				if(ticket.get("TicketIdAuthor"+i) == idAuthor)
					{
						verif = 1;
						break
					}
				else{}
		}
		if(verif == 0)
			{
				ticket.set("TicketIdAuthor" + idTicket, idAuthor);
				ticket.set("TicketAuthor"+ idTicket, Author);
				ticket.set("TicketMsg" + idTicket, msg)
				message.channel.send("Votre ticket a bien été pris en compte monseigneur. Il porte le numéro " + (idTicket+1));
				idTicket++;
				ticket.set("idTicket", idTicket)
			}
		else
			{
				message.channel.send("Vous avez déjà ouvert un ticket. Attendez que mes seigneurs répondes à votre requête avant d'en ouvrir un autre !")
			}
	}

	if(message.content.startsWith(config.prefix + "tget")){ //recup ticket ouvert
		if (message.member.roles.has("373199648254328834"))
			{
			var nbTicket = 0;
			for(i=0; i<ticket.get("idTicket"); i++)
				{
					if(ticket.get("TicketMsg"+i)== null)//verif si les ticket trouver ne sont pas vide
						{}
					else
						{
							nbTicket++;
						}
				}
			message.channel.send("Il y a " + nbTicket + " doléance(s) ouverte.")
			for(i=0; i<ticket.get("idTicket"); i++)
				{
					if(ticket.get("TicketMsg"+i) != null)
						{
							message.channel.send("",{
								embed: {
									title: "Doléance " + (i+1).toString(),
									description: ticket.get("TicketMsg"+i)+"\n"+ticket.get("TicketAuthor"+i),
									color: 0xff9900,
								}
							});
					}
				}
		}
		else
		{
			message.channel.send("Vous n'êtes pas mon maître !")
		}
	}


	if(message.content.startsWith(config.prefix +"tr ")) //réponse ticket
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


	if(message.content.startsWith(config.prefix + "tclose ")) //ferme un ticket
	{
		var msg = message.content;
		var ticketId = msg.split(" ");
		var ticketlth = ticketId.length;
		ticketId = ticketId.splice(1,1);
		ticketId = parseInt(ticketId);
		ticket.delete("TicketIdAuthor" + (ticketId-1));
		ticket.delete("TicketAuthor"+ (ticketId-1));
		ticket.delete("TicketMsg" + (ticketId-1));
	}





 // System distribution code tournoi

	if(message.content.startsWith(config.prefix + "open"))
	{
		message.channel.send("La soirée est ouverte ! Prouvez votre présence !").then(function (message){
			message.react("✅");
			idMsgCheck = message.id;
		});
	}

	if(message.content.startsWith(config.prefix + "login "))
	{
		var msg = message.content;
		var msg = msg.split(" ");
		var msglth = msg.length;
		var msgfinal = "";
		msg = msg.splice(1,msglth);
		for (i=0; i< (msglth-1); i++)
		{
			msgfinal = msgfinal + " " + msg[i];
		}
		player.set("PLol" + message.author.id, msgfinal);
	}


});


bot.on('messageReactionAdd', reaction => {


console.log(reaction.message.author.bot);
console.log(reaction.message.id);
console.log(idMsgCheck);
console.log("Wololo\n");

	if(reaction.message.id == idMsgCheck)
	{
		idUsers = reaction.users.map(user => user.name);
	}

});

bot.login(config.token)
