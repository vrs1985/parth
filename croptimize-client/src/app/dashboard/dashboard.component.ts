import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private url : string = 'http://localhost:1337/api/test';
  private url2 : string = 'http://localhost:1337/guitar/count';  
  private url3 : string = `http://localhost:1337/api/login/getToken`;

  constructor(private http: HttpClient) { }

  getTestApi() {
    this.http.get(this.url, httpOptions).toPromise()
    .then(
      res => console.log("TEST API", res ),
      err => console.log('Error:',err)
    );

    // this.http.get(this.url2, httpOptions).toPromise()
    // .then( 
    //   res => console.log("TEST API2", res ),
    //   err => console.log('Error2:',err)
    // );

  }

  ngOnInit() {
  }

  sendToken(){
    let acess_token = window.localStorage.getItem('code');
    this.http.get(`http://localhost:1337/api/login/getToken/${acess_token}`, httpOptions).toPromise()
    .then( 
      res => localStorage.setItem('socket_token', res['token']),
      err => console.log('Error2:',err)
    );
  }

  subscribeData(){
    let socket_token = window.localStorage.getItem('code');
    this.http.get(`http://localhost:1337/api/stream/${socket_token}/subscribe`, httpOptions).toPromise()
    .then( 
      res => console.log(res),
      err => console.log('Error2:',err)
    );
  }

}
