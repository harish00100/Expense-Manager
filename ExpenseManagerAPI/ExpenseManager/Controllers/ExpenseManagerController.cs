using ExpenseManager.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ExpenseManager.Controllers
{
    public class ExpenseManagerController : ApiController
    {
        SqlConnection ConnectionString = new SqlConnection(ConfigurationManager.ConnectionStrings["DB"].ConnectionString);

        [HttpGet]
        [Route("api/get_Category")]
        public HttpResponseMessage Get()
        {
            string query = @"select * from CategoryMaster where ActiveFlag='Y'";
            DataTable table = new DataTable();
            //using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["DB"].ConnectionString))
            using (var command = new SqlCommand(query, ConnectionString))
            using (var da = new SqlDataAdapter(command))
            {
                da.Fill(table);
            }
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpPost]
        [Route("api/delete_Category")]
        public string DeleteCategory(CategoryMaster data)
        {
            int rowsAffected = 0;
            string query = @"update CategoryMaster set ActiveFlag='N' where Category='" + data.Category + "'";
            using (var command = new SqlCommand(query, ConnectionString))
            {
                ConnectionString.Open();
                rowsAffected = (int)command.ExecuteNonQuery();
                ConnectionString.Close();
            }
            return "Deleted Category - " + data.Category;
        }

        //[HttpPost]
        //[Route("api/Add_Category")]
        //public string AddCategory(ExpenseManagerModel values)
        //{
        //    int rowsAffected = 0;

        //    string checkDataAlreadyPresent = @"select count(*) from CategoryMaster where Category='" + values.Category + "'";
        //    using (var command = new SqlCommand(checkDataAlreadyPresent, ConnectionString))
        //    {
        //        ConnectionString.Open();
        //        rowsAffected = (int)command.ExecuteScalar();
        //        ConnectionString.Close();
        //    }
        //    if (rowsAffected == 0)
        //    {
        //        string query = @"insert into CategoryMaster(Category) values('" + values.Category + "')";
        //        using (var command = new SqlCommand(query, ConnectionString))
        //        {
        //            ConnectionString.Open();
        //            rowsAffected = command.ExecuteNonQuery();
        //            ConnectionString.Close();
        //        }
        //        return "Total Rows Affected is " + rowsAffected;
        //    }
        //    else
        //    {
        //        string query = @"update CategoryMaster set ActiveFlag=0 where Categories='" + values.Category + "'";
        //        using (var command = new SqlCommand(query, ConnectionString))
        //        {
        //            ConnectionString.Open();
        //            rowsAffected = command.ExecuteNonQuery();
        //            ConnectionString.Close();
        //        }
        //    }
        //    return "updated successfully";
        //}

        [HttpPost]
        [Route("api/AddNewTransaction")]
        public string AddNewTransaction(Transactions transaction)
        {
            SqlCommand command = new SqlCommand("AddTransactionsProc", ConnectionString)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@date", transaction.EntryDate);
            command.Parameters.AddWithValue("@type", transaction.Type);
            command.Parameters.AddWithValue("@category", transaction.Category);
            command.Parameters.AddWithValue("@amount", transaction.Amount);
            ConnectionString.Open();
            command.ExecuteNonQuery();
            ConnectionString.Close();
            return "Added Successfully";
        }

        [HttpGet]
        [Route("api/get_IncomeList")]
        public HttpResponseMessage GetIncomeList()
        {
            string query = @"select TransactionId,Category,type,EntryDate,Amount from CategoryMaster a join Transactions b on a.CategoryID=b.CategoryID and ActiveFlag='Y' order by EntryDate desc,amount desc";
            DataTable table = new DataTable();
            using (var command = new SqlCommand(query, ConnectionString))
            using (var da = new SqlDataAdapter(command))
            {
                da.Fill(table);
            }

            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpGet]
        [Route("api/get_ExpenseList")]
        public HttpResponseMessage GetExpenseList()
        {
            string query = @"select * from ExpenseManager where TransactionType='expense' order by EntryDate desc,Amount";
            DataTable table = new DataTable();
            using (var command = new SqlCommand(query, ConnectionString))
            using (var da = new SqlDataAdapter(command))
            {
                da.Fill(table);
            }

            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpPost]
        [Route("api/UpdateExistingTransactions")]
        public string UpdateExistingTransactions(Transactions transactions)
        {
            int rowsAffected = 0;

            SqlCommand command = new SqlCommand("UpdateTransactionsProc", ConnectionString)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@transactionID", transactions.TransactionId); 
            command.Parameters.AddWithValue("@category", transactions.Category);
            command.Parameters.AddWithValue("@type", transactions.Type);
            command.Parameters.AddWithValue("@date", transactions.EntryDate);
            command.Parameters.AddWithValue("@amount", transactions.Amount);
            ConnectionString.Open();
            rowsAffected = command.ExecuteNonQuery();
            ConnectionString.Close();
            return "updated Successfully";
        }

        [HttpPost]
        [Route("api/UpdateIncomeFlag")]
        public string UpdateIncomeFlag(Transactions transaction)
        {
            SqlCommand command = new SqlCommand("UpdateIncomeFlagfromIncomeListProc", ConnectionString)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@TransactionId", transaction.TransactionId);
            ConnectionString.Open();
            command.ExecuteNonQuery();
            ConnectionString.Close();
            return "Updated Income Flag Successfully";
        }

        [HttpPost]
        [Route("api/UpdateExpenseFlag")]
        public string UpdateExpenseFlag(Transactions transaction)
        {
            string UpdateExpenseFlagQuery = @"delete from [dbo].[Transactions] where TransactionId="+transaction.TransactionId;
            SqlCommand command = new SqlCommand(UpdateExpenseFlagQuery, ConnectionString);
            ConnectionString.Open();
            command.ExecuteNonQuery();
            ConnectionString.Close();
            return "Updated Income Flag Successfully";
        }

        [HttpPost]
        [Route("api/item_Category")]
        public HttpResponseMessage ItemCategory(ExpenseManagerModel values)
        {
            string query = @"select Category,type,EntryDate,Amount from CategoryMaster a join Transactions b on a.CategoryID=b.CategoryID where Category='" + values.CategoryType + "' and ActiveFlag='Y' order by EntryDate desc,amount desc";
            DataTable table = new DataTable();
            using (var command = new SqlCommand(query, ConnectionString))
            using (var da = new SqlDataAdapter(command))
            {
                da.Fill(table);
            }

            return Request.CreateResponse(HttpStatusCode.OK, table);
        }


       
        [HttpPost]
        [Route("api/IncomeDate_Filter")]
        public HttpResponseMessage IncomeDateFilter(Transactions transaction)
        {
            string s = @"select TransactionId,Category,type,EntryDate,Amount from CategoryMaster a join Transactions b on a.CategoryID=b.CategoryID where EntryDate>= '" + transaction.EntryDate.ToString("MM/dd/yyyy") + "' and  EntryDate<= '" + transaction.EntryEndDate.ToString("MM/dd/yyyy")+ "' and Type='Income' and ActiveFlag='Y'";
            DataTable table = new DataTable();
            using (var command = new SqlCommand(s, ConnectionString))
            using (var da = new SqlDataAdapter(command))
            {
                da.Fill(table);
            }

            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpPost]
        [Route("api/ExpenseDate_Filter")]
        public HttpResponseMessage ExpenseDateFilter(Transactions transaction)
        {
            string s = @"select TransactionId,Category,type,EntryDate,Amount from CategoryMaster a join Transactions b on a.CategoryID=b.CategoryID where EntryDate>= '" + transaction.EntryDate.ToString("MM/dd/yyyy") + "' and  EntryDate<= '" + transaction.EntryEndDate.ToString("MM/dd/yyyy") + "' and Type='Expense'";
            DataTable table = new DataTable();
            using (var command = new SqlCommand(s, ConnectionString))
            using (var da = new SqlDataAdapter(command))
            {
                da.Fill(table);
            }

            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpPost]
        [Route("api/Add_Budget")]
        public string AddBudget(Budget data)
        {
            if (data.MonthOrYearWise.Equals("Month"))
            {
                string MonthWiseDeleteQuery = @"delete from Budget where month(BudgetSaveDate)=month(getdate()) and year(BudgetSaveDate)=year(getdate()) and monthoryear='Month'";
                using (var command = new SqlCommand(MonthWiseDeleteQuery, ConnectionString))
                {
                    ConnectionString.Open();
                    command.ExecuteNonQuery();
                    ConnectionString.Close();
                }
                string YearWiseUpdateQuery = @"update Budget set ActiveFlag='N' where  year(BudgetSaveDate)=year(getdate())";
                using (var command = new SqlCommand(YearWiseUpdateQuery, ConnectionString))
                {
                    ConnectionString.Open();
                    command.ExecuteNonQuery();
                    ConnectionString.Close();
                }
                InsertNewBudgetValue(data,"Month");
                return "Budget Removed Successfully";
            }
            else
            {
                string YearWiseDeleteQuery = @"delete from Budget where year(BudgetSaveDate)=year(getdate()) and monthoryear='Year'";
                using (var command = new SqlCommand(YearWiseDeleteQuery, ConnectionString))
                {
                    ConnectionString.Open();
                    command.ExecuteNonQuery();
                    ConnectionString.Close();
                }
                
                string YearWiseUpdateQuery = @"update Budget set ActiveFlag='N' where  year(BudgetSaveDate)=year(getdate())";
                using (var command = new SqlCommand(YearWiseUpdateQuery, ConnectionString))
                {
                    ConnectionString.Open();
                    command.ExecuteNonQuery();
                    ConnectionString.Close();
                }
                InsertNewBudgetValue(data, "Year");
                return "Budget Removed Successfully";
            }
        }

        public string InsertNewBudgetValue(Budget data,string MonthorYear)
        {
            string query = @"insert into Budget(BudgetSaveDate,BudgetAmount,MonthorYear) values(getdate()," + data.BudgetAmount+",'"+ MonthorYear + "')";
            using (var command = new SqlCommand(query, ConnectionString))
            {
                ConnectionString.Open();
                command.ExecuteNonQuery();
                ConnectionString.Close();
            }
            return "removed successfully";
        }

        [HttpDelete]
        [Route("api/RemoveSavedBudget")]
        public string RemoveSavedBudget(ExpenseManagerModel values)
        {
            string query = @"update budget set ActiveFlag='N'";
            using (var command = new SqlCommand(query, ConnectionString))
            {
                ConnectionString.Open();
                command.ExecuteNonQuery();
                ConnectionString.Close();
            }
            return "removed successfully";
        }

        [HttpGet]
        [Route("api/get_Budget")]
        public HttpResponseMessage GetBudget()
        {
            //get month budget first if null get for current year

            int rowsCount = 0;

            string BudgetAvailableCurrMonth = @"select count(*) from [dbo].[Budget] where month(BudgetSaveDate)=month(getdate()) and year(BudgetSaveDate)=year(getdate()) and ActiveFlag='Y'";
            using (var command = new SqlCommand(BudgetAvailableCurrMonth, ConnectionString))
            {
                ConnectionString.Open();
                rowsCount = (int)command.ExecuteScalar();
                ConnectionString.Close();
            }
            if (rowsCount == 0)
            {
                string YearQuery = @"select * from [dbo].[Budget] where year(BudgetSaveDate)=year(getdate()) and ActiveFlag='Y'";
                DataTable table = new DataTable();
                using (var command = new SqlCommand(YearQuery, ConnectionString))
                using (var da = new SqlDataAdapter(command))
                {
                    da.Fill(table);
                }
                return Request.CreateResponse(HttpStatusCode.OK, table);
            }
            else
            {
                string Monthquery = @"select * from [dbo].[Budget] where month(BudgetSaveDate)=month(getdate()) and year(BudgetSaveDate)=year(getdate()) and ActiveFlag='Y'";
                DataTable table = new DataTable();
                using (var command = new SqlCommand(Monthquery, ConnectionString))
                using (var da = new SqlDataAdapter(command))
                {
                    da.Fill(table);
                }
                return Request.CreateResponse(HttpStatusCode.OK, table);
            } 
        }

        [HttpGet]
        [Route("api/Type_Income")]
        public HttpResponseMessage TyepIncome(ExpenseManagerModel values)
        {
            string s = @"select sum(Amount)Amount from CategoryMaster a join Transactions b on a.categoryid=b.categoryid where type='Income' and month(getdate())=month(entrydate) and year(getdate())=year(entrydate)";
            DataTable table = new DataTable();
            using (var command = new SqlCommand(s, ConnectionString))
            using (var da = new SqlDataAdapter(command))
            {
                da.Fill(table);
            }

            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpGet]
        [Route("api/Type_Expense")]
        public HttpResponseMessage TyepExpense(ExpenseManagerModel values)
        {
            string s = @"select sum(Amount)Amount from CategoryMaster a join Transactions b on a.categoryid=b.categoryid where type='Expense' and month(getdate())=month(entrydate) and year(getdate())=year(entrydate)";
            DataTable table = new DataTable();
            using (var command = new SqlCommand(s, ConnectionString))
            using (var da = new SqlDataAdapter(command))
            {
                da.Fill(table);
            }

            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpGet]
        [Route("api/Sum_Category")]
        public HttpResponseMessage GroupCategory(ExpenseManagerModel values)
        {
            string s = @"select category as CategoryType,sum(amount)Amount from CategoryMaster a join Transactions b on a.categoryid=b.categoryid where type!='Income' and month(getdate())=month(entrydate) and year(getdate())=year(entrydate) group by category";
            DataTable table = new DataTable();
            using (var command = new SqlCommand(s, ConnectionString))
            using (var da = new SqlDataAdapter(command))
            {
                da.Fill(table);
            }

            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpGet]
        [Route("api/Budget_rowsCount")]
        public int Budget_rows(ExpenseManagerModel values)
        {
            int rowsAffected = 0;
            string s = @"select count(*) from Budget";
            using (var command = new SqlCommand(s, ConnectionString))
            {
                ConnectionString.Open();
                rowsAffected = (int)command.ExecuteScalar();
                ConnectionString.Close();
            }
            return rowsAffected;
        }

        [HttpPost]
        [Route("api/Month_Filter")]
        public int MonthFilter(ExpenseManagerModel values)
        {
            int sumAmount = 0;
            string monthFilter = @"select sum(amount) from [dbo].[ExpenseManager] where month(entrydate)="+values.month+" and year(entrydate)="+values.year+ " and TransactionType!='income'";
            using (var command = new SqlCommand(monthFilter, ConnectionString))
            {
                ConnectionString.Open();
                object obj = command.ExecuteScalar();
                if (obj.ToString().Length==0)
                {
                    sumAmount = 0;
                }
                else
                {
                    sumAmount = Convert.ToInt32(command.ExecuteScalar());
                }
                ConnectionString.Close();
            }
            return sumAmount;
        }

        [HttpPost]
        [Route("api/Year_Filter")]
        public int YearFilter(ExpenseManagerModel values)
        {
            int sumAmount = 0;
            string monthFilter = @"select sum(amount) from [dbo].[ExpenseManager] where year(entrydate)=" + values.year+ " and TransactionType!='income'";
            using (var command = new SqlCommand(monthFilter, ConnectionString))
            {
                ConnectionString.Open();
                object obj = command.ExecuteScalar();
                if (obj.ToString().Length == 0)
                {
                    sumAmount = 0;
                }
                else
                {
                    sumAmount = Convert.ToInt32(command.ExecuteScalar());
                }
                ConnectionString.Close();
            }
            return sumAmount;
        }


        [HttpGet]
        [Route("api/CurrentMonthExpense")]
        public int MonthlyExpense(ExpenseManagerModel values)
        {
            int sumAmount = 0;
            string s = @"select sum(amount) as current_month_expense from[dbo].[ExpenseManager] where month(EntryDate)=month(getdate()) and year(EntryDate)=year(GETDATE()) and TransactionType = 'expense'";
            using (var command = new SqlCommand(s, ConnectionString))
            {
                ConnectionString.Open();
                sumAmount = Convert.ToInt32(command.ExecuteScalar());
                ConnectionString.Close();
            }
            return sumAmount;
        }





        [HttpPost]
        [Route("api/AddNewCategory")]
        public string AddNewCategory(CategoryMaster data)
        {
            int rowsCount = 0;
            string s = @"select count(Type) from CategoryMaster where Category='"+data.Category+"'";
            using (var command = new SqlCommand(s, ConnectionString))
            {
                ConnectionString.Open();
                rowsCount = (int)command.ExecuteScalar();
                ConnectionString.Close();
            }
            if (rowsCount == 0)
            {
                string InsertQuery = @"insert into CategoryMaster(Category,Type) values('"+data.Category+"','"+data.Type+"')";
                using(var command=new SqlCommand(InsertQuery, ConnectionString))
                {
                    ConnectionString.Open();
                    command.ExecuteNonQuery();
                    ConnectionString.Close();
                }
                return "New Category - "+data.Category+" added successfully";
            }
            else
            {
                string query = @"select count(*) from CategoryMaster where Category='" + data.Category + "' and ActiveFlag='N'";
                using (var command = new SqlCommand(query, ConnectionString))
                {
                    ConnectionString.Open();
                    rowsCount = (int)command.ExecuteScalar();
                    ConnectionString.Close();
                }
                if (rowsCount != 0)
                {
                    string UpdateCategoryMaster = @"update CategoryMaster set ActiveFlag='Y' where Category='" + data.Category + "'";
                    using (var command = new SqlCommand(UpdateCategoryMaster, ConnectionString))
                    {
                        ConnectionString.Open();
                        rowsCount = (int)command.ExecuteNonQuery();
                        ConnectionString.Close();
                    }
                    return "New Category - " + data.Category + " added successfully";
                }
                else
                {
                    return "The entered Category " + data.Category + " already exists";
                }
            }
        }
    }
}
