/**
  * █▒▓▒░ The FlexPaper Project 
  * Copyright (c) 2009 - 2012 Devaldi Ltd
  * 
  */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using lib;
using System.IO;

public partial class checkdirpermissions : System.Web.UI.Page
{
    protected Config configManager;

    protected void Page_Load(object sender, EventArgs e)
    {
        configManager = new Config(Server.MapPath(VirtualPathUtility.GetDirectory(Request.Path)));
        if (configManager.getConfig("admin.password")!=null && Session["FLEXPAPER_AUTH"] == null)
        {
            Response.Redirect("Default.aspx");
            Response.End();
        }

        if (Request["dir"] != null)
        {
            if (Directory.Exists(Request["dir"]) && hasWriteAccessToFolder(Request["dir"]))
            {
                Response.Write("1");
            }
            else
            {
                Response.Write("0");
            }
        }
    }

    private bool hasWriteAccessToFolder(string folderPath)
    {
        try
        {
            System.Security.AccessControl.DirectorySecurity ds = Directory.GetAccessControl(folderPath);
            return true;
        }
        catch (UnauthorizedAccessException)
        {
            return false;
        }
    }
}