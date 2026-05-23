#!/bin/bash

echo "============================================"
echo " Amozun Backend Setup Script for EC2"
echo "============================================"

# Define environment variables
read -p "Enter FRONTEND_URL (e.g. https://your-vercel-app.vercel.app): " FRONTEND_URL
read -p "Enter JWT_SECRET (or press enter to generate a random one): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -hex 32)
    echo "Generated JWT_SECRET"
fi

read -p "Enter RESEND_API_KEY: " RESEND_API_KEY
read -p "Enter STRIPE_SECRET_KEY: " STRIPE_SECRET_KEY
read -p "Enter STRIPE_WEBHOOK_SECRET: " STRIPE_WEBHOOK_SECRET
read -p "Enter POSTGRES_PASSWORD (or press enter to generate a random one): " POSTGRES_PASSWORD
if [ -z "$POSTGRES_PASSWORD" ]; then
    POSTGRES_PASSWORD=$(openssl rand -hex 16)
    echo "Generated POSTGRES_PASSWORD"
fi

echo "Creating .env file in backend/..."

cat <<EOF > backend/.env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_DB=amozun
JWT_SECRET=$JWT_SECRET
RESEND_API_KEY=$RESEND_API_KEY
FRONTEND_URL=$FRONTEND_URL
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET
EOF

echo ".env file created successfully in the backend folder!"
echo ""
echo "Starting Docker containers..."
cd backend
docker compose -f docker-compose.prod.yml up -d

echo "============================================"
echo " Setup complete! The backend is now running."
echo "============================================"
