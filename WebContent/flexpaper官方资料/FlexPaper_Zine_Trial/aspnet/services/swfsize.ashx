<%@ WebHandler Language="C#" Class="swfsize" %>
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
using System.Web.Script.Serialization;
public class swfsize : IHttpHandler
{
    protected lib.Config configManager;
	protected String doc = "";
    protected String page = "";
	protected String callback = "";
	
    public void ProcessRequest(HttpContext context)
    {
		if (context.Request["callback"] != null) { callback = context.Request["callback"]; }

		doc = context.Request["doc"];
		if(context.Request["page"]!=null){
			page = context.Request["page"];
		}else{
			page = "1";
		}
		
		String height = new swfsizequery(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path)) + @"..\").getSize(doc,page,"height");
		String width = new swfsizequery(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path)) + @"..\").getSize(doc,page,"width");
 
		context.Response.Write(callback + "(");
        context.Response.Write("{\"width\" : " + width + ", \"height\" : \"" + height + "\"}");
		context.Response.Write(")");
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}    