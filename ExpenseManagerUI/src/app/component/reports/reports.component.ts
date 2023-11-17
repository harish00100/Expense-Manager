import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { JsonDataService } from 'src/app/services/json-data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

  @ViewChild('optionChoice') optionChoice!:ElementRef

  nav='nav-link'
  navActive='nav-link active fs-5 fw-bold'
  
  constructor(private _domsanitizer:DomSanitizer,public _jsondataService:JsonDataService){}

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
    if(this.startDate>this.endDate){
      alert('start Date Should not be greater than End Date')
    }
    else{
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
