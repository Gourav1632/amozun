#!/bin/sh

echo "Running database migrations..."
npm run migrate

echo "Starting Node.js application..."
exec npm start
