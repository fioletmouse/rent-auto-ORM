FROM postgres:latest
COPY ./scripts/seed.sh /docker-entrypoint-initdb.d
COPY ./scripts/schema.sql /db-dumps/