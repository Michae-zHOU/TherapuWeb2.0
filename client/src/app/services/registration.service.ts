import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RegistrationService {
  
  constructor(private http: Http) { }

  //signup
  // submitReg(newUser) {
  //   var headers = new Headers();
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.post('http://localhost:3000/auth', JSON.stringify(newUser), {headers: headers})
  //   .map(res=> res.json())
  // }
  //login
  login(user) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(user)
    return this.http.post('http://localhost:3000/login', JSON.stringify(user), {headers: headers})
    .map(res => res.json())

    }
}
