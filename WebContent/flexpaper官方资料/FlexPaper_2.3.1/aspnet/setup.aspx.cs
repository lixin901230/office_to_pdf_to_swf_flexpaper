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
using System.Collections;
using System.IO;

public partial class setup : System.Web.UI.Page
{
    protected String path_to_pdf2swf = @"C:\Program Files\SWFTools\";
    protected String path_to_pdf2json = @"C:\Program Files\PDF2JSON\";
    protected String pdf2swf_exec = "pdf2swf.exe";
    protected String pdf2json_exec = "pdf2json.exe";
    protected int step = 1;
    protected Config configManager;

    private Boolean pdf2swf = false;
    protected ArrayList tests = new ArrayList();
    protected String table_data = "";
    protected int warnings = 0;
    protected int fatals = 0;
    protected ArrayList warning_msg = new ArrayList();
    protected ArrayList fatal_msg = new ArrayList();

    protected void Page_Load(object sender, EventArgs e)
    {
        configManager = new Config(Server.MapPath(VirtualPathUtility.GetDirectory(Request.Path)));

        if (Request["step"] != null)
        {
            step = int.Parse(Request["step"]);
        }

        if (!pdf2swfEnabled(path_to_pdf2swf + pdf2swf_exec))
        {
            path_to_pdf2swf = @"C:\Program Files (x86)\SWFTools\";
        }

        if (!pdf2jsonEnabled(path_to_pdf2json + pdf2json_exec))
        {
            path_to_pdf2json = @"C:\Program Files (x86)\PDF2JSON\";
        }

        if (configManager.getConfig("admin.password") != null)
        {
            Response.Redirect("Default.aspx");
        }

        /* PDF2SWF PATH */
        /* -------------------------------------------- */
        if (Request["PDF2SWF_PATH"] != null)
        {
            path_to_pdf2swf = Request["PDF2SWF_PATH"];
            Session["PDF2SWF_PATH"] = path_to_pdf2swf; 
        }

        if (Session["PDF2SWF_PATH"] != null)
        {
            path_to_pdf2swf = Session["PDF2SWF_PATH"].ToString();
        }
        /* -------------------------------------------- */

        /* PDF2JSON PATH */
        /* -------------------------------------------- */
        if (Request["PDF2JSON_PATH"] != null)
        {
            path_to_pdf2json = Request["PDF2JSON_PATH"];
            Session["PDF2JSON_PATH"] = path_to_pdf2json;
        }

        if (Session["PDF2JSON_PATH"] != null)
        {
            path_to_pdf2json = Session["PDF2JSON_PATH"].ToString();
        }
        /* -------------------------------------------- */

        if (step == 4) // Save configuration
        {
            String path_pdf = Request["PDF_DIR"];
            String path_pdf_workingdir = Request["PUBLISHED_PDF_DIR"];

            // check for trailing slash
            if (!path_pdf.EndsWith("\\"))
            {
                path_pdf += "\\";
            }

            if (!path_pdf_workingdir.EndsWith("\\"))
            {
                path_pdf_workingdir += "\\";
            }

            configManager.setConfig("path.pdf", path_pdf);
            configManager.setConfig("path.swf", path_pdf_workingdir);
            configManager.setConfig("pdf2swf", pdf2swfEnabled(path_to_pdf2swf + pdf2swf_exec).ToString());
            configManager.setConfig("admin.username", Request["ADMIN_USERNAME"]);
            configManager.setConfig("admin.password", Request["ADMIN_PASSWORD"]);
            configManager.setConfig("licensekey", Request["LICENSEKEY"]);
            configManager.setConfig("splitmode", Request["SPLITMODE"]);

            if (configManager.getConfig("test_pdf2json") == "true")
            {
                configManager.setConfig("renderingorder.primary", Request["RenderingOrder_PRIM"]);
                configManager.setConfig("renderingorder.secondary", Request["RenderingOrder_SEC"]);
            }

            configManager.setConfig("cmd.conversion.singledoc", configManager.getConfig("cmd.conversion.singledoc").Replace("pdf2swf.exe","\"" + path_to_pdf2swf + "pdf2swf.exe" + "\""));
            configManager.setConfig("cmd.conversion.splitpages", configManager.getConfig("cmd.conversion.splitpages").Replace("pdf2swf.exe", "\"" + path_to_pdf2swf + "pdf2swf.exe" + "\""));
            configManager.setConfig("cmd.conversion.renderpage", configManager.getConfig("cmd.conversion.renderpage").Replace("swfrender.exe", "\"" + path_to_pdf2swf + "swfrender.exe" + "\""));
            configManager.setConfig("cmd.conversion.rendersplitpage", configManager.getConfig("cmd.conversion.rendersplitpage").Replace("swfrender.exe", "\"" + path_to_pdf2swf + "swfrender.exe" + "\""));
            configManager.setConfig("cmd.conversion.jsonfile", configManager.getConfig("cmd.conversion.jsonfile").Replace("pdf2json.exe", "\"" + path_to_pdf2json + "pdf2json.exe" + "\""));
            configManager.setConfig("cmd.searching.extracttext", configManager.getConfig("cmd.searching.extracttext").Replace("swfstrings.exe", "\"" + path_to_pdf2swf + "swfstrings.exe" + "\""));

			if(configManager.SaveConfig(Server.MapPath(VirtualPathUtility.GetDirectory(Request.Path)))){
    	        Response.Redirect("Default.aspx");
    	    }else{
    	    	Response.Redirect("setup.aspx?step=-1");
    	    }
        }
    }

    protected void exec_tests()
    {
        String i="";
        foreach (Test test in tests)
        {
            i = String.Format("<tr><td class=\"title\">{0}</td>",test.desc);
            if (Boolean.Parse(test.test.ToString()))
            {
                if(test.msg==null)
                {
                    test.msg = "Yes";
                }
                i+= "<td class='pass'>" + test.msg + "</td>";
            }else{
                if (test.msg == null)
                {
                    test.nomsg = "No";
                }
                i += "<td class='fail'>" + test.nomsg + "</td>";
                fatals++;
                fatal_msg.Add(test.failmsg);
            }
            i += "</tr>";
            table_data += i;
        }
    }

    protected Boolean pdf2swfEnabled(String lpath_to_pdf2swf)
    {
        try
        {
            System.Diagnostics.Process proc = new System.Diagnostics.Process();

            proc.StartInfo.FileName = lpath_to_pdf2swf;
            proc.StartInfo.Arguments = " --version 2>&1";
            proc.StartInfo.UseShellExecute = false;
            proc.StartInfo.RedirectStandardOutput = true;
            proc.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
            proc.StartInfo.CreateNoWindow = true;
            proc.Start();
            string output = proc.StandardOutput.ReadToEnd();
            proc.WaitForExit();
            proc.Close();
            return output.ToLower().IndexOf("swftools 0.9.1") >= 0;
        }
        catch
        {
            return false;
        }
    }

    protected Boolean pdf2jsonEnabled(String lpath_to_pdf2swf)
    {
        try
        {
            System.Diagnostics.Process proc = new System.Diagnostics.Process();

            proc.StartInfo.FileName = lpath_to_pdf2swf;
            proc.StartInfo.Arguments = " --help 2>&1";
            proc.StartInfo.UseShellExecute = false;
            proc.StartInfo.RedirectStandardOutput = true;
            proc.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
            proc.StartInfo.CreateNoWindow = true;
            proc.Start();
            string output = proc.StandardOutput.ReadToEnd();
            proc.WaitForExit();
            proc.Close();
            return output.ToLower().IndexOf("devaldi") >= 0;
        }
        catch
        {
            return false;
        }
    }

    protected Boolean test_isConfigWritable()
    {
        try
        {
            System.IO.FileStream f = System.IO.File.Open(Server.MapPath(VirtualPathUtility.GetDirectory(Request.Path)) + @"config\config.xml", FileMode.Open, FileAccess.Write, FileShare.None);
            f.Close();
            return true;
        }
        catch { return false; }
    }

    protected class Test
    {
        public String desc;
        public Boolean test;
        public String msg;
        public String nomsg;
        public String failmsg;
        public int sev;
    }
}