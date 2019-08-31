<?php
	header('Access-Control-Allow-Origin: *');
	header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
	header("Pragma: no-cache"); // HTTP 1.0.
	header("Expires: 0"); // Proxies.
	session_start(); // start up a session to help with DB connections

  echo getenv("DATABASE_URL");

?>



