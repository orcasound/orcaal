To document how I got it all started:

acces_key
AKIAZN2WCXIFR6QV7SFN

secret access
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


First run ML service

docker run --name activelearning_ml -d -p 5001:5001 -e AWS_ACCESS_KEY_ID=AKIAZN2WCXIFR6QV7SFN -e AWS_SECRET_ACCESS_KEY=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 --rm jdiegors/activelearning_ml:latest


Start postgres

docker run --name postgres -p 5432:5432 -e POSTGRES_DB=orcagsoc -e POSTGRES_PASSWORD=postgres -d postgres

Start API

docker run --name activelearning_api -d -p 5000:5000 -e S3_LABELED_PATH=s3://orcagsoc/labeled_test/ -e S3_UNLABELED_PATH=s3://orcagsoc/unlabeled_test/ -e RETRAIN_TARGET=20 -e S3_MODEL_PATH=s3://orcagsoc/models/srkw_9.h5 -e IMG_WIDTH=607 -e IMG_HEIGHT=617 -e EPOCHS=1 --link postgres:dbserver -e DATABASE_URL=postgresql+psycopg2://postgres:postgres@dbserver/orcagsoc --link activelearning_ml:ml -e ML_ENDPOINT_URL=http://ml:5001 -e AWS_ACCESS_KEY_ID=xxx -e AWS_SECRET_ACCESS_KEY=xxx --rm jdiegors/activelearning_api:latest

Start web app

nvm use 16.6.1
npm install
npm start

