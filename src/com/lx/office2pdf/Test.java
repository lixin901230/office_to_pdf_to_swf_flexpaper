package com.lx.office2pdf;

/**
 * 文档转换测试类
 * <li>1、测试通过OpenOffice将office文档转换为pdf工具类@link DocConverterUtil.java</li>
 * <li>2、测试通过SWF服务将pdf文件转换为swf文件工具类</li>
 * @author lixin
 *
 */
public class Test {

	public static void main(String[] args) {
		
		microsoftOfficeDocTest();	// 微软 Office 文档转换测试
//		wpsOfficeDocTest();			// 金山wps 文档转换测试
//		openOfficeDocTest();		// apache 开源openOffice 文档转换测试
	}
	
	public static void microsoftOfficeDocTest() {
		
		String basePath = System.getProperty("user.dir").replace("\\", "/") +"/WebContent/";
		
		//带空格目录测试，带空格后，swftools命令执行在windows中，需将路径用双引号括起来
//		basePath = "D:/Program Files (x86)";
//		String sourceFilePath = basePath + "/Mysql_性能优化教程（内部材料）_07_10.docx";
//		String pdfFilePath = basePath + "/Mysql_性能优化教程（内部材料）_07_10.docx.pdf";
		
		//2007-2010版 office 文档测试
		String sourceFilePath = basePath + "docs/msoffice/Mysql_性能优化教程（内部材料）_07_10.docx";
		String pdfFilePath = basePath + "docs/msoffice/Mysql_性能优化教程（内部材料）_07_10.docx.pdf";
		String swfFilePath = basePath + "docs/msoffice/Mysql_性能优化教程（内部材料）_07_10.docx.pdf.swf";
//		String sourceFilePath = basePath + "docs/msoffice/天翼RTC研发项目-研发进展及周报_07_10.xlsx";
//		String pdfFilePath = basePath + "docs/msoffice/天翼RTC研发项目-研发进展及周报_07_10.xlsx.pdf";
//		String swfFilePath = basePath + "docs/msoffice/天翼RTC研发项目-研发进展及周报_07_10.xlsx.pdf.swf";
		
		//2003版 office 文档测试
//		String sourceFilePath = basePath + "docs/msoffice/Mysql_性能优化教程（内部材料）.doc";
//		String pdfFilePath = basePath + "docs/msoffice/Mysql_性能优化教程（内部材料）.doc.pdf";
//		String swfFilePath = basePath + "docs/msoffice/Mysql_性能优化教程（内部材料）.doc.pdf.swf";
//		String sourceFilePath = basePath + "docs/msoffice/天翼RTC研发项目-研发进展及周报.xls";
//		String pdfFilePath = basePath + "docs/msoffice/天翼RTC研发项目-研发进展及周报.xls.pdf";
//		String swfFilePath = basePath + "docs/msoffice/天翼RTC研发项目-研发进展及周报.xls.pdf.swf";
//		String sourceFilePath = basePath + "docs/msoffice/消息化解决方案.ppt";
//		String pdfFilePath = basePath + "docs/msoffice/消息化解决方案.ppt.pdf";
//		String swfFilePath = basePath + "docs/msoffice/消息化解决方案.ppt.pdf.swf";
//		
		office2pdf(sourceFilePath, pdfFilePath);
		pdf2swf(pdfFilePath, null);
	}
	
	public static void wpsOfficeDocTest() {
		
		String basePath = System.getProperty("user.dir").replace("\\", "/") +"/WebContent/";
		
		String sourceFilePath = basePath + "docs/wps/Mysql_性能优化教程（内部材料）.wps";
		String pdfFilePath = basePath + "docs/wps/Mysql_性能优化教程（内部材料）.wps.pdf";
		String swfFilePath = basePath + "docs/wps/Mysql_性能优化教程（内部材料）.wps.pdf.swf";
//		String sourceFilePath = basePath + "docs/wps/天翼RTC研发项目-研发进展及周报.et";
//		String pdfFilePath = basePath + "docs/wps/天翼RTC研发项目-研发进展及周报.et.pdf";
//		String swfFilePath = basePath + "docs/wps/天翼RTC研发项目-研发进展及周报.et.pdf.swf";
//		String sourceFilePath = basePath + "docs/wps/消息化解决方案.dps";
//		String pdfFilePath = basePath + "docs/wps/消息化解决方案.dps.pdf";
//		String swfFilePath = basePath + "docs/wps/消息化解决方案.dps.pdf.swf";
		
		office2pdf(sourceFilePath, pdfFilePath);
		pdf2swf(pdfFilePath, null);
	}
	
	public static void openOfficeDocTest() {
		
		String basePath = System.getProperty("user.dir").replace("\\", "/") +"/WebContent/";
		
		String sourceFilePath = basePath + "docs/openoffice/MySQL性能优化的最佳20条经验.odt";
		String pdfFilePath = basePath + "docs/openoffice/MySQL性能优化的最佳20条经验.odt.pdf";
		String swfFilePath = basePath + "docs/openoffice/MySQL性能优化的最佳20条经验.odt.pdf.swf";
//		String sourceFilePath = basePath + "docs/openoffice/天翼RTC研发项目-研发进展及周报-2013-9-13.ods";
//		String pdfFilePath = basePath + "docs/openoffice/天翼RTC研发项目-研发进展及周报-2013-9-13.ods.pdf";
//		String swfFilePath = basePath + "docs/openoffice/天翼RTC研发项目-研发进展及周报-2013-9-13.ods.pdf.swf";
//		String sourceFilePath = basePath + "docs/openoffice/图形文档.odp";
//		String pdfFilePath = basePath + "docs/openoffice/图形文档.odp.pdf";
//		String swfFilePath = basePath + "docs/openoffice/图形文档.odp.pdf.swf";
		
//		office2pdf(sourceFilePath, pdfFilePath);
		pdf2swf(pdfFilePath, null);
	}
	
	private static String docServiceConfigRelativePath = "config/docService.properties";
	
	public static void office2pdf(String sourceFilePath, String destFilePath) {
		
		try {
			DocConverterUtil.setHost("127.0.0.1");
			DocConverterUtil.setPort(8100);
			DocConverterUtil.setConfigFileRelativePath(docServiceConfigRelativePath);
			
			int office2pdf = DocConverterUtil.officeToPdf(sourceFilePath, destFilePath);
			System.out.println(office2pdf);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static void pdf2swf(String sourceFilePath, String destFilePath) {
		
//		String sourceFilePath = "D:\\test\\Spring_Security3.pdf";
//		String destFilePath = "D:\\test\\Spring_Security3.swf";
		
		try {
			
			DocConverterUtil.setConfigFileRelativePath(docServiceConfigRelativePath);
			int pdfToSwf = DocConverterUtil.pdfToSwf(sourceFilePath, destFilePath);
			System.out.println(pdfToSwf);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
