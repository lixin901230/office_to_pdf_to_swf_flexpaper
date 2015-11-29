<?php
require_once("config.php");
require_once("common.php");
require_once("pdf2swf_php5.php");

class swfsizequery
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
	* Method:search
	*/
	public function getSize($doc,$page,$mode)
	{
		$output=array();
	
		try {
			if($this->configManager->getConfig('splitmode')=='true'){$swfdoc 	= $doc . "_" . $page . ".swf";}else{$swfdoc 	= $doc . ".swf";}
			$swfFilePath = $this->configManager->getConfig('path.swf') . $swfdoc;
			
			// check for directory traversal & access to non pdf files and absurdely long params
			if(	!validSwfParams($swfFilePath,$swfdoc,$page) )
				return;	

			if($mode=='width'){
				$command = $this->configManager->getConfig('cmd.query.swfwidth');
			}
			
			if($mode=='height'){
				$command = $this->configManager->getConfig('cmd.query.swfheight');			
			}
			
			$command = str_replace("{path.swf}",$this->configManager->getConfig('path.swf'),$command);
			$command = str_replace("{swffile}",$swfFilePath,$command);
			$return_var=0;
			
			exec($command,$output,$return_var);
			if($return_var==0){
				return strip_non_numerics(arrayToString($output));
			}else{
				return "[Error Extracting]";
			}
		} catch (Exception $ex) {
			return $ex;
		}
	}
}
?>