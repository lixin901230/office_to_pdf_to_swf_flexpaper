package com.lx.office2pdf;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.ConnectException;
import java.util.ResourceBundle;

import com.artofsolving.jodconverter.DocumentConverter;
import com.artofsolving.jodconverter.openoffice.connection.OpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.connection.SocketOpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.converter.OpenOfficeDocumentConverter;

/** 
 * 将文件转成swf格式 
 *  
 * @author Administrator 
 *  
 */  
public class ConvertSwf {  
  
    /** 
     * 入口方法-通过此方法转换文件至swf格式 
     * @param filePath  上传文件所在文件夹的绝对路径 
     * @param dirPath   文件夹名称 
     * @param fileName  文件名称 
     * @return          生成swf文件名 
     */  
    public static String beginConvert(String filePath, String fileName) {  
        final String DOC = ".doc";  
        final String DOCX = ".docx";  
        final String XLS = ".xls";  
        final String XLSX = ".xlsx";  
        final String PDF = ".pdf";  
        final String SWF = ".swf";  
        final String PPT = ".ppt";
        final String PPTX = ".pptx";
        final String TOOL = "d:/Program Files/SWFTools/pdf2swf.exe ";  
        
        String outFile = "";  
        String fileNameOnly = "";  
        String fileExt = "";  
        if (null != fileName && fileName.lastIndexOf(".") > 0) {  
            int index = fileName.lastIndexOf(".");  
            fileNameOnly = fileName.substring(0, index);  
            fileExt = fileName.substring(index).toLowerCase();  
        }  
        String inputFile = filePath + File.separator + fileName;  
        String outputFile = "";  
  
        //如果是office文档，先转为pdf文件  
        if (fileExt.equals(DOC) || fileExt.equals(DOCX) || fileExt.equals(XLS) 
        		|| fileExt.equals(XLSX) || fileExt.equals(PPT) || fileExt.equals(PPTX)) {  
            outputFile = filePath + File.separator + fileNameOnly + PDF;  
            office2PDF(inputFile, outputFile);  
            inputFile = outputFile;  
            fileExt = PDF;  
        }  
  
        if (fileExt.equals(PDF)) {  
            String toolFile =  TOOL;  
            outputFile = filePath + File.separator + fileNameOnly + SWF;  
            convertPdf2Swf(inputFile, outputFile, toolFile);  
            outFile = outputFile;  
        }  
        return outFile;  
    }  
  
    /** 
     * 将pdf文件转换成swf文件 
     * @param sourceFile pdf文件绝对路径 
     * @param outFile    swf文件绝对路径 
     * @param toolFile   转换工具绝对路径 
     */  
    private static void convertPdf2Swf(String sourceFile, String outFile,  
            String toolFile) {  
        String command = toolFile + " \"" + sourceFile + "\" -o  \"" + outFile  
                + "\" -s flashversion=9 ";  
        try {  
            Process process = Runtime.getRuntime().exec(command);  
            System.out.println(loadStream(process.getInputStream()));  
            System.err.println(loadStream(process.getErrorStream()));  
            System.out.println(loadStream(process.getInputStream()));  
            System.out.println("###--Msg: swf 转换成功");  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }  
  
    /** 
     * office文档转pdf文件 
     * @param sourceFile    office文档绝对路径 
     * @param destFile      pdf文件绝对路径 
     * @return 
     */  
    private static int office2PDF(String sourceFile, String destFile) {  
    	File inputFile = new File(sourceFile);  
        if (!inputFile.exists()) {  
            return -1; // 找不到源文件   
        }  
        
        // 如果目标路径不存在, 则新建该路径    
        File outputFile = new File(destFile);  
        if (!outputFile.getParentFile().exists()) {  
            outputFile.getParentFile().mkdirs();  
        } 
        try {  
        	OpenOfficeConnection connection = initOpenOffice();
            if(!outputFile.exists()){
            	return convertFile(inputFile, outputFile, connection);  
            }
            // 关闭连接和服务  
            connection.disconnect();  
            return -1;  
        } catch (ConnectException e) {  
        	OpenOfficeConnection connection = initOpenOffice();
        	try {
				return convertFile(inputFile, outputFile, connection);
			} catch (ConnectException e1) {
				e1.printStackTrace();
			}  
        } 
        return 1;  
    }  
    
    private static int convertFile(File inputFile, File outputFile, OpenOfficeConnection connection) throws ConnectException{
    	connection.connect();
		DocumentConverter converter = new OpenOfficeDocumentConverter(connection);
		converter.convert(inputFile, outputFile);
		connection.disconnect();
		System.out.println("****pdf转换成功，PDF输出：" + outputFile.getPath()+ "****");
		return 0;
    	
    }
    
    /**
     * 初始化启动openoffice服务
     * @throws IOException
     */
    private static OpenOfficeConnection initOpenOffice(){
		try {
			String OpenOffice_HOME = "C:/Program Files/OpenOffice 4";
			String host_Str = "127.0.0.1";
			String port_Str = "8100";
			// 启动OpenOffice的服务
			String command = OpenOffice_HOME
					+ "/program/soffice.exe -headless -accept=\"socket,host="
					+ host_Str + ",port=" + port_Str + ";urp;\" -nofirststartwizard";
			System.out.println("###\n" + command);
			Runtime.getRuntime().exec(command);
			OpenOfficeConnection connection = new SocketOpenOfficeConnection(Integer.parseInt(port_Str));
			return connection;
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("###\n启动openoffice服务错误");
		}
		return null;
    }
      
    static String loadStream(InputStream in) throws IOException{  
        int ptr = 0;  
        in = new BufferedInputStream(in);  
        StringBuffer buffer = new StringBuffer();  
          
        while ((ptr=in.read())!= -1){  
            buffer.append((char)ptr);  
        }  
        return buffer.toString();  
    }  
  
}  