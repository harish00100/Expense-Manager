<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DateFilteronly.aspx.cs" Inherits="ExpenseManager.Reports.DateFilteronly" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <div>
        </div>
        <rsweb:ReportViewer ID="DateFilter" runat="server" Width="856px">
        </rsweb:ReportViewer>
    </form>
</body>
</html>
