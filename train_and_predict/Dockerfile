FROM tensorflow/tensorflow:latest-gpu

WORKDIR /orcagsoc

RUN pip install --upgrade pip && \
    pip install Pillow==7.2.0 scikit-learn==0.23.2 python-dotenv==0.14.0 flask==1.1.2 itsdangerous==2.0.1 gunicorn && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    apt install unzip && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf /var/lib/apt/lists/* awscliv2.zip aws/ && \
    apt-get purge -y --auto-remove curl unzip && \
    apt-get clean

COPY app.py train.py predict.py ./

ENV FLASK_APP app.py

EXPOSE 5001
CMD gunicorn -b :5001 --access-logfile - --error-logfile - app:app --timeout 100000