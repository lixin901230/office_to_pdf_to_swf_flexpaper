using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;

namespace lib
{
    public class mudraw
    {
        protected lib.Config configManager;

        public mudraw(String mapPath)
        {
            configManager = new Config(mapPath);
        }

        public String renderPage(string pdfdoc, string swfdoc, string page)
        {
            try
            {
                String output = "";
                String command = configManager.getConfig("cmd.conversion.mudraw");
                
				command = command.Replace("{path.pdf}", configManager.getConfig("path.pdf"));
                command = command.Replace("{path.swf}", configManager.getConfig("path.swf"));
                command = command.Replace("{swffile}", swfdoc);
                command = command.Replace("{pdffile}", pdfdoc);
                command = command.Replace("{page}", page);

                System.Diagnostics.Process proc = new System.Diagnostics.Process();
                proc.StartInfo.FileName = command.Substring(0, command.IndexOf(".exe") + 5);
                proc.StartInfo.UseShellExecute = false;
                proc.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
                proc.StartInfo.CreateNoWindow = true;
                proc.StartInfo.RedirectStandardOutput = true;
                proc.StartInfo.Arguments = command.Substring(command.IndexOf(".exe") + 5);

                if (proc.Start())
                {
                    output = proc.StandardOutput.ReadToEnd();
                    return output;
                }
                else
                    return "[Error converting PDF to PNG, please check your configuration]";
				
				return command;
            }
            catch (Exception ex)
            {
                return "[" + ex.Message + "]";
            }
        }
    }
}