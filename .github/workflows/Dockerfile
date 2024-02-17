# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /home/app

# Install nginx
RUN apt-get update && apt-get install -y nginx && apt-get clean

# Copy over and install application dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Clone the application repository
RUN apt-get update && apt-get install -y git
RUN git clone https://github.com/JoeyDP/PPDB-Template-App.git .

# Copy nginx and service configuration files into the container
COPY nginx/webapp /etc/nginx/sites-available/webapp
RUN ln -s /etc/nginx/sites-available/webapp /etc/nginx/sites-enabled/webapp
COPY service/webapp.service /etc/systemd/system/webapp.service

# Expose port 80 to the outside world
EXPOSE 80

# Start nginx and the application using gunicorn
CMD service nginx start && \
    cd src/ProgDBTutor && \
    gunicorn --bind 0.0.0.0:5000 wsgi:app
