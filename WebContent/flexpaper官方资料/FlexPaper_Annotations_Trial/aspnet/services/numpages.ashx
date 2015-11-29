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
public class numpages : IHttpHandler
{
    protected lib.Config configManager;

    public void ProcessRequest(HttpContext context)
    {
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}    