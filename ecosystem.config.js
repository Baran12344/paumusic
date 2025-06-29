module.exports = {
  apps: [
    {
      name: "discord-music-bot",
      script: "index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      // Restart strategies
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: "10s",
      // Advanced options
      kill_timeout: 5000,
      listen_timeout: 3000,
      // Monitoring
      monitoring: false,
    },
  ],
}
