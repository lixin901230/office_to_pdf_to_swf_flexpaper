<?php
/**
* █▒▓▒░ The FlexPaper Project 
* 
* Copyright (c) 2009 - 2011 Devaldi Ltd
* 
* Document page counter file for PHP. Accepts parameters 'doc'
* Executes specified conversion command if the document has not yet been
* converted and returns the number of pages in the converted document 
*   
* GNU GENERAL PUBLIC LICENSE Version 3 (GPL).
* 
* The GPL requires that you not remove the FlexPaper copyright notices
* from the user interface. 
*  
* Commercial licenses are available. The commercial player version
* does not require any FlexPaper notices or texts and also provides
* some additional features.
* When purchasing a commercial license, its terms substitute this license.
* Please see http://flexpaper.devaldi.com/ for further details.
* 
*/

/* Responds with height and width of a swf file*/
require_once("../lib/swfsize_php5.php");
$doc=$_GET["doc"];
if(isset($_GET["page"])){$page = $_GET["page"];}else{$page = "";}

$swfsizequery=new swfsizequery();

header("content-type: application/json"); 
$rtnjsonobj->height = $swfsizequery->getSize($doc,$page,'height');
$rtnjsonobj->width 	= $swfsizequery->getSize($doc,$page,'width');

// Wrap and write a JSON-formatted object with a function call, using the supplied value of parm 'callback' in the URL:
echo $_GET['callback']. '('. json_encode($rtnjsonobj) . ')';    
?>