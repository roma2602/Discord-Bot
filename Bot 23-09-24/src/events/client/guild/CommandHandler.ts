import {Events} from "discord.js"
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";
import Command from "../../../base/classes/Command";

export default class CommandHandler extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Command handler event",
            once: false
        })
    }

    Execute(interaction: ChatInputCommandInteraction): void{
        if (!interaction.isChatInputCommand()) return;

        const command: Command = this.client.commands.get(interaction.commandName)!;

        //@ts-ignore
        if (!command) return interaction.reply({ content: "This command does not exits", ephemeral: true}) && this.client.commands.delete(interaction.commandName) ;

        const {cooldown} = this.client;
        if(!cooldown.has(command.name)) cooldown.set(command.name, new Collection());

        const now = Date.now();
        const timestamps = cooldown.get(command.name)!;
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(interaction.user.id) && (now < (timestamps.get(interaction.user.id) || 0) + cooldownAmount))
            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(`❌ Plase wait another \`${((((timestamps.get(interaction.user.id) || 0) + cooldownAmount) - now) /1000).toFixed(1)}\` seconds to run this commnad!`)
            ], ephemeral: true});

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try{
            const subCommandGroup = interaction.options.getSubcommandGroup(false);
            const subCommand = `${interaction.commnadName}${subCommandGroup ? `.${subCommandGroup}` : ""}.${interaction.options.getSubcommand(false) || ""}`

            return this.client.subCommands.get(subCommand)?.Execute(interaction) || command.Execute(interaction);
        } catch(ex) {
            console.log(ex);
        }
        

    }
    


}