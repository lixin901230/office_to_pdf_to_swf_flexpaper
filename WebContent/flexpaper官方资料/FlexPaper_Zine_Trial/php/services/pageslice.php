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
require_once("../lib/config.php");

$configManager 	= new Config();	
$file_path = $configManager->getConfig('path.swf') . $_GET["path"];

//checking if paramateres and file exists
if(isset($_GET["path"]) && $_GET["path"] != "" && file_exists($file_path))
{
    $path = $file_path;

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
		$margin_x = $src_x - floor($src_x);
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
?>