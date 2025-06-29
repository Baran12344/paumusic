const fs = require("fs")
const path = require("path")

// Dil dosyalarını yükle
const languages = {}
const languageFiles = fs.readdirSync(path.join(__dirname, "../languages")).filter((file) => file.endsWith(".json"))

for (const file of languageFiles) {
  const langCode = file.replace(".json", "")
  languages[langCode] = require(`../languages/${file}`)
}

// Sunucu dil ayarları (gerçek uygulamada veritabanında saklanmalı)
const guildLanguages = new Map()

function getGuildLanguage(guildId) {
  return guildLanguages.get(guildId) || "tr" // Default Türkçe
}

function setGuildLanguage(guildId, language) {
  if (languages[language]) {
    guildLanguages.set(guildId, language)
    return true
  }
  return false
}

function getText(guildId, path) {
  const lang = getGuildLanguage(guildId)
  const langData = languages[lang] || languages["tr"]

  const keys = path.split(".")
  let result = langData

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key]
    } else {
      // Fallback to Turkish if key not found
      result = languages["tr"]
      for (const fallbackKey of keys) {
        if (result && typeof result === "object" && fallbackKey in result) {
          result = result[fallbackKey]
        } else {
          return path // Return path if not found
        }
      }
      break
    }
  }

  return result || path
}

function formatText(guildId, path, replacements = {}) {
  let text = getText(guildId, path)

  for (const [key, value] of Object.entries(replacements)) {
    text = text.replace(new RegExp(`{${key}}`, "g"), value)
  }

  return text
}

function getAvailableLanguages() {
  return Object.keys(languages)
}

module.exports = {
  getGuildLanguage,
  setGuildLanguage,
  getText,
  formatText,
  getAvailableLanguages,
  languages,
}
