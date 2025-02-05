import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: false
})
export class SigninPage implements OnInit {
  login: any = { username: '', password: '' };
  constructor() { }
  onLogin(){
    console.log('user name:', this.login.username );
    console.log('user password', this.login.password );
  }
  ngOnInit() {
  }

}
