using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using lib;
using System.Data.SqlClient;

public partial class annotations_handlers : System.Web.UI.UserControl
{
    protected Config configManager;
    protected SqlConnection conn;

    protected void Page_Load(object sender, EventArgs e)
    {
        configManager = new Config(Server.MapPath(VirtualPathUtility.GetDirectory(Request.Path)));

        if (configManager.getConfig("sql.verified") == "true")
        {
            conn = new SqlConnection(String.Format(configManager.getConfig("sql.connectionstring")));
        }
    }
}