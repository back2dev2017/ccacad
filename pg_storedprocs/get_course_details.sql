CREATE OR REPLACE FUNCTION public.get_course_details(IN p_course_id bigint DEFAULT NULL::bigint)
    RETURNS TABLE(
      id bigint, 
      acad_id bigint,
      comments text, 
      curr_cont_t_id bigint, 
      date_done date, 
      day_seq bigint, 
      hours_done numeric,
      sess_id bigint, 
      time_seq bigint, 
      week_num bigint, 
      module_id bigint,
      expected_hrs numeric,
      unit_retired date,
      unit_title character varying,
      module_name character varying,
      tally_hours integer
      )

    LANGUAGE 'plpgsql'
    STABLE
    PARALLEL UNSAFE
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
    return query execute 'select aa.id, aa.acad_id, aa.comments, aa.curr_cont_t_id, aa.date_done, aa.day_seq, aa.hours_done, ' || 
                            'aa.sess_id, aa.time_seq, aa.week_num, bb.module_id, bb.expected_hrs, bb.retired unit_retired, ' || 
                            'bb.title unit_title, cc.module_name, cc.tally_hours ' || 
                          'from acad_course_content aa ' || 
                            'left outer join session_list bb on aa.sess_id = bb.id ' || 
                            'left outer join module_categories cc on bb.module_id = cc.id ' || 
                          'order by aa.week_num, aa.day_seq ';

  else
    return query execute 'select aa.id, aa.acad_id, aa.comments, aa.curr_cont_t_id, aa.date_done, aa.day_seq, aa.hours_done, ' || 
                            'aa.sess_id, aa.time_seq, aa.week_num, bb.module_id, bb.expected_hrs, bb.retired unit_retired, ' || 
                            'bb.title unit_title, cc.module_name, cc.tally_hours ' || 
                          'from acad_course_content aa ' || 
                            'left outer join session_list bb on aa.sess_id = bb.id ' || 
                            'left outer join module_categories cc on bb.module_id = cc.id ' || 
                          'where aa.acad_id = $1 ' || 
                          'order by aa.week_num, aa.day_seq ' 
                          using v_courseid;
  end if;

END
$BODY$;