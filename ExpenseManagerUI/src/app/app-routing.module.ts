import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpendingComponent } from './component/spending/spending.component';
import { TransactionsComponent } from './component/transactions/transactions.component';
import { CategoriesComponent } from './component/categories/categories.component';
import { ReportsComponent } from './component/reports/reports.component';
import { ErrorpageComponent } from './component/errorpage/errorpage.component';

const routes: Routes = [
  {path:'',redirectTo:'Spending',pathMatch:'full'},
  {path:'Spending',component:SpendingComponent},
  {path:'Transactions',component:TransactionsComponent},
  {path:'Categories',component:CategoriesComponent},
  {path:'Reports',component:ReportsComponent},
  {path:'**',component:ErrorpageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
