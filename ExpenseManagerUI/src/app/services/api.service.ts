import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  // apiURL='http://localhost:65168/api';
  apiURL=environment.apiURL;

  getCategoryData(){
    return this.http.get(this.apiURL+'/get_Category');
  }

  deleteCategory(val:any){
    return this.http.post(this.apiURL+'/delete_Category',val)
  }

  addCategory(val:any){
    return this.http.post(this.apiURL+'/Add_Category',val)
  }

  AddNewTransaction(val:any){
    return this.http.post(this.apiURL+'/AddNewTransaction',val);//changed
  }

  getIncomeList(){
    return this.http.get(this.apiURL+'/get_IncomeList');
  }

  getExpenseList(){
    return this.http.get(this.apiURL+'/get_ExpenseList');
  }

  UpdateExistingTransactions(val:any){
    return this.http.post(this.apiURL+'/UpdateExistingTransactions',val)
  }

  UpdateIncomeFlag(val:any){
    return this.http.post(this.apiURL+'/UpdateIncomeFlag',val)
  }

  UpdateExpenseFlag(val:any){
    return this.http.post(this.apiURL+'/UpdateExpenseFlag',val)
  }

  CategoryFilter(val:any){
    return this.http.post(this.apiURL+'/item_Category',val)
  }

  IncomeDateFilter(val:any){
    return this.http.post(this.apiURL+'/IncomeDate_Filter',val)
  }

  ExpenseDateFilter(val:any){
    return this.http.post(this.apiURL+'/ExpenseDate_Filter',val)
  }

  AddBudget(val:any){
    return this.http.post(this.apiURL+'/Add_Budget',val);
  }

  GetBudget(){
    return this.http.get(this.apiURL+'/get_Budget')
  }

  RemoveSavedBudget(){
    return this.http.delete(this.apiURL+'/RemoveSavedBudget');
  }

  GetIncomeSum(){
    return this.http.get(this.apiURL+'/Type_Income')
  }

  GetExpenseSum(){
    return this.http.get(this.apiURL+'/Type_Expense')
  }

  GroupSumCategory(){
    return this.http.get(this.apiURL+'/Sum_Category')
  }

  BudgetRowsCount(){
    return this.http.get(this.apiURL+'/Budget_rowsCount')
  }

  MonthFilter(val:any){
    return this.http.post(this.apiURL+'/Month_Filter',val)
  }

  YearFilter(val:any){
    return this.http.post(this.apiURL+'/Year_Filter',val)
  }

  CurrentMonthExpense(){
    return this.http.get(this.apiURL+'/CurrentMonthExpense')
  }




  
  //
  AddNewCategory(value:any){
    return this.http.post(this.apiURL+'/AddNewCategory',value)
  }
}
