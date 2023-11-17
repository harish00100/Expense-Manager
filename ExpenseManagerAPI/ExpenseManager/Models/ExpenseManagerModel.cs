using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ExpenseManager.Models
{
    public class ExpenseManagerModel
    {
        public string Category { get; set; }
        public DateTime EntryDate { get; set; }
        public DateTime EntrysDate { get; set; }
        public string CategoryType { get; set; }
        public string TransactionType { get; set; }
        public int Amount { get; set; }
        public int Transaction_Id { get; set; }
        public DateTime EntryExpenseDate { get; set; }
        public DateTime EntrysExpenseDate { get; set; }
        public string duration { get; set; }
        public string Budgetamount { get; set; }
        public int month { get; set; }
        public int year { get; set; }
    }
}