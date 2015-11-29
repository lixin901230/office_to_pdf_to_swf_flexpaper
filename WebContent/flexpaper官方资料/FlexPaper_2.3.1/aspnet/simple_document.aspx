<%@ Page Language="C#" AutoEventWireup="true" CodeFile="simple_document.aspx.cs" Inherits="simple_document" %>
<%@ Import Namespace="lib" %>
<!doctype html>
<html>
    <head>
        <title>FlexPaper</title>
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
			<div id="documentViewer" class="flexpaper_viewer" style="position:absolute;left:10px;top:10px;width:770px;height:500px"></div>

	        <script type="text/javascript">
		        function getDocumentUrl(document){
					return "services/view.ashx?doc={doc}&format={format}&page={page}".replace("{doc}",document);
		        }

		        function getDocQueryServiceUrl(document){
		        	return "services/swfsize.ashx?doc={doc}&page={page}".replace("{doc}",document);
		        }

		        var startDocument = "<% if(Request["doc"]!=null){Response.Write(Request["doc"]);}else{%>Paper.pdf<% } %>";

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
						 RenderingOrder : '<%=(configManager.getConfig("renderingorder.primary") + ',' + configManager.getConfig("renderingorder.secondary")) %>',

						 ViewModeToolsVisible : true,
						 ZoomToolsVisible : true,
						 NavToolsVisible : true,
						 CursorToolsVisible : true,
						 SearchToolsVisible : true,

  						 DocSizeQueryService : 'services/swfsize.ashx?doc=' + startDocument,
  						 jsDirectory : '../js/',

						 JSONDataType : 'jsonp',
						 key : '<%=configManager.getConfig("licensekey") %>',

  						 localeChain: 'en_US'

						 }}
				);
	        </script>
   </body>
</html> 