<%@ WebHandler Language="C#" Class="numpages" %>
/**
* █▒▓▒░ The FlexPaper Project 
* 
* Copyright (c) 2009 - 2011 Devaldi Ltd
* 
* PDF to SWF accessibility file for PHP. Accepts parameters doc and page.
* Executes specified conversion command and returns the specified 
* document/document page upon successful conversion.
*   
* GNU GENERAL PUBLIC LICENSE Version 3 (GPL).
* 
* The GPL requires that you not remove the FlexPaper copyright notices
* from the user interface. 
*  
* Commercial licenses are available. The commercial player version
* does not require any FlexPaper notices or texts and also provides
* some additional features.
* When purchasing a commercial license, its terms substitute this license.
* Please see http://flexpaper.devaldi.com/ for further details.
* 
*/

using System;
using System.Web;
using lib;

public class numpages : IHttpHandler
{
    protected lib.Config configManager;
    protected String doc = "";
    protected String page = "";
    protected String swfFilePath = "";
    protected String pdfFilePath = "";
        
    public void ProcessRequest(HttpContext context)
    {
        configManager = new Config(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path))+@"..\");
        doc = context.Request["doc"];
        page = context.Request["page"];
        
        swfFilePath = configManager.getConfig("path.swf") + doc  + page + ".swf";
	    pdfFilePath = configManager.getConfig("path.pdf") + doc;

        if(!Common.validPdfParams(pdfFilePath,doc,page)){
            context.Response.Write("[Incorrect file specified]");
        }else{
            String output = new pdf2swf(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path))+@"..\").convert(doc, page);
            if(output.Equals("[Converted]")){
                if(configManager.getConfig("allowcache")=="true"){
                    Common.setCacheHeaders(context);
                }
                
                context.Response.AddHeader("Content-type", "application/x-shockwave-flash");
                context.Response.AddHeader("Accept-Ranges", "bytes");
                context.Response.AddHeader("Content-Length", new System.IO.FileInfo(swfFilePath).Length.ToString());

                context.Response.WriteFile(swfFilePath);
            }else{
                context.Response.Write(output);
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