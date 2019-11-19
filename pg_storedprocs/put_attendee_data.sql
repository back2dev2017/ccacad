CREATE OR REPLACE FUNCTION public.add_putdd_item(p_id bigint DEFAULT NULL :: bigint, p_fname text DEFAULT NULL :: text, p_lname text DEFAULT NULL :: text, 
    p_age integer DEFAULT NULL :: integer, p_doc_number text DEFAULT NULL :: text, p_first_arrest_age integer DEFAULT NULL :: integer, 
    p_previous_convictions integer DEFAULT NULL :: integer, p_fam_crime_history text DEFAULT NULL :: text, p_num_child integer DEFAULT NULL :: integer, 
    p_marital_status text DEFAULT NULL :: text, p_num_positive_model integer DEFAULT NULL :: integer, p_att_id_use text DEFAULT NULL :: text, 
    p_release_date date DEFAULT NULL :: date, p_parole_eligible date DEFAULT NULL :: date, p_workbook_status text DEFAULT NULL :: text, 
    p_gender text DEFAULT NULL :: text, p_race text DEFAULT NULL :: text, p_military smallint DEFAULT NULL :: smallint, 
    p_citizen smallint DEFAULT NULL :: smallint, p_email text DEFAULT NULL :: text,  
    p_adult_incarcerations integer DEFAULT NULL :: integer, p_family_crime_history text DEFAULT NULL :: text, 
    p_num_discipline_infractions integer DEFAULT NULL :: integer,   
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
    p_enroll_date date DEFAULT NULL :: date, p_drop_date date DEFAULT NULL :: date, p_club_leader_explain text DEFAULT NULL :: text)
    RETURNS void
    LANGUAGE 'plpgsql'
    VOLATILE
    PARALLEL UNSAFE
    COST 100
AS $BODY$declare 
	v_use_id bigint;
 	v_tmp_user varchar(200) = current_user;
 	v_systime timestamp(3) = current_timestamp;
 	v_error varchar(100) = 'Need an ID, or a non-blank table/column pair';
 	v_sqlcmd text;
 	v_sqlparms text;
 	tmp_cursor refcursor;
 	cur_row record;
--   need to have variables to hold on to the previous values of the item because this procedure allows them to only
-- update a couple fields: thus, need to hold on to the existing field values
	v_dc_item_id bigint;
	v_dc_meaning text;
	v_dc_dsrc varchar(250);
	v_dc_uf varchar(20);
	v_dc_sec varchar(40);
	v_dc_spri varchar(6);
	v_dc_sback varchar(35);
	v_dc_def_conf varchar(1);
	v_dc_inact int;
	v_dc_inact_dt timestamp(3);
	v_new_item_id INT = 0;
	data_cursor refcursor;
 	

 BEGIN
--	if position('' in  v_tmp_user) > 0 then
--		v_tmp_user := substring(v_tmp_user, position('' in  v_tmp_user) + 1, 6);
--	end if;

	-- if the @srch_id was not passed, use @tbl_name and @col_name to get to the item_id. 
	v_use_id := p_srch_id;

	-- if the passed ID, table_name, and column_name are all null (or blank), drop out of this SP. The API was not invoked correctly
	if p_srch_id is null and coalesce(p_tbl_name, '') = '' and coalesce(p_col_name, '') = ''
		then
		-- it would be best to raise an error here, but THROW does not appear to be a standard way
		 RAISE EXCEPTION 'Need item id or table/column pair';
	else
		if (v_use_id is null)
			then
				v_sqlcmd = 'select add_definitions.item_id from add_definitions where lower(table_name) = lower($1) and lower(column_name) = lower($2)';
				open tmp_cursor no scroll 
					for execute v_sqlcmd using p_tbl_name, p_col_name;
				fetch tmp_cursor into cur_row;
				v_use_id = cur_row.item_id;
				close tmp_cursor;
			end if;

		if (exists (select 1 from add_definitions where add_definitions.item_id = v_use_id))
			then
				-- make sure and pull all columns that would be meaningful to get added into add_def_history
				open data_cursor for 
					select aa.item_id, aa.meaning, aa.data_source, aa.update_frequency, aa.security, 
							aa.steward_primary_attuid, aa.steward_backup_attuids, aa.definition_confidence, aa.inactive, aa.inactive_date
						from add_definitions as aa 
						where aa.item_id = v_use_id;

				fetch data_cursor into v_dc_item_id, v_dc_meaning, v_dc_dsrc, v_dc_uf, v_dc_sec, v_dc_spri, v_dc_sback, v_dc_def_conf, v_dc_inact, v_dc_inact_dt;
				IF ((p_meaning is not null and v_dc_meaning is null) or (p_meaning is not null and v_dc_meaning is not null and p_meaning != v_dc_meaning)) or
						((p_data_source is not null and v_dc_dsrc is null) or (p_data_source is not null and v_dc_dsrc is not null and p_data_source != v_dc_dsrc)) or 
						((p_update_frequency is not null and v_dc_uf is null) or (p_update_frequency is not null and v_dc_uf is not null and p_update_frequency != v_dc_uf)) or 
						((p_security is not null and v_dc_sec is null) or (p_security is not null and v_dc_sec is not null and p_security != v_dc_sec)) or 
						((p_steward_primary_attuid is not null and v_dc_spri is null) or (p_steward_primary_attuid is not null and v_dc_spri is not null and p_steward_primary_attuid != v_dc_spri)) or 
						((p_steward_backup_attuids is not null and v_dc_sback is null) or (p_steward_backup_attuids is not null and v_dc_sback is not null and p_steward_backup_attuids != v_dc_sback)) or 
						((p_definition_confidence is not null and v_dc_def_conf is null) or (p_definition_confidence is not null and v_dc_def_conf is not null and p_definition_confidence != v_dc_def_conf))
			
					then
						update add_definitions set 
								meaning = coalesce(p_meaning, v_dc_meaning),
								data_source = coalesce(p_data_source, v_dc_dsrc),
								update_frequency = coalesce(p_update_frequency, v_dc_uf),
								security = coalesce(p_security, v_dc_sec),
								steward_primary_attuid = coalesce(p_steward_primary_attuid, v_dc_spri),
								steward_backup_attuids = coalesce(p_steward_backup_attuids, v_dc_sback),
								definition_confidence = coalesce(p_definition_confidence, v_dc_def_conf),
								last_meaning_change = v_systime,
								last_change_by = v_tmp_user
							where item_id = v_use_id;

						-- now add the record into the add_def_history table. Recall the fetch command above grabbed existing data
						-- in case not all parameters were provided, use values that existed in add_definitions
						insert into add_def_history 
							(item_id, table_name, column_name, meaning, data_source, 
							update_frequency, security, steward_primary_attuid,
							steward_backup_attuids, definition_confidence, last_meaning_change, last_change_by)
							values 
							(v_dc_item_id, p_tbl_name, p_col_name, coalesce(p_meaning, v_dc_meaning), coalesce(p_data_source, v_dc_dsrc), 
							coalesce(p_update_frequency, v_dc_uf), coalesce(p_security, v_dc_sec), coalesce(p_steward_primary_attuid, v_dc_spri),
							coalesce(p_steward_backup_attuids, v_dc_sback), coalesce(p_definition_confidence, v_dc_def_conf), v_systime, v_tmp_user);
					end if;
				close data_cursor;
		else	-- the item did not exist, so insert it.
				insert into add_definitions 
					(table_name, column_name, meaning, data_source, update_frequency, security, steward_primary_attuid,
					steward_backup_attuids, definition_confidence, last_meaning_change, last_change_by)
					values 
					(p_tbl_name, p_col_name, p_meaning, p_data_source, p_update_frequency, p_security, p_steward_primary_attuid,
					p_steward_backup_attuids, p_definition_confidence, v_systime, v_tmp_user)
					returning item_id into v_new_item_id;
-- take this out if the above works				v_new_item_id := lastval(); 
				insert into add_def_history 
					(item_id, table_name, column_name, meaning, data_source, update_frequency, security, steward_primary_attuid,
					steward_backup_attuids, definition_confidence, last_meaning_change, last_change_by)
					values 
					(v_new_item_id, p_tbl_name, p_col_name, p_meaning, p_data_source, p_update_frequency, p_security, p_steward_primary_attuid,
					p_steward_backup_attuids, p_definition_confidence, v_systime, v_tmp_user);

		end if;
	end if;
END;

$BODY$;