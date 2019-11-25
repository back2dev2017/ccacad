<?php
	header('Access-Control-Allow-Origin: *');
	header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
	header("Pragma: no-cache"); // HTTP 1.0.
	header("Expires: 0"); // Proxies.
	session_start(); // start up a session to help with DB connections
?>

<?php

function handle_sql_errors($query, $error_message) {
	echo '<pre>';
	echo $query;
	echo '</pre>';
	echo $error_message;
	die;
}

function custom_err_hdlr ($errno, $errstr, $errfile, $errline, $errcontext) {
	echo "<b>My ERROR</b> [$errno] $errstr<br>\n";
	echo "  Fatal error on line $errline in file $errfile";
	echo ", PHP " . PHP_VERSION . " (" . PHP_OS . ")\n";
	echo "Aborting...\n";
	die();
}

// require_once('add_conn_cls.php');
set_error_handler("custom_err_hdlr");

// if i keep seeting this it always is blank?
/* $_SESSION["lastcall"] = ""; */

$c_apifunc = strtoupper($_POST['api_func']);
// $c_apifunc = 'testingnothing';

// this connection is for a local db connection
$dbconn = pg_connect("host=localhost dbname=academydb user=cc2000 password=mssucksbad");
// this connection is for the prod db (to be running from prod)
// $dbconn = pg_connect(getenv("DATABASE_URL"));

if (!$dbconn) {
	echo "Error trying to just connect to DB";
	exit;
} else {
	// echo "Connected to DB OK\n";
}


// echo $c_apifunc . '<br>';

if ($c_apifunc != 'GET_LAST_CALL') {
		$_SESSION["lastcall"] = $c_apifunc;
}

switch ($c_apifunc) {
	case "GET_USERS":
		$data = pg_query($dbconn, "select id, fname, lname, module_id, email, phone, phone_ext, role, retired from sys_users order by fname, lname");
		$ret_array = pg_fetch_all($data);
		echo json_encode($ret_array);
		break;

	case "GET_COHORTS":
		$result = pg_query($dbconn, 'select * from acad_cohort');
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;

	case "GET_COURSES":
		// $v_course_id = $_POST['p_course_id'];
		// $result = pg_query_params($dbconn, "select * from get_course_data($1)", 
		//   array($v_course_id));

		$result = pg_query($dbconn, "select * from get_course_data()");
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;
	
  case "GET_COURSE_ATTEND":
    $v_course_id = isset($_POST['p_course_id']) ? $_POST['p_course_id'] : null;
    $v_unit_id = isset($_POST['p_unit_id']) ? $_POST['p_unit_id'] : null;
    
		// $result = pg_query_params($dbconn, 'select * from get_course_attend($1, $2)', array($v_course_id, $v_unit_id));
		$result = pg_query_params($dbconn, 'select * from get_course_attend($1)', array('11'));		
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;


  // case "GET_ATTENDEE_ATTEND":
	// 	echo 'please god please';
	// 	break;
	case "GET_ATTENDEE_ATTEND":
	// gets an individuals attendance record 
		$v_attendee_id = isset($_POST['p_attendee_id']) ? $_POST['p_attendee_id'] : null;
		$v_course_id = isset($_POST['p_course_id']) ? $_POST['p_course_id'] : null;
		if ($v_course_id == null or $v_attendee_id == null) {
			echo json_encode('bad parameters');
		} else {
			// note, forcing to ignore modue_id 13 for now - that is orientation week - look in stored procedure
			$result = pg_query_params($dbconn, 'select * from get_attendee_attend($1,$2)', array($v_course_id,$v_attendee_id));
			$ret_array = pg_fetch_all($result);
			echo json_encode($ret_array);
		};
		break;

  case "GET_COURSE_CONTENT":
    if (isset($_POST['p_course_id'])) {
      $v_course_id = strval($_POST['p_course_id']);
    } else {
      $v_course_id = null;
    }
    $result = pg_query_params($dbconn, "select * from get_course_details($1)", array($v_course_id));
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;

	case "GET_COURSE_ROSTER":
		if (isset($_POST['p_course_id'])) {
			$v_course_id = $_POST['p_course_id'];
		} else {
			$v_course_id = null;
    }
    $result = pg_query_params($dbconn, "select * from course_attendee_list where (course_id = $1) and (drop_date IS NULL)", array($v_course_id));
		// $result = pg_query_params($dbconn, "select * from get_roster($1)", array($v_course_id));
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;

  case "GET_COURSE_DROPS":
    $result = pg_query_params($dbconn, "select * from course_attendee_list where (course_id = $1) and (drop_date IS NOT NULL)", array($v_course_id));
		// $result = pg_query_params($dbconn, "select * from get_roster($1)", array($v_course_id));
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
    break;

	case "GET_CURRIC_TEMPLATES":
		$result = pg_query($dbconn, 'select * from curriculum_t');
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;

	case "GET_CURRIC_TEMPLATE_CONTENT":
		$result = pg_query($dbconn, 'select * from curriculum_content_t');
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;

	case "GET_FACILITIES":
		$result = pg_query($dbconn, 'select * from facility');
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;

	case "GET_FAC_STEPS":
		$result = pg_query($dbconn, 'select * from facility_steps');
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;

	case "GET_FAC_SETUP":
		$result = pg_query($dbconn, 
						'select aa.id, aa.title, aa.long_desc, aa.expected_hrs, aa.module_id, aa.sex_focus, aa.retired. bb.module_name from facility_setup');
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;

	case "GET_SESSION_LIST":
		$result = pg_query($dbconn, 'select * from get_session_data()');
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;

  case "GET_FORMATION_GROUP":
    $v_course_id = isset($_POST['p_course_id']) ? $_POST['p_course_id'] : null;
    $v_fg_id = isset($_POST['p_fg_id']) ? $_POST['p_fg_id'] : null;
    // echo 'trying get formation group';
    // echo 'vals: ' . $v_course_id;
    $result = pg_query_params($dbconn, 'select * from get_formation_group($1, $2)', array($v_course_id, $v_fg_id));
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
    break;

  case "PUT_ATTENDEE_DATA":
		$v_accept_criticism = isset($_POST['p_accept_criticism']) ? $_POST['p_accept_criticism'] : null;
		$v_accept_responsibility = isset($_POST['p_accept_responsibility']) ? $_POST['p_accept_responsibility'] : null;
		$v_adult_incarcerations = isset($_POST['p_adult_incarcerations']) ? intval($_POST['p_adult_incarcerations']) : null;
		$v_age = isset($_POST['p_age']) ? intval($_POST['p_age']) : null;
		$v_att_id_use = isset($_POST['p_att_id_use']) ? $_POST['p_att_id_use'] : null;
		$v_citizen = isset($_POST['p_citizen']) ? intval($_POST['p_citizen']) : null;
		$v_club_leader = isset($_POST['p_club_leader']) ? intval($_POST['p_club_leader']) : null;
		$v_club_leader_explain = isset($_POST['p_club_leader_explain']) ? $_POST['p_club_leader_explain'] : null;
		$v_club_leader_prison_explain = isset($_POST['p_club_leader_prison_explain']) ? $_POST['p_club_leader_prison_explain'] : null;
		$v_clubs_in_prison = isset($_POST['p_clubs_in_prison']) ? $_POST['p_clubs_in_prison'] : null;
		$v_clubs_prior = isset($_POST['p_clubs_prior']) ? $_POST['p_clubs_prior'] : null;
		$v_course_id = isset($_POST['p_course_id']) ? intval($_POST['p_course_id']) : null;
		$v_current_alcohol = isset($_POST['p_current_alcohol']) ? intval($_POST['p_current_alcohol']) : null;
		$v_current_drug = isset($_POST['p_current_drug']) ? intval($_POST['p_current_drug']) : null;
		$v_currently_employed = isset($_POST['p_currently_employed']) ? intval($_POST['p_currently_employed']) : null;
		$v_develop_goals = isset($_POST['p_develop_goals']) ? $_POST['p_develop_goals'] : null;
		$v_doc_number = isset($_POST['p_doc_number']) ? $_POST['p_doc_number'] : null;
		$v_drop_date = isset($_POST['p_drop_date']) ? $_POST['p_drop_date'] : null;
		$v_email = isset($_POST['p_email']) ? $_POST['p_email'] : null;
		$v_employ = isset($_POST['p_employ']) ? $_POST['p_employ'] : null;
		$v_employ_plan = isset($_POST['p_employ_plan']) ? intval($_POST['p_employ_plan']) : null;
		$v_employ_plan_explain = isset($_POST['p_employ_plan_explain']) ? $_POST['p_employ_plan_explain'] : null;
		$v_enroll_date = isset($_POST['p_enroll_date']) ? $_POST['p_enroll_date'] : null;
		$v_express_needs = isset($_POST['p_express_needs']) ? $_POST['p_express_needs'] : null;
		$v_fam_crime_history = isset($_POST['p_fam_crime_history']) ? $_POST['p_fam_crime_history'] : null;
    $v_fam_crime_who = isset($_POST['p_fam_crime_who']) ? $_POST['p_fam_crime_who'] : null;
    $v_fam_involve = isset($_POST['p_fam_involve']) ? $_POST['p_fam_involve'] : null;
		$v_fam_relationship = isset($_POST['p_fam_relationship']) ? $_POST['p_fam_relationship'] : null;
		$v_first_arrest_age = isset($_POST['p_first_arrest_age']) ? $_POST['p_first_arrest_age'] : null;
		$v_fname = isset($_POST['p_fname']) ? $_POST['p_fname'] : null;
		$v_friends_during_prison = isset($_POST['p_friends_during_prison']) ? intval($_POST['p_friends_during_prison']) : null;
		$v_friendships = isset($_POST['p_friendships']) ? $_POST['p_friendships'] : null;
		$v_gender = isset($_POST['p_gender']) ? $_POST['p_gender'] : null;
		$v_highest_education = isset($_POST['p_highest_education']) ? $_POST['p_highest_education'] : null;
		$v_id = isset($_POST['p_id']) ? intval($_POST['p_id']) : null;
		$v_lname = isset($_POST['p_lname']) ? $_POST['p_lname'] : null;
		$v_make_friends = isset($_POST['p_make_friends']) ? $_POST['p_make_friends'] : null;
		$v_manage_money = isset($_POST['p_manage_money']) ? $_POST['p_manage_money'] : null;
		$v_manage_problems = isset($_POST['p_manage_problems']) ? $_POST['p_manage_problems'] : null;
		$v_marital_status = isset($_POST['p_marital_status']) ? $_POST['p_marital_status'] : null;
		$v_military = isset($_POST['p_military']) ? intval($_POST['p_military']) : null;
		$v_num_addr_change = isset($_POST['p_num_addr_change']) ? intval($_POST['p_num_addr_change']) : null;
		$v_num_child = isset($_POST['p_num_child']) ? intval($_POST['p_num_child']) : null;
		$v_num_discipline_infractions = isset($_POST['p_num_discipline_infractions']) ? intval($_POST['p_num_discipline_infractions']) : null;
		$v_num_friends_criminal = isset($_POST['p_num_friends_criminal']) ? intval($_POST['p_num_friends_criminal']) : null;
		$v_num_positive_model = isset($_POST['p_num_positive_model']) ? intval($_POST['p_num_positive_model']) : null;
		$v_parole_eligible = isset($_POST['p_parole_eligible']) ? $_POST['p_parole_eligible'] : null;
		$v_previous_convictions = isset($_POST['p_previous_convictions']) ? intval($_POST['p_previous_convictions']) : null;
		$v_provide_good_criticism = isset($_POST['p_provide_good_criticism']) ? $_POST['p_provide_good_criticism'] : null;
		$v_race = isset($_POST['p_race']) ? $_POST['p_race'] : null;
		$v_release_date = isset($_POST['p_release_date']) ? $_POST['p_release_date'] : null;
		$v_school_expel = isset($_POST['p_school_expel']) ? intval($_POST['p_school_expel']) : null;
		$v_skill_plan = isset($_POST['p_skill_plan']) ? intval($_POST['p_skill_plan']) : null;
		$v_skill_plan_explain = isset($_POST['p_skill_plan_explain']) ? $_POST['p_skill_plan_explain'] : null;
		$v_understand_other_views = isset($_POST['p_understand_other_views']) ? $_POST['p_understand_other_views'] : null;
		$v_use_alcohol = isset($_POST['p_use_alcohol']) ? intval($_POST['p_use_alcohol']) : null;
		$v_use_contrib_crime = isset($_POST['p_use_contrib_crime']) ? intval($_POST['p_use_contrib_crime']) : null;
		$v_use_drugs = isset($_POST['p_use_drugs']) ? intval($_POST['p_use_drugs']) : null;
		$v_workbook_status = isset($_POST['p_workbook_status']) ? $_POST['p_workbook_status'] : null;
		$v_formation_group_id = isset($_POST['p_formation_group_id']) ? intval($_POST['p_formation_group_id']) : null;

    // convert empty values to nulls - doing a 'post' converts data to strings - dates as "" crash trying to update dates
    $v_drop_date = ($v_drop_date == "") ? null : $v_drop_date;
    $v_enroll_date = ($v_enroll_date == "") ? null : $v_enroll_date;
    $v_parole_eligible = ($v_parole_eligible == "") ? null : $v_parole_eligible;
    $v_release_date = ($v_release_date == "") ? null : $v_release_date;
    $v_first_arrest_age = ($v_first_arrest_age == "") ? null : $v_first_arrest_age;
    $v_num_addr_change = ($v_num_addr_change == "") ? null : $v_num_addr_change;
    $v_num_child = ($v_num_child == "") ? null : $v_num_child;
		$v_num_discipline_infractions = ($v_num_discipline_infractions == "") ? null : $v_num_discipline_infractions;
		$v_num_friends_criminal = ($v_num_friends_criminal == "") ? null : $v_num_friends_criminal;
		$v_num_positive_model = ($v_num_positive_model == "") ? null : $v_num_positive_model;

    // recall, if function returns void, do not use "...* from..."

    // $sqlcmd = "select put_attendee_data( " . 
    //           "p_accept_criticism := $1, p_accept_responsibility := $2, p_adult_incarcerations := $3, p_age := $4, " .
    //           "p_att_id_use := $5, p_citizen := $6, p_club_leader := $7, " .
    //           "p_club_leader_explain := $8, p_club_leader_prison_explain := $9, p_clubs_in_prison := $10, " .
    //           "p_clubs_prior := $11, p_course_id := $12, p_current_alcohol := $13, " .
    //           "p_current_drug := $14, p_currently_employed := $15, p_develop_goals := $16, " .
    //           "p_doc_number := $17, p_drop_date := $18, p_email := $19, " .
    //           "p_employ := $20, p_employ_plan := $21, p_employ_plan_explain := $22, " .
    //           "p_enroll_date := $23, p_express_needs := $24, p_fam_crime_history := $25, " .
    //           "p_fam_crime_who := $26, p_fam_involve := $27, p_fam_relationship := $28, " .
    //           "p_first_arrest_age := $29, p_fname := $30, p_friends_during_prison := $31, " .
    //           "p_friendships := $32, p_gender := $33, p_highest_education := $34, " .
    //           "p_id := $35, p_lname := $36, p_make_friends := $37, " .
    //           "p_manage_money := $38, p_manage_problems := $39, p_marital_status := $40, " .
    //           "p_military := $41, p_num_addr_change := $42, p_num_child := $43, " .
    //           "p_num_discipline_infractions := $44, p_num_friends_criminal := $45, p_num_positive_model := $46, " .
    //           "p_parole_eligible := $47, p_previous_convictions := $48, p_provide_good_criticism := $49, " .
    //           "p_race := $50, p_release_date := $51, p_school_expel := $52, " .
    //           "p_skill_plan := $53, p_skill_plan_explain := $54, p_understand_other_views := $55, " .
    //           "p_use_alcohol := $56, p_use_contrib_crime := $57, p_use_drugs := $58, " .
    //           "p_workbook_status := $59, p_formation_group_id := $60)";

    // $result = pg_query_params($dbconn, $sqlcmd, 
    //         array($v_accept_criticism, $v_accept_responsibility, $v_adult_incarcerations, $v_age, $v_att_id_use, $v_citizen, 
    //             $v_club_leader, $v_club_leader_explain, $v_club_leader_prison_explain, $v_clubs_in_prison, $v_clubs_prior, $v_course_id, 
    //             $v_current_alcohol, $v_current_drug, $v_currently_employed, $v_develop_goals, $v_doc_number, $v_drop_date, 
    //             $v_email, $v_employ, $v_employ_plan, $v_employ_plan_explain, $v_enroll_date, $v_express_needs, 
    //             $v_fam_crime_history, $v_fam_crime_who, $v_fam_involve, $v_fam_relationship, $v_first_arrest_age, $v_fname, 
    //             $v_friends_during_prison, $v_friendships, $v_gender, $v_highest_education, $v_id, $v_lname, 
    //             $v_make_friends, $v_manage_money, $v_manage_problems, $v_marital_status, $v_military, $v_num_addr_change, 
    //             $v_num_child, $v_num_discipline_infractions, $v_num_friends_criminal, $v_num_positive_model, $v_parole_eligible, $v_previous_convictions, 
    //             $v_provide_good_criticism, $v_race, $v_release_date, $v_school_expel, $v_skill_plan, $v_skill_plan_explain, 
    //             $v_understand_other_views, $v_use_alcohol, $v_use_contrib_crime, $v_use_drugs, $v_workbook_status, $v_formation_group_id));

    $sqlcmd = "select put_attendee_data(" .
            "p_accept_criticism := $1, p_accept_responsibility := $2, p_adult_incarcerations := $3, p_age := $4, " . 
            "p_att_id_use := $5, p_citizen := $6, p_club_leader := $7, p_club_leader_explain := $8, p_club_leader_prison_explain := $9, " . 
            "p_clubs_in_prison := $10, p_clubs_prior := $11, p_course_id := $12, p_current_alcohol := $13, p_current_drug := $14, " . 
            "p_currently_employed := $15, p_develop_goals := $16, p_doc_number := $17, p_drop_date := $18, " . 
            "p_email := $19, p_employ := $20, p_employ_plan := $21, p_employ_plan_explain := $22, p_enroll_date := $23, p_express_needs := $24, " . 
            "p_fam_crime_history := $25, p_fam_crime_who := $26, p_fam_involve := $27, p_fam_relationship := $28, p_first_arrest_age := $29, p_fname := $30, " . 
            "p_friends_during_prison := $31, p_friendships := $32, p_gender := $33, p_highest_education := $34, p_id := $35, p_lname := $36, " . 
            "p_make_friends := $37, p_manage_money := $38, p_manage_problems := $39, p_marital_status := $40, p_military := $41, p_num_addr_change := $42, " . 
            "p_num_child := $43, p_num_discipline_infractions := $44, p_num_friends_criminal := $45, p_num_positive_model := $46, " . 
            "p_parole_eligible := $47, p_previous_convictions := $48, " . 
            "p_provide_good_criticism := $49, p_race := $50, p_release_date := $51, p_school_expel := $52, p_skill_plan := $53, p_skill_plan_explain := $54, " . 
            "p_understand_other_views := $55, p_use_alcohol := $56, p_use_contrib_crime := $57, p_use_drugs := $58, p_workbook_status := $59, " . 
            "p_formation_group_id := $60)";
  
    $result = pg_query_params($dbconn, $sqlcmd, 
            array($v_accept_criticism, $v_accept_responsibility, $v_adult_incarcerations, $v_age, $v_att_id_use, $v_citizen, 
                  $v_club_leader, $v_club_leader_explain, $v_club_leader_prison_explain, $v_clubs_in_prison, $v_clubs_prior, $v_course_id, 
                  $v_current_alcohol, $v_current_drug, $v_currently_employed, $v_develop_goals, $v_doc_number, $v_drop_date, 
                  $v_email, $v_employ, $v_employ_plan, $v_employ_plan_explain, $v_enroll_date, $v_express_needs, 
                  $v_fam_crime_history, $v_fam_crime_who, $v_fam_involve, $v_fam_relationship, $v_first_arrest_age, $v_fname, 
                  $v_friends_during_prison, $v_friendships, $v_gender, $v_highest_education, $v_id, $v_lname, 
                  $v_make_friends, $v_manage_money, $v_manage_problems, $v_marital_status, $v_military, $v_num_addr_change, 
                  $v_num_child, $v_num_discipline_infractions, $v_num_friends_criminal, $v_num_positive_model, $v_parole_eligible, $v_previous_convictions, 
                  $v_provide_good_criticism, $v_race, $v_release_date, $v_school_expel, $v_skill_plan, $v_skill_plan_explain, 
                  $v_understand_other_views, $v_use_alcohol, $v_use_contrib_crime, $v_use_drugs, $v_workbook_status, 
                  $v_formation_group_id));

		echo json_encode('done');
		break;

  case "GET_1ON1_DATA":
    $v_course_id = $_POST['p_course_id'];
    $v_attendee_id = $_POST['p_attendee_id'];
    // $result = pg_query_params($dbcon, 'select * from get_1on1_details($1, $2)', array($v_course_id, $v_attendee_id));
    $result = pg_query_params($dbconn, 
            'select * from course_attendee_1o1 where course_id = $1 and attendee_id = $2 order by meeting_date desc', 
            array($v_course_id, $v_attendee_id));

    $ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
    break;

	case "GET_VIA_DATA":
		$v_course_id = $_POST['p_course_id'];
		// $v_attendee_id = $_POST['p_attendee_id'];
		// $result = pg_query_params($dbcon, 'select * from ????($1, $2)', array($v_course_id, $v_attendee_id));
		$result = pg_query_params($dbconn, 
						'select * from course_attendee_via where course_id = $1 order by given_date desc', array($v_course_id));
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;

	case "GET_DISC_DATA":
		$v_course_id = $_POST['p_course_id'];
		// $v_attendee_id = $_POST['p_attendee_id'];
		// $result = pg_query_params($dbcon, 'select * from ????($1, $2)', array($v_course_id, $v_attendee_id));
		$result = pg_query_params($dbconn, 
						'select * from course_attendee_disc where course_id = $1 order by given_date desc', array($v_course_id));
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;
		
	case "UTIL TABLE NAMES":
		// returns only the list of table names currently in add_definitions. To ensure it is up to date it may be advisable
		// to first run the add_populatedd, then get all data, then step through data grabbing unique table names
		$result = pg_query($dbconn, 'select * from add_populatedd()');
		$result = null;
		$result = pg_query($dbconn, 'select * from add_getdd_all()');
		$tmp_rslt = pg_fetch_all($result);
		$ret_array = array_unique(array_column($tmp_rslt, 'table_name'));
		echo json_encode($ret_array);
		break;
 
	case "GET_LAST_CALL":
			echo $_SESSION["lastcall"];
			break;
			
	default:
		echo "POST call not recognized: " . $c_apifunc. "<br><br>" ;
		echo '<br>';
		$result = pg_query($dbconn, "select * from information_schema.tables where table_schema='public'");
		// some column names in result set: table_name, table_type, table_schema, table_catalog, is_typed
		$tmpvals = pg_fetch_all($result);
		// echo '<pre>';
		// print_r($tmpvals);
		// echo '</pre>';
		// var_dump($tmpvals);
		$nvals = sizeof($tmpvals);
		foreach($tmpvals as $item) {
			// echo 'there was an item here ' . strval($nvals) . '<br>';
			echo $item['table_name'] . '<br>';
		}
		
}
?>
