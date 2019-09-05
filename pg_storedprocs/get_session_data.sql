CREATE OR REPLACE function public.get_session_data( p_session_id bigint=null )
	RETURNS TABLE (
		id bigint, 
		title varchar, 
		long_desc text, 
		retired date, 
		module_id bigint, 
		expected_hrs numeric,
		sex_focus varchar, 
    module_category varchar)
STABLE
LANGUAGE 'plpgsql'
as
$BODY$

DECLARE
  c_sqlstatement varchar;
  v_sessid bigint;
BEGIN
	-- IMPORTANT NOTE: Postgresql data types of their information_schema crap is specially defined. So, when queried, the
	-- return values look like varchar or integer: BUT THEY ARE NOT!!!!! Therefore, when pulling info from the 
	-- information_schema, cast it (i.e. " :: ") to the type that is going to be returned
  if p_session_id is null then
    v_sessid = -1;
  else
    v_sessid = p_session_id;
  end if;

  if v_sessid < 0 then
    return query execute 'select aa.id, aa. title :: varchar, aa.long_desc :: text, aa.retired, aa.module_id, ' || 
                   'aa.expected_hrs, aa.sex_focus :: varchar, bb.module_name :: varchar module_category ' || 
                   'from session_list aa left outer join module_categories bb on aa.module_id = bb.id';
  else
    return query execute 'select aa.id, aa. title :: varchar, aa.long_desc :: text, aa.retired, aa.module_id, ' || 
                   'aa.expected_hrs, aa.sex_focus :: varchar, bb.module_name :: varchar module_category ' || 
                    'from session_list aa left outer join module_categories bb on aa.module_id = bb.id ' ||
                    'where aa.id = $1' using v_sessid;
  end if;

END
$BODY$