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
			if(property_exists($mark,'selection_info') && ($mark->{'type'}=='highlight'||$mark->{'type'}=='strikeout')){$pageIndex = current(split(";",$mark->{'selection_info'}));}
			if(isset($_POST['DOCUMENT_PATH'])){$path = $_POST['DOCUMENT_PATH'];}else{$path = "";}
			$update 	= 	"UPDATE " .
							"mark " .
							"SET " .
							"selection_text = '" . (property_exists($mark,'selection_text')?mysql_real_escape_string($mark->{'selection_text'}):"") . "'," .
							"has_selection = '" . ((property_exists($mark,'has_selection') && $mark->{'has_selection'}=="true")?1:0) . "'," . 
							"color = '" . (property_exists($mark,'color')?mysql_real_escape_string($mark->{'color'}):"") . "'," .
							"selection_info = '" . (property_exists($mark,'selection_info')?mysql_real_escape_string($mark->{'selection_info'}):"") . "'," .
							"readonly = '" . ((property_exists($mark,'readonly') && $mark->{'readonly'}=="true")?1:0) . "'," .
							"note = '" . (property_exists($mark,'note')?mysql_real_escape_string($mark->{'note'}):"") . "'," . 
							"pageIndex = '" . mysql_real_escape_string($pageIndex) . "'," .
							"positionX = '" . (property_exists($mark,'positionX')?mysql_real_escape_string($mark->{'positionX'}):"-1") . "'," .
							"positionY = '" . (property_exists($mark,'positionY')?mysql_real_escape_string($mark->{'positionY'}):"-1") . "'," .
							"width = '" . (property_exists($mark,'width')?mysql_real_escape_string($mark->{'width'}):"-1") . "'," .
							"height = '" . (property_exists($mark,'height')?mysql_real_escape_string($mark->{'height'}):"-1") . "'," .
							"collapsed = '" . ((property_exists($mark,'collapsed') && $mark->{'collapsed'}=="true")?1:0) . "'," . 
							"points = '" . (property_exists($mark,'points')?mysql_real_escape_string($mark->{'points'}):"") . "'" .
							"WHERE id = '" . mysql_real_escape_string($mark->{'id'}) . "'";
	
			if(mysql_query($update)){echo 1;}else{echo 0;}
		}
	}else{echo 0;}}?>
