CREATE OR REPLACE FUNCTION public.put_attendee_data(p_id bigint DEFAULT NULL :: bigint, p_fname text DEFAULT NULL :: text, p_lname text DEFAULT NULL :: text, 
    p_age integer DEFAULT NULL :: integer, p_doc_number text DEFAULT NULL :: text, p_first_arrest_age integer DEFAULT NULL :: integer, 
    p_previous_convictions integer DEFAULT NULL :: integer, p_fam_crime_history text DEFAULT NULL :: text, p_fam_crime_who text DEFAULT NULL :: text,
    p_num_child integer DEFAULT NULL :: integer, 
    p_marital_status text DEFAULT NULL :: text, p_num_positive_model integer DEFAULT NULL :: integer, p_att_id_use text DEFAULT NULL :: text, 
    p_release_date date DEFAULT NULL :: date, p_parole_eligible date DEFAULT NULL :: date, p_workbook_status text DEFAULT NULL :: text, 
    p_gender text DEFAULT NULL :: text, p_race text DEFAULT NULL :: text, p_military smallint DEFAULT NULL :: smallint, 
    p_citizen smallint DEFAULT NULL :: smallint, p_email text DEFAULT NULL :: text,  
    p_adult_incarcerations integer DEFAULT NULL :: integer, p_num_discipline_infractions integer DEFAULT NULL :: integer,   
    p_fam_involve text DEFAULT NULL :: text, p_fam_relationship text DEFAULT NULL :: text, 
    p_num_addr_change integer DEFAULT NULL :: integer, p_friendships text DEFAULT NULL :: text, p_num_friends_criminal integer DEFAULT NULL :: integer, 
    p_friends_during_prison integer DEFAULT NULL :: integer, p_use_alcohol smallint DEFAULT NULL :: smallint, 
    p_use_drugs smallint DEFAULT NULL :: smallint, p_current_alcohol smallint DEFAULT NULL :: smallint, p_current_drug smallint DEFAULT NULL :: smallint, 
    p_use_contrib_crime smallint DEFAULT NULL :: smallint, p_highest_education text DEFAULT NULL :: text, p_school_expel smallint DEFAULT NULL :: smallint, 
    p_skill_plan smallint DEFAULT NULL :: smallint, p_skill_plan_explain text DEFAULT NULL :: text, p_employ text DEFAULT NULL :: text, 
    p_currently_employed smallint DEFAULT NULL :: smallint, p_employ_plan smallint DEFAULT NULL :: smallint, p_employ_plan_explain text DEFAULT NULL :: text, 
    p_clubs_prior text DEFAULT NULL :: text, p_clubs_in_prison text DEFAULT NULL :: text, p_club_leader smallint DEFAULT NULL :: smallint, 
    p_club_leader_explain text DEFAULT NULL :: text, p_express_needs text DEFAULT NULL :: text, 
    p_understand_other_views text DEFAULT NULL :: text, p_make_friends text DEFAULT NULL :: text, p_accept_criticism text DEFAULT NULL :: text, 
    p_provide_good_criticism text DEFAULT NULL :: text, p_accept_responsibility text DEFAULT NULL :: text, p_manage_problems text DEFAULT NULL :: text, 
    p_develop_goals text DEFAULT NULL :: text, p_manage_money text DEFAULT NULL :: text,p_course_id bigint DEFAULT NULL :: bigint, 
    p_enroll_date date DEFAULT NULL :: date, p_drop_date date DEFAULT NULL :: date, p_club_leader_prison_explain text DEFAULT NULL :: text,
    p_formation_group_id bigint DEFAULT NULL :: bigint)
    RETURNS void
    LANGUAGE 'plpgsql'
    VOLATILE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
declare 
	v_use_id bigint;
 	v_tmp_user varchar(200) = current_user;
 	v_systime timestamp(3) = current_timestamp;
 	v_error varchar(100) = 'Need an ID, or a non-blank table/column pair';
 	v_sqlcmd text;
 	v_sqlparms text;
 	

 BEGIN
	-- -- if the passed ID, table_name, and column_name are all null (or blank), drop out of this SP. The API was not invoked correctly
	-- if p_srch_id is null and coalesce(p_tbl_name, '') = '' and coalesce(p_col_name, '') = ''
	-- 	then
	-- 	-- it would be best to raise an error here, but THROW does not appear to be a standard way
	-- 	 RAISE EXCEPTION 'Need item id or table/column pair';
	-- else
	-- 	if (v_use_id is null)
	-- 		then
	-- 			v_sqlcmd = 'select add_definitions.item_id from add_definitions where lower(table_name) = lower($1) and lower(column_name) = lower($2)';
	-- 			open tmp_cursor no scroll 
	-- 				for execute v_sqlcmd using p_tbl_name, p_col_name;
	-- 			fetch tmp_cursor into cur_row;
	-- 			v_use_id = cur_row.item_id;
	-- 			close tmp_cursor;
	-- 		end if;

		if (exists (select 1 from course_attendee_list where id = p_id))
			then
        UPDATE course_attendee_list
          SET accept_criticism = p_accept_criticism, accept_responsibility = p_accept_responsibility, 
            adult_incarcerations = p_adult_incarcerations, 
            age = p_age, att_id_use = p_att_id_use, citizen = p_citizen, 
            club_leader = p_club_leader, club_leader_explain = p_club_leader_explain, 
            club_leader_prison_explain = p_club_leader_prison_explain, 
            clubs_in_prison = p_clubs_in_prison, clubs_prior = p_clubs_prior, course_id = p_course_id, 
            current_alcohol = p_current_alcohol, current_drug = p_current_drug, currently_employed = p_currently_employed, 
            develop_goals = p_develop_goals, doc_number = p_doc_number, drop_date = p_drop_date, 
            email = p_email, employ = p_employ, employ_plan = p_employ_plan, 
            employ_plan_explain = p_employ_plan_explain, enroll_date = p_enroll_date, express_needs = p_express_needs, 
            fam_crime_history = p_fam_crime_history, fam_involve = p_fam_involve, fam_relationship = p_fam_relationship, 
            fam_crime_who = p_fam_crime_who, first_arrest_age = p_first_arrest_age, fname = p_fname, 
            formation_group_id = p_formation_group_id, friends_during_prison = p_friends_during_prison, friendships = p_friendships, 
            gender = p_gender, highest_education = p_highest_education, 
            lname = p_lname, make_friends = p_make_friends, manage_money = p_manage_money, 
            manage_problems = p_manage_problems, marital_status = p_marital_status, military = p_military, 
            num_addr_change = p_num_addr_change, num_child = p_num_child, num_discipline_infractions = p_num_discipline_infractions, 
            num_friends_criminal = p_num_friends_criminal, num_positive_model = p_num_positive_model, 
            parole_eligible = p_parole_eligible, 
            previous_convictions = p_previous_convictions, provide_good_criticism = p_provide_good_criticism, race = p_race, 
            release_date = p_release_date, school_expel = p_school_expel, skill_plan = p_skill_plan, 
            skill_plan_explain = p_skill_plan_explain, understand_other_views = p_understand_other_views, use_alcohol = p_use_alcohol, 
            use_contrib_crime = p_use_contrib_crime, use_drugs = p_use_drugs, workbook_status = p_workbook_status 
          WHERE id = p_id;

		else	-- the item did not exist, so insert it.
				insert into course_attendee_list 
            (accept_criticism, accept_responsibility, adult_incarcerations, age, att_id_use, 
              citizen, club_leader, club_leader_explain, club_leader_prison_explain,
              clubs_in_prison, 
              clubs_prior, course_id, current_alcohol, current_drug, currently_employed, 
              develop_goals, doc_number, drop_date, email, employ, 
              employ_plan, employ_plan_explain, enroll_date, express_needs, fam_crime_history, 
              fam_involve, fam_relationship, fam_crime_who, first_arrest_age, fname, 
              formation_group_id, friends_during_prison, friendships, gender, highest_education, 
              lname, make_friends, manage_money, manage_problems, 
              marital_status, military, num_addr_change, num_child, num_discipline_infractions, 
              num_friends_criminal, num_positive_model, parole_eligible, previous_convictions, provide_good_criticism, 
              race, release_date, school_expel, skill_plan, skill_plan_explain, 
              understand_other_views, use_alcohol, use_contrib_crime, use_drugs, workbook_status) 
            VALUES 
            (p_accept_criticism, p_accept_responsibility, p_adult_incarcerations, p_age, p_att_id_use, 
              p_citizen, p_club_leader, p_club_leader_explain, p_club_leader_prison_explain,
              p_clubs_in_prison, 
              p_clubs_prior, p_course_id, p_current_alcohol, p_current_drug, p_currently_employed, 
              p_develop_goals, p_doc_number, p_drop_date, p_email, p_employ, 
              p_employ_plan, p_employ_plan_explain, p_enroll_date, p_express_needs, p_fam_crime_history, 
              p_fam_involve, p_fam_relationship, p_fam_crime_who, p_first_arrest_age, p_fname, 
              p_formation_group_id, p_friends_during_prison, p_friendships, p_gender, p_highest_education, 
              p_lname, p_make_friends, p_manage_money, p_manage_problems, 
              p_marital_status, p_military, p_num_addr_change, p_num_child, p_num_discipline_infractions, 
              p_num_friends_criminal, p_num_positive_model, p_parole_eligible, p_previous_convictions, p_provide_good_criticism, 
              p_race, p_release_date, p_school_expel, p_skill_plan, p_skill_plan_explain, 
              p_understand_other_views, p_use_alcohol, p_use_contrib_crime, p_use_drugs, p_workbook_status);

		end if;
END;

$BODY$;


