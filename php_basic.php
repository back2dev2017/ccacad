<?php
	header('Access-Control-Allow-Origin: *');
?>
<!DOCTYPE html>
<html>
<head>
<title>PHP for ADD</title>
<!--
<style>
table {
    width: 100%;
    border-collapse: collapse;
}

table, td, th {
    border: 1px solid black;
    padding: 5px;
}

th {text-align: left;}
</style>
-->
</head>

<body>

<?php
//$q = intval($_GET['q']);

// going to use PDO for db connections

echo '<p>Hello PHP</p>';
echo '<p>another line....</p>';
print("Cripes the insanity");

try {$host='localhost';
	 $dbuser='ccmain';
     $dbpass='damnatt';
     $dbname='PIM';
     $dbhandle= new PDO("pgsql:host=$host;dbname=$dbname", $dbuser, $dbpass);
    } catch (PDOException $e) {
		echo "Error: " . $e->getMessage() . "<br/>";
		die();
	}

$sql = 'SELECT firstname, lastname from contact_addr order by lastname' ;

foreach ($dbhandle->query($sql) as $row) {
	print $row['firstname'] . " ";
	print $row['lastname'] . "<br>";
}


?>
</body>

</html> 