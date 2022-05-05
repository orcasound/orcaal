#!/bin/sh
flask db upgrade
gunicorn -b :5000 --access-logfile - --error-logfile - app:app