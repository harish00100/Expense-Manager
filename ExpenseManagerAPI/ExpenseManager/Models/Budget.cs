using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ExpenseManager.Models
{
    public class Budget
    {
        public DateTime BudgetSaveDate { get; set; }
        public decimal BudgetAmount { get; set; }
        public string MonthOrYearWise { get; set; }
    }
}