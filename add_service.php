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

// $host='localhost';
// $dbuser='ccmain';
// $dbpass='damnatt';
// $dbname='PIM';

$c_apifunc = strtoupper($_POST['api_func']);
// this connection is for the prod db (to be running from prod) - pretty much only run add pages in prod anyway
$dbconn = pg_connect(getenv("DATABASE_URL"));


if (!$dbconn) {
    echo "Error trying to just connect to DB";
    exit;
}

// echo $c_apifunc . '<br>';

if ($c_apifunc != 'GET_LAST_CALL') {
    $_SESSION["lastcall"] = $c_apifunc;
}

switch ($c_apifunc) {

    case "ADD_CLONE_DEFINITIONS":
        $u_clone_from = trim(strtolower($_POST['from_tbl']));
        $u_clone_to = trim(strtolower($_POST['to_tbl']));
        $v_sql = 'select * from add_clone_definitions($1, $2)';
        $result = pg_query_params($dbconn, $v_sql, array($u_clone_from, $u_clone_to));
        $ret_array = pg_fetch_all($result);
        echo json_encode($ret_array);
        break;
        
        
    case "ADD_GETAPI_VERSION":
		$u_opt = strtoupper($_POST['ver_type']);
//		echo $u_opt . '<br>';
		$result = pg_query_params($dbconn, 'select * from add_getapi_version($1)', array($u_opt));
		//$result = pg_query($dbconn, 'select * from add_getapi_version()');
		if (!$result) {
		    echo "Error occurred when trying to run query";
		    exit;
		} else {
		    // remember pg_fetch_result row and col start at 0 (cripes.... what a language.....)
		    $new_junk = nl2br(pg_fetch_result($result, 0, 0), false);
		    echo $new_junk;
		}
		break;

	case "ADD_GETDD_ALL":
	    //	    echo 'called add_getdd_all';
	    // $u_struc_flag = strtoupper($_POST['add_struc']);
	    // note: not using the include structure parameter because postrgesql does not allow varying return structures
        $result = pg_query($dbconn, 'select * from add_getdd_all()');
        $ret_array = pg_fetch_all($result);
        echo json_encode($ret_array);
	    break;
	    
    case "ADD_GETDD_UNDOCUMENTED":
//	    echo '<h1>called add_getdd_all</h1>' . '<br>';
//  	    $u_source = strtoupper($_POST['stew_id']);
	    $result = pg_query($dbconn, 'select * from add_getdd_undocumented()');
	    $ret_array = pg_fetch_all($result);
	    echo json_encode($ret_array);
	    break;
	    
	    
	case "ADD_GETDD_BY_STEWARD":
//	    echo 'called add_getdd_by_steward';
	    $u_steward = strtoupper($_POST['steward_id']);
	    if ($u_steward === "GET AVAILABLE") {
	        $result = pg_query($dbconn, 'select * from add_getdd_by_steward()');
	        // only 1 column of interest - the steward_attuid_primary - but postgres limitations forced a return of all columns, so....
	        $ret_array = pg_fetch_all_columns($result, 7);
	        echo json_encode($ret_array);
	    } else {
	        // the php "array()" function will take a list of things and put them into an array construct - which is needed for pg_query_params
            $result = pg_query_params($dbconn, 'select * from add_getdd_by_steward($1)', array($u_steward));
	        $resultArray = pg_fetch_all($result);
	        echo json_encode($resultArray);
	    }
	    
	    break;

	case "ADD_GETDD_ITEM_HISTORY":
	    //	    echo 'called add_getdd_by_steward';
	    $u_item_id = strtoupper($_POST['hist_id']);
	    $u_tbl = strtoupper($_POST['hist_tbl']);
	    $u_col = strtoupper($_POST['hist_col']);
	    $u_start = strtoupper($_POST['hist_start']);
	    $u_end = strtoupper($_POST['hist_end']);
	    $u_item_id = $u_item_id === "" ? null : $u_item_id;
	    $u_tbl = $u_tbl === "" ? null : $u_tbl;
	    $u_col = $u_col === "" ? null : $u_col;
	    $u_start = $u_start === "" ? null : $u_start;
	    $u_end = $u_end === "" ? null : $u_end;
/* 	    echo gettype($u_item_id) . '<br>';
	    echo gettype($u_tbl) . '<br>';
	    echo gettype($u_col) . '<br>';
	    echo gettype($u_start) . '<br>';
	    echo gettype($u_end) . '<br>'; */
	    $sqlcmd = 'select * from add_getdd_item_history($1, $2, $3, $4, $5)';
        $result = pg_query_params($dbconn, $sqlcmd, array($u_item_id, $u_tbl, $u_col, $u_start, $u_end));
	    $ret_array = pg_fetch_all($result);
	    echo json_encode($ret_array);

	    break;
	    
	    
	case "ADD_GETDD_BY_SOURCE":
	    //	    echo 'called add_getdd_by_source';
	    $u_source = strtoupper($_POST['source_str']);
	    if ($u_source === "GET AVAILABLE") {
	        $result = pg_query($dbconn, 'select * from add_getdd_by_source()');
	        // only 1 column of interest - the steward_attuid_primary - but postgres limitations forced a return of all columns, so....
	        $ret_array = pg_fetch_all_columns($result, 4);
	        echo json_encode($ret_array);
	    } else {
	        // the php "array()" function will take a list of things and put them into an array construct - which is needed for pg_query_params
	        $result = pg_query_params($dbconn, 'select * from add_getdd_by_source($1)', array($u_source));
	        $resultArray = pg_fetch_all($result);
	        echo json_encode($resultArray);
	    }
	    break;
	    
	case "ADD_DELETEDD_ITEM":
	    $u_delid = strtoupper($_POST['del_id']);
	    $u_reason = $_POST['del_text'];
	    $sqlcmd = "select * from add_deletedd_item($1, $2)";
	    $result = pg_query_params($dbconn, $sqlcmd, array($u_delid, $u_reason));
	    $resultarray = pg_fetch_all($result);
	    echo json_encode($resultarray);
	    break;
	    
	case "ADD_SEARCHDD":
	    $u_text = strtoupper($_POST['srch_txt']);
	    $u_tbl = strtoupper($_POST['srch_tbl']);
	    $u_col = strtoupper($_POST['srch_col']);
	    $u_text = $u_text === '' ? null : $u_text;
	    $u_tbl = $u_tbl === '' ? null : $u_tbl;
	    $u_col = $u_col === '' ? null : $u_col;
	    $sqlcmd = "select * from add_searchdd($1, $2, $3)";
 	    $result = pg_query_params($dbconn, $sqlcmd, array($u_text, $u_tbl, $u_col));
/*  	    var_dump($result);
 	    echo '<br>'; */
	    $resultArray = pg_fetch_all($result);
/* 	    var_dump($resultArray);
	    echo '<br>'; */
	    echo json_encode($resultArray);
	    
	    break;

	case "ADD_POPULATE_DD_INACTIVES":
	        //	    echo '<h1>called add_getdd_all</h1>' . '<br>';
	        $result = pg_query($dbconn, 'select * from add_populate_dd_inactives()');
	        $ret_array = pg_fetch_all($result);
	        echo json_encode($ret_array);
	        break;
	        
	case "ADD_POPULATEDD":
	    //	    echo '<h1>called add_getdd_all</h1>' . '<br>';
	    $result = pg_query($dbconn, 'select * from add_populatedd()');
	    $ret_array = pg_fetch_all($result);
	    echo json_encode($ret_array);
	    break;
	    
	        
	case "ADD_GETINACTIVES":
        // note that this is not a direct API call: will use php constructs to pull just certain items. If this becomes important may add to the ADD API
	    $retarray = array();
	    $result = pg_query($dbconn, 'select * from add_getdd_all()');
	    while ($row = pg_fetch_assoc($result)) {
	        // inactive is col 13, but note array is 0-based
	        if ($row['inactive'] == 1) {
	            array_push($retarray, $row);
	        }
	    }
	    echo json_encode($retarray);
	    break;    
	        
	case "ADD_PUTDD_ITEM":
	    //	    echo 'called add_getdd_by_steward';
	    $t_item = ($_POST['p_item_id']);
	    $t_tbl = ($_POST['p_tbl']);
	    $t_col = ($_POST['p_col']);
	    $t_meaning = ($_POST['p_meaning']);
	    $t_source = ($_POST['p_data_source']);
	    $t_upfreq = ($_POST['p_update_frequency']);
	    $t_sec = ($_POST['p_security']);
	    $t_stew = ($_POST['p_steward']);
	    $t_stewb = ($_POST['p_steward_backups']);
	    $t_defconf = ($_POST['p_definition_confidence']);
        // going to use positional parameters - less to type - also the parameter names of the stored proc may change. The Stored procs
        // for SQL Server and Postgres are different at the moment (Postgres parms have a "p_" on the front... probably need to make same)
        $sqlcmd = "select * from add_putdd_item($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
        $result = pg_query_params($dbconn, $sqlcmd, 
            array($t_item, $t_tbl, $t_col, $t_meaning, $t_source, $t_upfreq, $t_sec, $t_stew, $t_stewb, $t_defconf));
	    echo 'ADD_PUTDD_ITEM Call completed';
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

  case "CONN_INFO":
      echo pg_host($dbconn) . '</br>' . getenv("CHARLIETESTENV");
      
	    break;
      
	default:
		echo "ADD API call not recognized: " . $c_apifunc ;
}
?>
