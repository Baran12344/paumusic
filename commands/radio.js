const { EmbedBuilder } = require("discord.js")
const { getText } = require("../utils/language")

module.exports = {
  name: "radio",
  description: "Play radio / Radyo çalar",
  async execute(interaction) {
    const guildId = interaction.guild.id

    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: getText(guildId, "messages.errors.not_in_voice"), ephemeral: true })
    }

    const embed = new EmbedBuilder()
      .setColor("#FF6B6B")
      .setTitle("📻 Radyo İstasyonları")
      .setDescription("Radyo özelliği yakında eklenecek!")
      .addFields(
        { name: "🎵 Radyo D", value: "Pop/Rock", inline: true },
        { name: "⚡ Power FM", value: "Hit Music", inline: true },
        { name: "🔥 Virgin Radio", value: "Rock/Alternative", inline: true },
        { name: "💫 Radyo Viva", value: "Turkish Pop", inline: true },
        { name: "😊 Joy FM", value: "Feel Good", inline: true },
        { name: "🌟 Radyo Fenomen", value: "Turkish Hits", inline: true },
      )
      .addFields({
        name: "ℹ️ Bilgi",
        value: "Ses özelliği yakında eklenecek! Şimdilik sadı radyo listesi gösteriliyor.",
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
