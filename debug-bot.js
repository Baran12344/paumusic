// Hızlı test için basit bot
const { Client, GatewayIntentBits } = require("discord.js")

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
})

client.once("ready", () => {
  console.log("🎵 Bot başarıyla bağlandı!")
  console.log(`📊 Bot adı: ${client.user.tag}`)
  console.log(`📊 Sunucu sayısı: ${client.guilds.cache.size}`)
  console.log(`📊 Kullanıcı sayısı: ${client.users.cache.size}`)

  // Bot durumunu ayarla
  client.user.setActivity("🎵 Test modunda!", { type: "LISTENING" })
})

client.on("error", (error) => {
  console.error("❌ Bot hatası:", error)
})

client.on("disconnect", () => {
  console.log("⚠️ Bot bağlantısı kesildi!")
})

// Environment variable ile token
const token = process.env.DISCORD_TOKEN

if (!token) {
  console.error("❌ DISCORD_TOKEN environment variable bulunamadı!")
  process.exit(1)
}

console.log("🔄 Bot başlatılıyor...")
client.login(token).catch((error) => {
  console.error("❌ Bot giriş hatası:", error)
})
