<%@ WebHandler Language="C#" Class="view" %>

using System;
using System.Web;
using lib;
using System.IO;

public class view : IHttpHandler
{
    protected lib.Config configManager;
    protected String doc = "";
    protected String page = "";
    protected String pdfdoc = "";
    protected String swfFilePath = "";
    protected String pdfFilePath = "";
	protected String pdfSplitPath = "";
    protected String pngFilePath = "";
    protected String jsonFilePath = "";
    protected String callback = "";
    protected String format = "";
    protected String swfdoc = "";
    protected String pngdoc = "";
    protected String jsondoc = "";
    protected bool validatedConfig = false;
    protected String messages = "";
    
    protected pdf2swf pdfconv;
    protected swfrender pngconv;
    protected pdf2json jsonconv;
    protected splitpdf splitpdfconv;
	protected mudraw mudrawconv;
	
    public void ProcessRequest(HttpContext context)
    {
        configManager = new Config(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path)) + @"..\");
        doc = context.Request["doc"].ToLower();
        page = context.Request["page"].ToLower();

        if (!doc.EndsWith(".pdf")) { pdfdoc = doc + ".pdf"; } else { pdfdoc = doc; }
        if (context.Request["format"] != null) { format = context.Request["format"]; } else { format = "swf"; }
        if (configManager.getConfig("splitmode") == "true"){swfdoc 	= pdfdoc + page + ".swf";}else{swfdoc 	= pdfdoc + ".swf";}
        if (context.Request["callback"] != null) { callback = context.Request["callback"]; }
        if (configManager.getConfig("splitmode") == "true"){jsondoc = pdfdoc + "_" + page + ".js";}else{jsondoc = pdfdoc + ".js";}
		
        pngdoc = pdfdoc + "_" + page + ".png";

        swfFilePath = configManager.getConfig("path.swf") + swfdoc;
        pdfFilePath = configManager.getConfig("path.pdf") + pdfdoc;
        pngFilePath = configManager.getConfig("path.swf") + pngdoc;
        jsonFilePath = configManager.getConfig("path.swf") + jsondoc;
		pdfSplitPath = configManager.getConfig("path.swf") + pdfdoc + "_" + page + ".pdf";
		
        validatedConfig = true;
        if(!Directory.Exists(configManager.getConfig("path.swf"))){
            messages = "[Cannot find SWF output directory, please check your configuration file]";
            validatedConfig = false;
        }

        if (!Directory.Exists(configManager.getConfig("path.pdf")))
        {
            messages = "[Cannot find PDF input directory, please check your configuration file]";
            validatedConfig = false;
        }

        if (!validatedConfig)
        {
            context.Response.Write("[Cannot read directories set up in configuration file, please check your configuration.]");
            context.Response.End();
        }
        else if (!Common.validPdfParams(pdfFilePath, pdfdoc, page))
        {
            context.Response.Write("[Incorrect file specified, please check your path]");
        }
        else
        {
            if(format == "swf" || format == "png" || format == "pdf" || format == "jpg"){
           
			    // rendering swf files to png images
			    if(format == "png" || format == "jpg"){
					if(configManager.getConfig("test_mudraw")=="true"){
						if(!File.Exists(pngFilePath)){
							mudrawconv = new mudraw(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path))+@"..\");
							mudrawconv.renderPage(pdfdoc,swfdoc,page);
						}
						
						if(configManager.getConfig("allowcache")=="true"){
								Common.setCacheHeaders(context);
						}
						
						context.Response.AddHeader("Content-type", "Content-Type: image/png");
						context.Response.WriteFile(pngFilePath);
					}else{
						// converting pdf files to swf format
						if(!File.Exists(swfFilePath)){
							pdfconv=new pdf2swf(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path))+@"..\");
							messages=pdfconv.convert(pdfdoc,page,context.Application);
						}
					
						if(Common.validSwfParams(swfFilePath,swfdoc,page)){
							if(!File.Exists(pngFilePath)){
								pngconv=new swfrender(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path))+@"..\");
								pngconv.renderPage(pdfdoc,swfdoc,page);
							}
						
							if(configManager.getConfig("allowcache")=="true"){
								Common.setCacheHeaders(context);
							}
						
							context.Response.AddHeader("Content-type", "Content-Type: image/png");
							context.Response.WriteFile(pngFilePath);
						}else{
							if(messages.Length==0 || messages == "[OK]")
								messages = "[Incorrect file specified, please check your path]";					
						}
					}
			    }
			
			    // rendering pdf files to the browser
			    if(format == "pdf"){
					if(configManager.getConfig("allowcache")=="true"){
						Common.setCacheHeaders(context);
					}
					
					if (configManager.getConfig("splitmode") == "true"){
						splitpdfconv = new splitpdf(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path))+@"..\");
						if(splitpdfconv.convert(pdfdoc)=="[OK]"){
							context.Response.ContentType = "application/pdf";
							context.Response.WriteFile(pdfSplitPath); 							
						}
					}else{
						context.Response.ContentType = "application/pdf";
						context.Response.WriteFile(pdfFilePath); 
					}
			    }
			
			    // writing files to output
			    if(File.Exists(swfFilePath)){
				    if(format == "swf"){
						// converting pdf files to swf format
						if(!File.Exists(swfFilePath)){
							pdfconv=new pdf2swf(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path))+@"..\");
							messages=pdfconv.convert(pdfdoc,page,context.Application);
						}

					
					    if(configManager.getConfig("allowcache")=="true"){
						    Common.setCacheHeaders(context);
					    }
					
                        context.Response.AddHeader("Content-type", "Content-type: application/x-shockwave-flash");		
						context.Response.AddHeader("Accept-Ranges", "bytes");		
						context.Response.AddHeader("Content-Length", new System.IO.FileInfo(swfFilePath).Length.ToString());
                        context.Response.WriteFile(swfFilePath);
					    
				    }
			    }else{
				    if(messages.Length==0)
					    messages = "[Cannot find SWF file. Please check your ASP.NET configuration]";					
			    }

            }
            
            if(format == "json" || format == "jsonp"){
                if(!File.Exists(jsonFilePath)){
				    jsonconv = new pdf2json(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path))+@"..\");
				    messages=jsonconv.convert(pdfdoc,jsondoc,page);
			    }
			
			    if(File.Exists(jsonFilePath)){
				    if(configManager.getConfig("allowcache")=="true"){
						    Common.setCacheHeaders(context);
				    }
				
                    context.Response.AddHeader("Content-Type", "text/javascript");		

                    if(format == "json"){
                        context.Response.WriteFile(jsonFilePath);
					}
					
					if(format == "jsonp"){
                        context.Response.Write(callback + "(");
                        context.Response.WriteFile(jsonFilePath);
                        context.Response.Write(")");
					}
			    }else{
				    if(messages.Length==0)
					    messages = "[Cannot find JSON file. Please check your PHP configuration]";
			    }   
            }
            
            // write any output messages
		    if(messages.Length>0 && messages != "[OK]" && messages != "[Converted]"){
			    context.Response.Write("Error:" + messages.Substring(1,messages.Length-2)); 			
		    }
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}