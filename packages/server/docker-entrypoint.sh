#!/bin/sh
set -e

echo "➜ Waiting for database and running migrations..."
# production — конфиг из sequelize.config.js / env Docker
npx sequelize-cli db:migrate --env production

echo "➜ Starting server..."
exec node /app/index.js
