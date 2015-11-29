<%@ WebHandler Language="C#" Class="delete_mark" %>

using System;
using System.Web;
using lib;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Runtime.Serialization;

public class delete_mark : IHttpHandler
{
    protected lib.Config configManager;
    private string _id;
    private HttpContext _c;
    private string test;
    protected JSONDict mark;
	
    public void ProcessRequest(HttpContext context)
    {
		configManager = new Config(context.Server.MapPath(VirtualPathUtility.GetDirectory(context.Request.Path)) + @"..\..\");
        mark = delete_mark.Deserialise<JSONDict>(context.Request["MARK"]);
	   
	    try
        {
            using (SqlConnection conn = new SqlConnection(String.Format(@"Data Source=.\SQLEXPRESS;AttachDbFilename=|DataDirectory|\flexpaper.mdf;Integrated Security=True;User Instance=True")))
            {
                conn.Open();

				SqlCommand nonqueryCommand = conn.CreateCommand();
                nonqueryCommand.CommandText = "DELETE mark " +
                                                "WHERE id = @id";

                nonqueryCommand.Parameters.Add("@id", getDictVariable("id"));
				
				nonqueryCommand.ExecuteNonQuery();
                context.Response.Write("1");
			}
		}catch (Exception ex)
        {
			context.Response.Write("0");
            context.Response.Write(ex.ToString());
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
}