<?php 
	require_once("lib/config.php");
	$configManager = new Config();
	session_start();

	if($configManager->getConfig('admin.password')!=null && !isset($_SESSION['FLEXPAPER_AUTH'])){
		$url = 'index.php';
		header("Location: $url");
		exit;
	}

// perform connectivity test
$retval = "1";

if(function_exists('mysql_connect')){
	$connect = mysql_connect($_POST['SQL_HOST'], $_POST['SQL_USERNAME'], $_POST['SQL_PASSWORD']);
		if(!$connect)
			$retval = "no_connect";
	
	$database = mysql_select_db($_POST['SQL_DATABASE'], $connect);
		if(!$database)
			$retval = "no_db";
}else{
	$retval = "no_mysql_extensions";
}
echo $retval;
?>