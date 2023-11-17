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
    public partial class GetAllReport : System.Web.UI.Page
    {
        private List<SqlParameter> sqlParameters;
        private System.Data.DataSet dataset;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                try
                {
                    //setSqlParameter();
                    GetDataTable();
                    GenerateReport();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error has Occured while Processing the report",ex.Message);
                }
            }
        }
        private void GetDataTable()
        {
            string query = @"select * from ExpenseManager order by TransactionType desc,EntryDate desc,Amount desc";

            string connectionstring = ConfigurationManager.ConnectionStrings["DB"].ConnectionString;
            dataset = new System.Data.DataSet();
            using (SqlConnection ConnectionString = new SqlConnection(connectionstring))
            {
                using (SqlCommand cmd = new SqlCommand(query, ConnectionString))
                {
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dataset);
                }
            }
        }
        private void GenerateReport()
        {
            getAllReport.LocalReport.ReportPath = Server.MapPath("~/Reports/ExpenseManagerReport.rdlc");
            getAllReport.LocalReport.DataSources.Clear();
            getAllReport.LocalReport.DataSources.Add(new ReportDataSource("ExpenseManagerDataSet", dataset.Tables[0]));
            getAllReport.LocalReport.Refresh();
        }
    }
}