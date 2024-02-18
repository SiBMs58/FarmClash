# Syntax to specify base image
FROM python:3.8-slim

# Define the build-time variable
ARG PAT

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    postgresql \
    python3-psycopg2 \
    git \
    virtualenv \
    gunicorn \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /home/app

# Clone the application repository
RUN git clone https://$PAT:x-oauth-basic@github.com/SiBMs58/FarmClash.git .

# Set up Python environment and install dependencies
RUN virtualenv -p python3 env \
    && . env/bin/activate \
    && pip3 install -r requirements.txt

# Configure Nginx
COPY nginx/webapp /etc/nginx/sites-available/webapp
RUN ln -s /etc/nginx/sites-available/webapp /etc/nginx/sites-enabled/webapp \
    && echo "daemon off;" >> /etc/nginx/nginx.conf

# Database setup (simplified for Docker)
# This section is tricky because it involves initializing and running a Postgres database within the same container.
# It's typically recommended to run your database in a separate container or use a managed database service.
# For simplicity, this Dockerfile assumes the database is managed outside this container.

# Expose the port nginx is reachable on
EXPOSE 80

# Define the command to run your app using gunicorn
# Note: This command assumes that your app can be started with gunicorn directly.
# Adjust the command according to your app's actual start command.
CMD service nginx start && gunicorn --bind 0.0.0.0:5000 src/ProgDBTutor/wsgi:app
