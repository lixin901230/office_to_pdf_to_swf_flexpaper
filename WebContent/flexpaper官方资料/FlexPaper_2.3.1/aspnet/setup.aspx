<%@ Page Title="" Language="C#" MasterPageFile="~/flexpaper.master" AutoEventWireup="true" CodeFile="setup.aspx.cs" Inherits="setup" %>
<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
<div style="width:690px;clear:both;padding: 20px 10px 20px 10px;">
			<ul id="process" style="margin-bottom:10px;">
			<%
            switch (step)
            {
                case 1:
			%>
				<li class="first active"><span>Step 1: Server Requirements</span></li>
				<li class=""><span>Step 2: FlexPaper Configuation</span></li>
			<% 
			break;
				case -1:
			%>
				<li class="first active"><span>Step 1: Server Requirements</span></li>
				<li class=""><span>Step 2: FlexPaper Configuation</span></li>
			<% 
			break;
			default:
			%>
				<li class="first prevactive"><span>Step 1: Server Essentials</span></li>
				<li class="last active"><span>Step 2: FlexPaper Configuration</span></li>
			<% break; %>
			<% } %>			
			</ul>
		</div>

        <div style="clear:both;background-color:#fff;padding: 20px 10px 20px 30px;border:0px;-webkit-box-shadow: rgba(0, 0, 0, 0.246094) 0px 4px 8px 0px;min-width:650px;float:left;width:650px;margin-left:10px;margin-bottom:50px;">
		    <%
            switch (step)
            {
                case 1:
                    Test t1 = new Test();
                    t1.desc = "ASP.NET can write to the config file";
                    t1.test = test_isConfigWritable();
                    t1.failmsg = "ASP.NET does not have the ability to update the config file. Change the permissions on the config file (config/config.xml) and set its permissions to \"Modify\" and \"Write\" for \"Users\" / \"Everyone\" (see <a href=\"admin_files/images/config.ini.win.php.png\" target=\"_new\">screen shot</a>). If you have any questions on how to set permissions, please contact your host.";
                    t1.sev = 1;
                    tests.Add(t1);

                    Test t2 = new Test();
                    t2.desc = "SWFTools support";
                    t2.test = pdf2swfEnabled(path_to_pdf2swf + pdf2swf_exec);
                    t2.failmsg = "You may not have SwfTools installed or you are an unsupported version. Without <font color='red'>SWFTools 0.9.1</font> installed, documents will have to be published manually. Please <a href='https://flexpaper-desktop-publisher.googlecode.com/files/swftools-0.9.1.exe'>download SwfTools 0.9.1 from here</a>. <br/><br/>Have you installed SWFTools at a different location? Please enter the full path to your SWFTools installation below<br/><form class='devaldi'><div class='text' style='width:400px;float:left;'><input type='text' name='PDF2SWF_PATH' id='PDF2SWF_PATH' value='" + path_to_pdf2swf + "' onkeydown='updatepdf2swfpath()'/><div class='effects'></div><div class='loader'></div></div></form><br/>";
                    t2.sev = 1;
                    tests.Add(t2);
                    
                    exec_tests();
			%>
                <h3>FlexPaper Configuration: Server Requirements</h3>
			    <table width="100%" cellspacing="0" cellpadding="0" class="sortable">
					    <tr>
						    <th class="title">Test</th>
						    <th class="tr">Result</th>
					    </tr>
					    <% Response.Write(table_data); %>
			    </table>

                <% if (fatals == 0){ %>
			    <div style="margin-top:10px;float:right;">
				    <button class="tiny main n_button" type="submit" onclick="location.href='setup.aspx?step=2'"><span></span><em style="min-width:150px">On to step 2 &rarr;</em></button>&nbsp;<br/>
			    </div>
			    <% }else{ %>
			    <h4 class="warn">This server is not compatible with FlexPaper, here's why:</h4>
			    <ul class="list">
			        <% foreach (String msg in fatal_msg) {
                       Response.Write("<li>"+msg+"</li>");
                    }%>
                </ul>			
			    <% } %>
            <% break; %>
            <% case -1: %>
            <h3>FlexPaper: Error writing to config file</h3>
			FlexPaper failed to write your settings to the configuration file. Please check the file permissions for the config.xml file or <a href="http://flexpaper.devaldi.com/docs_publishing_with_ASPNET.jsp">see our documentation</a> on how to finish the configuration manually.   
            <% break; %>
            <% default: %>
                <script language="JavaScript">
                    function validateConfiguration() {
                        if ($('#ADMIN_PASSWORD').val().length == 0) {
                            $('#ADMIN_PASSWORD_RESULT').html('Admin password needs to be set');
                            return false;
                        }

                        if ($('#ADMIN_USERNAME').val().length == 0) {
                            $('#ADMIN_USERNAME_RESULT').html('Admin username needs to be set');
                            return false;
                        }

                        if ($('#PDF_DIR').val().length == 0) {
                            $('#PDF_DIR_ERROR').html('PDF storage directory needs to be set');
                            return false;
                        }

                        if ($('#PUBLISHED_PDF_DIR').val().length == 0) {
                            $('#PUBLISHED_PDF_DIR_ERROR').html('Working directory needs to be set');
                            return false;
                        }

                        /*if($('#LICENSEKEY').val().length==0){
                        $('#LICENSEKEY_ERROR').html('License key needs to be set');
                        return false;
                        }*/
                    }
			</script>
			<h3>FlexPaper: Configuration</h3>
			<form class="devaldi" action="setup.aspx" method="post" onsubmit="return validateConfiguration()">
				<input type="hidden" id="step" name="step" value="4" />
				<table width="100%" cellspacing="0" cellpadding="0" class="sortable">
						<tr>
							<td>Admin Username</th>
							<td>
								<div class='text' style="width:150px;float:left;">
											<input type="text" name="ADMIN_USERNAME" id="ADMIN_USERNAME" value="<%=configManager.getConfig("admin.username") %>"/>
											<div class="effects"></div><div class="loader"></div>
								</div>
								<div id="ADMIN_USERNAME_RESULT" class="formError" style="float:right;"></div>
							</td>
						</tr>
						
						<tr>
							<td>Admin Password</th>
							<td>
								<div class='text' style="width:150px;float:left">
											<input type="text" name="ADMIN_PASSWORD" id="ADMIN_PASSWORD" value="<%=configManager.getConfig("admin.password")%>"/>
											<div class="effects"></div><div class="loader"></div>
								</div>
								<div id="ADMIN_PASSWORD_RESULT" class="formError" style="float:right;"></div>
							</td>
						</tr>
						
						<tr>
							<td style="vertical-align:top;padding-top:12px;">PDF Storage Directory</th>
							<td style="vertical-align:top;">
								<div class='text'>
											<input type="text" name="PDF_DIR" id="PDF_DIR" value=""/>
											<div class="effects"></div><div class="loader"></div>
								</div>
								<div style="float:left;font-size:10px;padding-top:5px;">Please enter the full absolute path to the directory where you want to store your PDF files</div>
								<div id="PDF_DIR_ERROR" class="formError" style="float:right;"></div>
							</td>
						</tr>
						
						<tr>
							<td>Working Directory</th>
							<td>
								<div class='text'>
											<input type="text" name="PUBLISHED_PDF_DIR" id="PUBLISHED_PDF_DIR" value=""/>
											<div class="effects"></div><div class="loader"></div>
								</div>
								<div style="float:left;font-size:10px;padding-top:5px;">Please enter the full absolute path to the directory where you want to store your published files</div>
								<div id="PUBLISHED_PDF_DIR_ERROR" class="formError" style="float:right;"></div>
							</td>
						</tr>
						
						<% if(configManager.getConfig("test_pdf2json")=="true"){ %>
						<tr>
							<td valign="top">
								Primary Format
							</td>
							<td>
								<div style="width:300px;float:left;">
									<select id="RenderingOrder_PRIM" name="RenderingOrder_PRIM" style="font-size:12pt;float:left;">
										<option value="flash" <% if(configManager.getConfig("renderingorder.primary") == "flash") { %>selected="true"<% } %>>flash</option>
										<option value="html" <% if(configManager.getConfig("renderingorder.primary") == "html") { %>selected="true"<% } %>>html</option>
										<option value="html5" <% if(configManager.getConfig("renderingorder.primary") == "html5") { %>selected="true"<% } %>>html5 (beta)</option>
									</select>
								</div>
								<div style="float:left;font-size:10px;padding-top:5px;">This decides what to use as primary media format to use for your visitors. </div>
							</td>
						</tr>
						<% } %>
						
						<% if(configManager.getConfig("test_pdf2json")=="true"){ %>
						<tr>
							<td valign="top">
								Secondary Format
							</td>
							<td >
								<div style="width:300px;float:left;">
									<select id="RenderingOrder_SEC" name="RenderingOrder_SEC" style="font-size:12pt;float:left;">
										<option value="flash" <% if(configManager.getConfig("renderingorder.secondary") == "flash") { %>selected="true"<% } %>>flash</option>
										<option value="html" <% if(configManager.getConfig("renderingorder.secondary") == "html") { %>selected="true"<% } %>>html</option>
										<option value="html5" <% if(configManager.getConfig("renderingorder.secondary") == "html5") { %>selected="true"<% } %>>html5 (beta)</option>
									</select>
								</div>	
								<div style="float:left;font-size:10px;padding-top:5px;">This decides what to use as secondary media format to use for your visitors. </div>
							</td>
						</tr>
						<% } %>

						<tr>
                            <td>Split mode publishing? </th>
                            <td>
                                    <INPUT TYPE=RADIO NAME="SPLITMODE" id="SPLITMODE1" VALUE="0" style="vertical-align: middle"> No
                                    <INPUT TYPE=RADIO NAME="SPLITMODE" id="SPLITMODE2" VALUE="1" checked="true" style="vertical-align: middle;margin-left:30px;"> Yes<BR>
                                <div style="float:left;font-size:10px;padding-top:5px;">If you generally publish large PDF documents then running split mode is recommended.</div>
                                <div id="LICENSEKEY_ERROR" class="formError" style="float:right;"></div>
                            </td>
                        </tr>

						<tr>
							<td>License Key</th>
							<td>
								<div class='text' style="width:300px;float:left;">
											<input type="text" name="LICENSEKEY" id="LICENSEKEY" value=""/>
											<div class="effects"></div><div class="loader"></div>
								</div>
								<div style="float:left;font-size:10px;padding-top:5px;">If using the commercial version, this is the key you recieved from our commercial download area.</div>
								<div id="LICENSEKEY_ERROR" class="formError" style="float:right;"></div>
							</td>
						</tr>
				</table>
				<script language="JavaScript">
				    $(document).ready(function () {
				        $("input#PDF_DIR").keyup(initTimer);
				        $("input#PDF_DIR").change(checkDirectoryChangePermissionsHandler);

				        $("input#PUBLISHED_PDF_DIR").keyup(initTimer);
				        $("input#PUBLISHED_PDF_DIR").change(checkDirectoryChangePermissionsHandler);
				    });

				    var globalTimeout;
				    var currentTimeoutField;

				    function initTimer(event) {
				        currentTimeoutField = $(this);

				        if (globalTimeout) clearTimeout(globalTimeout);
				        globalTimeout = setTimeout(checkDirectoryPermissionsHandler, 2000);
				    }

				    function checkDirectoryPermissions(obj) {
				        var infield = obj;
				        if (infield.val().length < 3) { return; }
				        $.ajax({
				            url: "checkdirpermissions.aspx?dir=" + infield.val(),
				            context: document.body,
				            success: function (data) {
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
				<div style="margin-top:10px;float:right;">
					<button class="tiny main n_button" type="submit"><span></span><em style="min-width:150px">Save &amp; Complete Setup</em></button>&nbsp;<br/>
				</div>
			</form>
            <% break; %>
			<% } %>
        </div>
</asp:Content>