import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private service: HttpClient) {

  }

  apiURL:any = 'http://localhost:3200'

  post(URL: any, data: any){
    return this.service.post(`${this.apiURL}${URL}`,data)
  }
}
