#!/bin/bash
set -e

echo "🚀 Starting Influfinder Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
python << END
import asyncio
import asyncpg
import os
import time

async def wait_for_db():
    max_retries = 30
    retry_count = 0

    # Extract database connection info from DATABASE_URL
    db_url = os.getenv('DATABASE_URL', 'postgresql+asyncpg://influfinder:influfinder_password@postgres:5432/influfinder')

    # Convert asyncpg format
    if db_url.startswith('postgresql+asyncpg://'):
        db_url = db_url.replace('postgresql+asyncpg://', 'postgresql://')

    while retry_count < max_retries:
        try:
            conn = await asyncpg.connect(db_url.replace('postgresql://', 'postgresql://'))
            await conn.close()
            print("✅ Database is ready!")
            return True
        except Exception as e:
            retry_count += 1
            if retry_count >= max_retries:
                print(f"⚠️  Could not connect to database after {max_retries} attempts")
                print(f"   Error: {e}")
                print("   Starting anyway - database operations may fail initially")
                return False
            print(f"   Waiting for database... ({retry_count}/{max_retries})")
            await asyncio.sleep(2)

asyncio.run(wait_for_db())
END

echo "🔧 Running database migrations..."
# alembic upgrade head || echo "⚠️  Migrations skipped (not configured yet)"

echo "✅ Starting application..."

# Check if we're in production mode
if [ "$DEBUG" = "False" ] || [ "$DEBUG" = "false" ] || [ -z "$DEBUG" ]; then
    echo "🌐 Production mode - no auto-reload"
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
else
    echo "🔨 Development mode - with auto-reload"
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
fi
