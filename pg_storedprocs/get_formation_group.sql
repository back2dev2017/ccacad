CREATE OR REPLACE FUNCTION public.get_formation_group(IN p_course_id bigint DEFAULT NULL::bigint, p_fg_id bigint DEFAULT NULL::bigint)
	RETURNS TABLE(
		id bigint, 
		course_id bigint, 
    group_name character varying
		)
	LANGUAGE 'plpgsql'
	STABLE
AS $BODY$
DECLARE
  c_sqlstatement varchar;
  v_courseid bigint;
  v_fg_id bigint;
BEGIN
	-- IMPORTANT NOTE: Postgresql data types of their information_schema crap is specially defined. So, when queried, the
	-- return values look like varchar or integer: BUT THEY ARE NOT!!!!! Therefore, when pulling info from the 
	-- information_schema, cast it (i.e. " :: ") to the type that is going to be returned
  if p_course_id is null then
		v_courseid = -1;
  else
		v_courseid = p_course_id;
  end if;
  if p_fg_id is null then
		v_fg_id = -1;
  else
		v_fg_id = p_fg_id;
  end if;

  -- if the p_fg_id was passed, the p_course_id does not matter
  if v_fg_id > 0 THEN
    return query execute 'select aa.id, aa.course_id, aa.group_name ' || 
            'from course_formation_group aa ' || 
            'where id = $1 ' || 
            'order by aa.group_name' using v_fg_id; 
  else
    if v_courseid < 0 then
      return query execute 'select aa.id, aa.course_id, aa.group_name ' || 
              'from course_formation_group aa ' || 
              'order by aa.group_name';

    else
      return query execute 'select aa.id, aa.course_id, aa.group_name ' || 
              'from course_formation_group aa ' || 
              'where aa.course_id = $1 ' || 
              'order by aa.group_name' using v_courseid;
    end if;
  end if;
END
$BODY$;