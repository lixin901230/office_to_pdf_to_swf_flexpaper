using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;

namespace lib
{
    public class pdf2swf
    {
        protected lib.Config configManager;

        public pdf2swf(String mapPath)
        {
            configManager = new Config(mapPath);    
        }

        public String convert(string doc, String page, HttpApplicationState application)
        {
            try
            {
                String output = "";
                String pdfFilePath = configManager.getConfig("path.pdf") + doc;
                String swfFilePath = configManager.getConfig("path.swf") + doc + page + ".swf";
                String command = "";

                if (configManager.getConfig("splitmode") == "true")
                    command = configManager.getConfig("cmd.conversion.splitpages");
                else
                    command = configManager.getConfig("cmd.conversion.singledoc");

                command = command.Replace("{path.pdf}", this.configManager.getConfig("path.pdf"));
                command = command.Replace("{path.swf}", this.configManager.getConfig("path.swf"));
                command = command.Replace("{pdffile}", doc);
                
                try
                {
                    if (!this.isNotConverted(pdfFilePath, swfFilePath))
                    {
                        return "[Converted]";
                    }
                }
                catch (Exception ex)
                {
                    return "[" + ex.Message + "]";
                }

                int return_var = 0;
                String pagecommand = "";

                if (configManager.getConfig("splitmode") == "true")
                {
                    pagecommand = command.Replace("%", page);
                    pagecommand += " -p " + page;
                }

                System.Diagnostics.Process proc = new System.Diagnostics.Process();
                proc.StartInfo.FileName = command.Substring(0, command.IndexOf(".exe") + 5);
                command = command.Substring(command.IndexOf(".exe") + 5);

                if (configManager.getConfig("splitmode") == "true")
                    proc.StartInfo.Arguments = pagecommand.Substring(pagecommand.IndexOf(".exe") + 5);
                else
                    proc.StartInfo.Arguments = command;
                
                proc.StartInfo.UseShellExecute = false;
                proc.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
                proc.StartInfo.CreateNoWindow = true;
                proc.StartInfo.RedirectStandardOutput = true;

                if (proc.Start())
                {
                    output = proc.StandardOutput.ReadToEnd();
                    proc.WaitForExit();
                    proc.Close();
                    return_var = 0;

                    if (configManager.getConfig("splitmode") == "true")
                    {
						if(application["runningExecutions"] == null){
							application["runningExecutions"] = new Hashtable();
						}
						
						bool forkExecution = true;
						
						if((application["runningExecutions"] as Hashtable)[command] != null){
							TimeSpan duration = DateTime.Now - (DateTime)(application["runningExecutions"] as Hashtable)[command]; 
							forkExecution = duration.Minutes > 1;
						}
						
						if(forkExecution){
							System.Diagnostics.Process proc2 = new System.Diagnostics.Process();
							proc2.StartInfo.FileName = proc.StartInfo.FileName;
							proc2.StartInfo.Arguments = command;
							proc2.StartInfo.UseShellExecute = true;
							proc2.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
							proc2.StartInfo.CreateNoWindow = true;
							
							// save the executing command to avoid multiple split mode executions
							(application["runningExecutions"] as Hashtable)[command] = DateTime.Now;
							
							proc2.Start();
						}
                    }
                }
                else
                    return_var = -1;
               
                if(return_var == 0)
                    return "[Converted]";
                else
                    return "[Error converting document, make sure the conversion tool is installed and that correct user permissions are applied to the SWF Path directory]";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return "";
        }

        public Boolean isNotConverted(String pdfFilePath, String swfFilePath)
        {
            if(!File.Exists(pdfFilePath))
                throw new Exception("Document does not exist");

            if (swfFilePath == null)
                throw new Exception("Document output file name not set");
            else
            {
                if (!File.Exists(swfFilePath))
                    return true;
                else
                    if (new System.IO.FileInfo(pdfFilePath).LastWriteTime > new System.IO.FileInfo(swfFilePath).LastWriteTime)
                        return true;
            }

            return false;
        }
    }
}