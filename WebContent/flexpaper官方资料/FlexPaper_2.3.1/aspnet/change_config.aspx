<%@ Page Title="" Language="C#" MasterPageFile="~/flexpaper.master" AutoEventWireup="true" CodeFile="change_config.aspx.cs" Inherits="change_config" %>
<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
<script language="JavaScript">
var globalTimeout;
var currentTimeoutField;

function initTimer(event) {
    currentTimeoutField = $(this);

    if (globalTimeout) clearTimeout(globalTimeout);
    globalTimeout = setTimeout(checkDirectoryPermissionsHandler, 2000);
}

$(document).ready(function () {
    $("input#PDF_Directory").keyup(initTimer);
    $("input#PDF_Directory").change(checkDirectoryChangePermissionsHandler);

    $("input#SWF_Directory").keyup(initTimer);
    $("input#SWF_Directory").change(checkDirectoryChangePermissionsHandler);
});

function checkDirectoryPermissions(obj) {
    var infield = obj;
    if (infield.val().length < 3) { return; }

    $.ajax({
        url: "checkdirpermissions.aspx?dir=" + infield.val(),
        context: document.body,
        success: function (data) {
            console.log(data);
            if (data == "0") {
                $('#' + infield.attr("id") + '_ERROR').html('Cannot write to directory. Please verify path & permissions (needs to be writable).');
                return false;
            } else {
                $('#' + infield.attr("id") + '_ERROR').html('');
                return true;
            }
        }
    });
}

function checkDirectoryChangePermissionsHandler(event) {
    var infield = $(this);
    checkDirectoryPermissions(infield);
}

function checkDirectoryPermissionsHandler(event) {
    var infield = currentTimeoutField;
    checkDirectoryPermissions(infield);
}
</script>
<div style="position:relative;left:10px;top:10px;background-color:#fff;padding: 20px 10px 20px 30px;border:0px;-webkit-box-shadow: rgba(0, 0, 0, 0.246094) 0px 4px 8px 0px;min-width:400px;float:left;margin-left:10px;margin-bottom:50px;margin-top:20px">

	<h3>FlexPaper Configuration</h3>
	<form class="devaldi" method="post" action="change_config.aspx" style="padding-bottom:30px;width:650px;"> 
					<table>
						<tr>
							<td style="border:0px;" valign="top">
								<label><nobr>Publishing Mode</nobr></label>
							</td>
							<td style="border:0px">
								<font style="font-size:13px">
									<INPUT TYPE=RADIO NAME="SPLITMODE" id="SPLITMODE1" VALUE="false" <% if(configManager.getConfig("splitmode") == "false" || configManager.getConfig("splitmode") == "") { %>checked="true"<% } %> style="vertical-align: middle"> one file<BR>
									<INPUT TYPE=RADIO NAME="SPLITMODE" id="SPLITMODE2" VALUE="true" <% if(configManager.getConfig("splitmode") == "true") { %>checked="true"<% } %> style="vertical-align: middle"> split mode<BR>
								</font>
							</td>
						</tr>
										
						<tr>
							<td style="border:0px" valign="top">
								<label><nobr>PDF Directory</nobr></label>
							</td>
							<td style="border:0px">
								<div class='text'>
									<input type="text" NAME="PDF_Directory" id="PDF_Directory" value="<% Response.Write(configManager.getConfig("path.pdf")); %>" size="80"/>
									<div class="effects"></div><div class="loader"></div>
								</div>
								<div style="float:left;font-size:10px;padding-top:5px;">This directory should reside outside of your web application root folder to protect your documents.</div>
								<div id="PDF_Directory_ERROR" class="formError" style="float:left;"></div>
							</td>
						</tr>

						<tr>
							<td style="border:0px" valign="top">
								<label><nobr>Working Directory</nobr></label>
							</td>
							<td style="border:0px">
								<div class='text'>
									<input type="text" NAME="SWF_Directory" id="SWF_Directory" value="<%=configManager.getConfig("path.swf") %>" size="80"/>
									<div class="effects"></div><div class="loader"></div>
								</div>
								<div style="float:left;font-size:10px;padding-top:5px;">This directory should reside outside of your web application root folder to protect your documents.</div>
								<div id="SWF_Directory_ERROR" class="formError" style="float:right;"></div>
							</td>
						</tr>
										
						<% if(configManager.getConfig("test_pdf2json") == "true"){ %>
						<tr>
							<td style="border:0px" valign="top">
								<label><nobr>Primary Format</nobr></label>
							</td>
							<td style="border:0px">
									<select id="RenderingOrder_PRIM" name="RenderingOrder_PRIM" style="font-size:12pt;">
										<option value="flash" <% if(configManager.getConfig("renderingorder.primary") == "flash") { %>selected="true"<% } %>>flash</option>
										<option value="html" <% if(configManager.getConfig("renderingorder.primary") == "html") { %>selected="true"<% } %>>html</option>
										<option value="html5" <% if(configManager.getConfig("renderingorder.primary") == "html5") { %>selected="true"<% } %>>html5 (beta)</option>
									</select><br/>
								<div style="float:left;font-size:10px;padding-top:5px;">This decides what to use as primary media format to use for your visitors. </div>
							</td>
						</tr>
						<% } %>
										
						<% if(configManager.getConfig("test_pdf2json") == "true"){%>
						<tr>
							<td style="border:0px" valign="top">
								<label><nobr>Secondary Format</nobr></label>
							</td>
							<td style="border:0px">
									<select id="RenderingOrder_SEC" name="RenderingOrder_SEC" style="font-size:12pt;">
										<option value="flash" <% if(configManager.getConfig("renderingorder.secondary") == "flash") { %>selected="true"<% } %>>flash</option>
										<option value="html" <% if(configManager.getConfig("renderingorder.secondary") == "html") { %>selected="true"<% } %>>html</option>
										<option value="html5" <% if(configManager.getConfig("renderingorder.secondary") == "html5") { %>selected="true"<% } %>>html5 (beta)</option>
									</select><br/>
								<div style="float:left;font-size:10px;padding-top:5px;">This decides what to use as secondary media format to use for your visitors. </div>
							</td>
						</tr>										
						<% } %>
										
						<tr>
							<td style="border:0px">
								<label><nobr>License Key</nobr></label>
							</td>
							<td style="border:0px">
								<div class='text' style="width:300px">
									<input type="text" NAME="LICENSEKEY" id="LICENSEKEY" value="<%=configManager.getConfig("licensekey") %>"/>
									<div class="effects"></div><div class="loader"></div>
								</div>
							</td>
						</tr>
										
					</table>
					<div style="padding-top:30px">
					<div style="float:left;padding-left:10px;"><button class="tiny main n_button" type="submit"><span></span><em style="min-width:75px;">Save</em></button>&nbsp;<br/></div>
					<div style="float:left;padding-left:10px;"><button class="tiny main n_button" type="submit" onclick="window.location='Default.aspx'; return false;"><span></span><em style="min-width:75px;">Cancel</em></button>&nbsp;<br/></div>
					</div>
					<input type="hidden" value="1" id="SAVE_CONFIG" name="SAVE_CONFIG" />
				</form>
								 
</div>
</asp:Content>