using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using lib;
using System.IO;

public partial class _Default : System.Web.UI.Page
{
    protected Config configManager;
    protected String loginerr;
    protected String pdfFilePath;

    protected void Page_Load(object sender, EventArgs e)
    {
        configManager = new Config(Server.MapPath(VirtualPathUtility.GetDirectory(Request.Path)));

        if (configManager.getConfig("admin.password") == null)
        {
            Response.Redirect("setup.aspx");
            Response.End();
        }

        pdfFilePath = configManager.getConfig("path.pdf");

        if(Session["FLEXPAPER_AUTH"]!=null){
            if(Request["pdfFile"]!=null){
                String[] vals = Request["pdfFile"].Split(',');
                for (int i = 0; i < vals.Length; i++)
                {
                    if(File.Exists(pdfFilePath+vals[i]) && vals[i].IndexOfAny(System.IO.Path.GetInvalidFileNameChars())==-1){
                        File.Delete(pdfFilePath+vals[i]);
                    }
                }
            }
        }

        if (Request["ADMIN_USERNAME"] != null)
        {
            if(configManager.getConfig("admin.username") == Request["ADMIN_USERNAME"] &&
               configManager.getConfig("admin.password") == Request["ADMIN_PASSWORD"]){
                Session["FLEXPAPER_AUTH"] = "1";
            }else{
                Session["FLEXPAPER_AUTH"] = null;
                loginerr = "Authentication failed. Please contact your system administrator for assistance.";
            }
        }
    }
}