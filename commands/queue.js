const { EmbedBuilder } = require("discord.js")
const { getText, formatText } = require("../utils/language")

module.exports = {
  name: "queue",
  description: "Show queue / Kuyruğu göster",
  async execute(interaction, { queues }) {
    const guildId = interaction.guild.id
    const queue = queues.get(guildId)

    if (!queue || queue.length === 0) {
      return interaction.reply({ content: getText(guildId, "messages.errors.empty_queue"), ephemeral: true })
    }

    const embed = new EmbedBuilder()
      .setColor("#0099FF")
      .setTitle(getText(guildId, "messages.music.queue_title"))
      .setDescription(
        queue
          .slice(0, 10)
          .map(
            (song, index) =>
              `${index === 0 ? "🎵" : `${index + 1}.`} **${song.title}** - ${song.artist}\n👤 ${song.requester}`,
          )
          .join("\n\n"),
      )
      .setFooter({ text: formatText(guildId, "messages.music.queue_footer", { count: queue.length }) })

    if (queue.length > 10) {
      embed.addFields({
        name: "📝 Note",
        value: formatText(guildId, "messages.music.queue_more", { count: queue.length - 10 }),
      })
    }

    await interaction.reply({ embeds: [embed] })
  },
}
