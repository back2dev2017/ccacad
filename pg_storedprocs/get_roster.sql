CREATE OR REPLACE FUNCTION public.get_roster(IN p_course_id bigint DEFAULT NULL::bigint)
	RETURNS TABLE(
		id bigint, 
		course_id bigint, 
		att_id_use character varying,
		enroll_date date,
		drop_date date,
		fname character varying,
		lname character varying,
    formation_group_id bigint,
    group_name character varying
		)
	LANGUAGE 'plpgsql'
	STABLE
AS $BODY$
DECLARE
  c_sqlstatement varchar;
  v_courseid bigint;
BEGIN
	-- IMPORTANT NOTE: Postgresql data types of their information_schema crap is specially defined. So, when queried, the
	-- return values look like varchar or integer: BUT THEY ARE NOT!!!!! Therefore, when pulling info from the 
	-- information_schema, cast it (i.e. " :: ") to the type that is going to be returned
  if p_course_id is null then
		v_courseid = -1;
  else
		v_courseid = p_course_id;
  end if;

  if v_courseid < 0 then
		return query execute 'select aa.id, aa.course_id, aa.att_id_use, ' || 
						'aa.enroll_date, aa.drop_date, aa.fname, aa.lname, formation_group_id, ' ||
            'bb.group_name ' || 
						'from course_attendee_list aa left outer join course_formation_group bb ' || 
              'on aa.formation_group_id = bb.id ' || 
						'order by aa.fname, aa.lname';

  else
		return query execute 'select aa.id, aa.course_id, aa.att_id_use, ' || 
						'aa.enroll_date, aa.drop_date, aa.fname, aa.lname, formation_group_id, ' || 
            'bb.group_name ' || 
						'from course_attendee_list aa left outer join course_formation_group bb ' || 
              'on aa.formation_group_id = bb.id ' || 
						'where aa.course_id = $1 ' || 
						'order by aa.fname, aa.lname' using v_courseid;
  end if;

END
$BODY$;