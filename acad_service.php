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
    $result = pg_query_params($dbconn, "select * from course_attendee_list where course_id = $1 and drop_date = null", array($v_course_id));
		// $result = pg_query_params($dbconn, "select * from get_roster($1)", array($v_course_id));
		$ret_array = pg_fetch_all($result);
		echo json_encode($ret_array);
		break;

  case "GET_COURSE_DROPS":
    $result = pg_query_params($dbconn, "select * from course_attendee_list where course_id = $1 and drop_date <> null", array($v_course_id));
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

  case "PUT_ROSTER_DATA":
		$v_accept_criticism = isset($_POST['p_accept_criticism']) ? $_POST['p_accept_criticism'] : null;
		$v_accept_responsibility = isset($_POST['p_accept_responsibility']) ? $_POST['p_accept_responsibility'] : null;
		$v_adult_incarcerations = isset($_POST['p_adult_incarcerations']) ? $_POST['p_adult_incarcerations'] : null;
		$v_age = isset($_POST['p_age']) ? $_POST['p_age'] : null;
		$v_att_id_use = isset($_POST['p_att_id_use']) ? $_POST['p_att_id_use'] : null;
		$v_citizen = isset($_POST['p_citizen']) ? $_POST['p_citizen'] : null;
		$v_club_leader = isset($_POST['p_club_leader']) ? $_POST['p_club_leader'] : null;
		$v_club_leader_explain = isset($_POST['p_club_leader_explain']) ? $_POST['p_club_leader_explain'] : null;
		$v_club_leader_prison_explain = isset($_POST['p_club_leader_prison_explain']) ? $_POST['p_club_leader_prison_explain'] : null;
		$v_clubs_in_prison = isset($_POST['p_clubs_in_prison']) ? $_POST['p_clubs_in_prison'] : null;
		$v_clubs_prior = isset($_POST['p_clubs_prior']) ? $_POST['p_clubs_prior'] : null;
		$v_course_id = isset($_POST['p_course_id']) ? $_POST['p_course_id'] : null;
		$v_current_alcohol = isset($_POST['p_current_alcohol']) ? $_POST['p_current_alcohol'] : null;
		$v_current_drug = isset($_POST['p_current_drug']) ? $_POST['p_current_drug'] : null;
		$v_currently_employed = isset($_POST['p_currently_employed']) ? $_POST['p_currently_employed'] : null;
		$v_develop_goals = isset($_POST['p_develop_goals']) ? $_POST['p_develop_goals'] : null;
		$v_doc_number = isset($_POST['p_doc_number']) ? $_POST['p_doc_number'] : null;
		$v_drop_date = isset($_POST['p_drop_date']) ? $_POST['p_drop_date'] : null;
		$v_email = isset($_POST['p_email']) ? $_POST['p_email'] : null;
		$v_employ = isset($_POST['p_employ']) ? $_POST['p_employ'] : null;
		$v_employ_plan = isset($_POST['p_employ_plan']) ? $_POST['p_employ_plan'] : null;
		$v_employ_plan_explain = isset($_POST['p_employ_plan_explain']) ? $_POST['p_employ_plan_explain'] : null;
		$v_enroll_date = isset($_POST['p_enroll_date']) ? $_POST['p_enroll_date'] : null;
		$v_express_needs = isset($_POST['p_express_needs']) ? $_POST['p_express_needs'] : null;
		$v_fam_crime_history = isset($_POST['p_fam_crime_history']) ? $_POST['p_fam_crime_history'] : null;
		$v_fam_involve = isset($_POST['p_fam_involve']) ? $_POST['p_fam_involve'] : null;
		$v_fam_relationship = isset($_POST['p_fam_relationship']) ? $_POST['p_fam_relationship'] : null;
		$v_family_crime_history = isset($_POST['p_family_crime_history']) ? $_POST['p_family_crime_history'] : null;
		$v_first_arrest_age = isset($_POST['p_first_arrest_age']) ? $_POST['p_first_arrest_age'] : null;
		$v_fname = isset($_POST['p_fname']) ? $_POST['p_fname'] : null;
		$v_friends_during_prison = isset($_POST['p_friends_during_prison']) ? $_POST['p_friends_during_prison'] : null;
		$v_friendships = isset($_POST['p_friendships']) ? $_POST['p_friendships'] : null;
		$v_gender = isset($_POST['p_gender']) ? $_POST['p_gender'] : null;
		$v_highest_education = isset($_POST['p_highest_education']) ? $_POST['p_highest_education'] : null;
		$v_id = isset($_POST['p_id']) ? $_POST['p_id'] : null;
		$v_lname = isset($_POST['p_lname']) ? $_POST['p_lname'] : null;
		$v_make_friends = isset($_POST['p_make_friends']) ? $_POST['p_make_friends'] : null;
		$v_manage_money = isset($_POST['p_manage_money']) ? $_POST['p_manage_money'] : null;
		$v_manage_problems = isset($_POST['p_manage_problems']) ? $_POST['p_manage_problems'] : null;
		$v_marital_status = isset($_POST['p_marital_status']) ? $_POST['p_marital_status'] : null;
		$v_military = isset($_POST['p_military']) ? $_POST['p_military'] : null;
		$v_num_addr_change = isset($_POST['p_num_addr_change']) ? $_POST['p_num_addr_change'] : null;
		$v_num_child = isset($_POST['p_num_child']) ? $_POST['p_num_child'] : null;
		$v_num_child = isset($_POST['p_num_child']) ? $_POST['p_num_child'] : null;
		$v_num_discipline_infractions = isset($_POST['p_num_discipline_infractions']) ? $_POST['p_num_discipline_infractions'] : null;
		$v_num_friends_criminal = isset($_POST['p_num_friends_criminal']) ? $_POST['p_num_friends_criminal'] : null;
		$v_num_positive_model = isset($_POST['p_num_positive_model']) ? $_POST['p_num_positive_model'] : null;
		$v_parole_eligible = isset($_POST['p_parole_eligible']) ? $_POST['p_parole_eligible'] : null;
		$v_previous_convictions = isset($_POST['p_previous_convictions']) ? $_POST['p_previous_convictions'] : null;
		$v_provide_good_criticism = isset($_POST['p_provide_good_criticism']) ? $_POST['p_provide_good_criticism'] : null;
		$v_race = isset($_POST['p_race']) ? $_POST['p_race'] : null;
		$v_release_date = isset($_POST['p_release_date']) ? $_POST['p_release_date'] : null;
		$v_school_expel = isset($_POST['p_school_expel']) ? $_POST['p_school_expel'] : null;
		$v_skill_plan = isset($_POST['p_skill_plan']) ? $_POST['p_skill_plan'] : null;
		$v_skill_plan_explain = isset($_POST['p_skill_plan_explain']) ? $_POST['p_skill_plan_explain'] : null;
		$v_understand_other_views = isset($_POST['p_understand_other_views']) ? $_POST['p_understand_other_views'] : null;
		$v_use_alcohol = isset($_POST['p_use_alcohol']) ? $_POST['p_use_alcohol'] : null;
		$v_use_contrib_crime = isset($_POST['p_use_contrib_crime']) ? $_POST['p_use_contrib_crime'] : null;
		$v_use_drugs = isset($_POST['p_use_drugs']) ? $_POST['p_use_drugs'] : null;
		$v_workbook_status = isset($_POST['p_workbook_status']) ? $_POST['p_workbook_status'] : null;
		$v_formation_group_id = isset($_POST['p_formation_group_id']) ? $_POST['p_formation_group_id'] : null;

		$result = pg_query_params($dbconn, 'select * from put_attendee_data($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
								$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,
								$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,$52,$53,$54,$55,$56,$57,
								$58,$59,$60,$61)', 
			array($v_id,$v_fname,$v_lname,$v_age,$v_doc_number,$v_first_arrest_age,$v_previous_convictions,
				$v_fam_crime_history,$v_num_child,$v_marital_status,$v_num_positive_model,$v_att_id_use,
				$v_release_date,$v_parole_eligible,$v_workbook_status,$v_gender,$v_race,$v_military,
				$v_citizen,$v_email,$v_adult_incarcerations,
				$v_family_crime_history,$v_num_discipline_infractions,$v_num_child,
				$v_fam_involve,$v_fam_relationship,$v_num_addr_change,$v_friendships,
				$v_num_friends_criminal,$v_friends_during_prison,$v_use_alcohol,
				$v_use_drugs,$v_current_alcohol,$v_current_drug,$v_use_contrib_crime,$v_highest_education,
				$v_school_expel,$v_skill_plan,$v_skill_plan_explain,$v_employ,$v_currently_employed,$v_employ_plan,
				$v_employ_plan_explain,$v_clubs_prior,$v_clubs_in_prison,$v_club_leader,$v_club_leader_explain,
				$v_express_needs,$v_understand_other_views,$v_make_friends,$v_accept_criticism,
				$v_provide_good_criticism,$v_accept_responsibility,$v_manage_problems,$v_develop_goals,$v_manage_money,
				$v_course_id, $v_enroll_date, $v_drop_date, $v_club_leader_prison_explain,
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
		echo "ADD API call not recognized: " . $c_apifunc. "<br><br>" ;
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
