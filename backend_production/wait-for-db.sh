#!/bin/sh
# wait-for-db.sh

set -e

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "postgres" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"

# Generate Prisma Client
>&2 echo "Generating Prisma Client..."
if ! npx prisma generate; then
  >&2 echo "ERROR: Failed to generate Prisma Client"
  exit 1
fi

# Run migrations
>&2 echo "Running database migrations..."
if ! npx prisma migrate deploy; then
  >&2 echo "ERROR: Database migration failed"
  exit 1
fi

>&2 echo "Database setup complete - starting application"

# Start the application
exec "$@"