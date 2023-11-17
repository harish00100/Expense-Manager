import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { 
  formatDate 
 } 
  from '@angular/common'; 
import { 
  Inject, 
  LOCALE_ID } 
  from '@angular/core';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit{

  ExpenseList:Array<any>=[]
  IncomeList:Array<any>=[]

  form!:FormGroup
  categoryList:Array<any>=[]
  dropdown='Choose Category'

  constructor(@Inject(LOCALE_ID) public locale: string,private api:ApiService,private fb:FormBuilder,public datepipe: DatePipe){}

  ngOnInit(): void {
    this.form=this.fb.group({
      valtype:['',Validators.required],
      ValCategory:['',Validators.required],
      ValDates:['',Validators.required]
    })
    this.GetData();
    // this.form=new FormGroup({
    //   valtype:new FormControl(Validators.required),
    //   ValCategory:new FormControl(Validators.required),
    //   ValDates:new FormControl(Validators.required)
    // })

    this.api.getIncomeList().subscribe((data:any)=>{ //object cannot assign to array (data:any)
      this.IncomeList=data      
      for(let i of this.IncomeList){
        i.EntryDate=new Date(i.EntryDate).toLocaleDateString("fr-FR"); //en-US will work properly fr-FR new functionality //en-US
      }
      console.log(data);
    })

    

    this.api.getIncomeList().subscribe((data:any)=>{
      this.ExpenseList=data
      for(let i of this.ExpenseList){
        i.EntryDate=new Date(i.EntryDate).toLocaleDateString("fr-FR"); //en-US will work properly fr-FR new functionality
      }
      console.log(data);
    })
  }
  errormessage:string='';

  nav='nav-link'
  navActive='nav-link active fs-5 fw-bold'
  Income:number | undefined
  Category:string=''
  Dates=''
  ShowForm:boolean=false
  hide:boolean=false
  Data:any
  TransactionDataBeforeChanged:any

  IncomeOrExpense:string=''
  edit(val:any){
    // console.log(val.EntryDate.slice(0,2));
    // console.log(val.EntryDate.slice(3,5));
    // console.log(val.EntryDate.slice(3,5)+'/'+val.EntryDate.slice(0,2)+'/'+val.EntryDate.slice(7,));
      
    
    this.Data=val
    console.log(val);
    this.TransactionDataBeforeChanged=val
    this.dropdown=val.Category
    if(this.dropdown=='Salary'){
      this.hide=true
    }
    else{
      this.hide=false
    }
    this.ShowForm=true
    this.Income=val.Amount
    this.Category=val.CategoryType
    this.Dates=formatDate(val.EntryDate.slice(3,5)+'/'+val.EntryDate.slice(0,2)+'/'+val.EntryDate.slice(7,), 'yyyy-MM-dd' ,this.locale);
    // console.log(this.Income,val);
    console.log(val.type);
    this.IncomeOrExpense=val.type
    
    
  }

  save(income:any,date:any){
    // console.log(income,this.dropdown,date);
    this.ShowForm=false
    
    var val={
      TransactionId:this.Data.TransactionId,
      Amount:income,
      Category:this.dropdown,
      Type:this.IncomeOrExpense,
      EntryDate:date
    }
    console.log(val);
    this.api.UpdateExistingTransactions(val).subscribe(data=>{
      alert('Updated Successfully')
      location.reload()
    })

  }

  close(){
    this.ShowForm=false
  }

  GetData(){
    this.api.getCategoryData().subscribe((data:any)=>{
      this.categoryList=data
      console.log(this.categoryList);
    })
  }

  chooseIncomeCategory(val:any){
    console.log(val.innerText,this.IncomeList);
    
    this.dropdownIncomeChange=val.innerText

    var value={
      CategoryType:this.dropdownIncomeChange
    }
    console.log(value);
    
    this.api.CategoryFilter(value).subscribe((data:any)=>{
      console.log(data);
      this.IncomeList=data
      for(let i of this.IncomeList){
        i.EntryDate=new Date(i.EntryDate).toLocaleDateString("fr-FR"); //en-US will work properly fr-FR new functionality
      }
    })
  }
  
  chooseExpenseCategory(val:any){
    this.dropdownExpenseChange=val.innerText
    var value={
      CategoryType:this.dropdownExpenseChange
    }
    console.log(value);
    
    this.api.CategoryFilter(value).subscribe((data:any)=>{
      // console.log(data);
      this.ExpenseList=data
      for(let i of this.ExpenseList){
        i.EntryDate=new Date(i.EntryDate).toLocaleDateString("fr-FR"); //en-US will work properly fr-FR new functionality
      }
    })
  }

  

  chooseCategory(val:any){
    // this.selected=true;
    this.dropdown=val.innerText
    
    // this.dropdownIncomeChange=val.innerText
    console.log(val.innerText);

   
  }

  delete(val:any,DeleteOption:string){

    console.log(val,DeleteOption);

    var value={
      TransactionId:val.TransactionId
    }
    

    if(DeleteOption=='Income'){
      this.api.UpdateIncomeFlag(value).subscribe(data=>{
        alert('Deleted a Income Successfully')
        location.reload()
      })
    }
    else if(DeleteOption=='Expense'){
      this.api.UpdateExpenseFlag(value).subscribe(data=>{
        alert('Deleted a Expense Successfully')
        location.reload()
      })
    }
  }

  dropdownExpenseChange='Choose category'
  dropdownIncomeChange='Choose category'
  changeValue(){
    console.log("called");
    
  }

  toShow:boolean=false;

  defaultFromStyle='font-size: small;cursor:pointer'
  defaultToStyle='font-size: small;pointer-events: none'

  defaultExpenseFromStyle='font-size: small;cursor:pointer'
  defaultExpenseToStyle='font-size: small;pointer-events: none'
  IncomeFromTime:any
  // IncomeToTime:any
  ExpenseFromTime:any

  fromcalc(val:any){
    if(val.value){
      this.IncomeFromTime=val.value
      this.toShow=true
      this.defaultToStyle='font-size: small;cursor:pointer'

      console.log(val.value);
    }
  }

  fromExpensecalc(val:any){
    if(val.value){
      this.ExpenseFromTime=val.value
      this.toShow=true
      this.defaultExpenseToStyle='font-size: small;cursor:pointer'

      console.log(val.value);
    }
  }

  date1:any
  date2:any

  tocalc(val:any){
    if(this.toShow){
      this.date1 =this.IncomeFromTime.toString();
      this.date2 =val.value.toString();
      
      if(this.date1>this.date2){
        console.log("1 is greater");
        console.log("No API call");
        // alert('Wrong Date Range. Check the Date to which you want to filter and Try Again...')
      }
      else{
        console.log("2 is greater");
        var value={
          EntryDate:this.date1,
          EntryEndDate:this.date2
          // EntryDate:this.datepipe.transform(this.date1, 'dd/MM/yyyy'),EntrysDate:this.datepipe.transform(this.date2, 'dd/MM/yyyy')
        }
        console.log(value.EntryDate[0]);
        console.log(value.EntryDate[1]);
        this.api.IncomeDateFilter(value).subscribe((data:any)=>{
          console.log(data);
          this.IncomeList=data
          for(let i of this.IncomeList){
            i.EntryDate=new Date(i.EntryDate).toLocaleDateString("fr-FR"); //en-US will work properly fr-FR new functionality
          }
        })
      }
    }
  }


  toExpensecalc(val:any){
    if(this.toShow){
      this.date1 =this.ExpenseFromTime.toString();
      this.date2 =val.value.toString();
      
      if(this.date1>this.date2){
        console.log("1 is greater");
        console.log("No API call");
      }
      else{
        console.log("2 is greater");
        var value={
          EntryDate:this.date1,
          EntryEndDate:this.date2
          // EntryDate:this.datepipe.transform(this.date1, 'dd/MM/yyyy'),EntrysDate:this.datepipe.transform(this.date2, 'dd/MM/yyyy')
        }
   
        this.api.ExpenseDateFilter(value).subscribe((data:any)=>{
          console.log(data);
          this.ExpenseList=data
          for(let i of this.ExpenseList){
            i.EntryDate=new Date(i.EntryDate).toLocaleDateString("fr-FR"); //en-US will work properly fr-FR new functionality
          }
        })
      }
    }
  }
}
