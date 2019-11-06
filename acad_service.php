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
// $dbconn = pg_connect("host=localhost dbname=academydb user=cc2000 password=mssucksbad");
// this connection is for the prod db (to be running from prod)
$dbconn = pg_connect(getenv("DATABASE_URL"));

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
		$result = pg_query_params($dbconn, "select * from get_roster($1)", array($v_course_id));
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
