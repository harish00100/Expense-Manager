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
    public partial class DateFilteronly : System.Web.UI.Page
    {
        private List<SqlParameter> sqlParameters;
        private System.Data.DataSet dataset;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                try
                {
                    setSqlParameter();
                    GetDataTable();
                    GenerateReport();
                }
                catch (Exception exp)
                {
                    Console.WriteLine("Error has Occured while Processing the report", exp.Message);
                }
            }
        }

        private void setSqlParameter()
        {
            sqlParameters = new List<SqlParameter>();
            sqlParameters.Add(new SqlParameter("startDate", Request.QueryString["startDate"]));
            sqlParameters.Add(new SqlParameter("endDate", Request.QueryString["endDate"]));
        }
        private void GetDataTable()
        {
            string query = @"select * from ExpenseManager where EntryDate >= @startDate and EntryDate <= @endDate";

            string connectionstring = ConfigurationManager.ConnectionStrings["DB"].ConnectionString;
            dataset = new System.Data.DataSet();
            using (SqlConnection con = new SqlConnection(connectionstring))
            {
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddRange(sqlParameters.ToArray());
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dataset);
                }
            }
        }
        private void GenerateReport()
        {
            DateFilter.LocalReport.ReportPath = Server.MapPath("~/Reports/ExpenseManagerReport.rdlc");
            DateFilter.LocalReport.DataSources.Clear();
            DateFilter.LocalReport.DataSources.Add(new ReportDataSource("ExpenseManagerDataSet", dataset.Tables[0]));
            DateFilter.LocalReport.Refresh();
        }
    }
}