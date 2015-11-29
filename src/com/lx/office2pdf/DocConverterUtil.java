package com.lx.office2pdf;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.ConnectException;
import java.util.Map;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.artofsolving.jodconverter.DefaultDocumentFormatRegistry;
import com.artofsolving.jodconverter.DocumentConverter;
import com.artofsolving.jodconverter.DocumentFamily;
import com.artofsolving.jodconverter.DocumentFormat;
import com.artofsolving.jodconverter.openoffice.connection.OpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.connection.SocketOpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.converter.OpenOfficeDocumentConverter;

/**
 * 
 * office文档转换为pdf文档转换器工具类，该转换器工具类需要用到OpenOffice
 * OpenOffice下载地址为：http://www.openoffice.org/（分windows和linux环境）
 * @author 	lixin
 *
 */
public class DocConverterUtil {
	
	private static Logger logger = LoggerFactory.getLogger(DocConverterUtil.class);
	
	private static final int NO_FIND_SOURCE_FILE = -1;			//源文件不存在，未找到源文件
	private static final int DOC_CONVERT_FAIL = 1;				//文档转换失败
	private static final int DOC_CONVERT_SUCCESS = 0;			//文档转换成功
	
	private static String configFileRelativePath;				//OpenOffice和SwfTools 服务的安装相对路径
	
	private static final String OPENOFFICE_SERVER_HOST = "127.0.0.1";
	private static final int OPENOFFICE_SERVER_PORT = 8100;
	private static String host = OPENOFFICE_SERVER_HOST;		//OpenOffice 服务IP，默认127.0.0.1
	private static int port = OPENOFFICE_SERVER_PORT;			//OpenOffice 服务端口，默认8100

	private static final String OPENOFFICE_HOME_CONFIG_SUBFIX = "_openoffice_home";
	private static final String SWFTOOLS_HOME_CONFIG_SUBFIX = "_swftools_home";
	private static String openOfficeHomeConfigSubfix = OPENOFFICE_HOME_CONFIG_SUBFIX;	//openOffice安装根路径配置名后缀，外部程序可通过该属性setter修改配置后缀
	private static String swfToolsHomeConfigSubfix = SWFTOOLS_HOME_CONFIG_SUBFIX;		//swftools安装根路径配置名后缀
	
	public static String separator = File.separator;			//跨平台 路径 分隔符 windows下是'\'；linux

	public static Map<String, String> configMap = null;			//文档服务安装路径根目录配置Map对象，（openoffice和swftools安装路径配置）
	/**
	 * 读取文档服务安装目录根路径配置文件
	 * @return
	 */
	public static Map<String, String> loadProperties() {
		
		if(configMap == null) {
			configMap = PropertiesConfigUtil.getPropertiesConfigByResourceRelativePath(configFileRelativePath);
		}
		return configMap;
	}
	
	/**
	 * 根据系统环境从配置文件中获取对于的OpenOffice安装跟路径
	 * @param serverConfigSubfix 配置文件中文档服务安装路径配置名称后缀（key的后缀）<br/>
	 * 	取值：[ openOfficeHomeConfigSubfix | openOfficeHomeConfigSubfix ]
	 * @return
	 * @throws Exception 
	 */
	public static String getOfficeHome(String serverConfigSubfix) throws Exception {
		
		loadProperties();
		
		if(serverConfigSubfix == null || "".equals(serverConfigSubfix)) {
			throw new Exception("参数不合法，serverConfigSubfix不能为空；参数如：[openOfficeHomeConfigSubfix | openOfficeHomeConfigSubfix]");
		}

		if(serverConfigSubfix.toLowerCase().contains(openOfficeHomeConfigSubfix)) {
			serverConfigSubfix = openOfficeHomeConfigSubfix;
		} else if(serverConfigSubfix.toLowerCase().contains(swfToolsHomeConfigSubfix)) {
			serverConfigSubfix = swfToolsHomeConfigSubfix;
		} else {
			throw new Exception("参数错误，serverType取值为[openoffice_home | swftools_home]");
		}
		
		String docServiceHome = "";	//文档服务安装目录的跟路径
		String osName = System.getProperty("os.name").toLowerCase();
		if (Pattern.matches("windows.*", osName.toLowerCase())) {			//Windows环境
			
			docServiceHome = configMap.get("windows" + serverConfigSubfix);
		} else if (Pattern.matches("linux.*", osName)) {	//Linux环境
			
			docServiceHome = configMap.get("linux" + serverConfigSubfix);
		} else if (Pattern.matches("mac.*", osName)) {		//Mac环境
			
			docServiceHome = configMap.get("mac" + serverConfigSubfix);
		} else {
			logger.error(">>>>>>>>未找到匹配的系统环境！");
			throw new Exception("未找到匹配的系统环境！");
		}
		if(!docServiceHome.endsWith(separator)) {	// 如果从文件中读取的URL地址最后一个字符不是 '\'或'/'，则添加'\'或'/'
			docServiceHome += separator;
		}
		return docServiceHome;
	}
	
	/**
	 * 检查系统中是否存在soffice.bin进程
	 * @return
	 */
	public static boolean hasSofficeProcess() {
		
		String cmd = "cmd.exe /c tasklist";
		String[] linuxCmd = new String[]{"/bin/sh","-c","ps aux|grep soffice"};
		try{
			Process process = null;
			if(System.getProperty("os.name").toLowerCase().contains("linux")){
				process = Runtime.getRuntime().exec(linuxCmd);
			}else{
				process = Runtime.getRuntime().exec(cmd);
			}
			BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
			String s = "";
			while((s=br.readLine()) != null){
				if(s.contains("soffice.bin")){
					return true;
				}
			}
			return false;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * 启动OpenOffice服务
	 * @throws Exception
	 * @return 
	 */
	public static Process startOpenOfficeService() throws Exception{
		
		// 1、读取配置文件，获取OpenOffice的安装根目录
		String officeHome = getOfficeHome(openOfficeHomeConfigSubfix);

		// 2、启动OpenOffice文档服务，注意：windows下命令执行路径中不能含空格字符，若路径中有空格，需要将路径用双引号括起来
        String command = "\"" + officeHome 
        		+ "program"+separator+"soffice.bin\" -headless -accept=\"socket,host="+ host +",port="+ port +";urp;\" -nofirststartwizard";
        if((System.getProperty("os.name").toLowerCase().contains("linux"))) {
        	// linux 环境中 不需要用双引号对含空格的路径的命令进行处理
        	command = officeHome + "program"+separator+"soffice.bin -headless -accept=socket,host="+ host +",port="+ port +";urp; -nofirststartwizard";
        }
//       	 	+ "program"+separator+"soffice.bin\" -invisible -headless -accept=\"socket,host="+ host +",port="+ port +";urp;StarOffice.ServiceManager\" -nofirststartwizard -nologo -headless";
        logger.info(">>>>>>openoffice_command："+command);
        
        // 3、执行OpenOffice命令，启动OpenOffice文档服务
        Process process = null;
        try {
        	if(process == null) {	//只需要启动一次
        		process = Runtime.getRuntime().exec("cmd.exe");
        		logger.info(">>>>>>开始启动OpenOffice文档服务...");
        		process = Runtime.getRuntime().exec(command);
        		//Thread.sleep(5000);
        	}
		} catch (Exception e) {
			outProcessErrorMsg(process);
			logger.error(">>>>>>启动OpenOffice文档服务失败，原因："+e);
			e.printStackTrace();
		}
        outProcessErrorMsg(process);
        return process;
	}
	
	/**
	 * 获取SocketOpenOfficeConnection连接
	 * @return
	 */
	public static OpenOfficeConnection getConnection(){
		
		logger.info(">>>>>>连接OpenOffice服务...");
		OpenOfficeConnection connection = null;
        try {
        	if(connection == null || !connection.isConnected()) {
        		connection = new SocketOpenOfficeConnection(host, port);
        		connection.connect();
        		logger.info(">>>>>>连接OpenOffice服务成功！");
        	}
		} catch (Exception e) {
			logger.error(">>>>>>连接OpenOffice服务失败，准备重新连接。原因："+e);
			e.printStackTrace();
			return getConnection();	//重连机制，如果连接失败，则一直去连接，知道成功，后期将改进加个重新连接时间限制
		}
        return connection;
	}

	/**
	 *  将Office文档转换为PDF. 
	 *  <li>支持转换的文件格式，
	 *  		1、Micsoft office 2003-2010：*.doc、*.docx、*.xls、*.xlsx、*.ppt、*.pptx
	 *  		2、金山wps office：*.wps、*.et(电子表格)、*.dps(演示文稿)
	 *  		3、OpenOffice：*.odt(文本)、*.ods(电子表格)、*.odp(演示文稿)、*.odg(绘图)
	 *  </li>
	 *  <li>运行该函数需要用到OpenOffice, OpenOffice下载地址为：http://www.openoffice.org/</li>
	 *  
	 *	<li>方法示例: </li>
     * 	<li>String sourcePath = "F:\\office\\source.doc"; </li>
     * 	<li>String destFile = "F:\\pdf\\dest.pdf"; </li>
     * 	<li>DocConverterUtil.office2PDF(sourcePath, destFile); </li>
     * 
	 * @param sourceFilePath	office源文件, 绝对路径. 可以是Office2003-2007全部格式的文档, Office2010的没测试. 
	 * 							包括.doc, .docx, .xls, .xlsx, .ppt, .pptx等. 示例: F:\\office\\source.doc 
	 * 
	 * @param destFilePath	pdf目标文件， 绝对路径. 示例: F:\\pdf\\dest.pdf 
	 * 
	 * @return 操作成功与否的提示信息. 如果返回 -1, 表示找不到源文件, 或docService.properties配置错误; 如果返回 0, 则表示操作成功; 返回1, 则表示转换失败 
	 * @throws Exception 
	 */
	public static int officeToPdf(String sourceFilePath, String destFilePath) throws Exception {
		
		// 1、启动文档转换服务
		if(!hasSofficeProcess()) {	//若存在OpenOffice文档进程，则不再需要启动服务
			Process process = startOpenOfficeService();
		}
		
        // 2、 连接到运行在8100端口上的OpenOffice服务 
		OpenOfficeConnection connection = getConnection();
		if(connection == null || !connection.isConnected()) {
			logger.error(">>>>>>连接OpenOffice服务失败!");
			throw new Exception("连接OpenOffice服务失败!");
		}
		
		logger.info(">>>>>>office源文件路径："+sourceFilePath);

		// 3、源文件不存在
		File sourceFile = new File(sourceFilePath);
		if(!sourceFile.exists()) {
			logger.error("源文件不存在："+sourceFilePath);
			return NO_FIND_SOURCE_FILE;
		}
		
		// 4、目标文件不存在，则默认转换后的pdf文件名与原文件名一致
		if(destFilePath == null || "".equals(destFilePath.trim())) {
			destFilePath = sourceFilePath.substring(0, sourceFilePath.lastIndexOf(".") + 1)+"pdf";
		}
		logger.info(">>>>>>pdf目标文件路径："+destFilePath);
		File destFile = new File(destFilePath);
		if(!destFile.getParentFile().exists()) {	//判断目标文件错在文件夹是否存在，不存在说明目标文件也不存在，则需要创建目标文件所在的目录
			destFile.getParentFile().mkdirs();
		}
		
		// 5、获取源文件扩展名，便于后面转换时根据不同类型的文件进行适配转换格式化
		String fileExt = "";
		String fileName = sourceFile.getName();
		int i = fileName.indexOf(".");
		if (i != -1) {
	    	fileExt = fileName.substring(i + 1);
	    }
		
		// 6、文档转换
		try {
			logger.info(">>>>>>开始转换...");
			
			//不同版本的office文档处理  
			DocumentConverter converter = new OpenOfficeDocumentConverter(connection);
	    	if ("wps".equalsIgnoreCase(fileExt)) {
	    		
	    		DocumentFormat df = new DocumentFormat("Kingsoft wps", DocumentFamily.TEXT, "application/wps", "wps");
	    		DefaultDocumentFormatRegistry formatReg = new DefaultDocumentFormatRegistry();
	    		DocumentFormat pdf = formatReg.getFormatByFileExtension("pdf");
	    		converter.convert(sourceFile, df, destFile, pdf);
	    	} else if ("et".equalsIgnoreCase(fileExt)) {
	    		
	    		DocumentFormat df = new DocumentFormat("Kingsoft et", DocumentFamily.TEXT, "application/et", "et");
	    		DefaultDocumentFormatRegistry formatReg = new DefaultDocumentFormatRegistry();
	    		DocumentFormat pdf = formatReg.getFormatByFileExtension("pdf");
	    		converter.convert(sourceFile, df, destFile, pdf);
	    	} else if ("dps".equalsIgnoreCase(fileExt)) {
	    		
	    		DocumentFormat df = new DocumentFormat("Kingsoft dps", DocumentFamily.TEXT, "application/dps", "dps");
	    		DefaultDocumentFormatRegistry formatReg = new DefaultDocumentFormatRegistry();
	    		DocumentFormat pdf = formatReg.getFormatByFileExtension("pdf");
	    		converter.convert(sourceFile, df, destFile, pdf);
	    	} else {
	    		converter.convert(sourceFile, destFile);
	    	}
	    	logger.info(">>>>>>转换成功！");
		} catch (Exception e) {
			logger.error(">>>>>>文档转换失败，原因："+e);
			e.printStackTrace();
			return DOC_CONVERT_FAIL;
		} finally {
		
			// 7、关闭文档服务连接
			if (connection != null && connection.isConnected()) {
				connection.disconnect();
			}
		}
		
		// 8、销毁openoffice进程
		/*if(process != null) {
			process.destroy();
		}*/
		return DOC_CONVERT_SUCCESS;
	}
	
	/**
	 *  将PDF文档转换为swf格式的FLASH文件. 
	 *  注意：运行该函数需要用到SWFTools, 下载地址为：http://www.swftools.org/download.html
	 *  
	 *  示例: 
     * 	String sourcePath = "F:\\PDF\\source.pdf"; 
     * 	String destFile = "F:\\SWF\\dest.swf"; 
     * 	try { 
     *  	DocConverterUtil.pdf2SWF(sourcePath, destFile); 
     * 	} catch (IOException e) {
     *  	e.printStackTrace(); 
     * 	} 
	 *  
	 * @param sourceFilePath	pdf源文件, 绝对路径. *.pdf格式文件；示例: F:\\pdf\\source.pdf
	 * @param destFilePath		swf目标文件. 绝对路径. 示例: F:\\swf\\dest.swf 
	 *  
	 * @return 操作成功与否的提示信息. 如果返回 -1, 表示找不到源PDF文件, 或配置文件docService.properties配置错误; 如果返回 
     *         0: 则表示操作成功; 1或其他：表示转换失败
	 */
	public static int pdfToSwf(String sourceFilePath, String destFilePath) throws Exception {
		

		// 读取配置文件，获取SWFTools的安装目录
		String swfToolsHome = getOfficeHome(swfToolsHomeConfigSubfix);
		
		logger.info(">>>>>>pdf源文件路径："+sourceFilePath);

		// 源文件不存在则返回 -1
		File srcFile = new File(sourceFilePath);
		if(!srcFile.exists()) {
			logger.error("pdf源文件不存在："+sourceFilePath);
			return NO_FIND_SOURCE_FILE;
		}
		
		// 目标路径不存在则建立目标路径
		/*if(destFilePath == null || "".equals(destFilePath.trim())) {
			destFilePath = sourceFilePath.substring(0, sourceFilePath.lastIndexOf(".") + 1)+"swf";
		}*/
		destFilePath = sourceFilePath + ".swf";
		
		logger.info(">>>>>>swf目标文件了路径："+destFilePath);
		File destFile = new File(destFilePath);
		if(!destFile.getParentFile().exists()) {
			destFile.getParentFile().mkdirs();
		}
		
		/*
		 * 调用pdf2swf命令进行转换swfextract -i - sourceFilePath.pdf -o destFilePath.swf 
		 * 注意：windows下命令执行路径中不能含空格字符，若路径中有空格，需要将路径用双引号括起来
		 */
		
		// 1、该行命令中对路径额外加了双引号，因为windows命令行中不允许出现空格，但加了双引号后，在linux中又不支持，所以linux中应该使用未带引号处理的路径
		String command = "\""+swfToolsHome + "pdf2swf.exe\" -t \"" + srcFile + "\" -s flashversion=9 -o \"" + destFile +"\"";	//为什么要用flashversion=9呢，是因为版本9以上提供了页面加载时分页加载功能
		if((System.getProperty("os.name").toLowerCase().contains("linux"))) {
			// 2、在linux环境下，应该使用未带双引号处理的空格路径的命令
			command = swfToolsHome + "pdf2swf.exe -t " + srcFile + " -s flashversion=9 -o " + destFile;	//为什么要用flashversion=9呢，是因为版本9以上提供了页面加载时分页加载功能
		}		
		
		logger.info(">>>>>>>pdf2swf_command："+command);
		Process process = null;
		try {
			process = Runtime.getRuntime().exec(command);
		} catch (IOException e) {
			outProcessErrorMsg(process);
			logger.error(">>>>>>调用pdf2swf命令启动pdf2swf转换服务失败！原因："+e);
			e.printStackTrace();
		}
		
		try {
			if(process == null) {
				throw new Exception(">>>>>>>文档转换失败，原因：pdf2swf服务启动未启动！");
			}
				
			BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			while (bufferedReader.readLine() != null) {  
				
			}
			process.waitFor();
			int exitValue = process.exitValue();
			if(process != null) {
				outProcessErrorMsg(process);
				process.destroy();
			}
			if(exitValue == 0) {
				logger.info(">>>>>>>pdf convert to pdf success!");
			} else {
				logger.error(">>>>>>>pdf convert to pdf fial! exitValue="+exitValue);
			}
			return exitValue;
			
		} catch (Exception e) {
			
			e.printStackTrace();
			return DOC_CONVERT_FAIL;
		}
	}
	
	public static void outProcessErrorMsg(Process process){
		
		StringBuffer errorBf = new StringBuffer();
		try {
			InputStream errorStream = process.getErrorStream();
			int i=0;
			byte[] b = new byte[1024];
			while( (i = errorStream.read(b)) != -1) {
				errorBf.append(new String(b, "UTF-8"));
				if(errorStream.read() == -1) {
					errorBf.append(new String(b, "UTF-8"));
				}
			}
			logger.info(errorBf.toString());
		} catch (Exception e) {
			logger.info(errorBf.toString());
			e.printStackTrace();
		}
	}
	
	
	//##################################	getter、setter	#################################
	
	public static String getHost() {
		return host;
	}
	public static void setHost(String host) {
		DocConverterUtil.host = host;
	}
	public static int getPort() {
		return port;
	}
	public static void setPort(int port) {
		DocConverterUtil.port = port;
	}
	public static String getConfigFileRelativePath() {
		return configFileRelativePath;
	}
	public static void setConfigFileRelativePath(String configFileRelativePath) {
		DocConverterUtil.configFileRelativePath = configFileRelativePath;
	}
	public static String getOpenOfficeHomeConfigSubfix() {
		return openOfficeHomeConfigSubfix;
	}
	public static void setOpenOfficeHomeConfigSubfix(
			String openOfficeHomeConfigSubfix) {
		DocConverterUtil.openOfficeHomeConfigSubfix = openOfficeHomeConfigSubfix;
	}
	public static String getSwfToolsHomeConfigSubfix() {
		return swfToolsHomeConfigSubfix;
	}
	public static void setSwfToolsHomeConfigSubfix(String swfToolsHomeConfigSubfix) {
		DocConverterUtil.swfToolsHomeConfigSubfix = swfToolsHomeConfigSubfix;
	}

}
