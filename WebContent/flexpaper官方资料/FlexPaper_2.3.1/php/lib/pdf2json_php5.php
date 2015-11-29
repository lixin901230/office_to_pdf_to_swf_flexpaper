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

require_once("config.php");
require_once("common.php");

class pdf2json
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
	* Method:render page as image
	*/
	public function convert($pdfdoc,$jsondoc,$page,$subfolder)
	{
		$output=array();
	
		try {
		    if($this->configManager->getConfig('splitmode')=='true'){
			    $command = $this->configManager->getConfig('cmd.conversion.splitjsonfile');
			}else{
			    $command = $this->configManager->getConfig('cmd.conversion.jsonfile');
			}

			$command = str_replace("{path.pdf}",$this->configManager->getConfig('path.pdf') . $subfolder,$command);
			$command = str_replace("{path.swf}",$this->configManager->getConfig('path.swf') . $subfolder,$command);
			$command = str_replace("{pdffile}",$pdfdoc,$command);
			$command = str_replace("{jsonfile}",$jsondoc,$command);
			
			$return_var=0;

			exec($command,$output,$return_var);

			if($return_var==0){
				return "[OK]";
			}else{
				return "[Error converting PDF to JSON, please check your directory permissions and configuration]";
			}
		} catch (Exception $ex) {
			return "[" . $ex . "]";
		}
	}
}
?>