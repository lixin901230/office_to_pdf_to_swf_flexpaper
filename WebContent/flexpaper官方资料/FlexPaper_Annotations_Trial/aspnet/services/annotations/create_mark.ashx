<%@ WebHandler Language="C#" Class="create_mark" %>

using System;
using System.Web;
using lib;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Runtime.Serialization;

public class create_mark : IHttpHandler
{
    protected lib.Config configManager;
    protected JSONDict mark;
    private string _id;
    private HttpContext _c;
    private string test;
    
    public void ProcessRequest(HttpContext context)
    {
        test = @"{
  ""selection_text"": ""NTERNATIONAL MONETA"",
  ""x"": 416.6666666666667,
  ""readonly"": false,
  ""y"": 164.14141414141415,
  ""width"": 200.85,
  ""mx_internal_uid"": ""7665B5BE-F91B-FA2B-73CB-1C73FFDA342C"",
  ""displayFormat"": ""flash"",
  ""height"": 51.95,
  ""type"": ""highlight"",
  ""color"": ""#fffc15"",
  ""id"": ""7665B5BE-F91B-FA2B-73CB-1C73FFDA342C"",
  ""has_selection"": true,
  ""selection_info"": ""1;58;76""
}";
        configManager = new Config(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path)) + @"..\..\");
        mark = create_mark.Deserialise<JSONDict>(context.Request["MARK"]);
        Boolean markExist = false;
        
        try
        {
            using (SqlConnection conn = new SqlConnection(String.Format(@"Data Source=.\SQLEXPRESS;AttachDbFilename=|DataDirectory|\flexpaper.mdf;Integrated Security=True;User Instance=True")))
            {
                conn.Open();

                using (SqlCommand command = new SqlCommand("SELECT * FROM mark WHERE id = @id", conn))
                {
                    command.Parameters.Add("@id", getDictVariable("id"));
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        markExist = reader.HasRows;
                    }
                }

                if (!markExist)
                {
                    SqlCommand nonqueryCommand = conn.CreateCommand();
                    nonqueryCommand.CommandText = "INSERT INTO mark (" +
                                                    "id, " +
                                                    "document_filename, " +
                                                    "document_relative_path, " +
                                                    "selection_text, " +
                                                    "has_selection, " +
                                                    "color, " +
                                                    "selection_info, " +
                                                    "readonly, " +
                                                    "type, " +
                                                    "displayFormat, " +
                                                    "note, " +
                                                    "pageIndex, " +
                                                    "positionX, " +
                                                    "positionY, " +
                                                    "width, " +
                                                    "height, " +
                                                    "collapsed, " +
                                                    "author, " +
                                                    "points) " +
                                                    "VALUES (" +
                                                    "@id, " +
                                                    "@document_filename, " +
                                                    "@document_relative_path, " +
                                                    "@selection_text, " +
                                                    "@has_selection, " +
                                                    "@color, " +
                                                    "@selection_info, " +
                                                    "@readonly, " +
                                                    "@type, " +
                                                    "@displayFormat, " +
                                                    "@note, " +
                                                    "@pageIndex, " +
                                                    "@positionX, " +
                                                    "@positionY, " +
                                                    "@width, " +
                                                    "@height, " +
                                                    "@collapsed, " +
                                                    "@author, " +
                                                    "@points)";

                    nonqueryCommand.Parameters.Add("@id", getDictVariable("id"));
                    nonqueryCommand.Parameters.Add("@document_filename", context.Request["DOCUMENT_FILENAME"]);
                    nonqueryCommand.Parameters.Add("@document_relative_path", getDictVariable("XX"));
                    nonqueryCommand.Parameters.Add("@selection_text", getDictVariable("selection_text"));
                    nonqueryCommand.Parameters.Add("@has_selection", (getDictVariable("has_selection") == "true") ? 1 : 0);
                    nonqueryCommand.Parameters.Add("@color", getDictVariable("color"));
                    nonqueryCommand.Parameters.Add("@selection_info", getDictVariable("selection_info"));
                    nonqueryCommand.Parameters.Add("@readonly", (getDictVariable("readonly") == "true") ? 1 : 0);
                    nonqueryCommand.Parameters.Add("@type", getDictVariable("type"));
                    nonqueryCommand.Parameters.Add("@displayFormat", getDictVariable("displayFormat"));
                    nonqueryCommand.Parameters.Add("@note", getDictVariable("note"));
                    nonqueryCommand.Parameters.Add("@pageIndex", getDictVariable("pageIndex"));
                    nonqueryCommand.Parameters.Add("@positionX", getDictVariable("positionX"));
                    nonqueryCommand.Parameters.Add("@positionY", getDictVariable("positionY"));
                    nonqueryCommand.Parameters.Add("@width", getDictVariable("width"));
                    nonqueryCommand.Parameters.Add("@height", getDictVariable("height"));
                    nonqueryCommand.Parameters.Add("@collapsed", (getDictVariable("collapsed") == "true") ? 1 : 0);
                    nonqueryCommand.Parameters.Add("@author", getDictVariable("author"));
                    nonqueryCommand.Parameters.Add("@points", getDictVariable("points"));

                    nonqueryCommand.ExecuteNonQuery();
                    context.Response.Write("1");
                }
                else
                {
                    context.Response.Write("2");
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(ex.ToString());
        }
    }

    private string getDictVariable(string key)
    {
        if (mark.dict.ContainsKey(key))
        {
            return mark.dict[key].ToString();
        }
        else
        {
            return "";
        }
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    public static JSONDict Deserialise<T>(string json)
    {
        JSONDict obj = new JSONDict();
        using (System.IO.MemoryStream ms = new System.IO.MemoryStream(System.Text.Encoding.Unicode.GetBytes(json)))
        {
            System.Runtime.Serialization.Json.DataContractJsonSerializer serializer = new System.Runtime.Serialization.Json.DataContractJsonSerializer(obj.GetType());
            obj = (JSONDict)serializer.ReadObject(ms);
            return obj;
        }
    }

    [Serializable]
    public class JSONDict : ISerializable
    {
        public Dictionary<string, string> dict;
        public JSONDict()
        {
            dict = new Dictionary<string, string>();
        }
        protected JSONDict(SerializationInfo info, StreamingContext context)
        {
            dict = new Dictionary<string, string>();
            foreach (var entry in info)
            {
                dict.Add(entry.Name, (entry.Value!=null)?entry.Value.ToString():"");
            }
        }
        public void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            foreach (string key in dict.Keys)
            {
                info.AddValue(key, dict[key]);
            }
        }
    } 
}

