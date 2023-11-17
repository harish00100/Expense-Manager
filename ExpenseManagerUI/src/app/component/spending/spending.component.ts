import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { 
  formatDate 
 } 
  from '@angular/common'; 
  import { 
    Inject, 
    LOCALE_ID } 
    from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, concat } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { JsonDataService } from 'src/app/services/json-data.service';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-spending',
  templateUrl: './spending.component.html',
  styleUrls: ['./spending.component.css']
})



export class SpendingComponent implements OnInit{ 

  @ViewChild('optionChoice') optionChoice!:ElementRef

  currentDate:string=''
  time=''
  categoryList:Array<any>=[]
  amount!:number
  dropdown='Choose Category'
  // show:boolean=false
  EntryForm!:FormGroup;
  selected:boolean=false
  hide:boolean=false


  
  Type:string=''
  Amount!:number




  currMonth:string=''

  categorySum:Array<any>=[]

  Income=''
  // Expense=''
  Expense=''
  Balance=''
  ExpenseEval!:number

  MonthlyExpense:number=0
  YearlyExpense:number=0

  BudgetEval:number=0

  MonthOrYearRadioValue:boolean=true

  ngOnInit(): void {
    this.spinner.show()

    this.api.BudgetRowsCount().subscribe((data:any)=>{
      console.log(data);
      if(data!=0){
        console.log(data);
        
        this.api.GetBudget().subscribe((data:any)=>{
          if(data==0)
          {

          }
          else{
          console.log(data);
          if(data[0].MonthorYear=='Month'){
            this.MonthOrYearRadioValue=true
            this.RadioValue='Month'
          }
          else{
            this.MonthOrYearRadioValue=false
            this.RadioValue='Year'
          }

          this.setBudget=data[0].BudgetAmount
          this.BudgetEval=this.setBudget
          if(this.BudgetEval>0){
            this.selected=true
            console.log(this.BudgetEval,this.selected);
          }}
        })
      }else{
        this.setBudget=0
      }
    },err=>{
      setTimeout(() => {
      this.spinner.hide();
      alert('Website did not respond well. Try again')
    }, 5000);
    })

    var val1={
      month:new Date().getMonth() + 1,
      year:new Date().getFullYear()
    }
    this.api.MonthFilter(val1).subscribe((data:any)=>{
      if(data!=0){
      this.MonthlyExpense=data
      console.log(this.MonthlyExpense);
      }
      else{
        this.MonthlyExpense=data
        console.log(this.MonthlyExpense);
        
      }
      
    })

    var val2={
      year:new Date().getFullYear()
    }
    this.api.YearFilter(val2).subscribe((data:any)=>{
      // console.log(data);
      if(data!=0){
      this.YearlyExpense=data
      console.log(this.YearlyExpense);
      }else{
        this.YearlyExpense=0
      }
    })

    this.api.GetIncomeSum().subscribe((data:any)=>{
      console.log(data);
      
      if(!data[0].Amount){
        this.Income='0'
      }
      else{
        this.Income=data[0].Amount
      }

      this.api.GetExpenseSum().subscribe((data:any)=>{
        // console.log(data);
        if(!data[0].Amount){
          this.Expense='0'
        }
        else{
          this.Expense=data[0].Amount
          this.ExpenseEval=data[0].Amount
        }
        
        this.Balance=(String)((Number)(this.Income)-(Number)(this.Expense))
        if((Number)(this.Balance)>0){
          // console.log("positive");
        }
        else{
          // console.log("negative");
          this.Balance=' - '.concat(this.Balance)
        }
      })
    })
    
    this.api.GroupSumCategory().subscribe((data:any)=>{
      console.log(data);
      this.categorySum=data
      // this.api.CurrentMonthExpense().subscribe((data:any)=>{
      //   this.currMonth=data
      // })
      this.spinner.hide();
    })

    this.EntryForm=this.fb.group({
      radio:['',Validators.required],
      amount:['',Validators.required]
    })

    this.date = new Date().toLocaleDateString('en-US');
    this.currentDate = formatDate(this.date.toString(), 'yyyy-MM-dd' ,this.locale);
    // console.log(this.currentDate);
    this.time=this.currentDate.toString()
    this.GetData();
  }

  constructor(@Inject(LOCALE_ID) public locale: string,private api:ApiService,private fb:FormBuilder,private _domsanitizer:DomSanitizer,public _jsondataService:JsonDataService,
  private spinner:NgxSpinnerService){

  }

  
  nav='nav-link'
  navActive='nav-link active fs-5 fw-bold'

  date:any

  GetData(){
    this.api.getCategoryData().subscribe((data:any)=>{
      console.log(data);
      
      this.categoryList=data
      // console.log(this.categoryList);
    })
  }

  save(){
    console.log("budget eval"+this.YearlyExpense +this.setBudget);
    
    console.log(this.EntryForm.valid,this.selected);
    
    if(this.EntryForm.valid){
      console.log(this.EntryForm.value);
      console.log(this.EntryForm.value.amount);
    
      
      var val={
        EntryDate:this.currentDate,
        Type:this.EntryForm.value['radio'],
        Category:this.dropdown,
        Amount:this.EntryForm.value['amount']
      }
      console.log(val);
      
      if(this.dropdown=='Choose Category'){
        alert('Category is not chosen.Fill all fields')
      }
      else{
        console.log("call api here");
        this.api.AddNewTransaction(val).subscribe(data=>{
          alert("Saved Successfully");
          this.EntryForm.reset()
        })
      }
      // this.RadioButtonOption=''
      this.selected=false
      this.dropdown='Choose Category'
    }
    else{
      alert('Fill all the fields')
    }
  }

  chooseCategory(val:any){
    // this.selected=true;
    this.dropdown=val.innerText
    console.log(val.innerText);
  }

  

  close(){
    // this.show=false
    location.reload()
  }

  optionEval=''

  RadioValue='Month'

  valcheck(){
    if(this.savebtn){
      this.savebtn=false
      this.clearbtn=true
    }
    else{
      this.savebtn=false
      this.clearbtn=true
    }
  }
  checkRadio1(){
    this.RadioValue='Month'
    this.hide=true
    this.selected=true;
    this.savebtn=false
    this.RadioButtonOption='Income'
    this.dropdown='Choose Category'
    // this.dropdown='Salary'
    // this.valcheck();
    // this.optionEval='M'
  }
  checkRadio2(){
    this.RadioValue='Year'
    this.hide=false
    this.selected=true;
    this.savebtn=false
    this.RadioButtonOption='Expense'
    this.dropdown='Choose Category'
    // this.valcheck();
    // this.optionEval='Y'
  }
  RadioButtonOption:string=''
  amountEval:number=0
  setBudget:number=0
  clearbtn:boolean=true
  savebtn:boolean=true
  budget(){
    this.savebtn=false
  }
  // subject:any 
  clearoption(val2:any){
    this.api.RemoveSavedBudget().subscribe(data=>{
      console.log(data);
    })
    location.reload()
  }

  saveoption(val:any){
    console.log(this.RadioValue,val.value);
    this.savebtn=true
    this.clearbtn=false
    if(this.RadioValue=='Month'){
      this.api.AddBudget(val={MonthOrYearWise:"Month",BudgetAmount:val.value}).subscribe(data=>{
          console.log(data);
          location.reload();
        })
    }
    else if(this.RadioValue=='Year'){
      this.api.AddBudget(val={MonthOrYearWise:"Year",BudgetAmount:val.value}).subscribe(data=>{
          console.log(data);
          location.reload();
        })
    }
    // this.BudgetEval=val.value
    // this.amountEval=this.amount

    // console.log(this.BudgetEval);
    
    // // console.log(this.RadioValue,val.value);
    // var init={
    //   duration:this.RadioValue,
    //   Budgetamount:val.value
    // }
    // this.api.AddBudget(init).subscribe(data=>{
    //   // console.log(data);
    // })
    // this.savebtn=true
    
  }

  ReportUrl!: SafeResourceUrl;
  AlldataURLString:string="http://localhost:65168/Reports/GetAllReport.aspx";
  UrlString:string="http://localhost:65168/Reports/ReportViewer.aspx?";
  FilteredUrlString:string="http://localhost:65168/Reports/Filtered.aspx?";
  DateFilterOnly:string="http://localhost:65168/Reports/DateFilteronly.aspx?";
  option:string="";
  startDate:string=""
  endDate:string=""

  viewReport(optionChoosed:any,val1:string,val2:string){
    console.log(optionChoosed,val1,val2);
    this.startDate=val1;
    this.endDate=val2

    if(optionChoosed==''){
      if(val1=='' && val2==''){
        this.ReportUrl=this._domsanitizer.bypassSecurityTrustResourceUrl(this.AlldataURLString)
      }
      else if((val1!='' && val2=='')||(val1=='' && val2!='')){
        alert('Fill both fields in date inputs')
      }
      else{
        this.ReportUrl=this._domsanitizer.bypassSecurityTrustResourceUrl(this.DateFilterOnly+"startDate="+this.startDate+"&endDate="+this.endDate)
      }
    }
    else{
      if(val1=='' && val2=='') //get all fields
      {
        if(optionChoosed=='1: income'){
          this.ReportUrl=this._domsanitizer.bypassSecurityTrustResourceUrl(this.UrlString+"option="+this.option)
        }
        else if(optionChoosed=='2: expense'){
          this.ReportUrl=this._domsanitizer.bypassSecurityTrustResourceUrl(this.UrlString+"option="+this.option)
        }
        else{     
          this.ReportUrl=this._domsanitizer.bypassSecurityTrustResourceUrl(this.AlldataURLString)
        }
      }
      else if((val1!='' && val2=='')||(val1=='' && val2!='')){
        alert('Fill both fields in date inputs')
      }
      else{

        if(optionChoosed=='1: income'){
          this.ReportUrl=this._domsanitizer.bypassSecurityTrustResourceUrl(this.GetQueryString())
        }
        else if(optionChoosed=='2: expense'){
          this.ReportUrl=this._domsanitizer.bypassSecurityTrustResourceUrl(this.GetQueryString())
        }
        else{      
          this.ReportUrl=this._domsanitizer.bypassSecurityTrustResourceUrl(this.AlldataURLString)
        }
      }
    }
  }

  private GetQueryString():string{
    // console.log(this.UrlString+"option="+this.option+"&startDate="+this.startDate+"&endDate="+this.endDate);
    return this.FilteredUrlString+"option="+this.option+"&startDate="+this.startDate+"&endDate="+this.endDate
  }

  clearfn(){
    const clear:HTMLSelectElement=this.optionChoice.nativeElement
    clear.value=""
  }
  
}