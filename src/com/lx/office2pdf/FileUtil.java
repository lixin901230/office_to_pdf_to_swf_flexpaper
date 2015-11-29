package com.lx.office2pdf;

import java.io.File;

/**
 * 文件操作工具类
 * @author lixin
 *
 */
public class FileUtil {
	
	public static void main(String[] args) {
		System.out.println(System.getProperty("os.name")+" path separator："+getSeparator());
	}

	/**
	 * 跨平台路径斜杠分隔符获取
	 * @return
	 */
	public static String getSeparator() {
		return File.separator;
	}
}
