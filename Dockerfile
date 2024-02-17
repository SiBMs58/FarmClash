# Stage 1: Clone the repository
FROM alpine/git as clone_stage
WORKDIR /app
RUN git clone https://github.com/SiBMs58/FarmClash.git .

# Stage 2: Setup the application
FROM python:3.8-slim
WORKDIR /home/app

# Install nginx
RUN apt-get update && apt-get install -y nginx && apt-get clean

# Copy the application from the previous stage
COPY --from=clone_stage /app .

# Install application dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Setup nginx and the service
COPY nginx/webapp /etc/nginx/sites-available/webapp
RUN ln -s /etc/nginx/sites-available/webapp /etc/nginx/sites-enabled/webapp
COPY service/webapp.service /etc/systemd/system/webapp.service

EXPOSE 80

CMD service nginx start && \
    cd src/ProgDBTutor && \
    gunicorn --bind 0.0.0.0:5000 wsgi:app
