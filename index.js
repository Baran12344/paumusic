const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
  ActivityType,
  REST,
  Routes,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js")
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice")
const ytdl = require("ytdl-core")
const YouTubeAPI = require("youtube-search-api")
const SpotifyWebApi = require("spotify-web-api-node")

// ✅ Environment Variables ile Config
const config = {
  token: process.env.DISCORD_TOKEN,
  prefix: "!",
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
}

const handleRadioSelection = require("./handleRadioSelection")
const { getText, formatText, getGuildLanguage, setGuildLanguage } = require("./utils/language")
const { startKeepAlive } = require("./keep-alive")

// ✅ Keep-alive server'ı başlat
startKeepAlive()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
})

// Spotify API kurulumu
const spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
})

// Müzik kuyruğu ve bağlantıları saklamak için
const queues = new Map()
const connections = new Map()

// Voting sistemi için
const guildUsageTime = new Map()
const guildVoteStatus = new Map()
const USAGE_LIMIT = 30 * 60 * 1000 // 30 dakika

client.commands = new Collection()

// Komutları yükle
const fs = require("fs")
const path = require("path")

// Commands klasörü kontrolü
const commandsPath = path.join(__dirname, "commands")
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"))

  for (const file of commandFiles) {
    try {
      const command = require(`./commands/${file}`)
      if (command.name) {
        client.commands.set(command.name, command)
        console.log(`✅ Komut yüklendi: ${command.name}`)
      }
    } catch (error) {
      console.error(`❌ Komut yüklenirken hata (${file}):`, error.message)
    }
  }
}

client.once("ready", async () => {
  console.log(`🎵 ${client.user.tag} aktif!`)
  console.log(`📊 ${client.guilds.cache.size} sunucuda, ${client.users.cache.size} kullanıcıya hizmet veriyorum!`)

  // Slash komutları kaydet
  const commands = [
    new SlashCommandBuilder()
      .setName("play")
      .setDescription("Play music / Müzik çalar")
      .addStringOption((option) =>
        option.setName("query").setDescription("Song name or URL / Şarkı adı veya URL").setRequired(true),
      ),
    new SlashCommandBuilder().setName("radio").setDescription("Play radio / Radyo çalar"),
    new SlashCommandBuilder().setName("stop").setDescription("Stop music / Müziği durdur"),
    new SlashCommandBuilder().setName("skip").setDescription("Skip song / Şarkıyı atla"),
    new SlashCommandBuilder().setName("queue").setDescription("Show queue / Kuyruğu göster"),
    new SlashCommandBuilder().setName("stats").setDescription("Show bot statistics / Bot istatistikleri"),
    new SlashCommandBuilder().setName("ping").setDescription("Show bot ping / Bot pingi"),
    new SlashCommandBuilder().setName("oy").setDescription("Vote for the bot / Botu oyla"),
    new SlashCommandBuilder().setName("vote").setDescription("Vote for the bot / Botu oyla"),
    new SlashCommandBuilder().setName("dil").setDescription("Change language / Dil değiştir"),
    new SlashCommandBuilder().setName("language").setDescription("Change language / Dil değiştir"),
  ].map((command) => command.toJSON())

  const rest = new REST({ version: "10" }).setToken(config.token)

  try {
    console.log("🔄 Slash komutları kaydediliyor...")
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands })
    console.log("✅ Slash komutları başarıyla kaydedildi!")
  } catch (error) {
    console.error("❌ Slash komutları kaydedilirken hata:", error)
  }

  // Spotify token al
  try {
    const data = await spotifyApi.clientCredentialsGrant()
    spotifyApi.setAccessToken(data.body["access_token"])
    console.log("✅ Spotify API bağlantısı başarılı!")

    // Token yenileme
    setInterval(async () => {
      try {
        const data = await spotifyApi.clientCredentialsGrant()
        spotifyApi.setAccessToken(data.body["access_token"])
        console.log("🔄 Spotify token yenilendi")
      } catch (error) {
        console.error("❌ Spotify token yenileme hatası:", error)
      }
    }, 3600000) // 1 saat
  } catch (error) {
    console.log("❌ Spotify API bağlantı hatası:", error)
  }

  // Bot durumu
  client.user.setActivity("🎵 Müzik çalıyor | /oy ver!", { type: ActivityType.Listening })

  // Kullanım süresi kontrolü
  setInterval(checkUsageLimits, 5 * 60 * 1000)
})

function checkUsageLimits() {
  const now = Date.now()

  for (const [guildId, startTime] of guildUsageTime.entries()) {
    const usageTime = now - startTime

    if (usageTime >= USAGE_LIMIT && !guildVoteStatus.get(guildId)) {
      const guild = client.guilds.cache.get(guildId)
      if (guild && connections.has(guildId)) {
        const connection = connections.get(guildId)
        connection.destroy()
        connections.delete(guildId)
        queues.delete(guildId)

        sendVoteMessage(guild)
      }
    }
  }
}

async function sendVoteMessage(guild) {
  try {
    const channels = guild.channels.cache.filter((c) => c.type === 0)
    const musicChannel =
      channels.find(
        (c) =>
          c.name.includes("müzik") || c.name.includes("music") || c.name.includes("bot") || c.name.includes("genel"),
      ) || channels.first()

    if (!musicChannel) return

    const guildId = guild.id

    const voteButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(getText(guildId, "messages.vote.button_vote"))
        .setStyle(ButtonStyle.Link)
        .setURL(`https://top.gg/bot/${client.user.id}/vote`),
      new ButtonBuilder()
        .setCustomId("check_vote")
        .setLabel(getText(guildId, "messages.vote.button_voted"))
        .setStyle(ButtonStyle.Success),
    )

    const embed = new EmbedBuilder()
      .setColor("#FF6B6B")
      .setTitle(getText(guildId, "messages.usage_limit.title"))
      .setDescription(getText(guildId, "messages.usage_limit.description"))
      .addFields({
        name: getText(guildId, "messages.usage_limit.how_to_vote"),
        value: getText(guildId, "messages.usage_limit.vote_steps"),
      })
      .setFooter({ text: getText(guildId, "messages.usage_limit.footer") })
      .setTimestamp()

    await musicChannel.send({ embeds: [embed], components: [voteButton] })
  } catch (error) {
    console.error("Oy mesajı gönderilirken hata:", error)
  }
}

function startUsageTimer(guildId) {
  if (!guildUsageTime.has(guildId) && !guildVoteStatus.get(guildId)) {
    guildUsageTime.set(guildId, Date.now())
    console.log(`⏰ ${guildId} sunucusu için kullanım süresi başlatıldı`)
  }
}

function checkPremiumStatus(guildId) {
  const voteStatus = guildVoteStatus.get(guildId)
  if (!voteStatus) return false

  const now = Date.now()
  const voteTime = voteStatus.timestamp
  const twelveHours = 12 * 60 * 60 * 1000

  if (now - voteTime > twelveHours) {
    guildVoteStatus.delete(guildId)
    guildUsageTime.delete(guildId)
    return false
  }

  return true
}

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return

  const args = message.content.slice(config.prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()

  const command = client.commands.get(commandName)
  if (!command) return

  try {
    await command.execute(message, args, { client, queues, connections, spotifyApi })
  } catch (error) {
    console.error(error)
    const guildId = message.guild?.id || "default"
    message.reply(getText(guildId, "messages.errors.command_error"))
  }
})

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    // Dil komutları için özel kontrol
    if (["dil", "language"].includes(interaction.commandName)) {
      const command = client.commands.get("language")
      if (command) {
        try {
          await command.execute(interaction, { client, queues, connections, spotifyApi })
        } catch (error) {
          console.error(error)
          await interaction.reply({
            content: getText(interaction.guild.id, "messages.errors.command_error"),
            ephemeral: true,
          })
        }
      }
      return
    }

    // Vote komutları için özel kontrol
    if (["oy", "vote"].includes(interaction.commandName)) {
      const command = client.commands.get("oy")
      if (command) {
        try {
          await command.execute(interaction, { client, queues, connections, spotifyApi })
        } catch (error) {
          console.error(error)
          await interaction.reply({
            content: getText(interaction.guild.id, "messages.errors.command_error"),
            ephemeral: true,
          })
        }
      }
      return
    }

    // Premium kontrol
    if (!["ping", "stats"].includes(interaction.commandName)) {
      const guildId = interaction.guild.id
      const isPremium = checkPremiumStatus(guildId)

      if (!isPremium) {
        const usageTime = guildUsageTime.get(guildId)
        if (usageTime) {
          const elapsed = Date.now() - usageTime
          if (elapsed >= USAGE_LIMIT) {
            return interaction.reply({
              content: getText(guildId, "messages.usage_limit.time_up"),
              ephemeral: true,
            })
          }
        } else {
          startUsageTimer(guildId)
        }
      }
    }

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    try {
      await command.execute(interaction, { client, queues, connections, spotifyApi })
    } catch (error) {
      console.error(error)
      const reply = {
        content: getText(interaction.guild.id, "messages.errors.command_error"),
        ephemeral: true,
      }

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply)
      } else {
        await interaction.reply(reply)
      }
    }
  } else if (interaction.isButton()) {
    if (interaction.customId.startsWith("radio_")) {
      const radioStation = interaction.customId.replace("radio_", "")
      await handleRadioSelection(interaction, radioStation, { queues, connections })
    } else if (interaction.customId.startsWith("lang_")) {
      const language = interaction.customId.replace("lang_", "")
      const guildId = interaction.guild.id

      if (setGuildLanguage(guildId, language)) {
        const embed = new EmbedBuilder()
          .setColor("#00FF00")
          .setTitle(getText(guildId, "messages.language.changed_title"))
          .setDescription(getText(guildId, "messages.language.changed_desc"))
          .setFooter({ text: getText(guildId, "messages.language.footer") })
          .setTimestamp()

        await interaction.update({ embeds: [embed], components: [] })
      }
    } else if (interaction.customId === "check_vote") {
      const guildId = interaction.guild.id

      guildVoteStatus.set(guildId, {
        voted: true,
        timestamp: Date.now(),
      })
      guildUsageTime.delete(guildId)

      const embed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle(getText(guildId, "messages.vote.thanks_title"))
        .setDescription(getText(guildId, "messages.vote.thanks_description"))
        .addFields(
          {
            name: getText(guildId, "messages.vote.field_time"),
            value: getText(guildId, "messages.vote.time_value"),
            inline: true,
          },
          { name: "🎯 Status", value: "✅ Active", inline: true },
        )
        .setFooter({ text: getText(guildId, "messages.vote.thanks_footer") })
        .setTimestamp()

      await interaction.update({ embeds: [embed], components: [] })
    }
  }
})

client.on("voiceStateUpdate", (oldState, newState) => {
  if (oldState.member.user.bot && oldState.channelId && !newState.channelId) {
    const guildId = oldState.guild.id
    if (connections.has(guildId)) {
      connections.get(guildId).destroy()
      connections.delete(guildId)
      queues.delete(guildId)
    }
  }
})

// Hata yakalama
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error)
})

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error)
})

// ✅ Environment Variables kullan
client.login(config.token)
