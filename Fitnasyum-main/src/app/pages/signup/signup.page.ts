import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements OnInit {

  alertButtons = ['Ok'];
  state: boolean = true;
  switchMode(){
    this.state = !this.state;
  }
  show(state: boolean){
    if(this.state == state){
      return 'visible';
    }
    else{
      return 'hidden';
    }
  }
  constructor() {
       }

  ngOnInit() {
  }
  myString: string = "";
  otp: string = "";
  generateOTP(){
    while(this.otp.length<4){
      this.otp += ""+(Math.floor(Math.random() * (9 - 0 + 1)) + 0);
    }
    return this.otp;
  }
  toNumeric(){
    this.myString = this.myString.replace(/\D/g,'');
  }
  getDig(i: number) {
    this.toNumeric();
    if(this.myString.charAt(i)>='0'&&this.myString.charAt(i)<='9')
    return this.myString.charAt(i);
    else return'';
  }
  onNumberClick(event: any) {
    this.toNumeric();
    const value = event.target.dataset.value;
    switch (value) {
      case 'backspace': {
        this.myString = this.myString.substring(0, this.myString.length - 1);
        break;
      }
      case 'clear': {
        this.myString = "";
        console.log(this.myString);
        break;
      }
      default:{
        console.log('Button value:', value);
        if(this.myString.length ==3){
          this.myString += value;
          console.log('4 digits: ', this.myString);
          if(this.myString == this.otp){
            this.showCorrectOTP(true);
            console.log('OTP Matched');
          }
          else{
            this.showWrongOTP(true);
            console.log('OTP Not Matched');
            this.myString = "";
          }
        }
        else if(this.myString.length < 4){
          this.myString += value;
        }
        break;
      }
      
    }
    console.log(this.myString);

  }
  focus(index: number): string {
    // Return the class name(s) you want to apply based on the index
    return index === this.myString.length ? 'focus' : 'box';
  }
  correctOTP: boolean = false;
  wrongOTP: boolean = false;
  showCorrectOTP(flag: boolean){
    this.correctOTP = flag;
  }
  showWrongOTP(flag: boolean){
    this.wrongOTP = flag;
  }

}
