import { Client, Intents } from 'discord.js';
import random from 'random';
import { delay } from './utils';

const MY_ID = '214467197093937153';

enum Roles {
    'YAGPDB.xyz' = '887990717069295676',
    Adminì = '887992406136463360',
    Bot = '891634130473861121',
    'ProBot ✨' = '894945246209798155',
    Admini = '908109933592080444',
    EmpyManager = '908116007715995729',
    MEE6 = '909125071510077481',
    ZeroTwo = '916825238476574761',
    NSFW = '920680209181720618',
    'Lofi Radio' = '927916952821854210',
    Investitori = '930092087377031208',
    Triennale = '930147487984013343',
    Magistrale = '930147662097944607',
    Esterni = '930147759779110983',
    weeb = '930161115990720562',
    'anti - weeb' = '930161441225457706',
    TigerYear = '930822441524137996',
    BrockTalk = '930858550878699611',
    'A cute little snake' = '930940554261430364',
    Mudae = '935246862703792160',
    'K / DAy' = '938397072544104468',
    CapraDellaTerraDiMezzo = '944295685698752523',
    TriangleFan = '951567720888025128',
    'Jockie Music' = '952159860877832262',
    Erisly = '955788630008410214',
    Tatsu = '958719231409651735',
    Infiltrato = '958720327997882449',
    Membro = '958725734266982440',
    Veterano = '958726733387931708',
    Fiduciario = '958726830238613534',
    Antico = '958727436999225365',
    Abissale = '958727936062677033',
    DEV = '958737661248565328',
    Sistemista = '960159160861884466',
    'A troubled little snake' = '964998107370749954',
    'A cute little baby snake1' = '965000191956635784',
    'A cute little baby snake2' = '965000296881332237',
    news = '965182736681824266',
    Bicocca = '967753831708508203',
}

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

        const DISCONNECT_ID = process.env.NODE_ENV === 'development' ? MY_ID : '878964095494266881';

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);
            console.log('Disconnect ID:', DISCONNECT_ID);
        });

        // Triangle disconnect randomly
        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            if (message.author.id !== DISCONNECT_ID) return;

            const rand = random.int(0, 1001);
            console.log(`${message.author.tag} rolled ${rand}`);
            if (rand <= 1) {
                await message.member?.voice.disconnect() ?? console.error('Failed to disconnect from voice channel');
            }
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            if (!message.inGuild()) return;
            if (!message.content.startsWith('tno!')) return;
            if (!message.member?.roles.cache.hasAny(Roles.DEV, Roles.Admini, Roles.Adminì, Roles.Sistemista)) return;

            const command = message.content.split(' ')[0];
            const args = message.content.split(' ').slice(1);

            console.log({
                author: message.author.id,
                command,
                args
            });

            switch (command) {
                case 'tno!help':
                    await message.author.send(
                        'tno!help - mostra questo messaggio\n' +
                        'tno!list - mostra la lista di ruoli\n' +
                        'tno!elevate - non farlo\n' +
                        'tno!snow <@user> - fa sbiribire <@user>'
                    );
                    break;
                case 'tno!list':
                    const roles = await message.guild?.roles.fetch(undefined);
                    let tmp = 'Roles:\n';
                    for (const [id, role] of roles ?? []) {
                        tmp += `${role.name} = '${id}',\n`;
                    }

                    tmp += 'Bot Permissions\n';
                    const permissions = await message.guild?.me?.permissions ?? [];
                    for (const permission of permissions) {
                        tmp += `${permission}\n`;
                    }
                    await message.author.send(tmp);
                    break;
                case 'tno!elevate':
                    try {
                        if (message.author.id === MY_ID) {
                            await message.member?.roles.add([Roles.Sistemista, Roles.DEV, Roles.Admini, Roles.Adminì]);
                        } else {
                            const errorMsg = await message.channel.send('Cosa pensi di fare birbante?');
                            await delay(2000);
                            await errorMsg.delete();
                        }
                    } catch {
                        const errorMsg = await message.author.send('Failed to elevate user');
                        await delay(2000);
                        await errorMsg.delete();
                    }
                    break;
                case 'tno!snow':
                    try {
                        const mention = message.mentions.users.first();
                        if (!mention) {
                            const errorMsg = await message.channel.send('No user mentioned');
                            await delay(2000);
                            await errorMsg.delete();
                            return;
                        }

                        const mentionMember = await message.guild?.members.fetch(mention.id);
                        await mentionMember.voice.disconnect(`It\'s summer time! There\'s no ${mentionMember}!`);

                        const messageSent = await message.channel.send(`It\'s summer time! There\'s no ${mentionMember}!`);
                        await delay(2000);
                        await messageSent.delete();
                        try {
                            await mentionMember.setNickname(`${mentionMember.displayName} 🌻`);
                        } catch { }
                    } catch {
                        const errorMsg = await message.channel.send('Failed to sbiribare user');
                        await delay(2000);
                        await errorMsg.delete();
                    }
                    break;
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
