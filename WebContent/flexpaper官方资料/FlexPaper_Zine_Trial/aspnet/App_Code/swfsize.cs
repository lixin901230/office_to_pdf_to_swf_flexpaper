using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;

namespace lib
{
    public class swfsizequery
    {
        protected lib.Config configManager;

        public swfsizequery(String mapPath)
        {
            configManager = new Config(mapPath);
        }

        public String getSize(string doc, string page, string mode)
        {
            try
            {
				String swfdoc = doc + ".swf";
				
				if(configManager.getConfig("splitmode") == "true"){
					swfdoc = doc + page + ".swf";
				}
                
				String output = "";
                String command = configManager.getConfig("cmd.query.swfwidth");
                
				if(mode == "height"){
					command = configManager.getConfig("cmd.query.swfheight");
				}

				command = command.Replace("{path.swf}", configManager.getConfig("path.swf"));
                command = command.Replace("{swffile}", swfdoc);				

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
                    return GetNumbers(output);
                }
                else
                    return "[Error converting PDF to PNG, please check your configuration]";
            }
            catch (Exception ex)
            {
                return "[" + ex.Message + "]";
            }
        }
		
		private static string GetNumbers(string input)
		{
			return new string(input.Where(c => char.IsDigit(c)).ToArray());
		}
    }
}