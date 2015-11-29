/**
  * ¦¦¦¦¦ The FlexPaper Project 
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
using System.Data.SqlClient;

public partial class checkdatabaseconnectivity : System.Web.UI.Page
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

        if (Request["SQL_CONNECTIONSTRING"] != null)
        {
            string respcode = "0";
            try{
                using (SqlConnection conn = new SqlConnection(String.Format(Request["SQL_CONNECTIONSTRING"])))
			    {
					    conn.Open();
                        try
                        {
                            SqlCommand nonqueryCommand = conn.CreateCommand();
                            nonqueryCommand.CommandText = "CREATE TABLE [dbo].[temp]([id] [varchar](255))";
                            nonqueryCommand.ExecuteNonQuery();
                            nonqueryCommand.CommandText = "DROP TABLE [dbo].[temp]";
                            nonqueryCommand.ExecuteNonQuery();
                        }
                        catch (Exception ex)
                        {
                            respcode = "cannot_create";
                        }

                        if (respcode == "0")
                        {
                            respcode = "1";
                        }

                        conn.Close();
			    }
            }
            catch (Exception ex)
            {
                respcode = "0";
            }

            Response.Write(respcode);
		}
    }
}