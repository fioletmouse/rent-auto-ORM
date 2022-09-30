CREATE TABLE IF NOT EXISTS auto (
    id serial PRIMARY KEY,
    auto_name varchar(50) NOT NULL
);

INSERT INTO auto(auto_name) VALUES ('toyota');
INSERT INTO auto(auto_name) VALUES ('honda pri');
INSERT INTO auto(auto_name) VALUES ('kia rio');
INSERT INTO auto(auto_name) VALUES ('kia sera');
INSERT INTO auto(auto_name) VALUES ('yamaha');

CREATE TABLE IF NOT EXISTS rate (
    id serial PRIMARY KEY,
    "from" smallint NOT NULL,
    "to" smallint NOT NULL,
    rate smallint NOT NULL,
    percentage smallint,
    start_date date NOT NULL,
    end_date date NOT NULL
);

INSERT INTO public.rate("from", "to", rate, percentage, start_date, end_date)
VALUES (1, 4, 1000, null, '1900-01-01', '3000-01-01');
INSERT INTO public.rate("from", "to", rate, percentage, start_date, end_date)
VALUES (5, 9, 1000, 5, '1900-01-01', '3000-01-01');
INSERT INTO public.rate("from", "to", rate, percentage, start_date, end_date)
VALUES (10, 17, 1000, 10, '1900-01-01', '3000-01-01');
INSERT INTO public.rate("from", "to", rate, percentage, start_date, end_date)
VALUES (18, 30, 1000, 15, '1900-01-01', '3000-01-01');

CREATE TABLE IF NOT EXISTS book_session (
    id serial PRIMARY KEY,
    auto_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total integer DEFAULT 0,
    CONSTRAINT "auto_id_FK" FOREIGN KEY (auto_id)
        REFERENCES public.auto (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
);