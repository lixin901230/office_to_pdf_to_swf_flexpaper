<?php 
	require_once("lib/config.php");
	$configManager = new Config();
	session_start();

	if($configManager->getConfig('admin.password')!=null && !isset($_SESSION['FLEXPAPER_AUTH'])){
		$url = 'index.php';
		header("Location: $url");
		exit;
	}
	
if(isset($_GET["dir"])){
	$dir = $_GET["dir"];
	if(is_dir($dir) && is_writable($dir)){
		echo "1";
	}else{
		echo "0";
	}
}
?>