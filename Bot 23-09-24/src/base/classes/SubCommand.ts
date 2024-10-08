import ISubCommand from "../interfaces/ISubCommand";
import ISubCommandOptions from "../interfaces/ISubCommandOptions";
import CustomClient from "./CustomClient";

export default class SubCommand implements ISubCommand {
    client: CustomClient;
    name: string;

    constructor(client: CustomClient, options: ISubCommandOptions) {
        this.client = client;
        this.name = options.name;
    }

    Execute(interaction: ChatInputCommandInteraction): void {
    }
    
}