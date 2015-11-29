<%@ Control Language="C#" AutoEventWireup="true" CodeFile="annotations_handlers.ascx.cs" Inherits="annotations_handlers" %>
<%@ Import Namespace="System.Data.SqlClient" %>
jQuery('#documentViewer').bind('onDocumentLoaded',function(e,totalPages){
	<%
	    String doc = "Paper.pdf";
	    if(Request["doc"]!=null){doc = Request["doc"];}
        using (SqlConnection conn = new SqlConnection(String.Format(configManager.getConfig("sql.connectionstring"))))
        {
            conn.Open();
            using (SqlCommand command = new SqlCommand("SELECT * FROM mark WHERE document_filename = @document_filename", conn))
            {
                command.Parameters.Add("@document_filename", doc);
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    String addMark = "";
                    int recordcount = 0;
                    
                    while (reader.Read())
                    {
                        recordcount++;
                        
                        if (reader["type"].ToString() == "note")
                        {
                            addMark = "$FlexPaper('documentViewer').addMark(" +
                                    "{" +
                                    "id : '" + reader["id"].ToString() + "'," +
                                    "type : 'note'," +
                                    "note : '" + reader["note"].ToString().Replace("'", "\'") + "'," +
                                    "positionX : " + reader["positionX"].ToString() + "," +
                                    "positionY : " + reader["positionY"].ToString() + "," +
                                    "width : " + reader["width"].ToString() + "," +
                                    "height : " + reader["height"].ToString() + "," +
                                    "pageIndex : " + reader["pageIndex"].ToString() + " ," +
                                    "collapsed : " + ((reader["collapsed"].ToString() == "1") ? "true" : "false") + "," +
                                    "readonly : " + ((reader["readonly"].ToString() == "1") ? "true" : "false") + "," +
                                    "color : '" + reader["color"].ToString() + "'," +
                                    "points : '" +  reader["points"].ToString() + "'," +
                                    "displayFormat : '" + reader["displayFormat"].ToString() + "'" +
                                    "});";
                            Response.Write(addMark); 
                        }

                        if (reader["type"].ToString() == "highlight" || reader["type"].ToString() == "strikeout")
                        {
                            addMark = 	"$FlexPaper('documentViewer').addMark(" + 
                                     "{" +
                                     "id : '" +  reader["id"].ToString() + "'," +
                                     "type : '" +  reader["type"].ToString() +"'," +
                                     "width : " +  reader["width"].ToString() + "," +
                                     "height : " +  reader["height"].ToString() + "," +
                                     "has_selection : false," +
                                     "color : '" +  reader["color"].ToString() + "'," +
                                     "note : '" + reader["note"].ToString().Replace("'", "\'") + "'," +
                                     "positionX : " + reader["positionX"].ToString() + "," +
                                     "positionY : " + reader["positionY"].ToString() + "," +
                                     "selection_info : '" +  reader["selection_info"].ToString() + "'," +		
                                     "selection_text : '" +  reader["selection_text"].ToString().Replace("'", "\'") + "'," +
                                     "pageIndex : " +  reader["pageIndex"].ToString() + " ," +
                                     "readonly : " + (( reader["readonly"].ToString()=="1")?"true":"false") + "," +
                                     "displayFormat : '" +  reader["displayFormat"].ToString() + "'" +
                                     "});";
                            Response.Write(addMark); 
                        }

                        if (reader["type"].ToString() == "drawing")
                        {
                            addMark = 	"$FlexPaper('documentViewer').addMark(" + 
                                     "{" +
                                     "id : '" +  reader["id"].ToString() + "'," +
                                     "type : '" +  reader["type"].ToString() +"'," +
                                     "color : '" +  reader["color"].ToString() + "'," +
                                     "note : '" + reader["note"].ToString().Replace("'", "\'") + "'," +
                                     "width : " + reader["width"].ToString() + "," +
                                     "height : " + reader["height"].ToString() + "," +
                                     "positionX : " + reader["positionX"].ToString() + "," +
                                     "positionY : " + reader["positionY"].ToString() + "," +
                                     "points : '" +  reader["points"].ToString() + "'," +
                                     "pageIndex : " +  reader["pageIndex"].ToString() + " ," +
                                     "readonly : " + (( reader["readonly"].ToString()=="1")?"true":"false") + "," +
                                     "displayFormat : '" +  reader["displayFormat"].ToString() + "'" +
                                     "});";
                            Response.Write(addMark); 
                        }
                    }

                    if (addMark == "")
                    {
                        Response.Write("append_log('No existing marks found in the database for this document');");
                    }
                    else
                    {
                        Response.Write("append_log('Loaded " + recordcount.ToString() +  " mark(s) from the database');");
                    }
                }
            }
        }
       %>				
       
});

jQuery('#documentViewer').bind('onMarkCreated',function(e,mark){
	$.ajax({
			url: "services/annotations/create_mark.ashx",
			data : {
			'DOCUMENT_FILENAME' : startDocument,
			'MARK' : JSON.stringify(mark, null, 2)
			},
			context: document.body,
			type: 'POST',
			success: function(data){
			if(data=="1"){ // mark created
				append_log(String.format('New mark saved in database (id:{0})',mark.id));
			}
			if(data=="0"){ // failed creating mark
				append_log('Failed saving new mark to database');
			}
			}
	});
});

jQuery('#documentViewer').bind('onMarkDeleted',function(e,mark){
	$.ajax({
			url: "services/annotations/delete_mark.ashx",
			data : {
			'DOCUMENT_FILENAME' : startDocument,
			'MARK' : JSON.stringify(mark, null, 2)
			},
			context: document.body,
			type: 'POST',
			success: function(data){
			if(data=="1"){ // mark created
				append_log(String.format("deleted mark from database (id:{0})",mark.id));
			}
			if(data=="0"){ // failed creating mark
				append_log(String.format("failed deleting mark from database (id:{0})",mark.id));
			}
			}
	});
});

jQuery('#documentViewer').bind('onMarkChanged',function(e,mark){
    if(mark.note && !(typeof mark.note == "string")){
		mark.note = '<notes>'+mark.note.find("note").parent().html()+'</notes>';
	}

	$.ajax({
			url: "services/annotations/change_mark.ashx",
			data : {
			'DOCUMENT_FILENAME' : startDocument,
			'MARK' : JSON.stringify(mark, null, 2)
			},
			context: document.body,
			type: 'POST',
			success: function(data){
			if(data=="1"){ // mark created
				append_log(String.format('Mark updated in database (id:{0})',mark.id));
			}
			if(data=="0"){ // failed creating mark
				append_log('Failed updating mark in database');
			}
			}
	});
});