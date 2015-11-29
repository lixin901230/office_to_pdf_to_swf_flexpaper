<?php
	/**
	* █▒▓▒░ The FlexPaper Project 
	* Copyright (c) 2009 - 2012 Devaldi Ltd
	* 
	*/

	// Check for user configuration entries. If missing redirect to setup page.
	require_once("lib/config.php");
	require_once("lib/common.php");
	$configManager = new Config();
	
	if($configManager->getConfig('admin.password')==null){
		$url = 'setup.php';
		header("Location: $url");
		exit;
	}
	
	$loginerr = "";
	session_start();
	
	$pdfFilePath = $configManager->getConfig('path.pdf');
	$subFolder = "";
	if(isset($_GET['subfolder'])){
		$subFolder = $_GET['subfolder'];
	}

	if(isset($_SESSION['FLEXPAPER_AUTH'])) {
        if(isset($_POST['pdfFile'])){
            for ($i = 0; $i < count($_POST['pdfFile']); $i++) {
                if(file_exists($pdfFilePath . $_POST['pdfFile'][$i]) && !invalidFilename($_POST['pdfFile'][$i])){
                    unlink($pdfFilePath . $_POST['pdfFile'][$i]);
                }
            }
        }
	}
	
	if(isset($_POST['ADMIN_USERNAME'])){
		if(	$configManager->getConfig('admin.username') == $_POST['ADMIN_USERNAME'] &&
			$configManager->getConfig('admin.password') == $_POST['ADMIN_PASSWORD']){
				$_SESSION['FLEXPAPER_AUTH'] = "1";
			}else{
				$_SESSION['FLEXPAPER_AUTH'] = null;
				$loginerr = "Authentication failed. Please contact your system administrator for assistance.";
			}
	}
	
	function GetBasePath() { 
    return substr($_SERVER['SCRIPT_FILENAME'], 0, strlen($_SERVER['SCRIPT_FILENAME']) - strlen(strrchr($_SERVER['SCRIPT_FILENAME'], "\\"))); 
	} 
?>

<?php require_once("admin_files/header.php"); ?>
<?php if(!isset($_SESSION['FLEXPAPER_AUTH'])) { ?>
 	<div id="underlay"></div>
		  <div id="content">
		  
			  <img alt="devaldi lock" id="lock" src="admin_files/images/paper_lock.png" width="347" height="346" />
			
			<div class="right_column">
				<form action="index.php" class="devaldi" id="login" method="post"><h3><nobr>Login to the FlexPaper Console</nobr></h3>
				  
				  <label for="j_username">User</label>
				  <div class='text'><input id="ADMIN_USERNAME" name="ADMIN_USERNAME" size="30" type="text" /><div class="effects"></div><div class="loader"></div></div>
				  
				  <label for="j_password">Password</label>
				  <div class='text'><input id="ADMIN_PASSWORD" name="ADMIN_PASSWORD" size="30" type="password" /><div class="effects"></div><div class="loader"></div></div>

				  <div id="loginResult" class="formError"><?php echo $loginerr ?></div> 
				    
				  <ol class="horiz_bttns">
				    <li><button class="login small main n_button" type="submit"><span></span><em>Login</em></button></li>    
					</ol>
					<p id="result"></p>
				</form>
			</div>
		</div>
<?php }else{ ?>
<script type="text/javascript"> 

$(function() {
      $('table tbody tr').mouseover(function() {
	  	 $(this).removeClass('checkedRow')
	  	 $(this).removeClass('unselectedRow');
         $(this).addClass('selectedRow');
      }).mouseout(function() {
	  	 if ($('input:first', this).attr('checked') == 'checked') {
		 	$(this).removeClass('selectedRow');
		 	$(this).addClass('checkedRow');
		 }
		 else {
		 	$(this).removeClass('selectedRow');
		 	$(this).addClass('unselectedRow');
			$(this).removeClass('checkedRow');
		 }
      }).click(function(event){
      	if(jQuery(event.target).hasClass('folder')){return;}
      	
      	 var tagName = (event && event.target)?event.target.tagName:window.event.srcElement.tagName;
		 if(tagName != 'INPUT' && !jQuery(event.target).hasClass('title')){
			<?php if(!$configManager->getConfig('splitmode') || $configManager->getConfig('splitmode') == "false"){ ?>
            var newWindow = window.open('simple_document.php?subfolder=<?php echo $subFolder ?>&doc='+ $('input:first', this).val(),'open_window','menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0');
            <?php }else{ ?>
            var newWindow = window.open('split_document.php?subfolder=<?php echo $subFolder ?>&doc='+ $('input:first', this).val(),'open_window','menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0');
            <?php } ?>
      	 }else{
			if(tagName != 'INPUT')
				$('input:first', this).prop("checked", !($('input:first', this).attr('checked') == 'checked'));
		}
      });
      
      
      $('.file-upload').fileUpload(
		{
			url: 'admin_files/controls/uploadify.php',
			type: 'POST',
			dataType: 'json',
			beforeSend: function () {
				jQuery('#Filename').val(jQuery('#Filedata').val().substr(jQuery('#Filedata').val().lastIndexOf("\\")+1));
			},
			complete: function () {

			},
			success: function (result, status, xhr) {
				if(result=='0'){
					alert('Unable to upload file. Please verify your server directory permissions.');
				}else{
					window.location.reload(true);
				}
			}
		}
	);
   });
</script> 
<script type="text/javascript" src="admin_files/js/pagination.js"></script>
		<div style="width:690px;clear:both;padding: 20px 10px 20px 10px;">
			<button class="tiny main n_button" type="submit"  onclick="location.href='change_config.php'"><span></span><em style="min-width:150px"><img src="http://flexpaper.devaldi.com/static/icon16_configuration.gif" style="padding-top:2px;">&nbsp;Configuration</em></button>&nbsp;
		</div>
		
		<div style="clear:both;background-color:#fff;padding: 20px 10px 20px 30px;border:0px;-webkit-box-shadow: rgba(0, 0, 0, 0.246094) 0px 4px 8px 0px;min-width:900px;float:left;width:900px;margin-left:10px;margin-bottom:50px;">
			<h3>Available Documents</h3>
			<form action="index.php" method="post" enctype="multipart/form-data">
			<div style="float:left;position:absolute;">
			    <div style="position:absolute;left:0px;top:0px;">
                    <input class="file-upload" type="file" name="Filedata" id="Filedata" style="width:115px;font-size: 250px;opacity:0;cursor: pointer;position:absolute;left:0;top:0;" />
                    <button class="tiny main n_button" type="submit" onclick="return false;" style="pointer-events:none;"><span></span><em style="min-width:100px"><input type="hidden" name="Filename" id="Filename" value="" /><img src="admin_files/images/upload.png" style="padding-top:2px;">&nbsp;Upload</em></button>
                    &nbsp;<br/>
                </div><div style="position:absolute;left:0px;top:0px;"><div id="file_upload" type="button"></div></div>
			</div>

			<div style="float:left;padding-left:120px;"><button class="tiny main n_button" onclick="return window.confirm('Are you sure you want to delete these files?');" type="submit"><span></span><em style="min-width:100px"><img src="admin_files/images/delete.png" style="padding-top:2px;">&nbsp;Delete</em></button>&nbsp;</div>
			<div style="clear:both"><br/></div>
			<!-- <div style="float:left;"><button class="tiny main n_button disabled" id="bttn_view" onclick="window.location.href='simple_document.php';return false; " type="submit"><span></span><em style="min-width:100px">view</em></button>&nbsp;</div><br/>   -->
				<table width="100%" style="width:880px" cellspacing="0" cellpadding="0" class="selectable_sortable">
				<?php 
				if ($handle = opendir($configManager->getConfig('path.pdf') . $subFolder)) { 
					$blacklist = array('.', '..');					
					
					while (false !== ($file = readdir($handle))) { 
						if(!in_array($file, $blacklist) && !endsWith($file,'.pdf') && !startsWith($file,'.')) {?>						
						<tr class="unselectedRow folder" onclick="location.href='index.php?subfolder=<?php echo $subFolder . $file . '/' ?>'">
							<th class="title folder" style="width:15px"><img src="admin_files/images/folder.png"/></th>
							<td class="tr folder" style="text-align:left;" colspan="2"><?php echo "$file"; ?></td>
						</tr>
						<?php }
					}
					closedir($handle);
					 
					$handle = opendir($configManager->getConfig('path.pdf') . $subFolder);
					while (false !== ($file = readdir($handle))) { 
						if(!in_array($file, $blacklist) && endsWith($file,'.pdf') && $file != "Sample.pdf") {?>
						<tr class="unselectedRow">
							<th class="title" style="width:15px"><input type="checkbox" id="pdfFile" name="pdfFile[]" value="<?php echo "$file"; ?>" class="fileCheckBox"></th>
							<td class="tr" style="text-align:left;"><?php echo "$file"; ?></td>
							<td class="tr" style="text-align:left;"><?php echo filesize($configManager->getConfig('path.pdf') . $subFolder . $file)?>&nbsp;bytes</td>
						</tr>
						<?php } ?>
					<?php } ?>
				<?php closedir($handle); ?>
				<?php }else{ ?>
                <div style="padding-top:100px">Could not open directory listing. Make sure the web user has read and write permission to the PDF directory.
                <?php } ?> 
				</table>
			</form>
			<div id="upload-queue" style="width:300px;height:50px;"></div>
			<link href="admin_files/css/prettify.css" type="text/css" rel="stylesheet" />
			<script src="admin_files/js/prettify.js"></script> 
			<script type="text/javascript"> 
			prettyPrint();
			</script>

			<?php if(isset($_GET['msg'])){ ?>
				<div id="messagebox" style="width:300px;height:50px;">
				<img src="admin_files/images/info_icon.png" />&nbsp;
				<?php echo $_GET['msg'];?>
				</div>
			<?php } ?>
		</div>
<?php } ?>		
<?php require_once("admin_files/footer.php"); ?>	
