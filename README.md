# rent-auto
Small auto rent API. NestJS, Postgres 11 w/o TypeORM (plain SQL) in Docker

# Start
1. Open `deploy` folder and run `docker compose up` command. 
This command setup & running postgress 11 instance, create tables and seed initial data - 5 test auto and rates.
Note: if you change postgres env in compose file then update `environment.ts` file as well.

2. `npm start`

# Docs

Path prefix is `rent`. Swagger url by default `http://localhost:3000/rent/api`
Port might be changes in `environment.ts`