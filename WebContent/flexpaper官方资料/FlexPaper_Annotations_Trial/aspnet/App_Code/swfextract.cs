using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace lib
{
    public class swfextract
    {
        protected lib.Config configManager;

        public swfextract(String mapPath)
        {
            configManager = new Config(mapPath);
        }

        public String findText(String doc, String page, String searchterm, int numPages = -1)
        {
            try
            {
                String output = "";
                String swfFilePath = configManager.getConfig("path.swf") + doc + page + ".swf";
                String command = configManager.getConfig("cmd.searching.extracttext"); ;
                int pagecount = -1;

                if(numPages == -1){
                    pagecount = Directory.GetFiles(configManager.getConfig("path.swf"), doc+"*").Count();
                }else{
                    pagecount = numPages;
                }

                if(!Common.validSwfParams(swfFilePath,doc,page))
                    return "[Invalid Parameters]";

                command = command.Replace("{path.swf}",configManager.getConfig("path.swf"));
                command = command.Replace("{swffile}", doc + page + ".swf");

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
                    int strpos = output.ToLower().IndexOf(searchterm.ToLower());
                    if(strpos > 0){
                        return "[{\"page\":" + page + ", \"position\":" + strpos + "}]";
                    }else{
                        int npage = Convert.ToInt32(page);

                        if(npage < pagecount){
                            return this.findText(doc,(npage+1).ToString(),searchterm,pagecount);
                        }else{
                            return "[{\"page\":-1, \"position\":-1}]";
                        }
                    }
                }
                else
                    return "[Error Extracting]";
            }
            catch (Exception ex)
            {
                return "[Error Extracting]";
            }
        }
    }
}