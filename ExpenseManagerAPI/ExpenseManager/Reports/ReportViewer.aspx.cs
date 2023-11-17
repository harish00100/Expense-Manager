using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.ReportingServices.Diagnostics.Internal;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Configuration;
using System.Web.UI.WebControls;
using Microsoft.Reporting.WebForms;

namespace ExpenseManager.Reports
{
    public partial class ReportViewer : System.Web.UI.Page
    {
        private List<SqlParameter> sqlParameters;
        private System.Data.DataSet dataset;
        protected void Page_Load(object sender, EventArgs e)
        {
            if(!Page.IsPostBack)
            {
                try
                {
                    setSqlParameter();
                    GetDataTable();
                    GenerateReport();
                }
                catch(Exception exp)
                {
                    Console.WriteLine("Error has Occured while Processing the report",exp.Message);
                }
            }
        }

        private void setSqlParameter()
        {
            sqlParameters = new List<SqlParameter>();
            sqlParameters.Add(new SqlParameter("option", Request.QueryString["option"]));
        }
        private void GetDataTable()
        {
            string query = @"select * from ExpenseManager where TransactionType=@option";

            string connectionstring = ConfigurationManager.ConnectionStrings["DB"].ConnectionString;
            dataset = new System.Data.DataSet();
            using (SqlConnection ConnectionString = new SqlConnection(connectionstring))
            {
                using (SqlCommand cmd = new SqlCommand(query, ConnectionString))
                {
                    cmd.Parameters.AddRange(sqlParameters.ToArray());
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dataset);
                }
            }
        }
        private void GenerateReport()
        {
            RdlcReportViewer.LocalReport.ReportPath = Server.MapPath("~/Reports/ExpenseManagerReport.rdlc");
            RdlcReportViewer.LocalReport.DataSources.Clear();
            RdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource("ExpenseManagerDataSet", dataset.Tables[0]));
            RdlcReportViewer.LocalReport.Refresh();
        }
    }
}