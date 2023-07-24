# Meeting Scheduler Through Email

## Description

A basic meeting scheduler server with nest, prisma, postgresql, zod, docker and nodemailer.
It lets users set up meeting by sending emails and also has cancel meeting feature by sending mail.
CRUD endpoints are available at /api. By defaul swagger-ui should be located at
http://localhost:3333/api

## Docker Image
To use the dockerized setup, please run
```
docker-compose up
```
Please make sure port 3333 and 5432 are not currently being used. Alternatively, please adjust the PORT and DB_PORT configs in .env file.
(Sample config for .env is given in .env.sample.)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## For development
`dev-db.compose.yml` provides settings to access the db in a docker container.
```bash
cd docker/dev
docker compose -f dev-db.compose.yml up -d
npm i
npm exec prisma db push
```


## Stay in touch

- Author - [Suman Khadka](https://github.com/sumann7916)
