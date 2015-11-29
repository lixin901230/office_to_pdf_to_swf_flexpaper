				<?php require_once("lib/config.php"); 
				require_once("lib/common.php");
				
				$configManager = new Config();
				if(isset($_GET["subfolder"])){$subfolder=$_GET["subfolder"];}else{$subfolder="";}					
				?>
				// displaying previously stored annotations when document has loaded
				<?php 
				if($configManager->getConfig('sql.verified')=='true'){
					$con = mysql_connect($configManager->getConfig('sql.host'), $configManager->getConfig('sql.username'), $configManager->getConfig('sql.password'));
					if($con){
						$database = mysql_select_db($configManager->getConfig('sql.database'), $con);
					}
				}	
				?>

				jQuery('#documentViewer').bind('onDocumentLoaded',function(e,totalPages){
					<?php
						if($database){
						    $doc = "Paper.pdf";
						    if($_GET["doc"]!=null){$doc = $_GET["doc"];}

							$select = mysql_query("SELECT * FROM mark WHERE document_filename = '" . mysql_real_escape_string($_GET["doc"]) . "' AND document_relative_path = '" . $subfolder ."'");
							for ($a=0; $a<mysql_num_rows($select); $a++) {
								$row=mysql_fetch_array($select);
								if($row["type"] == "note"){
									$addMark = 	"\$FlexPaper('documentViewer').addMark(" . 
												"{" .
												"id : '" . $row["id"] . "'," .
												"type : 'note'," .
												"note : '" . mysql_real_escape_string(str_replace("'","\'", $row["note"])) ."'," .
												"positionX : " . $row["positionX"] . "," .
												"positionY : " . $row["positionY"] . "," .
												"width : " . $row["width"] . "," .
												"height : " . $row["height"] . "," .
												"pageIndex : " . $row["pageIndex"] . " ," .
												"collapsed : " . (($row["collapsed"]==1)?"true":"false") . "," .
												"readonly : " . (($row["readonly"]==1)?"true":"false") . "," .
												"color : '" . $row["color"] . "'," .
												"points : '" . $row["points"] . "'," .
												"displayFormat : '" . $row["displayFormat"] . "'" .
												"});";
									echo $addMark;
								}

								if($row["type"] == "highlight" || $row["type"] == "strikeout"){
									$addMark = 	"\$FlexPaper('documentViewer').addMark(" . 
												"{" .
												"id : '" . $row["id"] . "'," .
												"type : '" . $row["type"] ."'," .
												"width : " . $row["width"] . "," .
												"height : " . $row["height"] . "," .
												"has_selection : false," .
												"color : '" . $row["color"] . "'," .
												"note : '" . mysql_real_escape_string(str_replace("'","\'", $row["note"])) ."'," .
                                                "positionX : " . $row["positionX"] . "," .
                                                "positionY : " . $row["positionY"] . "," .
												"selection_info : '" . $row["selection_info"] . "'," .		
												"selection_text : '" . $row["selection_text"] . "'," .		
												"pageIndex : " . $row["pageIndex"] . " ," .
												"readonly : " . (($row["readonly"]==1)?"true":"false") . "," .
												"displayFormat : '" . $row["displayFormat"] . "'" .
												"});";
									echo $addMark;
								}

								if($row["type"] == "drawing"){
									$addMark = 	"\$FlexPaper('documentViewer').addMark(" . 
												"{" .
												"id : '" . $row["id"] . "'," .
												"type : '" . $row["type"] ."'," .
												"color : '" . $row["color"] . "'," .		
												"points : '" . $row["points"] . "'," .
                                                "note : '" . mysql_real_escape_string(str_replace("'","\'", $row["note"])) ."'," .
                                                "width : " . $row["width"] . "," .
												"height : " . $row["height"] . "," .
												"positionX : " . $row["positionX"] . "," .
												"positionY : " . $row["positionY"] . "," .
												"pageIndex : " . $row["pageIndex"] . " ," .
												"readonly : " . (($row["readonly"]==1)?"true":"false") . "," .
												"displayFormat : '" . $row["displayFormat"] . "'" .
												"});";
									echo $addMark;
								}

							}

							if(mysql_num_rows($select)>0){
								echo "append_log('Loaded " . mysql_num_rows($select) . " mark(s) from the database');";
							}else{
								echo "append_log('No existing marks found in the database for this document');";
							}
						}
					?>
				});

				jQuery('#documentViewer').bind('onMarkCreated',function(e,mark){
					$.ajax({
						  url: "services/annotations/create_mark.php",
						  data : {
							'DOCUMENT_FILENAME' : startDocument,
							'DOCUMENT_PATH' : '<?php echo $subfolder ?>',
						  	'MARK' : JSON.stringify(mark, null, 2)
						  },
						  context: document.body,
						  type: 'POST',
						  success: function(data){
							if(data=="1"){ // mark created
								append_log(String.format('New mark saved in database (id:{0})',mark.id));
							}
							if(data=="0"){ // failed creating mark
								append_log('Failed saving new mark to database');
							}
						  }
					});
				});

				jQuery('#documentViewer').bind('onMarkDeleted',function(e,mark){
					$.ajax({
						  url: "services/annotations/delete_mark.php",
						  data : {
							'DOCUMENT_FILENAME' : startDocument,
							'DOCUMENT_PATH' : '<?php echo $subfolder ?>',							
						  	'MARK' : JSON.stringify(mark, null, 2)
						  },
						  context: document.body,
						  type: 'POST',
						  success: function(data){
							if(data=="1"){ // mark created
								append_log(String.format("deleted mark from database (id:{0})",mark.id));
							}
							if(data=="0"){ // failed creating mark
								append_log(String.format("failed deleting mark from database (id:{0})",mark.id));
							}
						  }
					});
				});

				jQuery('#documentViewer').bind('onMarkChanged',function(e,mark){
				    if(mark.note && !(typeof mark.note == "string")){
                        mark.note = '<notes>'+mark.note.find("note").parent().html()+'</notes>';
                    }

					$.ajax({
						  url: "services/annotations/change_mark.php",
						  data : {
							'DOCUMENT_FILENAME' : startDocument,
							'DOCUMENT_PATH' : '<?php echo $subfolder ?>',							
						  	'MARK' : JSON.stringify(mark, null, 2)
						  },
						  context: document.body,
						  type: 'POST',
						  success: function(data){
							if(data=="1"){ // mark created
								append_log(String.format('Mark updated in database (id:{0})',mark.id));
							}
							if(data=="0"){ // failed creating mark
								append_log('Failed updating mark in database');
							}
						  }
					});
				});