import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  option:option[]=[{"option":"income"},{"option":"expense"}]

  constructor() { }
}
 
export interface option{
  option:string
}