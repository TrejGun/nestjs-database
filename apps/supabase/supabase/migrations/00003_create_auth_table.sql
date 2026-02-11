CREATE TABLE public.auth (
  id serial PRIMARY KEY,
  refresh_token varchar NOT NULL,
  refresh_token_expires_at bigint NOT NULL,
  user_id int NOT NULL REFERENCES public."user" (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION delete_expired_auths() RETURNS trigger
LANGUAGE plpgsql
AS $$
  BEGIN
    DELETE FROM public.auth WHERE created_at < NOW() - INTERVAL '30 days';
    RETURN NEW;
  END;
$$;

CREATE TRIGGER delete_expired_auths_trigger
AFTER INSERT ON public.auth
EXECUTE PROCEDURE delete_expired_auths();

ALTER TABLE public.auth ENABLE ROW LEVEL SECURITY;
