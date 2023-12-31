require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('0_0');

  const ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('This is a ping command!');

  client.application.commands.create(ping);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content === '!COOOM') {
    message.reply('@firebolt.');
  }
});

client.on('messageCreate', async (message) => {
  if (message.content === '!GO') {
    message.channel.send('@0_0');
  }
});

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!play')) {
    const args = message.content.split(' ');
    if (args.length < 2) {
      return message.reply('Please provide a YouTube URL.');
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('You must be in a voice channel to use this command.');
    }

    
    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      const url = args[1];
      const stream = ytdl(url, {
        quality: 'lowest',
        filter: 'audioonly', 
        highWaterMark: 1 << 25, 
      });
      

      
      const audioResource = createAudioResource(stream, {
        inputType: 'webm/opus',
        inlineVolume: true, 
      });
      

      
      const audioPlayer = createAudioPlayer();
      audioPlayer.play(audioResource);
      audioPlayer.on(VoiceConnectionStatus.Destroyed, () => {
        voiceChannel.leave();
      });

      
      connection.subscribe(audioPlayer);
    } catch (error) {
      console.error(error);
    }
  }
});

const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());


client.login(process.env.TOKEN);
