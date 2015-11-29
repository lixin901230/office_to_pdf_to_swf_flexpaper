package com.lx.office2pdf;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;
import java.util.TreeMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 配置文件加载
 * @author lixin
 *
 */
public class PropertiesConfigUtil {
	
	private static Logger logger = LoggerFactory.getLogger(PropertiesConfigUtil.class);

	public static void main(String[] args) {
		String realPath = getFileRealPath("config/docService.properties");
		getPropertiesConfigByResourceRealPath(realPath);
		
	}
	
	/**
	 * 通过文件相对路径获取文件真实物理路径（相对于classes目录路径）
	 * @param fileRelativePath	文件相对路径
	 * @return
	 */
	public static String getFileRealPath(String fileRelativePath) {
		
		logger.info(">>>>>>开始根据相对路径["+fileRelativePath+"]获取该配置文件的真实物理路径...");
		/*private static final String RUL_PATH = Thread.currentThread()
				.getContextClassLoader().getResource("").getPath()
				.replace("%20", " ") + "config\\openOfficeServer.properties";*/
		//String CONFIG_PATH = ClassLoader.getSystemClassLoader().getResource(fileRelativePath).getPath();
		String fileRealPath = ClassLoader.getSystemResource(fileRelativePath).getPath();
		logger.info(">>>>>>成功获取配置文件真实物理路径：["+fileRealPath+"]！");
		return fileRealPath;
	}
	

	/**
	 * 通过Properties文件相对路径获取文件信息并以Map对象返回
	 * @param fileRelativePath	配置文件相对路径
	 * @return	properties文件对应的Map配置对象
	 */
	public static Map<String, String> getPropertiesConfigByResourceRelativePath(String fileRelativePath) {
		
		String realPath = getFileRealPath(fileRelativePath);
		return getPropertiesConfigByResourceRealPath(realPath);
	}
	
	/**
	 * 通过Properties文件真实绝对路径获取文件信息并以Map对象返回
	 * @param fileRelativePath	配置文件相对路径
	 * @return	properties文件对应的Map配置对象
	 * @throws Exception 
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static Map<String, String> getPropertiesConfigByResourceRealPath(String fileRealPath) {
		
		logger.error(">>>>>>开始加载配置文件：["+fileRealPath+"]！");
		Map<String, String> configMap = null;
		try {
			
			InputStream inStream = new FileInputStream(fileRealPath);
			Properties properties = new Properties();
			properties.load(inStream);
			inStream.close();
			configMap = new HashMap<String, String>((Map) properties);
			
			// 测试代码：输出配置内容
			Set<Entry<String, String>> propertySet = new TreeMap(configMap).entrySet();
			StringBuffer configSbf = new StringBuffer();
	        for (Object o : propertySet) {
	            Map.Entry<String, String> entry = (Map.Entry<String, String>) o;
	            configSbf.append("\t\t"+String.format("%s = %s%n", entry.getKey(), entry.getValue()));
	        }
	        logger.info("\n\n>>>>>>配置文件配置项输出：\n"+configSbf.toString()+"\n\n");
	        
		} catch (FileNotFoundException e) {
			logger.error(">>>>>>未找到配置文件：["+fileRealPath+"]！");
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return configMap;
	}
	
}
