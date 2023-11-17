<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Filtered.aspx.cs" Inherits="ExpenseManager.Reports.Filtered" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server">
            </asp:ScriptManager>
        </div>
        <rsweb:ReportViewer ID="filteredReport" runat="server" Width="894px">
        </rsweb:ReportViewer>
    </form>
</body>
</html>
