// ==========================================
// PM2 — SWIVIQ production (2 processus)
//   swiviq-api : backend Express  -> port 4001
//   swiviq-ssr : frontend Angular -> port 4002
// ==========================================
module.exports = {
  apps: [
    {
      name: 'swiviq-api',
      cwd: '/var/www/swiviq/backend',
      script: 'src/index.js',
      env: { NODE_ENV: 'production' },
      max_memory_restart: '300M',
    },
    {
      name: 'swiviq-ssr',
      cwd: '/var/www/swiviq/frontend',
      script: 'dist/frontend/server/server.mjs',
      env: { NODE_ENV: 'production', PORT: 4002 },
      max_memory_restart: '300M',
    },
  ],
};
