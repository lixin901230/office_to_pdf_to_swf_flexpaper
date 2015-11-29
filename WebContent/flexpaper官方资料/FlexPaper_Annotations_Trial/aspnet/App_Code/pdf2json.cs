using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;

namespace lib
{
    public class pdf2json
    {
        protected lib.Config configManager;

        public pdf2json(String mapPath)
        {
            configManager = new Config(mapPath);    
        }

        public String convert(string pdfdoc, string jsondoc, string page)
        {
            try
            {
                String output = "";
                String command = "";

                if (configManager.getConfig("splitmode") == "true"){
                    command = configManager.getConfig("cmd.conversion.splitjsonfile");
                }else{
                    command = configManager.getConfig("cmd.conversion.jsonfile");
                }

                command = command.Replace("{path.pdf}", configManager.getConfig("path.pdf"));
                command = command.Replace("{path.swf}", configManager.getConfig("path.swf"));
                command = command.Replace("{pdffile}", pdfdoc);
                command = command.Replace("{jsonfile}", jsondoc);

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
                    return "[Error converting PDF to JSON, please check your directory permissions and configuration]";
            }
            catch (Exception ex)
            {
                return "[" + ex.Message + "]";
            }
        }
    }
}