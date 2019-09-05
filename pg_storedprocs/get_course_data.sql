CREATE OR REPLACE function public.get_course_data( p_course_id bigint=null )
	RETURNS TABLE (
		id bigint, 
		desc_id varchar, 
		curr_t_id bigint, 
		facility_id bigint, 
		cohort_id bigint,
    assigned_am bigint,
    start_date date,
    projected_grad_date date,
    grad_date date,
    tmplt_title varchar,
    fac_name varchar,
    fac_abbrev varchar,
    cohort_title varchar,
    fname varchar,
    lname varchar)
STABLE
LANGUAGE 'plpgsql'
as
$BODY$

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
    return query execute 'select aa.id, aa.desc_id, aa.curr_t_id, aa.facility_id, ' || 
                   'aa.cohort_id, aa.assigned_am, aa.start_date, aa.projected_grad_date, aa.grad_date, ' || 
                   'bb.title tmplt_title, cc.fac_name, cc.fac_abbrev, dd.title cohort_title, ' || 
                   'ee.fname, ee.lname ' ||
                   'from acad_course aa ' ||
                      'left outer join curriculum_t bb on aa.curr_t_id = bb.id ' || 
                      'left outer join facility cc on aa.facility_id = cc.id ' ||
                      'left outer join acad_cohort dd on aa.cohort_id = dd.id ' ||
                      'left outer join sys_users ee on aa.assigned_am = ee.id ' ||
                    'order by aa.desc_id';

  else
    return query execute 'select aa.id, aa.desc_id, aa.curr_t_id, aa.facility_id, ' || 
                   'aa.cohort_id, aa.assigned_am, aa.start_date, aa.projected_grad_date, aa.grad_date, ' || 
                   'bb.title tmplt_title, cc.fac_name, cc.fac_abbrev, dd.title cohort_title, ' || 
                   'ee.fname, ee.lname ' ||
                   'from acad_course aa ' ||
                      'left outer join curriculum_t bb on aa.curr_t_id = bb.id ' || 
                      'left outer join facility cc on aa.facility_id = cc.id ' ||
                      'left outer join acad_cohort dd on aa.cohort_id = dd.id ' ||
                      'left outer join sys_users ee on aa.assigned_am = ee.id ' ||
                    'where aa.id = $1 '
                    'order by aa.desc_id' using v_courseid;
  end if;

END
$BODY$