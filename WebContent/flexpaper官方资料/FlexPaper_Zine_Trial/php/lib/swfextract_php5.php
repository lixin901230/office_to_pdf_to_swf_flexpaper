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

require_once("config.php");
require_once("common.php");
require_once("pdf2swf_php5.php");

class swfextract
{
	private $configManager = null;
	private $pdftoolsPath;

	/**
	* Constructor
	*/
	function __construct()
	{
		$this->configManager = new Config();
	}

	/**
	* Destructor
	*/
	function __destruct() {
        //echo "swfextract destructed\n";
    }

	/**
	* Method:extractText
	*/
	public function findText($doc,$page,$searchterm,$numPages = -1)
	{
		$output=array();
		if(strlen($searchterm)==0){return "[{\"page\":-1, \"position\":-1}]";}
		
		try {
			$swf_file = $this->configManager->getConfig('path.swf') . $doc . "_" . $page . ".swf";
            if(! file_exists($swf_file)){
                return "[{\"page\":-1, \"position\":-1}]";
            }

			// check for directory traversal & access to non pdf files and absurdely long params
			$pdfFilePath = $this->configManager->getConfig('path.pdf') . $doc;
			if($numPages == -1){
				$pagecount = count(glob($this->configManager->getConfig('path.swf') . $doc . "*"));
			}else{
				$pagecount = $numPages;
			}

			if(	!validPdfParams($pdfFilePath,$doc,$page))
				return;

			$command = $this->configManager->getConfig('cmd.searching.extracttext');
			$command = str_replace("{swffile}", $this->configManager->getConfig('path.swf') . $doc . "_"  . $page. ".swf",$command);
			$return_var=0;

			exec($command,$output,$return_var);

            $pos = strpos(strtolower(arrayToString($output)),strtolower($searchterm));
            if($return_var==0 && $pos > 0){
                return "[{\"page\":" . $page .", \"position\":" . $pos . "}]";
            }else{
                if($page<$pagecount){
                    $page++;
                    return $this->findText($doc,$page,$searchterm,$pagecount);
                }else{
                    return "[{\"page\":-1, \"position\":-1}]";
                }
            }
		} catch (Exception $ex) {
			return $ex;
		}
	}
}
?>