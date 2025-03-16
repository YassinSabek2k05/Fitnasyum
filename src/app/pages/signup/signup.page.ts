import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements OnInit {

  fullname : string = '';
  email : string = '';
  phoneNumber : string = '';
  password : string = '';
  formError: boolean = false;
  formErrorMSG: string = '';
  isLoading: boolean = false;
  apiError: boolean = false;
  apiErrorMessage: string = '';

  alertButtons = ['Ok'];
  state: boolean = true;

  apiUrl: string = 'https://fitnasyumapis.laviedentalcenter.com/auth/signup';

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
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
  }

  inputValidation() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!this.fullname?.trim() || this.fullname.length < 8)
      return this.setError('Full name must be at least 8 characters.');
    
    if (!this.email || !emailPattern.test(this.email))
      return this.setError('Please enter a valid email address.');
  
    if (!this.phoneNumber || this.phoneNumber.length !== 11 || isNaN(Number(this.phoneNumber)))
      return this.setError('Phone number should be 11 digits and contain only numbers.');
  
    if (!this.password || this.password.length < 8)
      return this.setError('Password must be at least 8 characters long.');
  
    this.formError = false;

    return true;
  }
  
  setError(msg: string) {
    this.formErrorMSG = msg;
    this.formError = true;
  }
  
  signup() {
    if(this.inputValidation()) {
      this.switchMode();
    }
  }

  signupApi() {
    this.isLoading = true;
    const signupData = {fullname: this.fullname, email: this.email, mobile: this.phoneNumber, passwd: this.password};

    this.http.post(this.apiUrl, signupData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response?.result) { 
          localStorage.setItem('userName', response.data?.fullname || 'User');
          localStorage.setItem("token", response.data?.secure_key || '');
          localStorage.setItem("fitnasyum_backend_data", JSON.stringify(response?.data || {}));
          
          setTimeout(() => {
            this.router.navigate(['/details']).then(() => {
              window.location.reload();
            });
          }, 100); 
        } else {
          this.apiErrorMessage = response?.message || 'Unexpected error occurred';
          this.apiError = true;
          console.log(response);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.apiErrorMessage = error?.error?.message || 'An error occurred while logging in';
        this.apiError = true;
      }
    });
  }

  myString: string = "";
  otp: string = "1234";
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
            this.signupApi();
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

  clear(){
    this.formError = false;
  }

}
