using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;

namespace lib
{
    public class splitpdf
    {
        protected lib.Config configManager;

        public splitpdf(String mapPath)
        {
            configManager = new Config(mapPath);    
        }

        public String convert(string pdfdoc)
        { String command = "";
            try
            {
                String output = "";
               

				command = configManager.getConfig("cmd.conversion.splitpdffile");
                command = command.Replace("{path.pdf}", configManager.getConfig("path.pdf"));
                command = command.Replace("{path.swf}", configManager.getConfig("path.swf"));
                command = command.Replace("{pdffile}", pdfdoc);
				
                System.Diagnostics.Process proc = new System.Diagnostics.Process();
                proc.StartInfo.FileName = command.Substring(0, command.IndexOf(".exe") + 5);
                proc.StartInfo.UseShellExecute = false;
                proc.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
                proc.StartInfo.CreateNoWindow = true;
                //proc.StartInfo.RedirectStandardOutput = true;
                proc.StartInfo.Arguments = command.Substring(command.IndexOf(".exe") + 5);

                if (proc.Start())
                {
                    proc.WaitForExit();
                    proc.Close();
                    return "[OK]";
                }
                else
                    return "[Error converting splitting PDF, please check your configuration]";
            }
            catch (Exception ex)
            {
                return "[" + ex.Message + "]";
            }
        }
    }
}