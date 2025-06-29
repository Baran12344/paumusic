const { EmbedBuilder } = require("discord.js")
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice")
const ytdl = require("ytdl-core")
const YouTubeAPI = require("youtube-search-api")
const { getText, formatText } = require("../utils/language")

module.exports = {
  name: "play",
  description: "Play music / Müzik çalar",
  async execute(interaction, { client, queues, connections, spotifyApi }) {
    const guildId = interaction.guild.id

    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: getText(guildId, "messages.errors.not_in_voice"), ephemeral: true })
    }

    const query = interaction.options.getString("query")

    await interaction.deferReply()

    // Kuyruk oluştur
    if (!queues.has(guildId)) {
      queues.set(guildId, [])
    }

    const queue = queues.get(guildId)

    try {
      let songInfo

      // Spotify playlist kontrolü
      if (query.includes("spotify.com/playlist/")) {
        const playlistId = query.split("playlist/")[1].split("?")[0]
        const playlist = await spotifyApi.getPlaylist(playlistId)

        const embed = new EmbedBuilder()
          .setColor("#1DB954")
          .setTitle(getText(guildId, "messages.music.spotify_playlist_loading"))
          .setDescription(
            formatText(guildId, "messages.music.spotify_playlist_desc", {
              name: playlist.body.name,
              count: playlist.body.tracks.total,
            }),
          )
          .setThumbnail(playlist.body.images[0]?.url)

        await interaction.editReply({ embeds: [embed] })

        // Playlist şarkılarını YouTube'da ara ve kuyruğa ekle
        for (const item of playlist.body.tracks.items) {
          if (item.track && item.track.name) {
            const searchQuery = `${item.track.artists[0].name} ${item.track.name}`
            try {
              const searchResults = await YouTubeAPI.GetListByKeyword(searchQuery, false, 1)
              if (searchResults.items.length > 0) {
                const video = searchResults.items[0]
                queue.push({
                  title: item.track.name,
                  artist: item.track.artists[0].name,
                  url: `https://www.youtube.com/watch?v=${video.id}`,
                  thumbnail: video.thumbnail.thumbnails[0].url,
                  duration: item.track.duration_ms,
                  requester: interaction.user.tag,
                })
              }
            } catch (error) {
              console.log(`Şarkı bulunamadı: ${searchQuery}`)
            }
          }
        }

        if (queue.length > 0 && !connections.has(guildId)) {
          playMusic(interaction, queue, connections, guildId)
        }
        return
      }

      // Spotify şarkı kontrolü
      if (query.includes("spotify.com/track/")) {
        const trackId = query.split("track/")[1].split("?")[0]
        const track = await spotifyApi.getTrack(trackId)
        const searchQuery = `${track.body.artists[0].name} ${track.body.name}`

        const searchResults = await YouTubeAPI.GetListByKeyword(searchQuery, false, 1)
        if (searchResults.items.length > 0) {
          const video = searchResults.items[0]
          songInfo = {
            title: track.body.name,
            artist: track.body.artists[0].name,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            thumbnail: track.body.album.images[0]?.url,
            duration: track.body.duration_ms,
            requester: interaction.user.tag,
          }
        }
      }
      // YouTube URL kontrolü
      else if (ytdl.validateURL(query)) {
        const info = await ytdl.getInfo(query)
        songInfo = {
          title: info.videoDetails.title,
          artist: info.videoDetails.author.name,
          url: query,
          thumbnail: info.videoDetails.thumbnails[0].url,
          duration: Number.parseInt(info.videoDetails.lengthSeconds) * 1000,
          requester: interaction.user.tag,
        }
      }
      // YouTube arama
      else {
        const searchResults = await YouTubeAPI.GetListByKeyword(query, false, 1)
        if (searchResults.items.length > 0) {
          const video = searchResults.items[0]
          songInfo = {
            title: video.title,
            artist: video.channelTitle,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            thumbnail: video.thumbnail.thumbnails[0].url,
            duration: video.length,
            requester: interaction.user.tag,
          }
        }
      }

      if (!songInfo) {
        return interaction.editReply({ content: getText(guildId, "messages.errors.song_not_found") })
      }

      queue.push(songInfo)

      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle(getText(guildId, "messages.music.added_to_queue"))
        .setDescription(`**${songInfo.title}**\n${songInfo.artist}`)
        .setThumbnail(songInfo.thumbnail)
        .addFields(
          { name: getText(guildId, "messages.music.field_position"), value: `${queue.length}`, inline: true },
          { name: getText(guildId, "messages.music.field_requester"), value: songInfo.requester, inline: true },
        )

      await interaction.editReply({ embeds: [embed] })

      if (!connections.has(guildId)) {
        playMusic(interaction, queue, connections, guildId)
      }
    } catch (error) {
      console.error(error)
      await interaction.editReply({ content: getText(guildId, "messages.errors.play_error") })
    }
  },
}

async function playMusic(interaction, queue, connections, guildId) {
  if (queue.length === 0) {
    if (connections.has(guildId)) {
      connections.get(guildId).destroy()
      connections.delete(guildId)
    }
    return
  }

  const song = queue[0]

  try {
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    })

    connections.set(guildId, connection)

    const player = createAudioPlayer()
    const resource = createAudioResource(
      ytdl(song.url, {
        filter: "audioonly",
        highWaterMark: 1 << 25,
      }),
    )

    player.play(resource)
    connection.subscribe(player)

    const { getText } = require("../utils/language")
    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle(getText(guildId, "messages.music.now_playing"))
      .setDescription(`**${song.title}**\n${song.artist}`)
      .setThumbnail(song.thumbnail)
      .addFields(
        { name: getText(guildId, "messages.music.field_requester"), value: song.requester, inline: true },
        { name: getText(guildId, "messages.music.field_queue_count"), value: `${queue.length - 1}`, inline: true },
      )

    if (interaction.channel) {
      interaction.channel.send({ embeds: [embed] })
    }

    player.on(AudioPlayerStatus.Idle, () => {
      queue.shift()
      playMusic(interaction, queue, connections, guildId)
    })

    player.on("error", (error) => {
      console.error(error)
      queue.shift()
      playMusic(interaction, queue, connections, guildId)
    })
  } catch (error) {
    console.error(error)
    if (interaction.editReply) {
      const { getText } = require("../utils/language")
      await interaction.editReply({ content: getText(guildId, "messages.errors.voice_connect_error") })
    }
  }
}
