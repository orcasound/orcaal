#!/bin/sh
flask db upgrade
gunicorn -b :5000 --timeout 600 --access-logfile - --error-logfile - app:app