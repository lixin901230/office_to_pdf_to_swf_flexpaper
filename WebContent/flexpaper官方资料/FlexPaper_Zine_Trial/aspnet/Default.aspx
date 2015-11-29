<%@ Page Title="" Language="C#" MasterPageFile="flexpaper.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>
<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
<% if(Session["FLEXPAPER_AUTH"]==null){ %>
<div id="underlay"></div>
		  <div id="content">
		  
			  <img alt="devaldi lock" id="lock" src="admin_files/images/paper_lock.png" width="347" height="346" />
			
			<div class="right_column">
				<form action="Default.aspx" class="devaldi" id="login" method="post"><h3><nobr>Login to the FlexPaper Console</nobr></h3>
				  
				  <label for="j_username">User</label>
				  <div class='text'><input id="ADMIN_USERNAME" name="ADMIN_USERNAME" size="30" type="text" /><div class="effects"></div><div class="loader"></div></div>
				  
				  <label for="j_password">Password</label>
				  <div class='text'><input id="ADMIN_PASSWORD" name="ADMIN_PASSWORD" size="30" type="password" /><div class="effects"></div><div class="loader"></div></div>

				  <div id="loginResult" class="formError"><%=loginerr%></div> 
				    
				  <ol class="horiz_bttns">
				    <li><button class="login small main n_button" type="submit"><span></span><em>Login</em></button></li>    
					</ol>
					<p id="result"></p>
				</form>
			</div>
		</div>
<% }else{ %>
<script type="text/javascript"> 
$(function() {
      $('table tbody tr').mouseover(function() {
	  	 $(this).removeClass('checkedRow')
	  	 $(this).removeClass('unselectedRow');
         $(this).addClass('selectedRow');
      }).mouseout(function() {
	  	 if ($('input:first', this).attr('checked') == 'checked') {
		 	$(this).removeClass('selectedRow');
		 	$(this).addClass('checkedRow');
		 }
		 else {
		 	$(this).removeClass('selectedRow');
		 	$(this).addClass('unselectedRow');
			$(this).removeClass('checkedRow');
		 }
      }).click(function(event){
      	 var tagName = (event && event.target)?event.target.tagName:window.event.srcElement.tagName;
		 if(tagName != 'INPUT' && !jQuery(event.target).hasClass('title')){
			<% if(configManager.getConfig("splitmode") == "false"){ %>
			var newWindow = window.open('simple_document.aspx?doc='+ escape($('input:first', this).val()),'open_window','menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0');
			<% }else{ %>
			var newWindow = window.open('split_document.aspx?doc='+ escape($('input:first', this).val()),'open_window','menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0');
			<% } %>
      	 }else{
			if(tagName != 'INPUT')
				$('input:first', this).prop("checked", !($('input:first', this).attr('checked') == 'checked'));
		}
      });

      $('.file-upload').fileUpload(
      		{
      			url: 'admin_files/controls/uploadify.ashx',
      			type: 'POST',
      			dataType: 'json',
      			beforeSend: function () {
      				jQuery('#Filename').val(jQuery('#Filedata').val().substr(jQuery('#Filedata').val().lastIndexOf("\\")+1));
      			},
      			complete: function () {

      			},
      			success: function (result, status, xhr) {
      				if(result=='0'){
      					alert('Unable to upload file. Please verify your server directory permissions.');
      				}else{
      					window.location.reload(true);
      				}
      			}
      		}
      	);
   });
</script> 
<script type="text/javascript" src="admin_files/js/pagination.js"></script>
		<div style="width:690px;clear:both;padding: 20px 10px 20px 10px;">
			<button class="tiny main n_button" type="submit"  onclick="location.href='change_config.aspx'"><span></span><em style="min-width:150px"><img src="http://flexpaper.devaldi.com/static/icon16_configuration.gif" style="padding-top:2px;">&nbsp;Configuration</em></button>&nbsp;
		</div>

		<div style="clear:both;background-color:#fff;padding: 20px 10px 20px 30px;border:0px;-webkit-box-shadow: rgba(0, 0, 0, 0.246094) 0px 4px 8px 0px;min-width:900px;float:left;width:900px;margin-left:10px;margin-bottom:50px;">
			<h3>Available Documents</h3>
			<form method="post" action="Default.aspx" enctype="multipart/form-data">
			<div style="float:left;position:absolute;">
                <div style="position:absolute;left:0px;top:0px;">
                    <input class="file-upload" type="file" name="Filedata" id="Filedata" style="width:115px;font-size: 250px;opacity:0;cursor: pointer;position:absolute;left:0;top:0;" />
                    <button class="tiny main n_button" type="submit" onclick="return false;" style="pointer-events:none;"><span></span><em style="min-width:100px"><input type="hidden" name="Filename" id="Filename" value="" /><img src="admin_files/images/upload.png" style="padding-top:2px;">&nbsp;Upload</em></button>
                    &nbsp;<br/>
                </div><div style="position:absolute;left:0px;top:0px;"><div id="file_upload" type="button"></div></div>
            </div>
			<div style="float:left;padding-left:120px;"><button class="tiny main n_button" onclick="return window.confirm('Are you sure you want to delete these files?');" type="submit"><span></span><em style="min-width:100px"><img src="admin_files/images/delete.png" style="padding-top:2px;">&nbsp;Delete</em></button>&nbsp;</div><br/>
			<div style="clear:both"><br/></div>
			<!-- <div style="float:left;"><button class="tiny main n_button disabled" id="bttn_view" onclick="window.location.href='simple_document.aspx';return false; " type="submit"><span></span><em style="min-width:100px">view</em></button>&nbsp;</div><br/>   -->
				<table width="100%" style="width:880px" cellspacing="0" cellpadding="0" class="selectable_sortable">
				<%
                 if(System.IO.Directory.Exists(configManager.getConfig("path.pdf"))){ 
				 foreach (string filename in System.IO.Directory.GetFiles(configManager.getConfig("path.pdf"))){ 
                        if(filename.EndsWith(".pdf") && filename != "Sample.pdf"){ %>
						<tr class="unselectedRow">
							<th class="title" style="width:15px"><input type="checkbox" id="pdfFile" name="pdfFile" value="<%=filename.Replace(configManager.getConfig("path.pdf"),"")%>" class="fileCheckBox"></th>
							<td class="tr" style="text-align:left;"><%=filename.Replace(configManager.getConfig("path.pdf"),"")%></td>
							<td class="tr" style="text-align:left;"><% Response.Write(new System.IO.FileInfo(filename).Length); %>&nbsp;bytes</td>
						</tr>
						<% } %>
					<% } %>
				<% }else{ %>
                <div style="padding-top:100px">Could not open directory listing. Make sure the web user has read and write permission to the PDF directory.
                <% } %> 
				</table>
			</form>
			<div id="upload-queue" style="width:300px;height:50px;"></div>
			<link href="admin_files/css/prettify.css" type="text/css" rel="stylesheet" />
			<script src="admin_files/js/prettify.js"></script> 
			<script type="text/javascript">
			    prettyPrint();
			</script>

			<% if (Request["msg"] != null){ %>			 			
				<div id="messagebox" style="width:300px;height:50px;">
				<% 
				if(Request["msg"]!=null)
				{
				%>
				<img src="admin_files/images/info_icon.png" />&nbsp;
				<%
					Response.Write(Request["msg"]);
				} %>
				</div>
			<% } %>	
		</div>

		<div id="permissions_hint" style="display:none;clear:both;background-color:#fff;padding: 20px 10px 20px 30px;border:0px;-webkit-box-shadow: rgba(0, 0, 0, 0.246094) 0px 4px 8px 0px;min-width:900px;float:left;width:900px;margin-left:10px;margin-bottom:50px;">
			<img src="admin_files/images/icon_warn.png" style="vertical-align:middle"><b>&nbsp;&nbsp;Your file could not be uploaded</b><br/>This is most likely due to your permission settings on your PDF folder. The IUSR_MACHINENAME needs write permissions to your PDF folder to allow files to be uploaded through the upload tool. Click <a href="admin_files/images/config.ini.win.aspx.png" target="_new"><u>here for a screen shot</u></a> with these settings set. 
		</div>
		
<% } %>
</asp:Content>