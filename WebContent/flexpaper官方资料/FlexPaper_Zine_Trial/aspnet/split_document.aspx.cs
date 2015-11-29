using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using lib;


public partial class split_document : System.Web.UI.Page
{
    protected Config configManager;

    protected void Page_Load(object sender, EventArgs e)
    {
        configManager = new Config(Server.MapPath(VirtualPathUtility.GetDirectory(Request.Path)));

        if (configManager.getConfig("admin.password") == null)
        {
            Response.Redirect("setup.aspx");
            Response.End();
        }
    }
}