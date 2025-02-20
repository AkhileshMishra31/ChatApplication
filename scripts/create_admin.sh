#!/bin/bash

echo "---------------Create Admin----------"
echo ""

MAC_OS="darwin-amd64"
LINUX_OS="linux-amd64"
ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m |sed 's/x86_64/amd64/g')" |sed 's/darwin-arm64/darwin-amd64/g')

# letter we will create roles and deafault permission with them
# node ./db-migrations/default-roles.data.js

read -p "Enter admin email: " ADMIN_EMAIL
read -p "Enter admim password: " ADMIN_PASSWORD

if [ -z "$ADMIN_EMAIL" ]
then
      echo "--------- Email should be not empty ---------";
      exit 0;
fi

if [ -z "$ADMIN_PASSWORD" ]
then
      echo "--------- Password should be not empty ---------";
      exit 0;
fi

if [ "$ARCH" = "$MAC_OS" ];then
sed -i "" "s/DEFAULT_ADMIN_EMAIL=ADMIN_EMAIL/DEFAULT_ADMIN_EMAIL='$ADMIN_EMAIL'/" ./.env
sed -i "" "s/DEFAULT_ADMIN_PASSWORD=ADMIN_PASSWORD/DEFAULT_ADMIN_PASSWORD='$ADMIN_PASSWORD'/" ./.env
else
sed -i "s/DEFAULT_ADMIN_EMAIL=ADMIN_EMAIL/DEFAULT_ADMIN_EMAIL='$ADMIN_EMAIL'/" ./.env
sed -i "s/DEFAULT_ADMIN_PASSWORD=ADMIN_PASSWORD/DEFAULT_ADMIN_PASSWORD='$ADMIN_PASSWORD'/" ./.env
fi

echo ""

node ./db_migrations/create_admin.data.js
# node ./db-migrations/default-admin-store.data.js
sleep 5

if [ "$ARCH" = "$MAC_OS" ];then
sed -i "" "s/DEFAULT_ADMIN_EMAIL='$ADMIN_EMAIL'/DEFAULT_ADMIN_EMAIL=ADMIN_EMAIL/" ./.env
sed -i "" "s/DEFAULT_ADMIN_PASSWORD='$ADMIN_PASSWORD'/DEFAULT_ADMIN_PASSWORD=ADMIN_PASSWORD/" ./.env
else
sed -i "s/DEFAULT_ADMIN_EMAIL='$ADMIN_EMAIL'/DEFAULT_ADMIN_EMAIL=ADMIN_EMAIL/" ./.env
sed -i "s/DEFAULT_ADMIN_PASSWORD='$ADMIN_PASSWORD'/DEFAULT_ADMIN_PASSWORD=ADMIN_PASSWORD/" ./.env
fi