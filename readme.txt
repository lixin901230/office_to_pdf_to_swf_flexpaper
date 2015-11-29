

I、模拟百度文库在线文档中显示功能：

	1、实现方案：
		方案一：Java利用OpenOffice将word等office文档转换成PDF文档，再使用SwfTools将PDF文件转为flash格式的swf文件，最后使用Flexpaper在线展示该swf文件
		方案二：还可以使用print2Flash + jacob进行文档转换
		注意：本demo只对OpenOffice文档转换今夕演示

	2、本示例通过测试的环境及软件版本：
		1）、环境：windows 7
			①、OpenOffice：	Apache_OpenOffice_4.1.1_Win_x86_install_en-US.exe
							Apache_OpenOffice_4.1.1_Win_x86_langpack_zh-CN.exe（中文语言包）
			②、SWFTools：		swftools-2013-04-09-1007.exe
			
		2）、环境：linux redhot 5.4、 unbantu 14
			
			①、OpenOffice：	Apache_OpenOffice_4.1.1_Linux_x86_install-rpm_en-US.tar.gz
								Apache_OpenOffice_4.1.1_Linux_x86_langpack-rpm_zh-CN.tar.gz（中文语言包）
			②、SWFTools：			swftools-2013-04-09-1007.tar.gz


II、通过OpenOffice + SwfTools 实现文档转换，并使用Flexpaper展示转换后的 flash 文件
	
	软件介绍：
		JODConverter一个Java的OpenDocument 文件转换器，可以进行許多文件格式的转换，它利用OpenOffice所提供的转换介面来进行转换工作，它能进行底下的转换工作：
		1.Microsoft Office格式转换为OpenDocument，以及OpenDocument转换为Microsoft Office
		2.OpenDocument转换为PDF、Word、Excel、PowerPoint转换为PDF、RTF转换为PDF..等等.
		你可以将JODConverter內嵌在Java应用程式里，也可以单独变成命令列式的批次转换程式，更可以应用为网頁程式或Web Service以供网路应用
	
	一、利用OpenOffice将Office文档转换为PDF
		1.需要用的软件
			OpenOffice 下载地址http://www.openoffice.org/
		    JodConverter 下载地址http://sourceforge.net/projects/jodconverter/files/JODConverter/，也可以直接从附件里面下载
		
		2.启动OpenOffice的服务
			我到网上查如何利用OpenOffice进行转码的时候，都是需要先用cmd启动一个soffice服务，启动的命令是：soffice -headless -accept="socket,host=127.0.0.1,port=8100;urp;"。
			但是实际上，对于我的项目，进行转码只是偶尔进行，然而当OpenOffice的转码服务启动以后，该进程(进程名称是soffice.exe)会一直存在，并且大约占100M的内存，感觉非常浪费。于是我就想了一个办法，可以将执行该服务的命令直接在JAVA代码里面调用，然后当转码完成的时候，直接干掉这个进程。在后面的JAVA代码里面会有解释。
			所以，实际上，这第2步可以直接跳过
			
		3.将JodConverter相关的jar包添加到项目中
			 将JodConverter解压缩以后，把lib下面的jar包全部添加到项目中
			
		4. 转换详见Java代码解析
			转换工具类：/word_To_Pdf_Flexpaper/src/com/lx/office2pdf/DocConverterUtil.java
			转换核心方法：officeToPdf
	
	二、利用SWFTools工具，将PDF转换为SWF格式的FLASH
		1. 需要用到的工具
		 SWFTools 下载地址 http://www.swftools.org/download.html，下载完成以后，直接安装就行
		
		4. 转换详见Java代码解析
			转换工具类：/word_To_Pdf_Flexpaper/src/com/lx/office2pdf/DocConverterUtil.java
			转换核心方法：pdfToSwf
			
	三、利用FlexPaper显示生成的FLASH
		1、FlexPaper的下载地址： http://flexpaper.devaldi.com/download/，下载免费版的就行。
		2、将下载的FlexPaper解压缩后拷贝你的项目中，并删除  除 FlexPaperViewer.swf文件、js文件夹和css文件夹 以外 的其他所有文件和文件夹
		3、在需要显示在线文档的页面引入FlexPaperViewer.swf、js文件夹下的flexpaper.js、flexpaper_handlers.js、flexpaper_handlers_debug.js、jquery.min.js
			必须引入的文件为下面三个：
				<script type="text/javascript" src="resource/jquery-1.9.1.min.js"></script>
				<script type="text/javascript" src="resource/whaty_flexpaper/flexpaper.js"></script>
				<script type="text/javascript" src="resource/whaty_flexpaper/flexpaper_handlers.js?1=1"></script>
				<!-- 	<link rel="stylesheet" type="text/css" href="resource/flexpaper/css/flexpaper.css" /> -->
				<!--     <script type="text/javascript" src="resource/flexpaper/js/flexpaper.js"></script> -->
				<!--     <script type="text/javascript" src="resource/flexpaper/js/flexpaper_handlers.js"></script> -->
		4、根据官方demo中index.html页面中的js例子在自己的在线问答显示页面上编写显示swf格式flash文件的js代码
		5、代码见 项目WebContent目录下的index.html页面中的示例；
		js如下：
		<script type="text/javascript">
				$('#documentViewer').FlexPaperViewer(
					{ config : {
	// 		            SWFFile : 'docs/项目安全检查规范.pdf.swf',
			            SWFFile : 'docs/project_safe_check_standerd.pdf.swf',
	// 		            SWFFile : 'docs/Paper.pdf.swf',
			            jsDirectory:'resource/whaty_flexpaper',
			            Scale : 1,
			            ZoomTransition : 'easeOut',
			            Zoom:1,
			            ZoomTime : 0.5,
			            ZoomInterval : 0.1,
			            FitPageOnLoad : false,
			            FitWidthOnLoad : true,
			            FullScreenAsMaxWindow : false,
			            ProgressiveLoading : false,
			            MinZoomSize : 0.2,
			            MaxZoomSize : 5,
			            SearchMatchAll : false,
			            InitViewMode : 'Portrait',
			            RenderingOrder : 'flash',
			            StartAtPage : '',
			            ViewModeToolsVisible : false,
			            ZoomToolsVisible : false,
			            NavToolsVisible : false,
			            CursorToolsVisible : false,
			            SearchToolsVisible : false,
			            WMode : 'opaque',	//参数取值：Window（默认） | Opaque | Transparent，见下面注释说明
		            	localeDirectory: 'resource/whaty_flexpaper/locale/',
			            localeChain: 'zh_CN'
	// 		            localeChain: 'en_US'
			        }}
				);
				
				/* 
				WMode：[Window（默认） | Opaque | Transparent]
					Window: 	Web 页上用影片自己的矩形窗口来播放应用程序。“Window”表明 Flash 应用程序与 HTML 层没有任何交互，并且始终位于最顶层。
					Opaque：		使应用程序隐藏页面上位于它后面的所有内容。
					Transparent：即把FLASH背景设成透明，在网页上就可以把FLASH放到图片或者文字之上，这样可能会降低动画性能。
				 */
			</script>