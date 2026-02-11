CREATE TYPE public.token_type_enum AS ENUM (
  'EMAIL',
  'PASSWORD'
);

CREATE TABLE public.token (
  id serial PRIMARY KEY,
  code varchar NOT NULL,
  type public.token_type_enum NOT NULL,
  user_id int NOT NULL REFERENCES public."user" (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION delete_expired_tokens() RETURNS trigger
LANGUAGE plpgsql
AS $$
  BEGIN
    DELETE FROM public.token WHERE created_at < NOW() - INTERVAL '1 hour';
    RETURN NEW;
  END;
$$;

CREATE TRIGGER delete_expired_tokens_trigger
AFTER INSERT ON public.token
EXECUTE PROCEDURE delete_expired_tokens();

ALTER TABLE public.token ENABLE ROW LEVEL SECURITY;
