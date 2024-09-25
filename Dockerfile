FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Working directory
WORKDIR /app

# Copy Project files
COPY ./requirements.txt .
COPY ./backend/ .

# Virtual Enviroment
RUN python3 -m venv /app/myenv
ENV PATH="/app/myenv/bin:$PATH"

# Python Dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Django Migrations
RUN python3 manage.py makemigrations
RUN python3 manage.py migrate

EXPOSE 8080

# START : Django Development server
CMD [ "python3", "manage.py", "runserver", "0.0.0:8000" ]

