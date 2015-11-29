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
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
    <head>
        <title>FlexPaper AdaptiveUI PHP Example</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css" media="screen">
			html, body	{ height:100%; }
			body { margin:0; padding:0; overflow:auto; }
			#flashContent { display:none; }
        </style>

		<link rel="stylesheet" type="text/css" href="../css/flexpaper.css" />
		<script type="text/javascript" src="../js/jquery.min.js"></script>
		<script type="text/javascript" src="../js/flexpaper.js"></script>
		<script type="text/javascript" src="../js/flexpaper_handlers.js"></script>
    </head>
    <body>
    <div style="position:absolute;left:10px;top:10px;">
			<div id="documentViewer" class="flexpaper_viewer" style="width:770px;height:500px"></div>
	        <?php
	        if(isset($_GET["doc"])){
	            $doc = substr($_GET["doc"],0,strlen($_GET["doc"])-4);
	        }else{
	            $doc = "Report";
	        }

			$pdfFilePath = $configManager->getConfig('path.pdf');
			?>
	        <script type="text/javascript">
		        function getDocumentUrl(document){
		        	var numPages 			= <?php echo getTotalPages($pdfFilePath . $doc . ".pdf") ?>;
					var url = "{services/view.php?doc={doc}&format={format}&page=[*,0],{numPages}}";
						url = url.replace("{doc}",document);
						url = url.replace("{numPages}",numPages);
						return url;
		        }

				var searchServiceUrl	= escape('php/services/containstext.php?doc=<?php echo $doc ?>&page=[page]&searchterm=[searchterm]');
				$('#documentViewer').FlexPaperViewer(
				  { config : {

						 DOC : escape(getDocumentUrl("<?php echo $doc ?>")),
						 Scale : 0.6,
						 ZoomTransition : 'easeOut',
						 ZoomTime : 0.5,
						 ZoomInterval : 0.2,
						 FitPageOnLoad : false,
						 FitWidthOnLoad : true,
						 FullScreenAsMaxWindow : false,
						 ProgressiveLoading : false,
						 MinZoomSize : 0.2,
						 MaxZoomSize : 5,
						 SearchMatchAll : false,
  						 SearchServiceUrl : searchServiceUrl,
						 InitViewMode : 'Portrait',
						 RenderingOrder : '<?php echo ($configManager->getConfig('renderingorder.primary') . ',' . $configManager->getConfig('renderingorder.secondary')) ?>',

						 ViewModeToolsVisible : true,
						 ZoomToolsVisible : true,
						 NavToolsVisible : true,
						 CursorToolsVisible : true,
						 SearchToolsVisible : true,
  						 key : '<?php echo $configManager->getConfig('licensekey') ?>',

  						 DocSizeQueryService : 'services/swfsize.php?doc=<?php echo $doc ?>',
						 jsDirectory : '../js/',
						 localeDirectory : '../locale/',
						 JSONDataType : 'jsonp',

  						 localeChain: 'en_US'
						 }}
				);
	        </script>
        <div style="width:760px;margin-top:10px;padding-left:10px; padding-top:10px; padding-bottom:10px; font-family:Verdana;font-size:10pt;background-color:#EFEFEF; border:1px solid #999;-webkit-box-shadow: rgba(0, 0, 0, 0.246094) 0px 2px 4px 0px;font-family:'District Thin', helvetica, arial;font-weight:lighter;">You are viewing a document in FlexPaper using Adobe Flash. Consider purchasing a commercial license with support for <a href="http://flexpaper.devaldi.com/download.jsp?ref=FlexPaper">Adaptive UI </a> to maximize your browser coverage and reach devices such as the Apple iPad. <br/><br/>With <a href="http://flexpaper.devaldi.com/download.jsp?ref=FlexPaper">AdaptiveUI enabled</a>, the viewer adjust automatically to the visitors capabilities and supports rendering documents as flash, html4 and html5. The viewer gracefully degrades between all formats.<br/><br/>For more information on browser coverage please <a href="http://flexpaper.devaldi.com/docs_html_flash_html5.jsp?ref=FlexPaper">see our documentation</a>.</div>
        </div>
   </body>
</html>