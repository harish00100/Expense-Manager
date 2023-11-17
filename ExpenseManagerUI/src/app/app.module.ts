import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpendingComponent } from './component/spending/spending.component';
import { TransactionsComponent } from './component/transactions/transactions.component';
import { CategoriesComponent } from './component/categories/categories.component';

import { HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportsComponent } from './component/reports/reports.component';
import { ErrorpageComponent } from './component/errorpage/errorpage.component';

@NgModule({
  declarations: [
    AppComponent,
    SpendingComponent,
    TransactionsComponent,
    CategoriesComponent,
    ReportsComponent,
    ErrorpageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-clip-rotate-multiple' }),
    BrowserAnimationsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
