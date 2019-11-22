CREATE OR REPLACE FUNCTION public.release_idle()
    RETURNS INTEGER
-- the purpose is to release connections that have been idle for a while. This is important for 
-- hosted databases that charge/restrict based on number of simultaneous connections.
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE
  cdbname varchar;

BEGIN

cdbname = current_database();


SELECT pg_terminate_backend(pid)
	FROM pg_stat_activity
	WHERE datname = cdbname
		AND pid <> pg_backend_pid()
		AND state in ('idle', 'idle in transaction', 'idle in transaction (aborted)', 'disabled') 
		AND state_change < current_timestamp - INTERVAL '15' MINUTE;

RETURN 1;

END;


$BODY$;