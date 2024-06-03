# Use the official Python Alpine image from the Docker Hub
FROM python:3.9-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Run the command to execute the Python code
CMD ["python", "./your-daemon-or-main-script.py"]
