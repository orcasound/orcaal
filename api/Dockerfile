FROM python:3.8 as base
WORKDIR /orcagsoc
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install -r requirements.txt

FROM python:3.8 as base_dependencies
WORKDIR /orcagsoc
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && ./aws/install && \
    rm -rf awscliv2.zip aws/
COPY --from=base /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY app app
COPY migrations migrations
ENV FLASK_APP app
EXPOSE 5000

FROM base_dependencies as dev
CMD ["sh", "-c", "flask db upgrade && flask run --host 0.0.0.0"]

FROM base_dependencies as prod
COPY boot.sh ./
RUN pip install gunicorn
ENTRYPOINT ["./boot.sh"]

FROM base_dependencies as test
COPY tests/ tests/
RUN pip install pytest
CMD ["python", "-m", "pytest"]
