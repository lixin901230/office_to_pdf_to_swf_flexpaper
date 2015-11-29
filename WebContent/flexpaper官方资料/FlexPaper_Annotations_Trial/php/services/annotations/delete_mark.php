<?php
require_once("../../lib/config.php"); 
require_once("../../lib/common.php");

$mark = json_decode($_POST['MARK']);
if(!is_object($mark)){
	echo 0;
}else{
	$configManager = new Config();
	if($configManager->getConfig('sql.verified')=='true'){
		$con = mysql_connect($configManager->getConfig('sql.host'), $configManager->getConfig('sql.username'), $configManager->getConfig('sql.password'));
		if($con){
			$database 	= mysql_select_db($configManager->getConfig('sql.database'), $con);
			$pageIndex  = (property_exists($mark,'pageIndex')?$mark->{'pageIndex'}:"");
			if(property_exists($mark,'selection_info')){$pageIndex = current(split(";",$mark->{'selection_info'}));}
			if(isset($_POST['DOCUMENT_PATH'])){$path = $_POST['DOCUMENT_PATH'];}else{$path = "";}
			$delete 	= 	"DELETE FROM mark WHERE id = '" . mysql_real_escape_string($mark->{'id'}) . "'";
			if(mysql_query($delete)){echo 1;}else{echo 0;}
		}
	}else{echo 0;}}?>