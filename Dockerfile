# Syntax to specify base image
FROM python:3.8-slim

# Define the build-time variable
ARG GITHUB_TOKEN

# Other Dockerfile instructions...

# Use the build-time variable in the git clone command
RUN git clone https://$PAT:x-oauth-basic@github.com/SiBMs58/FarmClash.git .
