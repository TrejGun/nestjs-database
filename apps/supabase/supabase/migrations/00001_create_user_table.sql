CREATE TYPE public.user_role_enum AS ENUM (
  'ADMIN',
  'USER'
);

CREATE TYPE public.user_status_enum AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'PENDING'
);

CREATE TABLE public."user" (
  id serial PRIMARY KEY,
  first_name varchar NOT NULL,
  last_name varchar NOT NULL,
  email varchar NOT NULL UNIQUE,
  password varchar NOT NULL,
  roles public.user_role_enum[] NOT NULL DEFAULT '{USER}',
  status public.user_status_enum NOT NULL DEFAULT 'PENDING'
);

ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;
