<?php date_default_timezone_set('America/New_York'); ?>
<?php
class Config {
	protected $config;
	protected $configFileName;

	public function __construct() {
		if (!defined('ROOT')) {
			define('ROOT', dirname(dirname(dirname(__FILE__))));
		}

		if (!defined('APP_DIR')) {
			define('APP_DIR', basename(dirname(dirname(__FILE__))));
		}

		$this->configFileName = $this->getConfigFilename();
		$this->config = $this->read_php_ini($this->configFileName);
    }

	public function getConfig($key = null) {
		if($key !== null) {
			if(isset($this->config[$key])) {
			  return $this->config[$key];
			}
			else {
			  return null;
			}
		}
		return $this->config;
	}

	public function getDocUrl() {
		return "<br/><br/>Click <a href='http://flexpaper.devaldi.com/docs_php.jsp'>here</a> for more information on configuring FlexPaper with PHP";
	}

	public function getConfigFilename() {
		if(strstr(PHP_OS, "WIN"))
			return ROOT . '\\' . APP_DIR . '\\config\\config.ini.win.php';
		return ROOT . '/' . APP_DIR . '/config/config.ini.nix.php';
	}

	public function saveConfig($array) {
		$this->write_php_ini($array, $this->configFileName);
	}

	function write_php_ini($array, $file) {
		$res = json_encode($array);
		$this->safefilerewrite($file, $res);
	}

	// read Config file.
	function read_php_ini($file) {
		if(file_exists($file)){
			$rawdata 	= file($file);
			$rawdata[0]	= ( bool )false;
			$contents 	= implode('',$rawdata);
			$ret = json_decode($contents, true);
			if($ret != null)
				return $ret;
			else{ // try to replace \/ with / and decode again
                $contents = str_replace("\/", "/",$contents);
                $ret = json_decode($contents, true);
            }
		}
		$ret = $this->newConfig();
		$this->saveConfig($ret);
		return $ret;
	}

	// if there is no config file return sample config
	function newConfig(){
		$exe = strstr(PHP_OS, "WIN") ? ".exe" : "";
		$config["allowcache"]						=	true;
		$config["highrescache"]						=	true;
		$config["splitmode"]						=	true;
		$config["path.pdf"]							=	ROOT . '\\' . APP_DIR . "\\pdf\\";
		$config["path.swf"]							=	ROOT . '\\' . APP_DIR . "\\doc\\";
		$config["renderingorder.primary"]			=	"flash";
		$config["renderingorder.secondary"]			=	"html";
		$config["cmd.conversion.singledoc"]			=	"pdf2swf$exe \"{path.pdf}{pdffile}\" -o \"{path.swf}{pdffile}.swf\" -f -T 9 -t -s storeallcharacters -s linknameurl";
		$config["cmd.conversion.splitpages"]		=	"pdf2swf$exe \"{path.pdf}{pdffile}\" -o \"{path.swf}{pdffile}_%.swf\" -f -T 9 -t -s storeallcharacters -s linknameurl";
		$config["cmd.conversion.renderpage"]		=	"swfrender$exe \"{path.swf}{swffile}\" -p {page} -o \"{path.swf}{pdffile}_{page}.png\" -X 1024 -s keepaspectratio";
		$config["cmd.conversion.rendersplitpage"]	=	"swfrender$exe \"{path.swf}{swffile}\" -o \"{path.swf}{pdffile}_{page}.png\" -X 1024 -s keepaspectratio";
		$config["cmd.conversion.jsonfile"]			=	"pdf2json$exe \"{path.pdf}{pdffile}\" -enc UTF-8 -compress \"{path.swf}{pdffile}.js\"";
		$config["cmd.conversion.splitjsonfile"]		=	"pdf2json$exe \"{path.pdf}{pdffile}\" -enc UTF-8 -compress -split 10 \"{path.swf}{pdffile}_%.js\"";
		$config["cmd.conversion.splitpdffile"]		=	"pdftk$exe \"{path.pdf}{pdffile}\" burst output \"{path.swf}{pdffile}_%1d.pdf\" compress";
		$config["cmd.searching.extracttext"]		=	"swfstrings$exe \"{swffile}\"";
		$config["cmd.query.swfwidth"]				=	"swfdump$exe \"{swffile}\" -X";
		$config["cmd.query.swfheight"]				=	"swfdump$exe \"{swffile}\" -Y";
		return $config;
	}

	function trace($data) {
		$this->safefilerewrite(ROOT . '\\' . APP_DIR . "\\config\\log.txt", date("Y/m/d g:i a :: ") . $data . "\r\n", "a+");
	}

	function safefilerewrite($fileName, $dataToSave, $log = "w") {
		$dataToSave = "; <?php exit; ?> DO NOT REMOVE THIS LINE\n" . $dataToSave;

		if ($fp = fopen($fileName, $log)) {
			$startTime = microtime();
			do {
				$canWrite = flock($fp, LOCK_EX);
				// If lock not obtained sleep for 0 - 100 milliseconds, to avoid collision and CPU load
				if(!$canWrite) usleep(round(rand(0, 100)*1000));
			} while ((!$canWrite)and((microtime()-$startTime) < 1000));

			//file was locked so now we can store information
			if ($canWrite) {
				fwrite($fp, $dataToSave);
				flock($fp, LOCK_UN);
			}
			fclose($fp);
		}else{
			die("<b>Can't write to config $fileName </b>");
		}
	}
}
