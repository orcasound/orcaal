FROM python:3.8 as base
WORKDIR /orcagsoc
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

FROM python:3.8 as base_dependencies
WORKDIR /orcagsoc
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && ./aws/install && \
    rm -rf awscliv2.zip aws/
COPY --from=base /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY app.py train.py predict.py ./
ENV FLASK_APP app.py
EXPOSE 5001

FROM base_dependencies as dev
CMD flask run --host 0.0.0.0

FROM base_dependencies as prod
RUN pip install gunicorn
CMD gunicorn -b :5001 --access-logfile - --error-logfile - app:app --timeout 100000
