import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: false
})
export class SigninPage implements OnInit {
  alertButtons = ['Retry'];
  phone: string = '';
  password: string = '';
  phoneError: boolean = false;
  passwordError: boolean = false;
  constructor(private router: Router) { }
  onLogin() {
    this.router.navigateByUrl('/details');
    return
    if (this.phone.length != 11 || !isNaN(Number(this.phone))) {
      this.phoneError = true;
    }
    else if (this.password.length <= 8) {
      this.passwordError = true;
    }
    else {
      console.log('Phone Number:', this.phone);
      console.log('user password', this.password);
    }
  }
  ngOnInit() {
  }
  clear() {
    this.phone = '';
    this.password = '';
  }

}
