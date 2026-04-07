#!/bin/bash
# Install dependencies
python -m pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Note: Migrations are typically not possible during Vercel build 
# due to network restrictions. Use /api/migrate/ after deployment.
