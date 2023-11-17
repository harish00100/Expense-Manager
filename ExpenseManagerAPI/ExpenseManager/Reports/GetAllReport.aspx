<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="GetAllReport.aspx.cs" Inherits="ExpenseManager.Reports.GetAllReport" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <rsweb:ReportViewer ID="getAllReport" runat="server" Width="920px">
        </rsweb:ReportViewer>
    </form>
</body>
</html>
