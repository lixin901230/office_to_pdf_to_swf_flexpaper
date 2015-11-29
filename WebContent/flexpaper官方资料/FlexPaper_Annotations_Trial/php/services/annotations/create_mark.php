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
			$select = mysql_query("SELECT * FROM mark WHERE id = '" . mysql_real_escape_string($mark->{'id'}) . "'");
			if(mysql_num_rows($select)==0){ // only create annotations which does not exist yet
				$pageIndex  = (property_exists($mark,'pageIndex')?$mark->{'pageIndex'}:"");
				if(property_exists($mark,'selection_info') && ($mark->{'type'}=='highlight'||$mark->{'type'}=='strikeout')){$pageIndex = current(split(";",$mark->{'selection_info'}));}
				if(isset($_POST['DOCUMENT_PATH'])){$path = $_POST['DOCUMENT_PATH'];}else{$path = "";}
				$insert 	= 	"INSERT INTO " .
								"mark (" .
								"id, " .
								"document_filename, " .
								"document_relative_path, " .
								"selection_text, " .
								"has_selection, " . 
								"color, " .
								"selection_info, " .
								"readonly, " .
								"type, " . 
								"displayFormat, " .
								"note, " . 
								"pageIndex, " .
								"positionX, " . 
								"positionY, " . 
								"width, " .
								"height, " .
								"collapsed, " .
								"author, " .
								"points) " .
								"VALUES (" .
								"'" . mysql_real_escape_string($mark->{'id'}) . "', " . // id
								"'" . mysql_real_escape_string($_POST['DOCUMENT_FILENAME']) . "', " . // document_filename
								"'" . mysql_real_escape_string($path) ."', " . // document_relative_path
								"'" . (property_exists($mark,'selection_text')?mysql_real_escape_string($mark->{'selection_text'}):"") . "', " . // selection_text
								"'" . ((property_exists($mark,'has_selection') && $mark->{'has_selection'}=="true")?1:0) . "', " . // has_selection
								"'" . (property_exists($mark,'color')?mysql_real_escape_string($mark->{'color'}):"") . "', ".  // color
								"'" . (property_exists($mark,'selection_info')?mysql_real_escape_string($mark->{'selection_info'}):"") . "', " . // selection_info
								"'" . ((property_exists($mark,'readonly') && $mark->{'readonly'}=="true")?1:0) . "', " . // readonly
								"'" . (property_exists($mark,'type')?mysql_real_escape_string($mark->{'type'}):"") . "', " .
								"'" . (property_exists($mark,'displayFormat')?mysql_real_escape_string($mark->{'displayFormat'}):"html") . "', " . // displayFormat
								"'" . (property_exists($mark,'note')?mysql_real_escape_string($mark->{'note'}):"") . "', " . // note
								"'" . mysql_real_escape_string($pageIndex) . "', " . // pageIndex
								"'" . (property_exists($mark,'positionX')?mysql_real_escape_string($mark->{'positionX'}):"-1") . "', " . // X
								"'" . (property_exists($mark,'positionY')?mysql_real_escape_string($mark->{'positionY'}):"-1") . "', " .  // Y
								"'" . (property_exists($mark,'width')?mysql_real_escape_string($mark->{'width'}):"-1") . "', " .  // width
								"'" . (property_exists($mark,'height')?mysql_real_escape_string($mark->{'height'}):"-1") . "', " . // height
								"'" . ((property_exists($mark,'collapsed') && $mark->{'collapsed'}=="true")?1:0) . "', " .  // collapsed
								"'" . (property_exists($mark,'author')?mysql_real_escape_string($mark->{'author'}):"") . "', " . // author
								"'" . (property_exists($mark,'points')?mysql_real_escape_string($mark->{'points'}):"") . "'" . // points
								");";
		
				if(mysql_query($insert)){echo 1;}else{echo 0;}
			}else{echo 2;}
		}
	}else{echo 0;}}?>
