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
using System.Security.Permissions;
using System.Security;

public partial class checkdirpermissions : System.Web.UI.Page
{
    protected Config configManager;
	protected String lpath_to_pdf2swf=@"C:\Program Files\SWFTools\";
	protected String lpath_to_pdf2json=@"C:\Program Files\pdf2json\";
	
    protected void Page_Load(object sender, EventArgs e)
    {
        configManager = new Config(Server.MapPath(VirtualPathUtility.GetDirectory(Request.Path)));
        if (configManager.getConfig("admin.password") != null && Session["FLEXPAPER_AUTH"] == null)
        {
            Response.Redirect("Default.aspx");
            Response.End();
        }
		
		if(Request["pdf2swfpath"]!=null){
			lpath_to_pdf2swf = Request["pdf2swfpath"];
		}

		if(Request["pdf2jsonpath"]!=null){
        	lpath_to_pdf2json = Request["pdf2jsonpath"];
        }

        if (Request["dir"] != null)
        {
            if (Directory.Exists(Request["dir"]) && hasWriteAccessToFolder(Request["dir"]))
            {
                if (Request["pdfdir"] != null&&Request["docsdir"] !=null && Request["pdfdir"].ToString().Length > 0 && Request["docsdir"].ToString().Length >0)
                {
					
                    String docsdir = Request["docsdir"];
                    String pdfdir = Request["pdfdir"];

					if(docsdir.LastIndexOf(@"\")!=docsdir.Length-1){docsdir+=@"\";}
					if(pdfdir.LastIndexOf(@"\")!=pdfdir.Length-1){pdfdir+=@"\";}

					try
                    {
						if(!File.Exists(pdfdir+@"Paper.pdf")){
                            File.Copy(Server.MapPath(VirtualPathUtility.GetDirectory(Request.Path))+@"\pdf\Paper.pdf",pdfdir+@"Paper.pdf");
                        }

                        string command = configManager.getConfig("cmd.conversion.test");
                        command = command.Replace("{path.swftools}", lpath_to_pdf2swf);
                        command = command.Replace("{path.pdf}", pdfdir);
                        command = command.Replace("{path.swf}", docsdir);
						
                        System.Diagnostics.Process proc = new System.Diagnostics.Process();
                        proc.StartInfo.FileName = command.Substring(0, command.IndexOf(".exe") + 5);
                        command = command.Substring(command.IndexOf(".exe") + 5);

                        proc.StartInfo.Arguments = command;
                        proc.StartInfo.UseShellExecute = false;
                        proc.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
                        proc.StartInfo.CreateNoWindow = true;
                        proc.StartInfo.RedirectStandardOutput = true;

                        if (proc.Start())
                        {
							proc.WaitForExit();
							proc.Close();
							
							if(File.Exists(docsdir+"flexpaper_test.swf")){
								Response.Write("1");
							}else{
								Response.Write("0");
								Response.End();
							}
                        }
                        else
                        {
						    Response.Write("-1");
                        }
                    }
                    catch (Exception ex)
                    {
                        Response.Write("-1");
                    }
					
					if(Request["testpdf2json"] != null && Request["testpdf2json"] == "True"){
						try
						{
							string command = configManager.getConfig("cmd.conversion.pdf2jsontest");
							command = command.Replace("{path.pdf2json}", lpath_to_pdf2json);
							command = command.Replace("{path.pdf}", pdfdir);
							command = command.Replace("{path.swf}", docsdir);

							System.Diagnostics.Process proc = new System.Diagnostics.Process();
							proc.StartInfo.FileName = command.Substring(0, command.IndexOf(".exe") + 5);
							command = command.Substring(command.IndexOf(".exe") + 5);

							proc.StartInfo.Arguments = command;
							proc.StartInfo.UseShellExecute = false;
							proc.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
							proc.StartInfo.CreateNoWindow = true;

							if (proc.Start())
							{
								proc.WaitForExit();
								proc.Close();
								
								if(File.Exists(docsdir+"flexpaper_test.js")){
									Response.Write("1");
								}else{
									Response.Write("0");
									Response.End();
								}
							}
							else
							{
								Response.Write("-2");
							}
						}
						catch (Exception ex)
						{
							Response.Write("-2");
						}
					}
                }
                else
                {
                    Response.Write("1");
                }
            }
            else
            {
                Response.Write("0");
				Response.End();
            }
        }
    }

    private bool hasWriteAccessToFolder(string folderPath)
    {
        try
        {
            var permission = new FileIOPermission(FileIOPermissionAccess.Write, folderPath);
            var permissionSet = new PermissionSet(PermissionState.None);
            permissionSet.AddPermission(permission);
            if (permissionSet.IsSubsetOf(AppDomain.CurrentDomain.PermissionSet))
            {
                return true;
            }
            else
            {
                return false;
            }

        }
        catch (UnauthorizedAccessException)
        {
            return false;
        }
    }
}