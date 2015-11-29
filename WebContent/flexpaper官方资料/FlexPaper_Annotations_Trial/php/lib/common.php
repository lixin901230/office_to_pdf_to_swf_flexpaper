<?php
/**
* █▒▓▒░ The FlexPaper Project 
* 
* Copyright (c) 2009 - 2011 Devaldi Ltd
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
	date_default_timezone_set('UTC');
	function arrayToString($result_array) {
		reset($result_array);
		$s="";
		$itemNo=0;
		$total=count($result_array);
		while ($array_cell=each($result_array)) {
			$itemNo++;
			if ($itemNo<30) {
				$s .= $array_cell['value'] . chr(10) ;
			} else if ($itemNo>$total-30) {
				$s .= $array_cell['value'] . chr(10) ;
			} else if ($itemNo==30) {
				$s .= chr(10) . "... ... ... ... ... ... ... ... ... ..." . chr(10) . chr(10);
			}
		}
		return $s;
	}
	
	function getLastWord($myStr) {
		$compare=1;
		$i=0;
		while(($compare!=0)&&($i+strlen($myStr)>0)) {
			$i--;
			$s1=substr($myStr,$i,1);
			$compare=strcmp($s1,"/");
		}
		return substr($myStr,strlen($myStr)+$i);
	}

	function removeFileName($myStr) {
		$end=getLastWord($myStr);
		$root=substr($myStr,0,strlen($myStr)-strlen($end));
		if ($root{strlen($root)-1}!="/") $root=$root . "/";
		return $root;
	}
	
	function validSwfParams($path,$doc,$page){
		return !(	basename(realpath($path)) != $doc  ||
				 	strlen($doc) > 255 ||
				 	strlen($page) > 255 ||
				 	($page !=null && is_numeric($page) == false) ||
				 	strpos($path . $doc . $page, "../") > 0 ||
				 	preg_match("=^[^/?*;:{}\\\\]+[^/?*;:{}\\\\]+$=",$page . $doc)==0
				);	
	}
	
	function validPdfParams($path,$doc,$page){
		return !(	basename(realpath($path)) != $doc ||
				 	strlen($doc) > 255 ||
				 	strlen($page) > 255 ||
				 	($page !=null && is_numeric($page) == false) ||
				 	strpos($path . $doc . $page, "../") > 0 ||
				 	preg_match("=^[^/?*;:{}\\\\]+[^/?*;:{}\\\\]+$=",$page . $doc)==0
				);
	}

	function invalidFilename($fname){
		return preg_match("=^[^/?*;:{}\\\\]+[^/?*;:{}\\\\]+$=",$fname)==0;
	}
	
	function setCacheHeaders(){
		header("Cache-Control: private, max-age=10800, pre-check=10800");
		header("Pragma: private");
		header("Expires: " . date(DATE_RFC822,strtotime(" 2 day")));	
	}
	
	function endOrRespond(){
		if(isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])){
		  header('Last-Modified: '.$_SERVER['HTTP_IF_MODIFIED_SINCE'],true,304);
		  return false;
		}else{
			return true;
		}
	}
	
	function getForkCommandStart(){
		if(	PHP_OS == "WIN32" || PHP_OS == "WINNT"	)
			return "START ";
		else
			return "";
	}
	
	function getForkCommandEnd(){
		if(	PHP_OS == "WIN32" || PHP_OS == "WINNT"	)
			return "";
		else
			return " >/dev/null 2>&1 &";
	}
	
	function getTotalPages($PDFPath) {
		$stream = @fopen($PDFPath, "r");
		$PDFContent = @fread ($stream, filesize($PDFPath));
		if(!$stream || !$PDFContent)
		    return false;
		    
		$firstValue = 0;
		$secondValue = 0;
		if(preg_match("/\/N\s+([0-9]+)/", $PDFContent, $matches)) {
		    $firstValue = $matches[1];
		}
		 
		if(preg_match_all("/\/Count\s+([0-9]+)/s", $PDFContent, $matches))
		{
		    $secondValue = max($matches[1]);
		}
		return (($secondValue != 0) ? $secondValue : max($firstValue, $secondValue));
	}
	
	function strip_non_numerics($string) {
		return preg_replace('/\D/', '', $string);
	}
	
	function startsWith($haystack, $needle)
	{
	    $length = strlen($needle);
	    return (substr($haystack, 0, $length) === $needle);
	}
	
	function endsWith($haystack, $needle)
	{
	    $length = strlen($needle);
	    $start  = $length * -1; //negative
	    return (substr($haystack, $start) === $needle);
	}

	function getStringHashCode($string){
      $hash = 0;
      $stringLength = strlen($string);
      for($i = 0; $i < $stringLength; $i++){
        $hash = 31 * $hash + $string[$i];
      }
      return $hash;
    }

    // generates a smaller image from the larger resolution image. Based on the work from adaptive-images.com
	function generateImage($source_file, $cache_file, $resolution, $inputformat, $outformat) {
	  global $sharpen;

	  $jpg_quality = 75;
	  $extension = $inputformat;
	
	  // Check the image dimensions
	  $dimensions   = GetImageSize($source_file);
	  $width        = $dimensions[0];
	  $height       = $dimensions[1];
		
	  // We need to resize the source image to the width of the resolution breakpoint we're working with
	  $ratio      = $height/$width;
	  $new_width  = $resolution;
	  $new_height = ceil($new_width * $ratio);
	  $dst        = ImageCreateTrueColor($new_width, $new_height); // re-sized image
	
	  switch ($extension) {
	    case 'png':
	      $src = @ImageCreateFromPng($source_file); // original image
	    break;
	    case 'gif':
	      $src = @ImageCreateFromGif($source_file); // original image
	    break;
	    default:
	      $src = @ImageCreateFromJpeg($source_file); // original image
	      ImageInterlace($dst, true); // Enable interlancing (progressive JPG, smaller size file)
	    break;
	  }
	
	  if($extension=='png'){
	    imagealphablending($dst, false);
	    imagesavealpha($dst,true);
	    $transparent = imagecolorallocatealpha($dst, 255, 255, 255, 127);
	    imagefilledrectangle($dst, 0, 0, $new_width, $new_height, $transparent);
	  }

	  ImageCopyResampled($dst, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height); // do the resize in memory
	  ImageDestroy($src);
	
	  // sharpen the image?
	  // NOTE: requires PHP compiled with the bundled version of GD (see http://php.net/manual/en/function.imageconvolution.php)
	  if($sharpen == TRUE && function_exists('imageconvolution')) {
	    $intSharpness = findSharp($width, $new_width);
	    $arrMatrix = array(
	      array(-1, -2, -1),
	      array(-2, $intSharpness + 12, -2),
	      array(-1, -2, -1)
	    );
	    imageconvolution($dst, $arrMatrix, $intSharpness, 0);
	  }
	
	  $cache_dir = dirname($cache_file);
	
	  // does the directory exist already?
	  if (!is_dir($cache_dir)) { 
	    if (!mkdir($cache_dir, 0755, true)) {
	      // check again if it really doesn't exist to protect against race conditions
	      if (!is_dir($cache_dir)) {
	        // uh-oh, failed to make that directory
	        ImageDestroy($dst);
	        sendErrorImage("Failed to create cache directory: $cache_dir");
	      }
	    }
	  }
	
	  if (!is_writable($cache_dir)) {
	    sendErrorImage("The cache directory is not writable: $cache_dir");
	  }
	
	  // save the new file in the appropriate path, and send a version to the browser
	  switch ($outformat) {
	    case 'png':
	      $gotSaved = ImagePng($dst, $cache_file);
	    break;
	    case 'gif':
	      $gotSaved = ImageGif($dst, $cache_file);
	    break;
	    default:
	      $gotSaved = ImageJpeg($dst, $cache_file, $jpg_quality);
	    break;
	  }
	  ImageDestroy($dst);
	
	  if (!$gotSaved && !file_exists($cache_file)) {
	    sendErrorImage("Failed to create image: $cache_file");
	  }
	
	  return $cache_file;
	}
?>