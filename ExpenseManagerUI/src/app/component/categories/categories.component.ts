import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit{

  Categories:Array<any>=[]
  Header='+'
  bgcolor=''
  show:boolean=false
  CategoryValue=''

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.bgcolor=this.default
    this.RefreshData();
  }

  RefreshData(){
    this.api.getCategoryData().subscribe((data:any)=>{
      console.log(data);
      if(data.length>=1){
      this.Categories=data
      console.log(this.Categories[1].Category);

      }
      else{
        console.log("no data");
        
      }
      
    })
  }

  // Toggler(val:any){
  //   if(val.srcElement.innerHTML!='+'){
  //     this.showDelete=false
  //     this.Header='+'
  //     this.bgcolor=this.default
  //     this.show=false
  //   }
  //   else{
  //     this.show=true
  //     this.Header='Close'
  //     this.bgcolor='display:none'
  //   }
  // }

  Savefn(e:any,Type:any){
    // console.log(Type.value);
    
    if(e.value!=''){
      console.log(e.value);
      var val={
        Category:e.value,
        Type:Type.value
      }
      this.api.AddNewCategory(val).subscribe(data=>{
        alert(data)
        location.reload();
      })
    }else{
      alert('Submitted Empty So no items were added')
    }
    
    this.showDelete=false
    this.Header='+'
    this.bgcolor=this.default
    this.show=false
  }

  nav='nav-link'
  navActive='nav-link active fs-5 fw-bold'
  default='width: 100px;'
  AfterSelect='width: 100px;background-color: rgb(255, 255, 255);color: rgb(0, 0, 0);'

  showDelete:boolean=false

  edit(){
    console.log(this.Categories);
    if(this.showDelete){
      this.showDelete=false
      this.Header='+'
      this.bgcolor=this.default
    }else{
      this.showDelete=true
      this.Header='Done'
      this.bgcolor=this.AfterSelect
    }
  }

  DeleteOption(e:any){
    console.log(e);
    const confirmation=confirm(`Do You Want to delete Category ${e}`);
    if(confirmation){
      var val={
      Category:e
      }
    this.api.deleteCategory(val).subscribe(data=>{
      console.log(data);
      alert(data)
      location.reload();
      this.RefreshData();
    })
    }
  }
}
