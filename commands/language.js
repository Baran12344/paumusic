const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { getText, setGuildLanguage, getGuildLanguage } = require("../utils/language")

module.exports = {
  name: "language",
  description: "Change bot language / Bot dilini değiştir",
  async execute(interaction, { client }) {
    const guildId = interaction.guild.id
    const currentLang = getGuildLanguage(guildId)

    const languageButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("lang_tr")
        .setLabel(getText(guildId, "messages.language.button_turkish"))
        .setEmoji("🇹🇷")
        .setStyle(currentLang === "tr" ? ButtonStyle.Success : ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("lang_en")
        .setLabel(getText(guildId, "messages.language.button_english"))
        .setEmoji("🇺🇸")
        .setStyle(currentLang === "en" ? ButtonStyle.Success : ButtonStyle.Secondary),
    )

    const embed = new EmbedBuilder()
      .setColor("#0099FF")
      .setTitle(getText(guildId, "messages.language.title"))
      .setDescription(getText(guildId, "messages.language.description"))
      .setFooter({ text: getText(guildId, "messages.language.footer") })
      .setTimestamp()

    await interaction.reply({ embeds: [embed], components: [languageButtons] })
  },
}
