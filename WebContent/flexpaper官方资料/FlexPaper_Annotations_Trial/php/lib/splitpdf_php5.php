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

class splitpdf
{
	private $configManager = null;

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

    }

	/**
	* Method:splitPDF
	*/
	public function splitPDF($pdfdoc,$subfolder)
	{
		$output=array();
        $command = $this->configManager->getConfig('cmd.conversion.splitpdffile');
        $command = str_replace("{path.pdf}",$this->configManager->getConfig('path.pdf') . $subfolder,$command);
        $command = str_replace("{path.swf}",$this->configManager->getConfig('path.swf') . $subfolder,$command);
        $command = str_replace("{pdffile}",$pdfdoc,$command);

		try {
    		$return_var=0;
            exec($command,$output,$return_var);
            if($return_var==1 || $return_var==0 || (strstr(PHP_OS, "WIN") && $return_var==1)){
                return "[OK]";
            }else{
                return "[Error converting splitting PDF, please check your configuration]";
            }
		} catch (Exception $ex) {
			return $ex;
		}
	}
}
?>