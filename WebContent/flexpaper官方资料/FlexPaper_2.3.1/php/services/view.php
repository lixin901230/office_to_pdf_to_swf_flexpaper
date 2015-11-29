<?php
/**
* █▒▓▒░ The FlexPaper Project
*
* Copyright (c) 2009 - 2011 Devaldi Ltd
*
* When purchasing a commercial license, its terms substitute this license.
* Please see http://flexpaper.devaldi.com/ for further details.
*
*/

require_once("../lib/common.php");
require_once("../lib/pdf2swf_php5.php");
require_once("../lib/swfrender_php5.php");
require_once("../lib/pdf2json_php5.php");
require_once("../lib/splitpdf_php5.php");

	$doc 		= $_GET["doc"];
	$configManager 	= new Config();
	$callback	= "";

	if(!endsWith($doc,'.pdf')){$pdfdoc 	= $doc . ".pdf";}else{$pdfdoc 	= $doc;}
	if(isset($_GET["page"])){$page = $_GET["page"];}else{$page = "";} if($page=="[*,0]"){$page=null;}
	if(isset($_GET["format"])){$format=$_GET["format"];}else{$format="swf";}
	if($configManager->getConfig('splitmode')=='true'){$swfdoc 	= $pdfdoc . "_" . $page . ".swf";}else{$swfdoc 	= $pdfdoc . ".swf";}
	if(isset($_GET["callback"])){$callback = $_GET["callback"];}else{$callback = "";}
    if($configManager->getConfig('splitmode')=='true'){$jsondoc = $pdfdoc . "_" . $page . ".js";}else{$jsondoc = $pdfdoc . ".js";}
	if(isset($_GET["resolution"])){$resolution=$_GET["resolution"];}else{$resolution=null;}
	if(isset($_GET["subfolder"])){$subfolder=$_GET["subfolder"];}else{$subfolder="";}

	$pngdoc 		= $pdfdoc . "_" . $page . ".png";
	$jpgcachedoc 	= $pdfdoc . "_" . $page . "_res_" . $resolution . ".jpg";

	$messages 		= "";

	$swfFilePath 	= $configManager->getConfig('path.swf') . $subfolder . $swfdoc;
	$pdfFilePath 	= $configManager->getConfig('path.pdf') . $subfolder . $pdfdoc;
	$pdfSplitPath	= $configManager->getConfig('path.swf') . $subfolder . $pdfdoc . "_" . $page . ".pdf";
	$pngFilePath 	= $configManager->getConfig('path.swf') . $subfolder . $pngdoc;
	$jpgCachePath 	= $configManager->getConfig('path.swf') . $subfolder . $jpgcachedoc;
	$jsonFilePath 	= $configManager->getConfig('path.swf') . $subfolder . $jsondoc;
	$validatedConfig = true;

	session_start();

	if(!is_dir($configManager->getConfig('path.swf'))){
		Echo "Error:Cannot find SWF output directory, please check your configuration file";
		$validatedConfig = false;
	}

	if(!is_dir($configManager->getConfig('path.pdf'))){
		echo "Error:Cannot find PDF output directory, please check your configuration file";
		$validatedConfig = false;
	}

	if(!$validatedConfig){
		echo "Error:Cannot read directories set up in configuration file, please check your configuration.";
	}else if(	!validPdfParams($pdfFilePath,$pdfdoc,$page) /*|| !validSwfParams($swfFilePath,$swfdoc,$page) */){
		echo "Error:Incorrect file specified, please check your path";
	}else{
		if($format == "swf" || $format == "png" || $format == "pdf" || $format == "jpg" || $format == "jpgpageslice"){

			// check if output folder exists (subfolder)
			if(!file_exists($configManager->getConfig('path.swf') . $subfolder)){
				mkdir($configManager->getConfig('path.swf') . $subfolder);
			}

			// converting pdf files to swf format
			if(!file_exists($swfFilePath)){
				$pdfconv=new pdf2swf();
				$messages=$pdfconv->convert($pdfdoc,$page,$subfolder);
			}

			// rendering swf files to png images
			if($format == "png"){
				if(validSwfParams($swfFilePath,$swfdoc,$page)){
					if(!file_exists($pngFilePath)){
						$pngconv=new swfrender();
						$pngconv->renderPage($pdfdoc,$swfdoc,$page);
					}

					if($configManager->getConfig('allowcache')){
						setCacheHeaders();
					}

					if(!$configManager->getConfig('allowcache') || ($configManager->getConfig('allowcache') && endOrRespond())){
						
						if($resolution!=null){
							header('Content-Type: image/jpeg');
							echo readfile(generateImage($pngFilePath,$jpgCachePath,$resolution,'png','jpg'));
						}else{
							header('Content-Type: image/png');
							echo readfile($pngFilePath);
						}
					}
				}else{
					if(strlen($messages)==0 || $messages == "[OK]")
						$messages = "[Incorrect file specified, please check your path]";
				}
			}

			if($format == "jpg"){
				if(validSwfParams($swfFilePath,$swfdoc,$page)){
					if(!file_exists($pngFilePath)){
						$pngconv=new swfrender();
						$pngconv->renderPage($pdfdoc,$swfdoc,$page,$subfolder);
					}
					
					if($configManager->getConfig('allowcache')){
						setCacheHeaders();
					}

					if(!$configManager->getConfig('allowcache') || ($configManager->getConfig('allowcache') && endOrRespond())){
						header('Content-Type: image/jpeg');

                        if(file_exists($jpgCachePath)) {
                                echo readfile($jpgCachePath);
                        }else{
                            if($resolution==null){
                                echo readfile(generateImage($pngFilePath,$jpgCachePath,1200,'png','jpg'));
                            }else{
                                echo readfile(generateImage($pngFilePath,$jpgCachePath,$resolution,'png','jpg'));
                            }
						}
					}
				}else{
					if(strlen($messages)==0 || $messages == "[OK]")
						$messages = "[Incorrect file specified, please check your path]";					
				}				
			}
			
			if($format == "jpgpageslice"){
				$path = $pngFilePath;

			    //getting extension type (jpg, png, etc)
			    $type = explode(".", $path);
			    $ext = strtolower($type[sizeof($type)-1]);
			    $ext = (!in_array($ext, array("jpeg","png","gif"))) ? "jpeg" : $ext;

			    if(isset($_GET["preserveext"]))
					$preserveext = $_GET["preserveext"];
				else
					$preserveext = false;
				
				// get the sector in question
				$sector = $_GET["sector"];
				$highrescache = true;
				if(!$configManager->getConfig('highrescache')){
					$highrescache = false;	
				}else{
					$highrescache = true;
				}
			
				// set the cache if needed
				$cachedir = $configManager->getConfig('path.swf');
				$image_filename = basename($path);
				$cachefilename = $cachedir . substr($image_filename,0,strripos($image_filename,".")) . "_" . $sector . ".jpeg";
			
				if(!file_exists($cachefilename) || !$highrescache){
				    //get image size
				    $size = getimagesize($path);
				    $width = $size[0];
				    $height = $size[1];
				
				    //get source image
				    $func = "imagecreatefrom".$ext;
				    $source = $func($path);
				
				    //setting default values
				    $new_width = $width * .25;
				    $new_height = $height * .25;
				    $k_w = 1;
				    $k_h = 1;
				    $src_x =0;
				    $src_y =0;
					$margin_x =0;
					$margin_y =0;
					
					switch($sector){
						// top 50%, left 50%
						case "l1t1":
							$src_x = 0;
							$src_y = 0;
						break;	
						case "l2t1":
							$src_x = $width * .25;
							$src_y = 0;		
						break;
						case "l1t2":
							$src_x = 0;
							$src_y = $height * .25;				
						break;
						case "l2t2":
							$src_x = $width * .25;
							$src_y = $height * .25;
						break;
						
						// top 50%, right 50%
						case "r1t1":
							$src_x = $width * .5;
							$src_y = 0;		
						break;
						case "r2t1":
							$src_x = $width * .75;
							$src_y = 0;				
						break;
						case "r1t2":
							$src_x = $width * .5;
							$src_y = $height * .25;
						break;
						case "r2t2":
							$src_x = $width * .75;
							$src_y = $height * .25;		
						break;
						
						//bottom 50%, left 50%
						case "l1b1":
							$src_x = 0;
							$src_y = $height * .5;
						break;
						case "l2b1":
							$src_x = $width * .25;
							$src_y = $height * .5;
						break;
						case "l1b2":
							$src_x = 0;
							$src_y = $height * .75;
						break;
						case "l2b2":
							$src_x = $width * .25;
							$src_y = $height * .75;
						break;
						
						// bottom 50%, right 50%
						case "r1b1":
							$src_x = $width * .5;
							$src_y = $height * .5;
						break;
						case "r2b1":
							$src_x = $width * .75;
							$src_y = $height * .5;				
						break;
						case "r1b2":
							$src_x = $width * .5;
							$src_y = $height * .75;
						break;
						case "r2b2":
							$src_x = $width * .75;
							$src_y = $height * .75;		
						break;
					}
				
					// adjusting for rounding
					$margin_x = $src_x - floor($src_x)+1;
					$margin_y = $src_y - floor($src_y);
				
				    $output = imagecreatetruecolor( $new_width, $new_height	);
				
				    //to preserve PNG transparency
				    if($ext == "png" && $preserveext)
				    {
				        //saving all full alpha channel information
				        imagesavealpha($output, true);
				        //setting completely transparent color
				        $transparent = imagecolorallocatealpha($output, 0, 0, 0, 127);
				        //filling created image with transparent color
				        imagefill($output, 0, 0, $transparent);
				    }
				
				    imagecopyresampled( $output, $source,  0, 0, $src_x-(1-$margin_x), $src_y-(1-$margin_y), 
				                        $new_width, $new_height, 
				                        $width * .25+(1-$margin_x)*2, $height * .25+(1-$margin_y)*2);
				    //free resources
				    ImageDestroy($source);
				
				    //output image
				    header('Content-Type: image/'.$ext);
				
					// output the image
					if($preserveext==null){
						if($highrescache){
							imagejpeg($output, $cachefilename);
						}
						
						imagejpeg($output);
					}else{  	
				  		$func = "image".$ext;
						$func($output); 
					}
				
				    //free resources
				    ImageDestroy($output);
				}else{
					header('Content-Type: image/jpeg');
					echo readfile($cachefilename);
				}
				
			}

			// rendering pdf files to the browser
			if($format == "pdf"){
                if($configManager->getConfig('allowcache')){
					setCacheHeaders();
				}

				if($configManager->getConfig('splitmode') == "true" && is_numeric($page)){
					if(!file_exists($pdfSplitPath)){
					$pdfsplit = new splitpdf();
						if($pdfsplit->splitPDF($pdfdoc,$subfolder) == "[OK]"){
							header('Content-type: application/pdf');
							echo readfile($pdfSplitPath);
						}
					}else{
						header('Content-type: application/pdf');
						echo readfile($pdfSplitPath);
					}
				}else{
					header('Content-type: application/pdf');
					echo readfile($pdfFilePath);
				}
			}

			// writing files to output
			if(file_exists($swfFilePath)){
				if($format == "swf"){

					if($configManager->getConfig('allowcache')){
						setCacheHeaders();
					}

					if(!$configManager->getConfig('allowcache') || ($configManager->getConfig('allowcache') && endOrRespond())){
						header('Content-type: application/x-shockwave-flash');
						header('Accept-Ranges: bytes');
						header('Content-Length: ' . filesize($swfFilePath));
						echo readfile($swfFilePath);
					}
				}
			}else{
				if(strlen($messages)==0)
					$messages = "[Cannot find SWF file. Please check your PHP configuration]";
			}
		}

		// for exporting pdf to json format
		if($format == "json" || $format == "jsonp"){
			if(!file_exists($jsonFilePath)){
				$jsonconv = new pdf2json();
				$messages=$jsonconv->convert($pdfdoc,$jsondoc,$page,$subfolder);
			}

			if(file_exists($jsonFilePath)){
				if($configManager->getConfig('allowcache')){
						setCacheHeaders();
				}

				if(!$configManager->getConfig('allowcache') || ($configManager->getConfig('allowcache') && endOrRespond())){
					header('Content-Type: text/javascript');

					if($format == "json"){
						echo file_get_contents($jsonFilePath);
					}

					if($format == "jsonp"){
						echo $callback. '('. file_get_contents($jsonFilePath) . ')';
					}
				}
			}else{
				if(strlen($messages)==0)
					$messages = "[Cannot find JSON file. Please check your PHP configuration]";
			}
		}

		// write any output messages
		if(strlen($messages)>0 && $messages != "[OK]" && $messages != "[Converted]" && $format != "png"){
			echo "Error:" . substr($messages,1,strlen($messages)-2);
		}
	}
?>