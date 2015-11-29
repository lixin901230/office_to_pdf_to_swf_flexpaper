<?php
require_once("../../lib/config.php");
$configManager = new Config();
if($configManager->getConfig('admin.password')==null){
    exit;
}

session_start();
if(!isset($_SESSION['FLEXPAPER_AUTH'])) {
    exit;
}

/*
Uploadify v3.1.0
Copyright (c) 2012 Reactive Apps, Ronnie Garcia
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/

// Define a destination
$targetFolder = '/uploads'; // Relative to the root

if (!empty($_FILES)) {
	$tempFile = $_FILES['Filedata']['tmp_name'];
	//$targetPath = $_SERVER['DOCUMENT_ROOT'] . $targetFolder;
	$targetPath = $configManager->getConfig('path.pdf');	
	$targetFile = rtrim($targetPath,'/') . '/' . $_FILES['Filedata']['name'];
	
	// Validate the file type
	$fileTypes = array('pdf'); 
	$fileParts = pathinfo($_FILES['Filedata']['name']);
	
	if (in_array($fileParts['extension'],$fileTypes)) {
		if(move_uploaded_file($tempFile,$targetFile)){
			echo '1';
		}else{
			echo '0';
		}
	} else {
		echo 'Invalid file type.';
	}
}
?>