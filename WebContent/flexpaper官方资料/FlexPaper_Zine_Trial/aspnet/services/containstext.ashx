<%@ WebHandler Language="C#" Class="containstext" %>
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
public class containstext : IHttpHandler
{
    protected String doc = "";
    protected String page = "";
    protected String swfFilePath = "";
    protected String searchterm = "";
    public void ProcessRequest(HttpContext context)
    {
        doc = context.Request["doc"];
        page = context.Request["page"];
        searchterm=context.Request["searchterm"];
        String result = new swfextract(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path)) + @"..\").findText(doc, page, searchterm);
        context.Response.Write(result);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}    