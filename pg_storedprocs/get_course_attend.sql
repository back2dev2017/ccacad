CREATE OR REPLACE function public.get_course_attend( p_course_id bigint=null, p_unitid bigint=null )
	RETURNS TABLE (
		id bigint, 
		attend_id bigint, 
		unit_id bigint, 
		course_id bigint, 
		attend_type varchar 
    )

LANGUAGE 'plpgsql'
STABLE
as $BODY$

DECLARE
  v_courseid bigint;
  v_unitid bigint;
BEGIN
	-- IMPORTANT NOTE: Postgresql data types of their information_schema crap is specially defined. So, when queried, the
	-- return values look like varchar or integer: BUT THEY ARE NOT!!!!! Therefore, when pulling info from the 
	-- information_schema, cast it (i.e. " :: ") to the type that is going to be returned
  if p_course_id is null then
    v_courseid = -1;
    v_unitid = -1;
  else
    v_courseid = p_course_id;
  end if;
  if p_unitid is null then
    v_unitid = -1;
  else
    v_unitid = p_unitid;
  end if;


  -- if the course id was not passed, will assume all data pulled, ignore weeknum. but if course id was passed see if
  -- unit id was passed - if it wasn't then get all weeks for the course, otherwise both coure id and unit id are used
  if v_courseid < 0 then
    return query execute 'select aa.id, aa.attend_id, sess_id unit_id, course_id course_id, attend_type ' || 
                   'from course_attendance aa';
  elsif v_unitid < 0 then
    return query execute 'select aa.id, aa.attend_id, sess_id unit_id, course_id course_id, attend_type ' || 
                    'from course_attendance aa ' ||
                    'where aa.course_id = $1' using v_courseid;
  else
    return query execute 'select aa.id, aa.attend_id, sess_id unit_id, course_id course_id, attend_type ' || 
                    'from course_attendance aa ' ||
                    'where aa.course_id = $1 and aa.sess_id = $2' using v_courseid, v_unitid;

  end if;
END
$BODY$;