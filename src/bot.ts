import { Client, Intents } from 'discord.js';
import { MY_ID, TRIANGLE_ID } from './constants';
import random from 'random';

export class Bot {
    private readonly client: Client;
    private readonly token: string;

    constructor() {
        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS
            ]
        });
        this.token = process.env.BOT_TOKEN;
        this.configure();
    }

    private async configure(): Promise<void> {

        const DISCONNECT_ID = process.env.NODE_ENV === 'development' ? MY_ID : TRIANGLE_ID;

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);
        });

        // Triangle disconnect randomly
        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            if (message.author.id !== DISCONNECT_ID) return;

            
            const rand = random.int(0, 5001);
            console.log(`${message.author.tag} rolled ${rand}`);
            if (rand <= 50) {
                await message.member?.voice.disconnect() ?? console.error('Failed to disconnect from voice channel');
            }
        });
    }

    async start(): Promise<void> {
        this.client.login(this.token);
    }

    async stop(): Promise<void> {
        this.client.destroy();
    }
}
