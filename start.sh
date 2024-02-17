#!/bin/sh
knex seed:run
pm2-runtime start ecosystem.config.js --env production