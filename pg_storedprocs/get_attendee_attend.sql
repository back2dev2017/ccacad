CREATE OR REPLACE function public.get_attendee_attend( p_attendee_id bigint=null )
	RETURNS TABLE (
		id bigint, 
		attend_id bigint, 
    sess_id bigint,
		course_id bigint, 
    attend_type varchar,
    title varchar,
    module_id bigint,
    module_name varchar,
    week_num bigint
    )

LANGUAGE 'plpgsql'
STABLE
as $BODY$

DECLARE
  v_attendee_id bigint;

BEGIN
	-- IMPORTANT NOTE: Postgresql data types of their information_schema crap is specially defined. So, when queried, the
	-- return values look like varchar or integer: BUT THEY ARE NOT!!!!! Therefore, when pulling info from the 
	-- information_schema, cast it (i.e. " :: ") to the type that is going to be returned
  if p_attendee_id is null then
    v_attendee_id = -1;
  else
    v_attendee_id = p_attendee_id;
  end if;

  -- purposly ignoreing module id 13 because that is orientation week
  return query execute 
     'select aa.id, aa.attend_id, aa.sess_id, aa.course_id, aa.attend_type, bb.title, ' || 
       'bb.module_id, cc.module_name, dd.week_num ' || 
		  'from course_attendance aa ' || 
			  'left outer join units bb on aa.sess_id = bb.id ' || 
			  'left outer join module_categories cc on bb.module_id = cc.id ' ||
			  'left outer join course_content dd on aa.course_id = dd.id ' || 
      'where bb.module_id <> 13 and aa.attend_id = $1 order by dd.week_num' using v_attendee_id;

END
$BODY$;