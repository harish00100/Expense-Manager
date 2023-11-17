using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ExpenseManager.Models
{
    public class Transactions
    {
        public DateTime EntryDate { get; set; }
        public DateTime EntryEndDate { get; set; }
        public int CategoryID { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; }
        public string Category { get; set; }
        public int TransactionId { get; set; }
    }
}