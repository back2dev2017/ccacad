<?php
	header('Access-Control-Allow-Origin: *');
	header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
	header("Pragma: no-cache"); // HTTP 1.0.
	header("Expires: 0"); // Proxies.
?>


<?php

function custom_err_hdlr ($errno, $errstr, $errfile, $errline, $errcontext) {
  echo "<b>My ERROR</b> [$errno] $errstr<br>\n";
  echo "  Fatal error on line $errline in file $errfile";
  echo ", PHP " . PHP_VERSION . " (" . PHP_OS . ")\n";
  echo "Aborting...\n";
  die();
}

// require_once('add_conn_cls.php');
set_error_handler("custom_err_hdlr");

$mainfolder = $_SERVER["DOCUMENT_ROOT"];

if ( isset($_GET['num_names']) ) {
  $num2make = intval($_GET['num_names']);
} else {
  $num2make = 1;
}
 
echo $mainfolder . '<br>';

$t1 = file_get_contents($mainfolder . "/dev/academyweb/resource/fnames.json");
// echo $t1;
$tfnames = json_decode($t1, true);
$t1 = file_get_contents($mainfolder . "/dev/academyweb/resource/lnames.json");
$tlnames = json_decode($t1, true);

echo $tfnames

// $retarry = [];
// for ($ni = 0; $ni < $num2make; $ni++) {
//   // making key assumption the number of fnames and lnames objects is 5000 each
//   $tindex = rand(1,5000);
//   $tmpf = $tfnames[$tindex];
//   $tindex = rand(1,5000);
//   $tmpl = $tlnames[$tindex];
//   $tobj = new {$tmpf, $tmpl};
//   $retarray[] = $tobj;
// }

// echo $retarray;
?>
