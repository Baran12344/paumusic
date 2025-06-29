const { EmbedBuilder } = require("discord.js")
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice")
const { getText, formatText } = require("./utils/language")

// Radyo istasyonları listesi
const radioStations = {
  radyo_d: {
    name: "Radyo D",
    url: "http://46.20.3.204/listen/radyo_d/radio.mp3",
    emoji: "🎵",
    genre: "Pop/Rock",
  },
  power_fm: {
    name: "Power FM",
    url: "http://46.20.3.204/listen/power_fm/radio.mp3",
    emoji: "⚡",
    genre: "Hit Music",
  },
  virgin_radio: {
    name: "Virgin Radio",
    url: "http://46.20.3.204/listen/virgin_radio_turkey/radio.mp3",
    emoji: "🔥",
    genre: "Rock/Alternative",
  },
  radyo_viva: {
    name: "Radyo Viva",
    url: "http://46.20.3.204/listen/radyo_viva/radio.mp3",
    emoji: "💫",
    genre: "Turkish Pop",
  },
  joy_fm: {
    name: "Joy FM",
    url: "http://46.20.3.204/listen/joy_fm/radio.mp3",
    emoji: "😊",
    genre: "Feel Good",
  },
  radyo_fenomen: {
    name: "Radyo Fenomen",
    url: "http://46.20.3.204/listen/radyo_fenomen/radio.mp3",
    emoji: "🌟",
    genre: "Turkish Hits",
  },
  best_fm: {
    name: "Best FM",
    url: "http://46.20.3.204/listen/best_fm/radio.mp3",
    emoji: "🏆",
    genre: "Best Hits",
  },
  radyo_mydonose: {
    name: "Radyo Mydonose",
    url: "http://46.20.3.204/listen/radyo_mydonose/radio.mp3",
    emoji: "🎧",
    genre: "Electronic",
  },
  slow_turk: {
    name: "Slow Türk",
    url: "http://46.20.3.204/listen/slow_turk/radio.mp3",
    emoji: "💝",
    genre: "Slow/Romantic",
  },
  radyo_turkuvaz: {
    name: "Radyo Turkuvaz",
    url: "http://46.20.3.204/listen/radyo_turkuvaz/radio.mp3",
    emoji: "🇹🇷",
    genre: "Turkish Music",
  },
}

async function handleRadioSelection(interaction, stationKey, { queues, connections }) {
  const station = radioStations[stationKey]
  const guildId = interaction.guild.id

  if (!station) {
    return interaction.reply({ content: getText(guildId, "messages.errors.invalid_radio"), ephemeral: true })
  }

  try {
    // Mevcut müziği durdur
    if (connections.has(guildId)) {
      connections.get(guildId).destroy()
    }
    queues.delete(guildId)

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    })

    connections.set(guildId, connection)

    const player = createAudioPlayer()
    const resource = createAudioResource(station.url, {
      inlineVolume: true,
    })

    player.play(resource)
    connection.subscribe(player)

    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle(getText(guildId, "messages.radio.playing_title"))
      .setDescription(
        formatText(guildId, "messages.radio.playing_desc", {
          emoji: station.emoji,
          name: station.name,
        }),
      )
      .addFields(
        { name: getText(guildId, "messages.radio.field_genre"), value: station.genre, inline: true },
        { name: getText(guildId, "messages.radio.field_starter"), value: interaction.user.tag, inline: true },
        {
          name: getText(guildId, "messages.radio.field_status"),
          value: getText(guildId, "messages.radio.status_live"),
          inline: true,
        },
      )
      .setFooter({ text: getText(guildId, "messages.radio.playing_footer") })
      .setTimestamp()

    await interaction.update({
      embeds: [embed],
      components: [],
    })

    player.on("error", (error) => {
      console.error("Radyo çalma hatası:", error)
      interaction.followUp({ content: getText(guildId, "messages.errors.radio_error"), ephemeral: true })
    })
  } catch (error) {
    console.error("Radyo bağlantı hatası:", error)
    await interaction.reply({ content: getText(guildId, "messages.errors.radio_connect_error"), ephemeral: true })
  }
}

module.exports = handleRadioSelection
