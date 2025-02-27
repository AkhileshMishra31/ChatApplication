#!/bin/bash

echo "--------------- Create Admin ---------------"
echo ""

read -p "Enter admin email: " ADMIN_EMAIL
read -p "Enter admin password: " ADMIN_PASSWORD

if [ -z "$ADMIN_EMAIL" ]; then
    echo "❌ Email should not be empty"
    exit 1
fi

if [ -z "$ADMIN_PASSWORD" ]; then
    echo "❌ Password should not be empty"
    exit 1
fi

# Update .env file safely
sed -i "s/^DEFAULT_ADMIN_EMAIL=.*/DEFAULT_ADMIN_EMAIL='$ADMIN_EMAIL'/" .env
sed -i "s/^DEFAULT_ADMIN_PASSWORD=.*/DEFAULT_ADMIN_PASSWORD='$ADMIN_PASSWORD'/" .env

echo "✅ Updated .env file"
echo "--------------------------------------------"

# Load environment variables and run script
export DEFAULT_ADMIN_EMAIL="$ADMIN_EMAIL"
export DEFAULT_ADMIN_PASSWORD="$ADMIN_PASSWORD"

# Debugging: Check if environment variables are set
echo "📧 Admin Email: $DEFAULT_ADMIN_EMAIL"
echo "🔑 Admin Password: $DEFAULT_ADMIN_PASSWORD"

# Run Node.js script
npx ts-node ./db_migrations/seed.ts

# Restore default values in .env
sed -i "s/^DEFAULT_ADMIN_EMAIL=.*/DEFAULT_ADMIN_EMAIL=ADMIN_EMAIL/" .env
sed -i "s/^DEFAULT_ADMIN_PASSWORD=.*/DEFAULT_ADMIN_PASSWORD=ADMIN_PASSWORD/" .env

echo "✅ Reset .env file to defaults"
