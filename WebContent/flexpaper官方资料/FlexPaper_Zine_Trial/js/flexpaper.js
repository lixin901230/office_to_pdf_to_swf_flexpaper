/**
 █▒▓▒░ The FlexPaper Project

 This file is part of FlexPaper.

 For more information on FlexPaper please see the FlexPaper project
 home page: http://flexpaper.devaldi.com
 */

/**
*
* FlexPaper helper function for retrieving a active FlexPaper instance 
*
*/ 
window.$FlexPaper = window.getDocViewer = window["$FlexPaper"] = function(id){
	var instance = (id==="undefined")?"":id;

    if (window['ViewerMode'] == 'flash') {
		return window["FlexPaperViewer_Instance"+instance].getApi();
	}else if(window['ViewerMode'] == 'html'){
		return window["FlexPaperViewer_Instance"+instance];
	}
};  



/**
 *
 * FlexPaper embedding (name of placeholder, config)
 *
 */
window.FlexPaperViewerEmbedding = window.$f = function(id, args) {
    this.id = id;

    var userAgent = navigator.userAgent.toLowerCase();
    var browser = window["eb.browser"] = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
        chrome: /chrome/.test(userAgent)
    };

    var platform = window["eb.platform"] = {
        win:/win/.test(userAgent),
        mac:/mac/.test(userAgent),
        touchdevice : (function(){try {return 'ontouchstart' in document.documentElement;} catch (e) {return false;} })(),
        android : (userAgent.indexOf("android") > -1),
        ios : ((userAgent.match(/iphone/i)) || (userAgent.match(/ipod/i)) || (userAgent.match(/ipad/i))),
        iphone : (userAgent.match(/iphone/i)) || (userAgent.match(/ipod/i)),
        ipad : (userAgent.match(/ipad/i)),
        winphone : userAgent.match(/Windows Phone/i),
        blackberry : userAgent.match(/BlackBerry/i),
        webos : userAgent.match(/webOS/i)
    };

    platform.touchonlydevice = platform.touchdevice && (platform.android || platform.ios || platform.winphone || platform.blackberry || platform.webos);

    var config = args.config;
    var _SWFFile,_PDFFile,_IMGFiles,_SVGFiles,_IMGFiles_thumbs="",_IMGFiles_highres="",_JSONFile  = "",_jsDirectory="",_cssDirectory="",_localeDirectory="";_WMode = (config.WMode!=null||config.wmode!=null?config.wmode||config.WMode:"direct");
    var _uDoc = ((config.DOC !=null)?unescape(config.DOC):null);
    var instance = "FlexPaperViewer_Instance"+((id==="undefined")?"":id);
    var _JSONDataType = (config.JSONDataType!=null)?config.JSONDataType:"json";

    if (_uDoc != null) {
        _SWFFile 	        = FLEXPAPER.translateUrlByFormat(_uDoc,"swf");
        _PDFFile 	        = FLEXPAPER.translateUrlByFormat(_uDoc,"pdf");
        _JSONFile 	        = FLEXPAPER.translateUrlByFormat(_uDoc,_JSONDataType);
        _IMGFiles 	        = FLEXPAPER.translateUrlByFormat(_uDoc,"jpg");
        _SVGFiles           = FLEXPAPER.translateUrlByFormat(_uDoc,"svg");
        _IMGFiles_thumbs    = FLEXPAPER.translateUrlByFormat(_uDoc,"jpg");
        _IMGFiles_highres   = FLEXPAPER.translateUrlByFormat(_uDoc,"jpgpageslice");
    }

    _SWFFile  			= (config.SwfFile!=null?config.SwfFile:_SWFFile);
    _SWFFile  			= (config.SWFFile!=null?config.SWFFile:_SWFFile);
    _PDFFile 			= (config.PDFFile!=null?config.PDFFile:_PDFFile);
    _IMGFiles 			= (config.IMGFiles!=null?config.IMGFiles:_IMGFiles);
    _IMGFiles 			= (config.PageImagePattern!=null?config.PageImagePattern:_IMGFiles);
    _SVGFiles 			= (config.SVGFiles!=null?config.SVGFiles:_SVGFiles);
    _IMGFiles_thumbs    = (config.ThumbIMGFiles!=null?config.ThumbIMGFiles:_IMGFiles_thumbs);
    _IMGFiles_highres   = (config.HighResIMGFiles!=null?config.HighResIMGFiles:_IMGFiles_highres);
    _JSONFile 			= (config.JSONFile!=null?config.JSONFile:_JSONFile);
    _jsDirectory 		= (config.jsDirectory!=null?config.jsDirectory:FLEXPAPER.detectjsdir());
    _cssDirectory 		= (config.cssDirectory!=null?config.cssDirectory:FLEXPAPER.detectcssdir());
    _localeDirectory 	= (config.localeDirectory!=null?config.localeDirectory:"locale/");
    if(_SWFFile!=null && _SWFFile.indexOf("{" )==0 && _SWFFile.indexOf("[*," ) > 0 && _SWFFile.indexOf("]" ) > 0){_SWFFile = escape(_SWFFile);} // split file fix

    // overwrite StartAtPage with anything off the hash
    if(FLEXPAPER.getLocationHashParameter){
        var pageFromHash = FLEXPAPER.getLocationHashParameter('page');
        if(pageFromHash!=null){
            config.StartAtPage = pageFromHash;
        }
    }

    if(FLEXPAPER.getLocationHashParameter){
        var previewModeFromHash = FLEXPAPER.getLocationHashParameter('PreviewMode');
        if(previewModeFromHash!=null){
            config.PreviewMode = previewModeFromHash;
        }
    }

    if(config.PreviewMode == "FrontPage" && ((_IMGFiles!=null && _IMGFiles.length>0) || (_IMGFiles_thumbs!=null && _IMGFiles_thumbs.length>0))){
        FLEXPAPER.initFrontPagePreview(id,args,(_IMGFiles_thumbs!=null && _IMGFiles_thumbs.length>0)?_IMGFiles_thumbs:_IMGFiles);
        return;
    }

    window[instance] = flashembed(id, {
        src						    : _jsDirectory+"../FlexPaperViewer.swf",
        version					    : [11, 0],
        expressInstall			    : "js/expressinstall.swf",
        wmode					    : _WMode
    },{
        ElementId               : id,
        SwfFile  				: _SWFFile,
        PdfFile  				: _PDFFile,
        IMGFiles  				: _IMGFiles,
        SVGFiles  				: _SVGFiles,
        JSONFile 				: _JSONFile,
        ThumbIMGFiles           : _IMGFiles_thumbs,
        HighResIMGFiles         : _IMGFiles_highres,
        useCustomJSONFormat 	: config.useCustomJSONFormat,
        JSONPageDataFormat 		: config.JSONPageDataFormat,
        JSONDataType 			: _JSONDataType,
        Scale 					: (config.Scale!=null)?config.Scale:0.8,
        ZoomTransition 			: (config.ZoomTransition!=null)?config.ZoomTransition:'easeOut',
        ZoomTime 				: (config.ZoomTime!=null)?config.ZoomTime:0.5,
        ZoomInterval 			: (config.ZoomInterval)?config.ZoomInterval:0.1,
        FitPageOnLoad 			: (config.FitPageOnLoad!=null)?config.FitPageOnLoad:false,
        FitWidthOnLoad 			: (config.FitWidthOnLoad!=null)?config.FitWidthOnLoad:false,
        FullScreenAsMaxWindow 	: (config.FullScreenAsMaxWindow!=null)?config.FullScreenAsMaxWindow:false,
        ProgressiveLoading 		: (config.ProgressiveLoading!=null)?config.ProgressiveLoading:false,
        MinZoomSize 			: (config.MinZoomSize!=null)?config.MinZoomSize:0.2,
        MaxZoomSize 			: (config.MaxZoomSize!=null)?config.MaxZoomSize:5,
        SearchMatchAll 			: (config.SearchMatchAll!=null)?config.SearchMatchAll:false,
        SearchServiceUrl 		: config.SearchServiceUrl,
        InitViewMode 			: config.InitViewMode,
        DisableOverflow         : config.DisableOverflow,
        DisplayRange            : config.DisplayRange,
        TouchInitViewMode       : config.TouchInitViewMode,
        PreviewMode             : config.PreviewMode,
        PublicationTitle        : config.PublicationTitle,
        MixedMode               : config.MixedMode,
        EnableWebGL             : config.EnableWebGL,
        AutoDetectLinks         : config.AutoDetectLinks,
        BitmapBasedRendering 	: (config.BitmapBasedRendering!=null)?config.BitmapBasedRendering:false,
        StartAtPage 			: (config.StartAtPage!=null&&config.StartAtPage.toString().length>0&&!isNaN(config.StartAtPage))?config.StartAtPage:1,
        PrintPaperAsBitmap		: (config.PrintPaperAsBitmap!=null)?config.PrintPaperAsBitmap:((browser.safari||browser.mozilla)?true:false),
        AutoAdjustPrintSize		: (config.AutoAdjustPrintSize!=null)?config.AutoAdjustPrintSize:true,
        EnableSearchAbstracts   : ((config.EnableSearchAbstracts!=null)?config.EnableSearchAbstracts:true),
        EnableCornerDragging 	: ((config.EnableCornerDragging!=null)?config.EnableCornerDragging:true), // FlexPaper Zine parameter
        BackgroundColor 		: config.BackgroundColor, // FlexPaper Zine parameter
        PanelColor 				: config.PanelColor, // FlexPaper Zine parameter
        BackgroundAlpha         : config.BackgroundAlpha, // FlexPaper Zine parameter
        UIConfig                : config.UIConfig,  // FlexPaper Zine parameter
        PageIndexAdjustment     : config.PageIndexAdjustment,

        ViewModeToolsVisible 	: ((config.ViewModeToolsVisible!=null)?config.ViewModeToolsVisible:true),
        ZoomToolsVisible 		: ((config.ZoomToolsVisible!=null)?config.ZoomToolsVisible:true),
        NavToolsVisible 		: ((config.NavToolsVisible!=null)?config.NavToolsVisible:true),
        CursorToolsVisible 		: ((config.CursorToolsVisible!=null)?config.CursorToolsVisible:true),
        SearchToolsVisible 		: ((config.SearchToolsVisible!=null)?config.SearchToolsVisible:true),
        AnnotationToolsVisible  : ((config.AnnotationToolsVisible!=null)?config.AnnotationToolsVisible:true), // Annotations viewer parameter

        StickyTools				: config.StickyTools,
        UserCollaboration       : config.UserCollaboration,
        CurrentUser             : config.CurrentUser,
        Toolbar                 : config.Toolbar,
        BottomToolbar           : config.BottomToolbar,
        DocSizeQueryService 	: config.DocSizeQueryService,

        RenderingOrder 			: config.RenderingOrder,

        TrackingNumber          : config.TrackingNumber,
        localeChain 			: (config.localeChain!=null)?config.localeChain:"en_US",
        jsDirectory 			: _jsDirectory,
        cssDirectory 			: _cssDirectory,
        localeDirectory			: _localeDirectory,
        signature               : config.signature,
        key 					: config.key
    });

    // add TrackingNumber to the data collection for easier use in events later
    if(config.TrackingNumber && config.TrackingNumber.length>0){

        var _trackSWFFile = _SWFFile; if(_trackSWFFile){_trackSWFFile = (_trackSWFFile.indexOf("/")>0?_trackSWFFile.substr(_trackSWFFile.lastIndexOf("/")+1):_trackSWFFile); _trackSWFFile = _trackSWFFile.replace("_[*,0]",""); _trackSWFFile = _trackSWFFile.replace(".swf",".pdf"); _trackSWFFile = (_trackSWFFile.indexOf("}")>0?_trackSWFFile.substr(0,_trackSWFFile.lastIndexOf(",")):_trackSWFFile);}
        var _trackPDFFile = _PDFFile; if(_trackPDFFile){_trackPDFFile = (_trackPDFFile.indexOf("/")>0?_trackPDFFile.substr(_trackPDFFile.lastIndexOf("/")+1):_trackPDFFile); _trackPDFFile = _trackPDFFile.replace("_[*,0]","").replace("_[*,2]","");}
        var _trackJSONFile = _JSONFile; if(_JSONFile){_trackJSONFile = (_trackJSONFile.indexOf("/")>0?_trackJSONFile.substr(_trackJSONFile.lastIndexOf("/")+1):_trackJSONFile); _trackJSONFile = _trackJSONFile.replace("{page}",""); _trackJSONFile = _trackJSONFile.replace(".js",".pdf");}

        jQuery('#'+id).data('TrackingDocument',(_trackPDFFile || _trackSWFFile || _trackJSONFile));
        jQuery('#'+id).data('TrackingNumber',config.TrackingNumber);
    }
};

(function() {
    if(!window.FLEXPAPER){window.FLEXPAPER = {};}

    FLEXPAPER.detectjsdir = function(){
        if(jQuery('script[src$="flexpaper.js"]').length>0){
            return jQuery('script[src$="flexpaper.js"]').attr('src').replace('flexpaper.js','');
        }else{
            return "js/"
        }
    };

    FLEXPAPER.detectcssdir= function(){
        if(jQuery('link[href$="flexpaper.css"]').length>0){
            return jQuery('link[href$="flexpaper.css"]').attr('href').replace('flexpaper_zine.css','');
        }else{
            return "css/"
        }
    };

    FLEXPAPER.getLocationHashParameter = function(param){
        var hash = location.hash.substr(1);

        if(hash.indexOf(param+'=')>=0){
            var value = hash.substr(hash.indexOf(param+'='))
                .split('&')[0]
                .split('=')[1];

            return value;
        }

        return null;
    };

    FLEXPAPER.translateUrlByFormat = function(url,format){
        if(url.indexOf("{") == 0 && format != "swf"){ // loading in split file mode
            url = url.substring(1,url.lastIndexOf(","));

            if(format!="pdf"){
                url = url.replace("[*,0]","{page}")
                url = url.replace("[*,2]","{page}")
            }
        }else if(format == "swf" && url.indexOf("{") != 0){
            url = url.replace("{page}", "");
            url = url.replace(/&/g, '%26');
            url = url.replace(/ /g, '%20');
        }

        if(format =="jpgpageslice"){
            url = url + "&sector={sector}";
        }

        url = (url!=null && url.indexOf('{format}') > 0 ? url.replace("{format}", format):null);
        return url;
    };

    FLEXPAPER.translateUrlByDocument = function(url,document){
        return (url!=null && url.indexOf('{doc}') > 0 ? url.replace("{doc}", document):null);
    };

    FLEXPAPER.animateDenyEffect = function(obj,margin,time,cycles,dir) {
        window.setTimeout(function(){
            var speed = time / ((2*cycles)+1);
            var margRat = 1 + (60/(cycles*cycles)); $(obj).stop(true,true);
            for (var i=0; i<=cycles; i++) {
                for (var j=-1; j<=1; j+=2)
                    $(obj).animate({marginLeft: (i!=cycles)*j*margin},{duration:speed, queue:true});

                margin/=margRat;
            }
        },500);
    };

    FLEXPAPER.initFrontPagePreview = function initFrontPagePreview(viewerid,args,IMGFiles){
        var animate = true;
        jQuery(document.body).css('background-color',jQuery('#'+viewerid).css('background-color'));

        var img = new Image();
        jQuery(img).bind('load',function(){
            jQuery(document.body).append(
                "<div id='flexpaper_frontpagePreview_"+viewerid+"'>"+
                    "<form class='flexpaper_htmldialog' method='POST' style='display:none;top:100px;margin:"+((jQuery(window).height()>350)?"50px auto":"0px auto")+";padding-bottom:0px;'>"+
                    "<div class='flexpaper_preview_container flexpaper_publications flexpaper_publication_csstransforms3d' style='overflow-y:hidden;overflow-x:hidden;text-align:center;margin: -25px -25px 0px;padding: 15px 25px 20px 25px;'>"+
                    "<div class='flexpaper_publication flexpaper_publication_csstransforms3d' style='cursor:pointer;margin-bottom:20px;'>"+
                    "<img src='"+(IMGFiles.replace("{page}",1))+"' />"+
                    "</div>"+
                    ((args.config.PublicationTitle!=null && args.config.PublicationTitle.length>0)?"<h1 class='flexpaper_htmldialog-title' style='margin-bottom:0px;'>"+args.config.PublicationTitle+"</h1>":"")+
                    "</div>"+
                    "</form>"+
                    "</div>"
            );

            var anim_duration = animate?1000:0;
            var anim_height_dur = animate?anim_duration/3:0;
            var theight = 260;

            jQuery('.flexpaper_htmldialog').css({height : '0px', display : 'block'});
            jQuery('.flexpaper_htmldialog').animate({'height': theight+'px','top':'0px'},{duration: anim_height_dur, complete: function(){
                var preview_container = jQuery('#flexpaper_frontpagePreview_'+viewerid);
                var container_width = preview_container.find('.flexpaper_preview_container').width();
                var container_height = preview_container.find('.flexpaper_preview_container').height();

                preview_container.find('.flexpaper_htmldialog').css({'height' : ''}); // remove height attribute to fit publication
                preview_container.find('.flexpaper_preview_container').append("<div class='flexpaper_frontpagePreview_play' style='position:absolute;left:"+(container_width/2)+"px;top:"+(container_height/2-((args.config.PublicationTitle!=null)?50:25))+"px;width:0px;height:0px;border-bottom:50px solid transparent;border-top:50px solid transparent;border-left:50px solid #AAAAAA;'></div>");

                var playbutton = preview_container.find('.flexpaper_frontpagePreview_play');

                playbutton.css({opacity : 0.85, 'cursor' : 'pointer'});
                preview_container.find('.flexpaper_publication, .flexpaper_frontpagePreview_play').on("mouseover",function(e){
                    jQuery(playbutton).css({
                        'border-left'	: '50px solid #FFFFFF',
                        opacity : 0.85
                    });
                });

                preview_container.find('.flexpaper_publication, .flexpaper_frontpagePreview_play').on("mouseout",function(e){
                    jQuery(playbutton).css({
                        'border-left'	: '50px solid #AAAAAA'
                    });
                });

                preview_container.find('.flexpaper_publication, .flexpaper_frontpagePreview_play').on("mousedown",function(e){
                    jQuery('#flexpaper_frontpagePreview_'+viewerid).remove();
                    args.config.PreviewMode=null;
                    jQuery('#'+viewerid).FlexPaperViewer(args);
                });

                jQuery('.flexpaper_publication').animate({opacity:1},{
                    step : function(now,fx){
                        var target = -7;var opacityfrom = -40;var diff = opacityfrom - target;var rotate = (diff * now);

                        jQuery('.flexpaper_publication').css({
                            '-webkit-transform' : 'perspective(300) rotateY('+(opacityfrom - rotate)+'deg)',
                            '-moz-transform' : 'rotateY('+(opacityfrom - rotate)+'deg)',
                            'box-shadow' : '5px 5px 20px rgba(51, 51, 51, '+now+')'
                        });
                    },
                    duration:anim_duration
                });

            }});

        });
        img.src = (IMGFiles.replace("{page}",1));
    };

    FLEXPAPER.initLoginForm = function initLoginForm(IMGFiles,animate){
        jQuery(document.body).css('background-color','#dedede');

        var img = new Image();
        jQuery(img).bind('load',function(){
            jQuery(document.body).append(
                    "<div id='loginForm'>"+
                    "<form class='flexpaper_htmldialog' method='POST' style='display:none;top:100px;margin:"+((jQuery(window).height()>500)?"50px auto":"0px auto")+"'>"+
                    "<div class='flexpaper_publications flexpaper_publication_csstransforms3d' style='overflow-y:hidden;overflow-x:hidden;text-align:center;background: #f7f7f7;margin: -25px -25px 0px;padding: 15px 25px 0px 25px;'>"+
                    "<div class='flexpaper_publication flexpaper_publication_csstransforms3d' id='flexpaper_publication1'>"+
                    "<img src='"+(IMGFiles.replace("{page}",1))+"' />"+
                    "</div>"+

                    "<h1 class='flexpaper_htmldialog-title'>password protected publication</h1>"+
                    "<input type='password' id='txt_flexpaper_password' name='txt_flexpaper_password' class='flexpaper_htmldialog-input' placeholder='Enter password'>"+
                    "<input type='submit' value='Submit' class='flexpaper_htmldialog-button'>"+
                    "</div>"+
                    "</form>"+
                    "</div>"
            );

            var anim_duration = animate?1000:0;
            var anim_height_dur = animate?anim_duration/3:0;
            var theight = 400;

            jQuery('.flexpaper_htmldialog').css({height : '0px', display : 'block'});
            jQuery('.flexpaper_htmldialog').animate({'height': theight+'px','top':'0px'},{duration: anim_height_dur, complete: function(){
                jQuery('.flexpaper_htmldialog').css({'height' : ''}); // remove height attribute to fit publication

                jQuery('.flexpaper_publication').animate({opacity:1},{
                    step : function(now,fx){
                        var target = -7;var opacityfrom = -40;var diff = opacityfrom - target;var rotate = (diff * now);

                        jQuery('.flexpaper_publication').css({
                            '-webkit-transform' : 'perspective(300) rotateY('+(opacityfrom - rotate)+'deg)',
                            '-moz-transform' : 'rotateY('+(opacityfrom - rotate)+'deg)',
                            'box-shadow' : '5px 5px 20px rgba(51, 51, 51, '+now+')'
                        });
                    },
                    duration:anim_duration
                });

            }});

        });
        img.src = (IMGFiles.replace("{page}",1));
    };
})();

/**
 * 
 * FlexPaper embedding functionality. Based on FlashEmbed
 *
 */

(function() {
    var  ua = navigator.userAgent.toLowerCase();
	var  IE = document.all,
		 URL = 'http://www.adobe.com/go/getflashplayer',
		 JQUERY = typeof jQuery == 'function', 
		 RE = /(\d+)[^\d]+(\d+)[^\d]*(\d*)/,
         MOBILE = (function(){try {return 'ontouchstart' in document.documentElement;} catch (e) {return false;} })(),
         MOBILEOS = ((ua.indexOf("android") > -1) || ((ua.match(/iphone/i)) || (ua.match(/ipod/i)) || (ua.match(/ipad/i))) || ua.match(/Windows Phone/i) || ua.match(/BlackBerry/i) || ua.match(/webOS/i)),
		 GLOBAL_OPTS = { 
			// very common opts
			width: '100%',
			height: '100%',		
			id: "_" + ("" + Math.random()).slice(9),
			
			// flashembed defaults
			allowfullscreen: true,
			allowscriptaccess: 'always',
			quality: 'high',
            allowFullScreenInteractive : true,
			
			// flashembed specific options
			version: [10, 0],
			onFail: null,
			expressInstall: null, 
			w3c: false,
			cachebusting: false  		 		 
	};

    window.isTouchScreen = MOBILE && MOBILEOS;

	if (window.attachEvent) {
		window.attachEvent("onbeforeunload", function() {
			__flash_unloadHandler = function() {};
			__flash_savedUnloadHandler = function() {};
		});
	}
	
	// simple extend
	function extend(to, from) {
		if (from) {
			for (var key in from) {
				if (from.hasOwnProperty(key)) {
					to[key] = from[key];
				}
			}
		} 
		return to;
	}

    // used by Flash to dispatch a event properly
    window.dispatchJQueryEvent = function (elementId,eventName,args){

        // make sure escaped flash backslash characters are normalized
        if(args.length>0 && args[0].note){
            args[0].note = args[0].note.replace(/%22/g, "\"")
                                       .replace(/%5c/g, "\\")
                                       .replace(/%26/g, "&")
                                       .replace(/%25/g, "%");
        }

        jQuery('#'+elementId).trigger(eventName,args);
    }

	// used by asString method	
	function map(arr, func) {
		var newArr = []; 
		for (var i in arr) {
			if (arr.hasOwnProperty(i)) {
				newArr[i] = func(arr[i]);
			}
		}
		return newArr;
	}

	window.flashembed = function(root, opts, conf) {
		// root must be found / loaded	
		if (typeof root == 'string') {
			root = document.getElementById(root.replace("#", ""));
		}
		
		// not found
		if (!root) { return; }
		
		root.onclick = function(){return false;}
		
		if (typeof opts == 'string') {
			opts = {src: opts};	
		}

		return new Flash(root, extend(extend({}, GLOBAL_OPTS), opts), conf); 
	};	
	
	// flashembed "static" API
	var f = extend(window.flashembed, {
		
		conf: GLOBAL_OPTS,
	
		getVersion: function()  {
			var fo, ver;
			
			try {
				ver = navigator.plugins["Shockwave Flash"].description.slice(16); 
			} catch(e) {
				
				try  {
					fo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
					ver = fo && fo.GetVariable("$version");
					
				} catch(err) {
                try  {
                    fo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                    ver = fo && fo.GetVariable("$version");  
                } catch(err2) { } 						
				} 
			}
			
			ver = RE.exec(ver);
			return ver ? [ver[1], ver[3]] : [0, 0];
		},
		
		asString: function(obj) { 

			if (obj === null || obj === undefined) { return null; }
			var type = typeof obj;
			if (type == 'object' && obj.push) { type = 'array'; }
			
			switch (type){  
				
				case 'string':
					obj = obj.replace(new RegExp('(["\\\\])', 'g'), '\\$1');
					
					// flash does not handle %- characters well. transforms "50%" to "50pct" (a dirty hack, I admit)
					obj = obj.replace(/^\s?(\d+\.?\d+)%/, "$1pct");
					return '"' +obj+ '"';
					
				case 'array':
					return '['+ map(obj, function(el) {
						return f.asString(el);
					}).join(',') +']'; 
					
				case 'function':
					return '"function()"';
					
				case 'object':
					var str = [];
					for (var prop in obj) {
						if (obj.hasOwnProperty(prop)) {
							str.push('"'+prop+'":'+ f.asString(obj[prop]));
						}
					}
					return '{'+str.join(',')+'}';
			}
			
			// replace ' --> "  and remove spaces
			return String(obj).replace(/\s/g, " ").replace(/\'/g, "\"");
		},
		
		getHTML: function(opts, conf) {

			opts = extend({}, opts);
			opts.id = opts.id + (" " + Math.random()).slice(9);
			
			/******* OBJECT tag and it's attributes *******/
			var html = '<object width="' + opts.width + 
				'" height="' + opts.height + 
				'" id="' + opts.id + 
				'" name="' + opts.id + '"';
			
			if (opts.cachebusting) {
				opts.src += ((opts.src.indexOf("?") != -1 ? "&" : "?") + Math.random());		
			}			
			
			if (opts.w3c || !IE) {
				html += ' data="' +opts.src+ '" type="application/x-shockwave-flash"';		
			} else {
				html += ' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"';	
			}
			
			html += '>'; 
			
			/******* nested PARAM tags *******/
			if (opts.w3c || IE) {
				html += '<param name="movie" value="' +opts.src+ '" />'; 	
			} 
			
			// not allowed params
			opts.width = opts.height = opts.id = opts.w3c = opts.src = null;
			opts.onFail = opts.version = opts.expressInstall = null;
			
			for (var key in opts) {
				if (opts[key]) {
					html += '<param name="'+ key +'" value="'+ opts[key] +'" />';
				}
			}	
		
			/******* FLASHVARS *******/
			var vars = "";
			
			if (conf) {
				for (var k in conf) {
                    if ((typeof conf[k] != "undefined") && (typeof conf[k] != "unknown") && k!='Toolbar' && k!='BottomToolbar') {
						var val = conf[k];
                        if(k=="JSONFile"){val = escape(val);}
						vars += k +'='+ (/function|object/.test(typeof val) ? f.asString(val) : val) + '&';
					}
				}
				vars = vars.slice(0, -1);
				html += '<param name="flashvars" value=\'' + vars + '\' />';
			}
			
			html += "</object>";	
			
			return html;				
		},
		
		isSupported: function(ver) {
			return VERSION[0] > ver[0] || VERSION[0] == ver[0] && VERSION[1] >= ver[1];			
		}		
		
	});
	
	var VERSION = f.getVersion(); 
	
	function Flash(root, opts, conf) {
        var browser = window["eb.browser"];
        var platform = window["eb.platform"];

        var supportsHTML4   = (browser.mozilla && browser.version.split(".")[0] >= 3) ||
            (browser.chrome) ||
            (browser.msie && browser.version.split(".")[0] >= 8) ||
            (browser.safari) ||
            (browser.opera);

        var supportsCanvasDrawing 	= 	(browser.mozilla && browser.version.split(".")[0] >= 4) ||
            (browser.chrome && browser.version.split(".") >= 535) ||
            (browser.msie && browser.version.split(".")[0] >= 9) ||
            (browser.safari && browser.version.split(".")[0] >= 535 /*&& !platform.ios*/);

        // Default to a rendering mode if its not set
        if(!conf.RenderingOrder && conf.SwfFile !=  null){conf.RenderingOrder = "flash";}
        if(!conf.RenderingOrder && conf.JSONFile !=  null && conf.JSONFile){conf.RenderingOrder = "html";}
        if(!conf.RenderingOrder && conf.PdfFile !=  null){conf.RenderingOrder = "html5";}

        // mobile preview removes flash from the rendering order
        if(FLEXPAPER.getLocationHashParameter && FLEXPAPER.getLocationHashParameter('mobilepreview')){
            conf.RenderingOrder = conf.RenderingOrder.replace(/flash/g, 'html');
        }

        // if a iOS device but not touch then user is clearly faking user agent. Assume mobile preview.
        if(!platform.touchdevice && platform.ios){
            conf.RenderingOrder = conf.RenderingOrder.replace(/flash/g, 'html');
        }

        if(platform.ios){
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if(v!=null && v.length>1){
                platform.iosversion = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)][0];
            }
        }

        var viewerId = jQuery(root).attr('id');
        var instance = "FlexPaperViewer_Instance"+((viewerId==="undefined")?"":viewerId);

        // version is ok
		if ((conf.RenderingOrder.indexOf('flash') == 0 || (conf.RenderingOrder.indexOf('flash')>0 &&!supportsHTML4) || (conf.RenderingOrder.indexOf('flash')>0 && conf.RenderingOrder.indexOf('html5')>=0 && !supportsCanvasDrawing)) && f.isSupported(opts.version)) {
            if(conf.Toolbar){
                var wrapper = jQuery(root).wrap("<div class='flexpaper_toolbar_wrapper' style='"+jQuery(root).attr('style')+"'></div>").parent();
                wrapper.prepend(jQuery(conf.Toolbar));
                
                jQuery(root).css({
                    left : '0px',
                    top: '0px',
                    position : 'relative',
                    width : '100%',
                    height : ((1 - jQuery(wrapper).find('.flexpaper_toolbar').height() / jQuery(root).parent().height()) * 100) + '%'
                }).addClass('flexpaper_viewer');
            }

			window['ViewerMode'] = 'flash';
			root.innerHTML = f.getHTML(opts, conf);

            if(conf.BottomToolbar && conf.AnnotationToolsVisible!=false){
                jQuery.get(conf.BottomToolbar,function(toolbarData){
                    wrapper.append(toolbarData);
                    
                    jQuery(root).css({
                        height : jQuery(root).height() - jQuery(wrapper).find('.flexpaper_bottomToolbar').height()
                    });
                });
            }

            if(conf.Toolbar){
                // initialize event handlers for flash
                jQuery.getScript(conf.jsDirectory+'flexpaper_flashhandlers_htmlui.js', function() {
                    FLEXPAPER.bindFlashEventHandlers(root);
                });
            }

            root.firstChild["dispose"] = function(){
                if(conf.Toolbar){
                    jQuery($FlexPaper('documentViewer')).parent().parent().remove();
                }else{
                    $FlexPaper(viewerId).remove();
                }
            }

		// express install
		} else if ((conf.RenderingOrder.indexOf('flash') == 0) && opts.expressInstall && f.isSupported([6, 65])) {
			window['ViewerMode'] = 'flash';

            if(conf.Toolbar){
                var wrapper = jQuery(root).wrap("<div class='flexpaper_toolbar_wrapper' style='"+jQuery(root).attr('style')+"'></div>").parent();
                jQuery(root).css({
                    left : '0px',
                    top: '0px',
                    position : 'relative',
                    width : '100%',
                    height : ((1 - jQuery(wrapper).find('.flexpaper_toolbar').height() / jQuery(root).parent().height()) * 100) + '%'
                }).addClass('flexpaper_viewer');

                wrapper.prepend(jQuery(conf.Toolbar));
            }

			root.innerHTML = f.getHTML(extend(opts, {src: opts.expressInstall}), {
				MMredirectURL: location.href,
				MMplayerType: 'PlugIn',
				MMdoctitle: document.title
			});

            if(conf.BottomToolbar && conf.AnnotationToolsVisible!=false){
                jQuery.get(conf.BottomToolbar,function(toolbarData){
                    wrapper.append(toolbarData);
                    
                    jQuery(root).css({
                        height : jQuery(root).height() - jQuery(wrapper).find('.flexpaper_bottomToolbar').height()
                    });
                });
            }

            if(conf.Toolbar){
                // initialize event handlers for flash
                jQuery.getScript(conf.jsDirectory+'flexpaper_flashhandlers_htmlui.js', function() {
                    FLEXPAPER.bindFlashEventHandlers(root);
                });
            }

            root.firstChild["dispose"] = function(){
                if(conf.Toolbar){
                    jQuery($FlexPaper('documentViewer')).parent().parent().remove();
                }else{
                    $FlexPaper(viewerId).remove();
                }
            }

		} else { //use html viewer or die
			window['ViewerMode'] = 'html';
			//jQuery.noConflict();
			if(true){
				jQuery(document).ready(function() {
                    if(conf.Toolbar){jQuery.fn.showFullScreen = function(){$FlexPaper(jQuery(this).attr('id')).openFullScreen();}}

                    // Enable cache of scripts. You can disable this if you want to force FlexPaper to use a non-cached version every time.
                    jQuery.ajaxSetup({
                        cache: true
                    });

                    var scriptPromise = new jQuery.Deferred();

                    if(!window["FlexPaperViewer_HTML"]){
                        jQuery.getScript(conf.jsDirectory+'FlexPaperViewer.js').then(function(){scriptPromise.resolve();}).fail(function(){
                                if(arguments[0].readyState==0){
                                    console.log("failed to load FlexPaperViewer.js. Check your resources");
                                }else{
                                    //script loaded but failed to parse
                                    console.log(arguments[2].toString());
                                }
                        });
                    }else{
                        scriptPromise.resolve();
                    }

                    if(scriptPromise.then(function(){
                        // If rendering order isnt set but the formats are supplied then assume the rendering order.
                        if(!conf.RenderingOrder){
                            conf.RenderingOrder = "";
                            if(conf.PdfFile!=null){conf.RenderingOrder = "html5";}
                            if(conf.SwfFile!=null){conf.RenderingOrder += (conf.RenderingOrder.length>0?",":"")+"flash"}
                        }

                        // add fallback for html if not specified
                        if(conf.JSONFile!=null && conf.JSONFile.length>0 && conf.IMGFiles!=null && conf.IMGFiles.length>0){

                            if((platform.ios /*&& (platform.iosversion<8 && platform.ipad)*/) || platform.android || (browser.msie && browser.version <=9)){ // ios should use html as preferred rendering mode if available.
                                conf.RenderingOrder = "html" + (conf.RenderingOrder.length>0?",":"") + conf.RenderingOrder;
                            }else{
                                conf.RenderingOrder += (conf.RenderingOrder.length>0?",":"")+"html";
                            }
                        }

                        var oRenderingList 	= conf.RenderingOrder.split(",");
                        var pageRenderer 	= null;

                        // if PDFJS isn't supported and the html formats are supplied, then use these as primary format
                        if(oRenderingList && oRenderingList.length==1 && conf.JSONFile!=null && conf.JSONFile.length>0 && conf.IMGFiles!=null && conf.IMGFiles.length>0 && !supportsCanvasDrawing){
                            oRenderingList[1] = conf.RenderingOrder[0];
                            oRenderingList[0] = 'html';
                        }

                        if(conf.PdfFile!=null && conf.PdfFile.length>0 && conf.RenderingOrder.split(",").length>=1 && supportsCanvasDrawing && (oRenderingList[0] == 'html5' || (oRenderingList.length > 1 && oRenderingList[0] == 'flash' && oRenderingList[1] == 'html5'))){
                            pageRenderer = new CanvasPageRenderer(viewerId,conf.PdfFile,conf.jsDirectory,
                                {
                                    jsonfile                : conf.JSONFile,
                                    pageImagePattern        : conf.IMGFiles,
                                    pageThumbImagePattern   : conf.ThumbIMGFiles,
                                    compressedJSONFormat    : !conf.useCustomJSONFormat,
                                    JSONPageDataFormat      : conf.JSONPageDataFormat,
                                    JSONDataType            : conf.JSONDataType,
                                    MixedMode               : conf.MixedMode,
                                    signature               : conf.signature,
                                    DisableShadows          : conf.DisableOverflow,
                                    DisplayRange            : conf.DisplayRange
                                });
                        }else{
                            pageRenderer = new ImagePageRenderer(
                                viewerId,
                                {
                                    jsonfile                : conf.JSONFile,
                                    pageImagePattern        : conf.IMGFiles,
                                    pageThumbImagePattern   : conf.ThumbIMGFiles,
                                    pageHighResImagePattern : conf.HighResIMGFiles,
                                    pageSVGImagePattern     : conf.SVGFiles,
                                    compressedJSONFormat    : !conf.useCustomJSONFormat,
                                    JSONPageDataFormat      : conf.JSONPageDataFormat,
                                    JSONDataType            : conf.JSONDataType,
                                    SVGMode                 : conf.RenderingOrder.toLowerCase().indexOf('svg')>=0,
                                    MixedMode               : conf.MixedMode,
                                    signature               : conf.signature,
                                    PageIndexAdjustment     : conf.PageIndexAdjustment,
                                    DisableShadows          : conf.DisableOverflow,
                                    DisplayRange            : conf.DisplayRange
                                },
                                conf.jsDirectory);
                        }

                        var flexpaper_html = window[instance] = new FlexPaperViewer_HTML({
                            rootid 		    : viewerId,
                            Toolbar 	    : ((conf.Toolbar!=null)?conf.Toolbar:null),
                            BottomToolbar   : ((conf.BottomToolbar!=null)?conf.BottomToolbar:null),
                            instanceid 	: instance,
                            document: {
                                SWFFile 				: conf.SwfFile,
                                IMGFiles 				: conf.IMGFiles,
                                ThumbIMGFiles           : conf.ThumbIMGFiles,
                                JSONFile 				: conf.JSONFile,
                                PDFFile 				: conf.PdfFile,
                                Scale 					: conf.Scale,
                                FitPageOnLoad 			: conf.FitPageOnLoad,
                                FitWidthOnLoad 			: conf.FitWidthOnLoad,
                                FullScreenAsMaxWindow   : conf.FullScreenAsMaxWindow,
                                MinZoomSize 			: conf.MinZoomSize,
                                MaxZoomSize 			: conf.MaxZoomSize,
                                SearchMatchAll 			: conf.SearchMatchAll,
                                InitViewMode 			: conf.InitViewMode,
                                DisableOverflow         : conf.DisableOverflow,
                                DisplayRange            : conf.DisplayRange,
                                TouchInitViewMode       : conf.TouchInitViewMode,
                                PreviewMode             : conf.PreviewMode,
                                MixedMode               : conf.MixedMode,
                                EnableWebGL             : conf.EnableWebGL,
                                StartAtPage 			: conf.StartAtPage,
                                RenderingOrder 			: conf.RenderingOrder,
                                useCustomJSONFormat 	: conf.useCustomJSONFormat,
                                JSONPageDataFormat 		: conf.JSONPageDataFormat,
                                JSONDataType 			: conf.JSONDataType,
                                ZoomTime     			: conf.ZoomTime,
                                ZoomTransition          : conf.ZoomTransition,
                                ZoomInterval 			: conf.ZoomInterval,
                                ViewModeToolsVisible 	: conf.ViewModeToolsVisible,
                                ZoomToolsVisible 		: conf.ZoomToolsVisible,
                                NavToolsVisible 		: conf.NavToolsVisible,
                                CursorToolsVisible 		: conf.CursorToolsVisible,
                                SearchToolsVisible 		: conf.SearchToolsVisible,
                                AnnotationToolsVisible  : conf.AnnotationToolsVisible,
                                StickyTools 			: conf.StickyTools,
                                AutoDetectLinks         : conf.AutoDetectLinks,
                                PrintPaperAsBitmap 		: conf.PrintPaperAsBitmap,
                                AutoAdjustPrintSize 	: conf.AutoAdjustPrintSize,
                                EnableSearchAbstracts   : conf.EnableSearchAbstracts,
                                EnableCornerDragging	: conf.EnableCornerDragging,
                                UIConfig                : conf.UIConfig,
                                BackgroundColor			: conf.BackgroundColor, // FlexPaper Zine parameter
                                PanelColor				: conf.PanelColor, // FlexPaper Zine parameter

                                localeChain 			: conf.localeChain
                            },
                            renderer 			: pageRenderer,
                            key 				: conf.key,
                            jsDirectory 		: conf.jsDirectory,
                            localeDirectory 	: conf.localeDirectory,
                            cssDirectory 		: conf.cssDirectory,
                            docSizeQueryService : conf.DocSizeQueryService,
                            UserCollaboration   : conf.UserCollaboration,
                            CurrentUser         : conf.CurrentUser
                        });

                        flexpaper_html.initialize();
                        flexpaper_html.bindEvents();

                        flexpaper_html['load'] = flexpaper_html.loadFromUrl;
                        flexpaper_html['loadDoc'] = flexpaper_html.loadDoc;
                        flexpaper_html['fitWidth'] = flexpaper_html.fitwidth;
                        flexpaper_html['fitHeight'] = flexpaper_html.fitheight;
                        flexpaper_html['gotoPage'] = flexpaper_html.gotoPage;
                        flexpaper_html['getCurrPage'] = flexpaper_html.getCurrPage;
                        flexpaper_html['getTotalPages'] = flexpaper_html.getTotalPages;
                        flexpaper_html['nextPage'] = flexpaper_html.next;
                        flexpaper_html['prevPage'] = flexpaper_html.previous;
                        flexpaper_html['setZoom'] = flexpaper_html.Zoom;
                        flexpaper_html['Zoom'] = flexpaper_html.Zoom;
                        flexpaper_html['ZoomIn'] = flexpaper_html.ZoomIn;
                        flexpaper_html['ZoomOut'] = flexpaper_html.ZoomOut;
                        flexpaper_html['openFullScreen'] = flexpaper_html.openFullScreen;
                        flexpaper_html['sliderChange'] = flexpaper_html.sliderChange;
                        flexpaper_html['searchText'] = flexpaper_html.searchText;
                        flexpaper_html['resize'] = flexpaper_html.resize;
                        flexpaper_html['rotate'] = flexpaper_html.rotate;
                        flexpaper_html['addLink'] = flexpaper_html.addLink;
                        flexpaper_html['addImage'] = flexpaper_html.addImage;
                        flexpaper_html['addVideo'] = flexpaper_html.addVideo;

                        //flexpaper_html['nextSearchMatch'] = flexpaper_html.nextSearchMatch; //TBD
                        //flexpaper_html['prevSearchMatch'] = flexpaper_html.nextSearchMatch; //TBD
                        flexpaper_html['switchMode'] = flexpaper_html.switchMode;
                        flexpaper_html['printPaper'] = flexpaper_html.printPaper;
                        flexpaper_html['highlight'] = flexpaper_html.highlight;
                        flexpaper_html['getCurrentRenderingMode'] = flexpaper_html.getCurrentRenderingMode;
                        //flexpaper_html['postSnapshot'] = flexpaper_html.postSnapshot; //TBD
                        flexpaper_html['setCurrentCursor'] = flexpaper_html.setCurrentCursor;
                        flexpaper_html['showFullScreen'] = flexpaper_html.openFullScreen;

                        pageRenderer.initialize(function(){
                            flexpaper_html.document.numPages = pageRenderer.getNumPages();
                            flexpaper_html.document.dimensions = pageRenderer.getDimensions();
                            flexpaper_html.show();
                            window[instance] = flexpaper_html;
                        },{
                            StartAtPage : conf.StartAtPage,
                            MixedMode : conf.MixedMode
                        });
                    }));
				});
			}else{
				// fail #2.1 custom content inside container
				if (!root.innerHTML.replace(/\s/g, '')) {
					var pageHost = ((document.location.protocol == "https:") ? "https://" :	"http://");
					
					root.innerHTML = 
						"<h2>Your browser is not compatible with FlexPaper</h2>" + 
						"<h3>Upgrade to a newer browser or download Adobe Flash Player 10 or higher.</h3>" + 
						"<p>Click on the icon below to download the latest version of Adobe Flash" + 
						"<a href='http://www.adobe.com/go/getflashplayer'><img src='" 
											+ pageHost + "www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' /></a>";
																							
					if (root.tagName == 'A') {	
						root.onclick = function() {
							location.href = URL;
						};
					}				
				}
				
				// onFail
				if (opts.onFail) {
					var ret = opts.onFail.call(this);
					if (typeof ret == 'string') { root.innerHTML = ret; }	
				}		
			}	
		}

        // bind a listener to the hash change event and change page if the user changes the page hash parameter
        jQuery(window).bind('hashchange',(function() {
            var page = FLEXPAPER.getLocationHashParameter('page');
            $FlexPaper(viewerId).gotoPage(page);
        }));
		
		// http://flowplayer.org/forum/8/18186#post-18593
		if (IE) {
			window[opts.id] = document.getElementById(opts.id);
		}

		// API methods for callback
		extend(this, {

			getRoot: function() {
				return root;
			},

			getOptions: function() {
				return opts;
			},


			getConf: function() {
				return conf;
			},

			getApi: function() {
				return root.firstChild;
			}

		});
	}

	// setup jquery support
	if (JQUERY) {
		jQuery.fn.flashembed = function(opts, conf) {
			return this.each(function() { 
				jQuery(this).data("flashembed", flashembed(this, opts, conf));
			});
		};

        jQuery.fn.FlexPaperViewer = function(args){
            jQuery('#'+this.attr('id')).empty();

            var embed = new FlexPaperViewerEmbedding(this.attr('id'),args);
            this.element = jQuery('#'+embed.id);
            return this.element;
        };
	}else{
        throw new Error("jQuery missing!");
    }
})();
function getIEversion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
    }
    return rv;
}


// Initializing PDFJS global object here, it case if we need to change/disable
// some PDF.js features, e.g. range requests
if (typeof PDFJS === 'undefined') {
  (typeof window !== 'undefined' ? window : this).PDFJS = {};
}

window.unsupportedPDFJSieversion = getIEversion()>0 && getIEversion()<9;

// Checking if the typed arrays are supported
// Support: iOS<6.0 (subarray), IE<10, Android<4.0
(function checkTypedArrayCompatibility() {
  if (typeof Uint8Array !== 'undefined') {
    // Support: iOS<6.0
    if (typeof Uint8Array.prototype.subarray === 'undefined') {
        Uint8Array.prototype.subarray = function subarray(start, end) {
          return new Uint8Array(this.slice(start, end));
        };
        Float32Array.prototype.subarray = function subarray(start, end) {
          return new Float32Array(this.slice(start, end));
        };
    }

    // Support: Android<4.1
    if (typeof Float64Array === 'undefined') {
      window.Float64Array = Float32Array;
    }
    return;
  }

  function subarray(start, end) {
    return new TypedArray(this.slice(start, end));
  }

  function setArrayOffset(array, offset) {
    if (arguments.length < 2) {
      offset = 0;
    }
    for (var i = 0, n = array.length; i < n; ++i, ++offset) {
      this[offset] = array[i] & 0xFF;
    }
  }

  function TypedArray(arg1) {
    var result, i, n;
    if (typeof arg1 === 'number') {
      result = [];
      for (i = 0; i < arg1; ++i) {
        result[i] = 0;
      }
    } else if ('slice' in arg1) {
      result = arg1.slice(0);
    } else {
      result = [];
      for (i = 0, n = arg1.length; i < n; ++i) {
        result[i] = arg1[i];
      }
    }

    result.subarray = subarray;
    result.buffer = result;
    result.byteLength = result.length;
    result.set = setArrayOffset;

    if (typeof arg1 === 'object' && arg1.buffer) {
      result.buffer = arg1.buffer;
    }
    return result;
  }

  window.Uint8Array = TypedArray;
  window.Int8Array = TypedArray;

  // we don't need support for set, byteLength for 32-bit array
  // so we can use the TypedArray as well
  window.Uint32Array = TypedArray;
  window.Int32Array = TypedArray;
  window.Uint16Array = TypedArray;
  window.Float32Array = TypedArray;
  window.Float64Array = TypedArray;
})();

// URL = URL || webkitURL
// Support: Safari<7, Android 4.2+
(function normalizeURLObject() {
  if (!window.URL) {
    window.URL = window.webkitURL;
  }
})();

// Object.defineProperty()?
// Support: Android<4.0, Safari<5.1
(function checkObjectDefinePropertyCompatibility() {
  if(window.unsupportedPDFJSieversion){return;}

  if (typeof Object.defineProperty !== 'undefined') {
    var definePropertyPossible = true;
    try {
      // some browsers (e.g. safari) cannot use defineProperty() on DOM objects
      // and thus the native version is not sufficient
      Object.defineProperty(new Image(), 'id', { value: 'test' });
      // ... another test for android gb browser for non-DOM objects
//      var Test = function Test() {};
//      Test.prototype = { get id() { } };
//      Object.defineProperty(new Test(), 'id',
//        { value: '', configurable: true, enumerable: true, writable: false });
        eval("var Test = function Test() {};Test.prototype = { get id() { } };Object.defineProperty(new Test(), 'id',{ value: '', configurable: true, enumerable: true, writable: false });");
    } catch (e) {
      definePropertyPossible = false;
    }
    if (definePropertyPossible) {
      return;
    }
  }

  Object.defineProperty = function objectDefineProperty(obj, name, def) {
    delete obj[name];
    if ('get' in def) {
      obj.__defineGetter__(name, def['get']);
    }
    if ('set' in def) {
      obj.__defineSetter__(name, def['set']);
    }
    if ('value' in def) {
      obj.__defineSetter__(name, function objectDefinePropertySetter(value) {
        this.__defineGetter__(name, function objectDefinePropertyGetter() {
          return value;
        });
        return value;
      });
      obj[name] = def.value;
    }
  };
})();


// No XMLHttpRequest#response?
// Support: IE<11, Android <4.0
(function checkXMLHttpRequestResponseCompatibility() {
  if(window.unsupportedPDFJSieversion){return;}
  var xhrPrototype = XMLHttpRequest.prototype;
  var xhr = new XMLHttpRequest();
  if (!('overrideMimeType' in xhr)) {
    // IE10 might have response, but not overrideMimeType
    // Support: IE10
    Object.defineProperty(xhrPrototype, 'overrideMimeType', {
      value: function xmlHttpRequestOverrideMimeType(mimeType) {}
    });
  }
  if ('responseType' in xhr) {
    return;
  }

  // The worker will be using XHR, so we can save time and disable worker.
  PDFJS.disableWorker = true;

  Object.defineProperty(xhrPrototype, 'responseType', {
    get: function xmlHttpRequestGetResponseType() {
      return this._responseType || 'text';
    },
    set: function xmlHttpRequestSetResponseType(value) {
      if (value === 'text' || value === 'arraybuffer') {
        this._responseType = value;
        if (value === 'arraybuffer' &&
            typeof this.overrideMimeType === 'function') {
          this.overrideMimeType('text/plain; charset=x-user-defined');
        }
      }
    }
  });

  // Support: IE9
  if (typeof VBArray !== 'undefined') {
    Object.defineProperty(xhrPrototype, 'response', {
      get: function xmlHttpRequestResponseGet() {
        if (this.responseType === 'arraybuffer') {
          return new Uint8Array(new VBArray(this.responseBody).toArray());
        } else {
          return this.responseText;
        }
      }
    });
    return;
  }

  Object.defineProperty(xhrPrototype, 'response', {
    get: function xmlHttpRequestResponseGet() {
      if (this.responseType !== 'arraybuffer') {
        return this.responseText;
      }
      var text = this.responseText;
      var i, n = text.length;
      var result = new Uint8Array(n);
      for (i = 0; i < n; ++i) {
        result[i] = text.charCodeAt(i) & 0xFF;
      }
      return result.buffer;
    }
  });
})();

// window.btoa (base64 encode function) ?
// Support: IE<10
(function checkWindowBtoaCompatibility() {
  if ('btoa' in window) {
    return;
  }

  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  window.btoa = function windowBtoa(chars) {
    var buffer = '';
    var i, n;
    for (i = 0, n = chars.length; i < n; i += 3) {
      var b1 = chars.charCodeAt(i) & 0xFF;
      var b2 = chars.charCodeAt(i + 1) & 0xFF;
      var b3 = chars.charCodeAt(i + 2) & 0xFF;
      var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
      var d3 = i + 1 < n ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
      var d4 = i + 2 < n ? (b3 & 0x3F) : 64;
      buffer += (digits.charAt(d1) + digits.charAt(d2) +
                 digits.charAt(d3) + digits.charAt(d4));
    }
    return buffer;
  };
})();

// window.atob (base64 encode function)?
// Support: IE<10
(function checkWindowAtobCompatibility() {
  if ('atob' in window) {
    return;
  }

  // https://github.com/davidchambers/Base64.js
  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  window.atob = function (input) {
    input = input.replace(/=+$/, '');
    if (input.length % 4 === 1) {
      throw new Error('bad atob input');
    }
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table?
      // initialize bit storage and add its ascii value
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = digits.indexOf(buffer);
    }
    return output;
  };
})();

// Function.prototype.bind?
// Support: Android<4.0, iOS<6.0
(function checkFunctionPrototypeBindCompatibility() {
  if (typeof Function.prototype.bind !== 'undefined') {
    return;
  }

  Function.prototype.bind = function functionPrototypeBind(obj) {
    var fn = this, headArgs = Array.prototype.slice.call(arguments, 1);
    var bound = function functionPrototypeBindBound() {
      var args = headArgs.concat(Array.prototype.slice.call(arguments));
      return fn.apply(obj, args);
    };
    return bound;
  };
})();

// HTMLElement dataset property
// Support: IE<11, Safari<5.1, Android<4.0
(function checkDatasetProperty() {
  if(window.unsupportedPDFJSieversion){return;}

  var div = document.createElement('div');
  if ('dataset' in div) {
    return; // dataset property exists
  }

  Object.defineProperty(HTMLElement.prototype, 'dataset', {
    get: function() {
      if (this._dataset) {
        return this._dataset;
      }

      var dataset = {};
      for (var j = 0, jj = this.attributes.length; j < jj; j++) {
        var attribute = this.attributes[j];
        if (attribute.name.substring(0, 5) !== 'data-') {
          continue;
        }
        var key = attribute.name.substring(5).replace(/\-([a-z])/g,
          function(all, ch) {
            return ch.toUpperCase();
          });
        dataset[key] = attribute.value;
      }

      Object.defineProperty(this, '_dataset', {
        value: dataset,
        writable: false,
        enumerable: false
      });
      return dataset;
    },
    enumerable: true
  });
})();

// HTMLElement classList property
// Support: IE<10, Android<4.0, iOS<5.0
(function checkClassListProperty() {
  if(window.unsupportedPDFJSieversion){return;}

  var div = document.createElement('div');
  if ('classList' in div) {
    return; // classList property exists
  }

  function changeList(element, itemName, add, remove) {
    var s = element.className || '';
    var list = s.split(/\s+/g);
    if (list[0] === '') {
      list.shift();
    }
    var index = list.indexOf(itemName);
    if (index < 0 && add) {
      list.push(itemName);
    }
    if (index >= 0 && remove) {
      list.splice(index, 1);
    }
    element.className = list.join(' ');
    return (index >= 0);
  }

  var classListPrototype = {
    add: function(name) {
      changeList(this.element, name, true, false);
    },
    contains: function(name) {
      return changeList(this.element, name, false, false);
    },
    remove: function(name) {
      changeList(this.element, name, false, true);
    },
    toggle: function(name) {
      changeList(this.element, name, true, true);
    }
  };

  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function() {
      if (this._classList) {
        return this._classList;
      }

      var classList = Object.create(classListPrototype, {
        element: {
          value: this,
          writable: false,
          enumerable: true
        }
      });
      Object.defineProperty(this, '_classList', {
        value: classList,
        writable: false,
        enumerable: false
      });
      return classList;
    },
    enumerable: true
  });
})();

// Check console compatibility
// In older IE versions the console object is not available
// unless console is open.
// Support: IE<10
(function checkConsoleCompatibility() {
  if(window.unsupportedPDFJSieversion){return;}

  if (!('console' in window)) {
    window.console = {
      log: function() {},
      error: function() {},
      warn: function() {}
    };
  } else if (!('bind' in console.log)) {
    // native functions in IE9 might not have bind
    console.log = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.log);
    console.error = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.error);
    console.warn = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.warn);
  }
})();

// Check onclick compatibility in Opera
// Support: Opera<15
(function checkOnClickCompatibility() {
  // workaround for reported Opera bug DSK-354448:
  // onclick fires on disabled buttons with opaque content
  function ignoreIfTargetDisabled(event) {
    if (isDisabled(event.target)) {
      event.stopPropagation();
    }
  }
  function isDisabled(node) {
    return node.disabled || (node.parentNode && isDisabled(node.parentNode));
  }
  if (navigator.userAgent.indexOf('Opera') !== -1) {
    // use browser detection since we cannot feature-check this bug
    document.addEventListener('click', ignoreIfTargetDisabled, true);
  }
})();

// Checks if possible to use URL.createObjectURL()
// Support: IE
(function checkOnBlobSupport() {
  // sometimes IE loosing the data created with createObjectURL(), see #3977
  if (navigator.userAgent.indexOf('Trident') >= 0) {
    PDFJS.disableCreateObjectURL = true;
  }
})();

// Checks if navigator.language is supported
(function checkNavigatorLanguage() {
  if ('language' in navigator &&
      /^[a-z]+(-[A-Z]+)?$/.test(navigator.language)) {
    return;
  }
  function formatLocale(locale) {
    var split = locale.split(/[-_]/);
    split[0] = split[0].toLowerCase();
    if (split.length > 1) {
      split[1] = split[1].toUpperCase();
    }
    return split.join('-');
  }
  var language = navigator.language || navigator.userLanguage || 'en-US';
  PDFJS.locale = formatLocale(language);
})();

(function checkRangeRequests() {
  // Safari has issues with cached range requests see:
  // https://github.com/mozilla/pdf.js/issues/3260
  // Last tested with version 6.0.4.
  // Support: Safari 6.0+
  var isSafari = Object.prototype.toString.call(
                  window.HTMLElement).indexOf('Constructor') > 0;

  // Older versions of Android (pre 3.0) has issues with range requests, see:
  // https://github.com/mozilla/pdf.js/issues/3381.
  // Make sure that we only match webkit-based Android browsers,
  // since Firefox/Fennec works as expected.
  // Support: Android<3.0
  var regex = /Android\s[0-2][^\d]/;
  var isOldAndroid = regex.test(navigator.userAgent);

  if (isSafari || isOldAndroid) {
    PDFJS.disableRange = true;
    PDFJS.disableStream = true;
  }
})();

// Check if the browser supports manipulation of the history.
// Support: IE<10, Android<4.2
(function checkHistoryManipulation() {
  // Android 2.x has so buggy pushState support that it was removed in
  // Android 3.0 and restored as late as in Android 4.2.
  // Support: Android 2.x
  if (!history.pushState || navigator.userAgent.indexOf('Android 2.') >= 0) {
    PDFJS.disableHistory = true;
  }
})();

// Support: IE<11, Chrome<21, Android<4.4, Safari<6
(function checkSetPresenceInImageData() {
  // IE < 11 will use window.CanvasPixelArray which lacks set function.
  if (window.CanvasPixelArray) {
    if (typeof window.CanvasPixelArray.prototype.set !== 'function') {
      window.CanvasPixelArray.prototype.set = function(arr) {
        for (var i = 0, ii = this.length; i < ii; i++) {
          this[i] = arr[i];
        }
      };
    }
  } else {
    // Old Chrome and Android use an inaccessible CanvasPixelArray prototype.
    // Because we cannot feature detect it, we rely on user agent parsing.
    var polyfill = false, versionMatch;
    if (navigator.userAgent.indexOf('Chrom') >= 0) {
      versionMatch = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
      // Chrome < 21 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[2]) < 21;
    } else if (navigator.userAgent.indexOf('Android') >= 0) {
      // Android < 4.4 lacks the set function.
      // Android >= 4.4 will contain Chrome in the user agent,
      // thus pass the Chrome check above and not reach this block.
      polyfill = /Android\s[0-4][^\d]/g.test(navigator.userAgent);
    } else if (navigator.userAgent.indexOf('Safari') >= 0) {
      versionMatch = navigator.userAgent.
        match(/Version\/([0-9]+)\.([0-9]+)\.([0-9]+) Safari\//);
      // Safari < 6 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[1]) < 6;
    }

    if (polyfill) {
      var contextPrototype = window.CanvasRenderingContext2D.prototype;
      contextPrototype._createImageData = contextPrototype.createImageData;
      contextPrototype.createImageData = function(w, h) {
        var imageData = this._createImageData(w, h);
        imageData.data.set = function(arr) {
          for (var i = 0, ii = this.length; i < ii; i++) {
            this[i] = arr[i];
          }
        };
        return imageData;
      };
    }
  }
})();

// Support: IE<10, Android<4.0, iOS
(function checkRequestAnimationFrame() {
  function fakeRequestAnimationFrame(callback) {
    window.setTimeout(callback, 20);
  }

  var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  if (isIOS) {
    // requestAnimationFrame on iOS is broken, replacing with fake one.
    window.requestAnimationFrame = fakeRequestAnimationFrame;
    return;
  }
  if ('requestAnimationFrame' in window) {
    return;
  }
  window.requestAnimationFrame =
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    fakeRequestAnimationFrame;
})();

(function checkCanvasSizeLimitation() {
  var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  var isAndroid = /Android/g.test(navigator.userAgent);
  if (isIOS || isAndroid) {
    // 5MP
    PDFJS.maxCanvasPixels = 5242880;
  }
})();
(function(){var root=this;var previousUnderscore=root._;var breaker={};var ArrayProto=Array.prototype,ObjProto=Object.prototype,FuncProto=Function.prototype;var push=ArrayProto.push,slice=ArrayProto.slice,concat=ArrayProto.concat,toString=ObjProto.toString,hasOwnProperty=ObjProto.hasOwnProperty;var nativeForEach=ArrayProto.forEach,nativeMap=ArrayProto.map,nativeReduce=ArrayProto.reduce,nativeReduceRight=ArrayProto.reduceRight,nativeFilter=ArrayProto.filter,nativeEvery=ArrayProto.every,nativeSome=
ArrayProto.some,nativeIndexOf=ArrayProto.indexOf,nativeLastIndexOf=ArrayProto.lastIndexOf,nativeIsArray=Array.isArray,nativeKeys=Object.keys,nativeBind=FuncProto.bind;var _=function(obj){if(obj instanceof _)return obj;if(!(this instanceof _))return new _(obj);this._wrapped=obj};if(typeof exports!=="undefined"){if(typeof module!=="undefined"&&module.exports)exports=module.exports=_;exports._=_}else root._=_;_.VERSION="1.5.2";var each=_.each=_.forEach=function(obj,iterator,context){if(obj==null)return;
if(nativeForEach&&obj.forEach===nativeForEach)obj.forEach(iterator,context);else if(obj.length===+obj.length)for(var i=0,length=obj.length;i<length;i++){if(iterator.call(context,obj[i],i,obj)===breaker)return}else{var keys=_.keys(obj);for(var i=0,length=keys.length;i<length;i++)if(iterator.call(context,obj[keys[i]],keys[i],obj)===breaker)return}};_.map=_.collect=function(obj,iterator,context){var results=[];if(obj==null)return results;if(nativeMap&&obj.map===nativeMap)return obj.map(iterator,context);
each(obj,function(value,index,list){results.push(iterator.call(context,value,index,list))});return results};var reduceError="Reduce of empty array with no initial value";_.reduce=_.foldl=_.inject=function(obj,iterator,memo,context){var initial=arguments.length>2;if(obj==null)obj=[];if(nativeReduce&&obj.reduce===nativeReduce){if(context)iterator=_.bind(iterator,context);return initial?obj.reduce(iterator,memo):obj.reduce(iterator)}each(obj,function(value,index,list){if(!initial){memo=value;initial=
true}else memo=iterator.call(context,memo,value,index,list)});if(!initial)throw new TypeError(reduceError);return memo};_.reduceRight=_.foldr=function(obj,iterator,memo,context){var initial=arguments.length>2;if(obj==null)obj=[];if(nativeReduceRight&&obj.reduceRight===nativeReduceRight){if(context)iterator=_.bind(iterator,context);return initial?obj.reduceRight(iterator,memo):obj.reduceRight(iterator)}var length=obj.length;if(length!==+length){var keys=_.keys(obj);length=keys.length}each(obj,function(value,
index,list){index=keys?keys[--length]:--length;if(!initial){memo=obj[index];initial=true}else memo=iterator.call(context,memo,obj[index],index,list)});if(!initial)throw new TypeError(reduceError);return memo};_.find=_.detect=function(obj,iterator,context){var result;any(obj,function(value,index,list){if(iterator.call(context,value,index,list)){result=value;return true}});return result};_.filter=_.select=function(obj,iterator,context){var results=[];if(obj==null)return results;if(nativeFilter&&obj.filter===
nativeFilter)return obj.filter(iterator,context);each(obj,function(value,index,list){if(iterator.call(context,value,index,list))results.push(value)});return results};_.reject=function(obj,iterator,context){return _.filter(obj,function(value,index,list){return!iterator.call(context,value,index,list)},context)};_.every=_.all=function(obj,iterator,context){iterator||(iterator=_.identity);var result=true;if(obj==null)return result;if(nativeEvery&&obj.every===nativeEvery)return obj.every(iterator,context);
each(obj,function(value,index,list){if(!(result=result&&iterator.call(context,value,index,list)))return breaker});return!!result};var any=_.some=_.any=function(obj,iterator,context){iterator||(iterator=_.identity);var result=false;if(obj==null)return result;if(nativeSome&&obj.some===nativeSome)return obj.some(iterator,context);each(obj,function(value,index,list){if(result||(result=iterator.call(context,value,index,list)))return breaker});return!!result};_.contains=_.include=function(obj,target){if(obj==
null)return false;if(nativeIndexOf&&obj.indexOf===nativeIndexOf)return obj.indexOf(target)!=-1;return any(obj,function(value){return value===target})};_.invoke=function(obj,method){var args=slice.call(arguments,2);var isFunc=_.isFunction(method);return _.map(obj,function(value){return(isFunc?method:value[method]).apply(value,args)})};_.pluck=function(obj,key){return _.map(obj,function(value){return value[key]})};_.where=function(obj,attrs,first){if(_.isEmpty(attrs))return first?void 0:[];return _[first?
"find":"filter"](obj,function(value){for(var key in attrs)if(attrs[key]!==value[key])return false;return true})};_.findWhere=function(obj,attrs){return _.where(obj,attrs,true)};_.max=function(obj,iterator,context){if(!iterator&&_.isArray(obj)&&obj[0]===+obj[0]&&obj.length<65535)return Math.max.apply(Math,obj);if(!iterator&&_.isEmpty(obj))return-Infinity;var result={computed:-Infinity,value:-Infinity};each(obj,function(value,index,list){var computed=iterator?iterator.call(context,value,index,list):
value;computed>result.computed&&(result={value:value,computed:computed})});return result.value};_.min=function(obj,iterator,context){if(!iterator&&_.isArray(obj)&&obj[0]===+obj[0]&&obj.length<65535)return Math.min.apply(Math,obj);if(!iterator&&_.isEmpty(obj))return Infinity;var result={computed:Infinity,value:Infinity};each(obj,function(value,index,list){var computed=iterator?iterator.call(context,value,index,list):value;computed<result.computed&&(result={value:value,computed:computed})});return result.value};
_.shuffle=function(obj){var rand;var index=0;var shuffled=[];each(obj,function(value){rand=_.random(index++);shuffled[index-1]=shuffled[rand];shuffled[rand]=value});return shuffled};_.sample=function(obj,n,guard){if(arguments.length<2||guard)return obj[_.random(obj.length-1)];return _.shuffle(obj).slice(0,Math.max(0,n))};var lookupIterator=function(value){return _.isFunction(value)?value:function(obj){return obj[value]}};_.sortBy=function(obj,value,context){var iterator=lookupIterator(value);return _.pluck(_.map(obj,
function(value,index,list){return{value:value,index:index,criteria:iterator.call(context,value,index,list)}}).sort(function(left,right){var a=left.criteria;var b=right.criteria;if(a!==b){if(a>b||a===void 0)return 1;if(a<b||b===void 0)return-1}return left.index-right.index}),"value")};var group=function(behavior){return function(obj,value,context){var result={};var iterator=value==null?_.identity:lookupIterator(value);each(obj,function(value,index){var key=iterator.call(context,value,index,obj);behavior(result,
key,value)});return result}};_.groupBy=group(function(result,key,value){(_.has(result,key)?result[key]:result[key]=[]).push(value)});_.indexBy=group(function(result,key,value){result[key]=value});_.countBy=group(function(result,key){_.has(result,key)?result[key]++:result[key]=1});_.sortedIndex=function(array,obj,iterator,context){iterator=iterator==null?_.identity:lookupIterator(iterator);var value=iterator.call(context,obj);var low=0,high=array.length;while(low<high){var mid=low+high>>>1;iterator.call(context,
array[mid])<value?low=mid+1:high=mid}return low};_.toArray=function(obj){if(!obj)return[];if(_.isArray(obj))return slice.call(obj);if(obj.length===+obj.length)return _.map(obj,_.identity);return _.values(obj)};_.size=function(obj){if(obj==null)return 0;return obj.length===+obj.length?obj.length:_.keys(obj).length};_.first=_.head=_.take=function(array,n,guard){if(array==null)return void 0;return n==null||guard?array[0]:slice.call(array,0,n)};_.initial=function(array,n,guard){return slice.call(array,
0,array.length-(n==null||guard?1:n))};_.last=function(array,n,guard){if(array==null)return void 0;if(n==null||guard)return array[array.length-1];else return slice.call(array,Math.max(array.length-n,0))};_.rest=_.tail=_.drop=function(array,n,guard){return slice.call(array,n==null||guard?1:n)};_.compact=function(array){return _.filter(array,_.identity)};var flatten=function(input,shallow,output){if(shallow&&_.every(input,_.isArray))return concat.apply(output,input);each(input,function(value){if(_.isArray(value)||
_.isArguments(value))shallow?push.apply(output,value):flatten(value,shallow,output);else output.push(value)});return output};_.flatten=function(array,shallow){return flatten(array,shallow,[])};_.without=function(array){return _.difference(array,slice.call(arguments,1))};_.uniq=_.unique=function(array,isSorted,iterator,context){if(_.isFunction(isSorted)){context=iterator;iterator=isSorted;isSorted=false}var initial=iterator?_.map(array,iterator,context):array;var results=[];var seen=[];each(initial,
function(value,index){if(isSorted?!index||seen[seen.length-1]!==value:!_.contains(seen,value)){seen.push(value);results.push(array[index])}});return results};_.union=function(){return _.uniq(_.flatten(arguments,true))};_.intersection=function(array){var rest=slice.call(arguments,1);return _.filter(_.uniq(array),function(item){return _.every(rest,function(other){return _.indexOf(other,item)>=0})})};_.difference=function(array){var rest=concat.apply(ArrayProto,slice.call(arguments,1));return _.filter(array,
function(value){return!_.contains(rest,value)})};_.zip=function(){var length=_.max(_.pluck(arguments,"length").concat(0));var results=new Array(length);for(var i=0;i<length;i++)results[i]=_.pluck(arguments,""+i);return results};_.object=function(list,values){if(list==null)return{};var result={};for(var i=0,length=list.length;i<length;i++)if(values)result[list[i]]=values[i];else result[list[i][0]]=list[i][1];return result};_.indexOf=function(array,item,isSorted){if(array==null)return-1;var i=0,length=
array.length;if(isSorted)if(typeof isSorted=="number")i=isSorted<0?Math.max(0,length+isSorted):isSorted;else{i=_.sortedIndex(array,item);return array[i]===item?i:-1}if(nativeIndexOf&&array.indexOf===nativeIndexOf)return array.indexOf(item,isSorted);for(;i<length;i++)if(array[i]===item)return i;return-1};_.lastIndexOf=function(array,item,from){if(array==null)return-1;var hasIndex=from!=null;if(nativeLastIndexOf&&array.lastIndexOf===nativeLastIndexOf)return hasIndex?array.lastIndexOf(item,from):array.lastIndexOf(item);
var i=hasIndex?from:array.length;while(i--)if(array[i]===item)return i;return-1};_.range=function(start,stop,step){if(arguments.length<=1){stop=start||0;start=0}step=arguments[2]||1;var length=Math.max(Math.ceil((stop-start)/step),0);var idx=0;var range=new Array(length);while(idx<length){range[idx++]=start;start+=step}return range};var ctor=function(){};_.bind=function(func,context){var args,bound;if(nativeBind&&func.bind===nativeBind)return nativeBind.apply(func,slice.call(arguments,1));if(!_.isFunction(func))throw new TypeError;
args=slice.call(arguments,2);return bound=function(){if(!(this instanceof bound))return func.apply(context,args.concat(slice.call(arguments)));ctor.prototype=func.prototype;var self=new ctor;ctor.prototype=null;var result=func.apply(self,args.concat(slice.call(arguments)));if(Object(result)===result)return result;return self}};_.partial=function(func){var args=slice.call(arguments,1);return function(){return func.apply(this,args.concat(slice.call(arguments)))}};_.bindAll=function(obj){var funcs=slice.call(arguments,
1);if(funcs.length===0)throw new Error("bindAll must be passed function names");each(funcs,function(f){obj[f]=_.bind(obj[f],obj)});return obj};_.memoize=function(func,hasher){var memo={};hasher||(hasher=_.identity);return function(){var key=hasher.apply(this,arguments);return _.has(memo,key)?memo[key]:memo[key]=func.apply(this,arguments)}};_.delay=function(func,wait){var args=slice.call(arguments,2);return setTimeout(function(){return func.apply(null,args)},wait)};_.defer=function(func){return _.delay.apply(_,
[func,1].concat(slice.call(arguments,1)))};_.throttle=function(func,wait,options){var context,args,result;var timeout=null;var previous=0;options||(options={});var later=function(){previous=options.leading===false?0:new Date;timeout=null;result=func.apply(context,args)};return function(){var now=new Date;if(!previous&&options.leading===false)previous=now;var remaining=wait-(now-previous);context=this;args=arguments;if(remaining<=0){clearTimeout(timeout);timeout=null;previous=now;result=func.apply(context,
args)}else if(!timeout&&options.trailing!==false)timeout=setTimeout(later,remaining);return result}};_.debounce=function(func,wait,immediate){var timeout,args,context,timestamp,result;return function(){context=this;args=arguments;timestamp=new Date;var later=function(){var last=new Date-timestamp;if(last<wait)timeout=setTimeout(later,wait-last);else{timeout=null;if(!immediate)result=func.apply(context,args)}};var callNow=immediate&&!timeout;if(!timeout)timeout=setTimeout(later,wait);if(callNow)result=
func.apply(context,args);return result}};_.once=function(func){var ran=false,memo;return function(){if(ran)return memo;ran=true;memo=func.apply(this,arguments);func=null;return memo}};_.wrap=function(func,wrapper){return function(){var args=[func];push.apply(args,arguments);return wrapper.apply(this,args)}};_.compose=function(){var funcs=arguments;return function(){var args=arguments;for(var i=funcs.length-1;i>=0;i--)args=[funcs[i].apply(this,args)];return args[0]}};_.after=function(times,func){return function(){if(--times<
1)return func.apply(this,arguments)}};_.keys=nativeKeys||function(obj){if(obj!==Object(obj))throw new TypeError("Invalid object");var keys=[];for(var key in obj)if(_.has(obj,key))keys.push(key);return keys};_.values=function(obj){var keys=_.keys(obj);var length=keys.length;var values=new Array(length);for(var i=0;i<length;i++)values[i]=obj[keys[i]];return values};_.pairs=function(obj){var keys=_.keys(obj);var length=keys.length;var pairs=new Array(length);for(var i=0;i<length;i++)pairs[i]=[keys[i],
obj[keys[i]]];return pairs};_.invert=function(obj){var result={};var keys=_.keys(obj);for(var i=0,length=keys.length;i<length;i++)result[obj[keys[i]]]=keys[i];return result};_.functions=_.methods=function(obj){var names=[];for(var key in obj)if(_.isFunction(obj[key]))names.push(key);return names.sort()};_.extend=function(obj){each(slice.call(arguments,1),function(source){if(source)for(var prop in source)obj[prop]=source[prop]});return obj};_.pick=function(obj){var copy={};var keys=concat.apply(ArrayProto,
slice.call(arguments,1));each(keys,function(key){if(key in obj)copy[key]=obj[key]});return copy};_.omit=function(obj){var copy={};var keys=concat.apply(ArrayProto,slice.call(arguments,1));for(var key in obj)if(!_.contains(keys,key))copy[key]=obj[key];return copy};_.defaults=function(obj){each(slice.call(arguments,1),function(source){if(source)for(var prop in source)if(obj[prop]===void 0)obj[prop]=source[prop]});return obj};_.clone=function(obj){if(!_.isObject(obj))return obj;return _.isArray(obj)?
obj.slice():_.extend({},obj)};_.tap=function(obj,interceptor){interceptor(obj);return obj};var eq=function(a,b,aStack,bStack){if(a===b)return a!==0||1/a==1/b;if(a==null||b==null)return a===b;if(a instanceof _)a=a._wrapped;if(b instanceof _)b=b._wrapped;var className=toString.call(a);if(className!=toString.call(b))return false;switch(className){case "[object String]":return a==String(b);case "[object Number]":return a!=+a?b!=+b:a==0?1/a==1/b:a==+b;case "[object Date]":case "[object Boolean]":return+a==
+b;case "[object RegExp]":return a.source==b.source&&a.global==b.global&&a.multiline==b.multiline&&a.ignoreCase==b.ignoreCase}if(typeof a!="object"||typeof b!="object")return false;var length=aStack.length;while(length--)if(aStack[length]==a)return bStack[length]==b;var aCtor=a.constructor,bCtor=b.constructor;if(aCtor!==bCtor&&!(_.isFunction(aCtor)&&aCtor instanceof aCtor&&_.isFunction(bCtor)&&bCtor instanceof bCtor))return false;aStack.push(a);bStack.push(b);var size=0,result=true;if(className==
"[object Array]"){size=a.length;result=size==b.length;if(result)while(size--)if(!(result=eq(a[size],b[size],aStack,bStack)))break}else{for(var key in a)if(_.has(a,key)){size++;if(!(result=_.has(b,key)&&eq(a[key],b[key],aStack,bStack)))break}if(result){for(key in b)if(_.has(b,key)&&!size--)break;result=!size}}aStack.pop();bStack.pop();return result};_.isEqual=function(a,b){return eq(a,b,[],[])};_.isEmpty=function(obj){if(obj==null)return true;if(_.isArray(obj)||_.isString(obj))return obj.length===
0;for(var key in obj)if(_.has(obj,key))return false;return true};_.isElement=function(obj){return!!(obj&&obj.nodeType===1)};_.isArray=nativeIsArray||function(obj){return toString.call(obj)=="[object Array]"};_.isObject=function(obj){return obj===Object(obj)};each(["Arguments","Function","String","Number","Date","RegExp"],function(name){_["is"+name]=function(obj){return toString.call(obj)=="[object "+name+"]"}});if(!_.isArguments(arguments))_.isArguments=function(obj){return!!(obj&&_.has(obj,"callee"))};
if(typeof/./!=="function")_.isFunction=function(obj){return typeof obj==="function"};_.isFinite=function(obj){return isFinite(obj)&&!isNaN(parseFloat(obj))};_.isNaN=function(obj){return _.isNumber(obj)&&obj!=+obj};_.isBoolean=function(obj){return obj===true||obj===false||toString.call(obj)=="[object Boolean]"};_.isNull=function(obj){return obj===null};_.isUndefined=function(obj){return obj===void 0};_.has=function(obj,key){return hasOwnProperty.call(obj,key)};_.noConflict=function(){root._=previousUnderscore;
return this};_.identity=function(value){return value};_.times=function(n,iterator,context){var accum=Array(Math.max(0,n));for(var i=0;i<n;i++)accum[i]=iterator.call(context,i);return accum};_.random=function(min,max){if(max==null){max=min;min=0}return min+Math.floor(Math.random()*(max-min+1))};var entityMap={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};entityMap.unescape=_.invert(entityMap.escape);var entityRegexes={escape:new RegExp("["+_.keys(entityMap.escape).join("")+
"]","g"),unescape:new RegExp("("+_.keys(entityMap.unescape).join("|")+")","g")};_.each(["escape","unescape"],function(method){_[method]=function(string){if(string==null)return"";return(""+string).replace(entityRegexes[method],function(match){return entityMap[method][match]})}});_.result=function(object,property){if(object==null)return void 0;var value=object[property];return _.isFunction(value)?value.call(object):value};_.mixin=function(obj){each(_.functions(obj),function(name){var func=_[name]=obj[name];
_.prototype[name]=function(){var args=[this._wrapped];push.apply(args,arguments);return result.call(this,func.apply(_,args))}})};var idCounter=0;_.uniqueId=function(prefix){var id=++idCounter+"";return prefix?prefix+id:id};_.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var noMatch=/(.)^/;var escapes={"'":"'","\\":"\\","\r":"r","\n":"n","\t":"t","\u2028":"u2028","\u2029":"u2029"};var escaper=/\\|'|\r|\n|\t|\u2028|\u2029/g;_.template=function(text,
data,settings){var render;settings=_.defaults({},settings,_.templateSettings);var matcher=new RegExp([(settings.escape||noMatch).source,(settings.interpolate||noMatch).source,(settings.evaluate||noMatch).source].join("|")+"|$","g");var index=0;var source="__p+='";text.replace(matcher,function(match,escape,interpolate,evaluate,offset){source+=text.slice(index,offset).replace(escaper,function(match){return"\\"+escapes[match]});if(escape)source+="'+\n((__t=("+escape+"))==null?'':_.escape(__t))+\n'";
if(interpolate)source+="'+\n((__t=("+interpolate+"))==null?'':__t)+\n'";if(evaluate)source+="';\n"+evaluate+"\n__p+='";index=offset+match.length;return match});source+="';\n";if(!settings.variable)source="with(obj||{}){\n"+source+"}\n";source="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+source+"return __p;\n";try{render=new Function(settings.variable||"obj","_",source)}catch(e){e.source=source;throw e;}if(data)return render(data,_);var template=function(data){return render.call(this,
data,_)};template.source="function("+(settings.variable||"obj")+"){\n"+source+"}";return template};_.chain=function(obj){return _(obj).chain()};var result=function(obj){return this._chain?_(obj).chain():obj};_.mixin(_);each(["pop","push","reverse","shift","sort","splice","unshift"],function(name){var method=ArrayProto[name];_.prototype[name]=function(){var obj=this._wrapped;method.apply(obj,arguments);if((name=="shift"||name=="splice")&&obj.length===0)delete obj[0];return result.call(this,obj)}});
each(["concat","join","slice"],function(name){var method=ArrayProto[name];_.prototype[name]=function(){return result.call(this,method.apply(this._wrapped,arguments))}});_.extend(_.prototype,{chain:function(){this._chain=true;return this},value:function(){return this._wrapped}})}).call(this);
(function(){if(typeof exports!=="undefined"){var underscore=require("underscore");underscore.extend(exports,declare(underscore))}else if(typeof define!=="undefined")define(["underscore"],declare);else window.ring=declare(_);function declare(_){var ring={};function RingObject(){}ring.Object=RingObject;_.extend(ring.Object,{__mro__:[ring.Object],__properties__:{__ringConstructor__:function(){}},__classId__:1,__parents__:[],__classIndex__:{1:ring.Object}});_.extend(ring.Object.prototype,{__ringConstructor__:ring.Object.__properties__.__ringConstructor__});
var objectCreate=function(o){function CreatedObject(){}CreatedObject.prototype=o;var tmp=new CreatedObject;tmp.__proto__=o;return tmp};ring.__objectCreate=objectCreate;var classCounter=3;var fnTest=/xyz/.test(function(){xyz()})?/\$super\b/:/.*/;ring.create=function(){var args=_.toArray(arguments);args.reverse();var props=args[0];var parents=args.length>=2?args[1]:[];if(!(parents instanceof Array))parents=[parents];_.each(parents,function(el){toRingClass(el)});if(parents.length===0)parents=[ring.Object];
var cons=props.constructor!==Object?props.constructor:undefined;props=_.clone(props);delete props.constructor;if(cons)props.__ringConstructor__=cons;else{cons=props.init;delete props.init;if(cons)props.__ringConstructor__=cons}var claz=function Instance(){this.$super=null;this.__ringConstructor__.apply(this,arguments)};claz.__properties__=props;var toMerge=_.pluck(parents,"__mro__");toMerge=toMerge.concat([parents]);var __mro__=[claz].concat(mergeMro(toMerge));var prototype=Object.prototype;_.each(_.clone(__mro__).reverse(),
function(claz){var current=objectCreate(prototype);_.extend(current,claz.__properties__);_.each(_.keys(current),function(key){var p=current[key];if(typeof p!=="function"||!fnTest.test(p)||key!=="__ringConstructor__"&&claz.__ringConvertedObject__)return;current[key]=function(name,fct,supProto){return function(){var tmp=this.$super;this.$super=supProto[name];try{return fct.apply(this,arguments)}finally{this.$super=tmp}}}(key,p,prototype)});current.constructor=claz;prototype=current});var id=classCounter++;
claz.__mro__=__mro__;claz.__parents__=parents;claz.prototype=prototype;claz.__classId__=id;claz.__classIndex__={};_.each(claz.__mro__,function(c){claz.__classIndex__[c.__classId__]=c});if(claz.prototype.classInit){claz.__classInit__=claz.prototype.classInit;delete claz.prototype.classInit}_.each(_.chain(claz.__mro__).clone().reverse().value(),function(c){if(c.__classInit__){var ret=c.__classInit__(claz.prototype);if(ret!==undefined)claz.prototype=ret}});return claz};var mergeMro=function(toMerge){var __mro__=
[];var current=_.clone(toMerge);while(true){var found=false;for(var i=0;i<current.length;i++){if(current[i].length===0)continue;var currentClass=current[i][0];var isInTail=_.find(current,function(lst){return _.contains(_.rest(lst),currentClass)});if(!isInTail){found=true;__mro__.push(currentClass);current=_.map(current,function(lst){if(_.head(lst)===currentClass)return _.rest(lst);else return lst});break}}if(found)continue;if(_.all(current,function(i){return i.length===0}))return __mro__;throw new ring.ValueError("Cannot create a consistent method resolution order (MRO)");
}};var toRingClass=function(claz){if(claz.__classId__)return;var proto=!Object.getOwnPropertyNames?claz.prototype:function(){var keys={};(function crawl(p){if(p===Object.prototype)return;_.extend(keys,_.chain(Object.getOwnPropertyNames(p)).map(function(el){return[el,true]}).object().value());crawl(Object.getPrototypeOf(p))})(claz.prototype);return _.object(_.map(_.keys(keys),function(k){return[k,claz.prototype[k]]}))}();proto=_.chain(proto).map(function(v,k){return[k,v]}).filter(function(el){return el[0]!==
"constructor"&&el[0]!=="__proto__"}).object().value();var id=classCounter++;_.extend(claz,{__mro__:[claz,ring.Object],__properties__:_.extend({},proto,{__ringConstructor__:function(){this.$super.apply(this,arguments);var tmp=this.$super;this.$super=null;try{claz.apply(this,arguments)}finally{this.$super=tmp}}}),__classId__:id,__parents__:[ring.Object],__classIndex__:{1:ring.Object},__ringConvertedObject__:true});claz.__classIndex__[id]=claz};ring.instance=function(obj,type){if(typeof obj==="object"&&
obj.constructor&&obj.constructor.__classIndex__&&typeof type==="function"&&typeof type.__classId__==="number")return obj.constructor.__classIndex__[type.__classId__]!==undefined;if(typeof type==="string")return typeof obj===type;return obj instanceof type};ring.Error=ring.create({name:"ring.Error",defaultMessage:"",constructor:function(message){this.message=message||this.defaultMessage},classInit:function(prototype){var protos=[];var gather=function(proto){if(!proto)return;protos.push(proto);gather(proto.__proto__)};
gather(prototype);var current=new Error;_.each(_.clone(protos).reverse(),function(proto){var tmp=objectCreate(current);_.each(proto,function(v,k){if(k!=="__proto__")tmp[k]=v});current=tmp});return current}});ring.ValueError=ring.create([ring.Error],{name:"ring.ValueError"});ring.getSuper=function(currentClass,obj,attributeName){var pos;var __mro__=obj.constructor.__mro__;for(var i=0;i<__mro__.length;i++)if(__mro__[i]===currentClass){pos=i;break}if(pos===undefined)throw new ring.ValueError("Class not found in instance's method resolution order.");
var find=function(proto,counter){if(counter===0)return proto;return find(proto.__proto__,counter-1)};var proto=find(obj.constructor.prototype,pos+1);var att;if(attributeName!=="constructor"&&attributeName!=="init")att=proto[attributeName];else att=proto.__ringConstructor__;if(ring.instance(att,"function"))return _.bind(att,obj);else return att};return ring}})();
