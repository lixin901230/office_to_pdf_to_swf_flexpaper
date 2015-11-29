<%@ Page Title="" Language="C#" %>
<%@ Import Namespace="System.Web.Hosting" %>
<%@ Import Namespace="System.Configuration" %>

<script runat="server">
		void Page_Load() {
			if(ConfigurationManager.AppSettings.Count > 0){
				if(!ConfigurationManager.AppSettings[0].ToString().Equals("flexpaper_test")){
					Response.Write("You need to make the aspnet directory a ASP.NET 4.0 web application before you can proceed further.<br/><br/>For more information on how to do this, please <a href='http://flexpaper.devaldi.com/docs_publishing_with_ASPNET.jsp'>see our documentation</a>. ");
					Response.End();
				}
			}else{
				Response.Write("You need to make the aspnet directory a ASP.NET 4.0 web application before you can proceed further.<br/><br/>For more information on how to do this, please <a href='http://flexpaper.devaldi.com/docs_publishing_with_ASPNET.jsp'>see our documentation</a>. ");
				Response.End();
			}	
		
        		if(!HostingEnvironment.IsHosted){
				Response.Write("You need to make the aspnet directory a ASP.NET 4.0 web application before you can proceed further.<br/><br/>For more information on how to do this, please <a href='http://flexpaper.devaldi.com/docs_publishing_with_ASPNET.jsp'>see our documentation</a>. ");
				Response.End();
			}
		
			if(System.Environment.Version.ToString().Substring(0,1)!="4"){
				Response.Write("You appear to be runnnig the wrong ASP.NET version. Please use ASP.NET version 4.0 and make sure you convert the aspnet directory to a web application before proceeding further. <br/><br/>For more information on how to do this, please <a href='http://flexpaper.devaldi.com/docs_publishing_with_ASPNET.jsp'>see our documentation</a>.");
				Response.End();
			}
			
			Response.Redirect("setup.aspx");
		}
		
		
</script>


