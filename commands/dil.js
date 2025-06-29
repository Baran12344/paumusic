// Türkçe alias için language komutunu kullan
const languageCommand = require("./language")

module.exports = {
  name: "dil",
  description: "Bot dilini değiştir",
  async execute(interaction, options) {
    return languageCommand.execute(interaction, options)
  },
}
