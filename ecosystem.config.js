module.exports = {
  apps: [
    {
      name: 'thecookflow',
      script: 'production-start.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      watch: false,
      ignore_watch: ['node_modules', 'dist', 'logs'],
      min_uptime: '10s',
      max_restarts: 5,
      autorestart: true
    }
  ]
};