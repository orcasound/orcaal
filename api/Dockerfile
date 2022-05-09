FROM python:3.8 as base
WORKDIR /orcagsoc
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN apt install unzip
RUN unzip awscliv2.zip
RUN ./aws/install

FROM python:3.8 as dev
COPY --from=base /usr/local/bin/aws /usr/local/bin/aws
COPY --from=base /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY app app
COPY migrations migrations
COPY boot.sh ./
ENV FLASK_APP app
EXPOSE 5000
ENTRYPOINT ["./boot.sh"]

FROM python:3.8 as test
WORKDIR /orcagsoc
COPY --from=base /usr/local/bin/aws /usr/local/bin/aws
COPY --from=base /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY app/ app/
COPY tests/ tests/
CMD ["python", "-m", "pytest"]
