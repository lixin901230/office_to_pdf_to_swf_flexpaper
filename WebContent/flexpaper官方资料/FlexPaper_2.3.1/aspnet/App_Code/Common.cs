using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text.RegularExpressions;

namespace lib
{
    public static class Common
    {
        public static Boolean validPdfParams(String pdfFilePath, String doc, String page)
        {
            return doc!=null  && !(doc.Length > 255 || page!=null && page.Length > 255) && doc.IndexOfAny(System.IO.Path.GetInvalidFileNameChars())==-1 && page.IndexOfAny(System.IO.Path.GetInvalidFileNameChars())==-1 && doc.IndexOf('\\') == -1 && doc.IndexOf('/') == -1 && page.IndexOf('\\') == -1 && page.IndexOf('/') == -1  && (doc + page).IndexOf("..") == -1 && (doc + page).IndexOf("cmd.") == -1 && (doc + page).IndexOf(".exe") == -1;
        }

        public static Boolean validSwfParams(String swfFilePath, String doc, String page)
        {
            return doc != null && !(doc.Length > 255 || page != null && page.Length > 255) && doc.IndexOfAny(System.IO.Path.GetInvalidFileNameChars())==-1 && page.IndexOfAny(System.IO.Path.GetInvalidFileNameChars())==-1 && doc.IndexOf('\\') == -1 && doc.IndexOf('/') == -1 && page.IndexOf('\\') == -1 && page.IndexOf('/') == -1  && (doc + page).IndexOf("..") == -1 && (doc + page).IndexOf("cmd.") == -1 && (doc + page).IndexOf(".exe") == -1;
        }

        public static int getTotalPages(string fileName)
        {
            using (StreamReader sr = new StreamReader(File.OpenRead(fileName)))
            {
                Regex regex = new Regex(@"/Type\s*/Page[^s]");
                MatchCollection matches = regex.Matches(sr.ReadToEnd());

                return matches.Count;
            }
        }

        public static void setCacheHeaders(HttpContext context)
        {
            context.Response.AddHeader("Cache-Control", "private, max-age=10800, pre-check=10800");
            context.Response.AddHeader("Pragma", "private");
            context.Response.Cache.SetExpires(DateTime.Now.AddDays(2));
        }

    }
}