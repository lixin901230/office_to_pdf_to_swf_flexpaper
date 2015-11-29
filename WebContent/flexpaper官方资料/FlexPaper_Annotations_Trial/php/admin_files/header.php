<?php
	require_once("lib/config.php");
	$configManager = new Config();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">	
    <head> 
        <title>FlexPaper</title>         
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link href="admin_files/css/install.css" media="screen" rel="stylesheet" type="text/css" />
		
        <style type="text/css" media="screen"> 
			html, body	{ height:100%; }
			body { margin:0; padding:0; overflow:auto; }   
			#flashContent { display:none; }
        </style> 
		<script type="text/javascript" src="admin_files/js/jquery.min.js"></script>
		<script type="text/javascript" src="admin_files/js/jquery.uploadify.min.js"></script>
    </head>
    <body>
    	<div id="body_proxy" class="section_users section_auth section_app" style="min-height:85%;">
    		<div class="headerx logged_out" id="header">
			   <div id="header_content">
			     <a href="index.php" class="home"><img alt="devaldi Logo" class="logo" id="devaldilogo" src="admin_files/images/flexpaper_logo.png" border=0 /></a>
				 
				  <ul id="nav"> 
				    <li class=""><a href="http://flexpaper.devaldi.com/" class="home">Home</a></li>
					<li class=""><a href="http://flexpaper.devaldi.com/docs.htm" class="docs">Docs</a></li> 
				  </ul> 
			   </div>
			</div>
			<div id="underlay"></div>
			  <div id="content" style="margin-top:0px;">
