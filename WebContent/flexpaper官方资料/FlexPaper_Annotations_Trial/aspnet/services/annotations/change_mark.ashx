<%@ WebHandler Language="C#" Class="change_mark" %>

using System;
using System.Web;
using lib;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Runtime.Serialization;

public class change_mark : IHttpHandler
{
    protected lib.Config configManager;
    protected JSONDict mark;
    private string _id;
    private HttpContext _c;
    
    public void ProcessRequest(HttpContext context)
    {
        configManager = new Config(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path)) + @"..\..\");
        mark = change_mark.Deserialise<JSONDict>(context.Request["MARK"]);

        try
        {
            using (SqlConnection conn = new SqlConnection(String.Format(@"Data Source=.\SQLEXPRESS;AttachDbFilename=|DataDirectory|\flexpaper.mdf;Integrated Security=True;User Instance=True")))
            {
                conn.Open();

                SqlCommand nonqueryCommand = conn.CreateCommand();
                nonqueryCommand.CommandText = "UPDATE mark SET " +
                                                "document_filename = @document_filename, " +
                                                "document_relative_path = @document_relative_path, " +
                                                "selection_text = @selection_text, " +
                                                "has_selection = @has_selection, " +
                                                "color = @color, " +
                                                "selection_info = @selection_info, " +
                                                "readonly = @readonly, " +
                                                "displayFormat = @displayFormat, " +
                                                "note = @note, " +
                                                "pageIndex = @pageIndex, " +
                                                "positionX = @positionX, " +
                                                "positionY = @positionY, " +
                                                "width = @width, " +
                                                "height = @height, " +
                                                "collapsed = @collapsed, " +
                                                "points = @points " +
                                                "WHERE id = @id";

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
                nonqueryCommand.Parameters.Add("@points", getDictVariable("points"));

                nonqueryCommand.ExecuteNonQuery();
                context.Response.Write("1");
            }
        }
        catch (Exception ex)
        {
            context.Response.Write("0");
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

