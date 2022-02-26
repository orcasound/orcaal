FROM python:3.8
WORKDIR /orcagsoc
COPY Pipfile Pipfile.lock boot.sh ./

RUN pip install pipenv && \
    pipenv install --deploy --ignore-pipfile && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    apt install unzip && \
    unzip awscliv2.zip && \
    ./aws/install && \
    chmod +x boot.sh && \
    rm -rf /var/lib/apt/lists/* awscliv2.zip aws/ && \
    apt-get purge -y --auto-remove curl unzip && \
    apt-get clean

COPY app app
COPY migrations migrations

ENV FLASK_APP app

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]