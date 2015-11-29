<?php
/* This section can be removed if you would like to reuse the PHP example outside of this PHP sample application */
require_once("lib/config.php"); 
require_once("lib/common.php");

$configManager = new Config();
if($configManager->getConfig('admin.password')==null){
	$url = 'setup.php';
	header("Location: $url");
	exit;
}
?>
<!doctype html>
    <head> 
        <title>FlexPaper AdaptiveUI PHP Example</title>                
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width" />
        <style type="text/css" media="screen"> 
			html, body	{ height:100%; }
			body { margin:0; padding:0; overflow:auto; }   
			#flashContent { display:none; }
        </style> 
		
		<link rel="stylesheet" type="text/css" href="css/flexpaper_flat.css" />
		<script type="text/javascript" src="js/jquery.min.js"></script>
		<script type="text/javascript" src="js/jquery.extensions.min.js"></script>
		<script type="text/javascript" src="js/flexpaper.js"></script>
		<script type="text/javascript" src="js/flexpaper_handlers.js"></script>
    </head> 
    <body>  
		<div id="documentViewer" class="flexpaper_viewer" style="position:absolute;left:10px;top:10px;width:800px;height:500px"></div>
	        
	        <script type="text/javascript">   
		        function getDocumentUrl(document){
					return "services/view.php?doc={doc}&format={format}&page={page}&subfolder=<?php echo $_GET["subfolder"] ?>".replace("{doc}",document);
		        }
		        
		        function getDocQueryServiceUrl(document){
		        	return "services/swfsize.php?doc={doc}&page={page}".replace("{doc}",document);
		        }

		        function append_log(msg){
                                    $('#txt_eventlog').val(msg+'\n'+$('#txt_eventlog').val());
                }

                String.format = function() {
                    var s = arguments[0];
                    for (var i = 0; i < arguments.length - 1; i++) {
                        var reg = new RegExp("\\{" + i + "\\}", "gm");
                        s = s.replace(reg, arguments[i + 1]);
                    }

                    return s;
                }
		        
		        var startDocument = "<?php if(isset($_GET["doc"])){echo $_GET["doc"];}else{?>Paper.pdf<?php } ?>";

		        <?php if($configManager->getConfig('sql.verified')=='true') { ?>
                    <?php include 'annotations_handlers.php'; ?>
                <?php } ?>

				jQuery.get((!window.isTouchScreen)?'UI_flexpaper_desktop_flat.html':'UI_flexpaper_mobile.html',
                function(toolbarData) {

                    $('#documentViewer').FlexPaperViewer(
                     { config : {

                             DOC : escape(getDocumentUrl(startDocument)),
                             Scale : 0.6,
                             ZoomTransition : 'easeOut',
                             ZoomTime : 0.5,
                             ZoomInterval : 0.2,
                             FitPageOnLoad : true,
                             FitWidthOnLoad : false,
                             FullScreenAsMaxWindow : false,
                             ProgressiveLoading : false,
                             MinZoomSize : 0.2,
                             MaxZoomSize : 5,
                             SearchMatchAll : false,
                             InitViewMode : 'Portrait',
                             RenderingOrder : '<?php echo ($configManager->getConfig('renderingorder.primary') . ',' . $configManager->getConfig('renderingorder.secondary')) ?>',

                             ViewModeToolsVisible : true,
                             ZoomToolsVisible : true,
                             NavToolsVisible : true,
                             CursorToolsVisible : true,
                             SearchToolsVisible : true,
                             Toolbar         : toolbarData,
                             BottomToolbar           : 'UI_flexpaper_annotations.html',
                             DocSizeQueryService : 'services/swfsize.php?doc=' + startDocument,

                             JSONDataType : 'jsonp',
                             key : '<?php echo $configManager->getConfig('licensekey') ?>',

                             localeChain: 'en_US'

                             }}
                    );
                });
	        </script>

            <?php if($configManager->getConfig('sql.verified')=='true') { ?>
	            <div style="position:absolute;left:830px;top:10px;font-family:Arial;font-size:12px"><b>Database Event Log</b><br/><textarea rows=6 cols=28 id="txt_eventlog" style="width:370px;font-size:9px;" wrap="off"></textarea></div>
	        <?php } ?>
   </body> 
</html> 