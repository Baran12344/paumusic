const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { getText, getGuildLanguage } = require("../utils/language")

module.exports = {
  name: "oy",
  description: "Vote for the bot / Botu oyla",
  async execute(interaction, { client }) {
    const guildId = interaction.guild.id
    const lang = getGuildLanguage(guildId)

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
      .setColor("#7289DA")
      .setTitle(getText(guildId, "messages.vote.title"))
      .setDescription(getText(guildId, "messages.vote.description"))
      .addFields(
        {
          name: getText(guildId, "messages.vote.field_time"),
          value: getText(guildId, "messages.vote.time_value"),
          inline: true,
        },
        {
          name: getText(guildId, "messages.vote.field_repeat"),
          value: getText(guildId, "messages.vote.repeat_value"),
          inline: true,
        },
        {
          name: getText(guildId, "messages.vote.field_bonus"),
          value: getText(guildId, "messages.vote.bonus_value"),
          inline: true,
        },
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: getText(guildId, "messages.vote.footer") })
      .setTimestamp()

    await interaction.reply({ embeds: [embed], components: [voteButton] })
  },
}
