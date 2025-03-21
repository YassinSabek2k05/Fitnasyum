import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';

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
  apiError: boolean = false;
  apiErrorMessage: string = '';
  isLoading: boolean = false;

  apiUrl: string = 'https://fitnasyumapis.the-marketscene.com/auth/signin';

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApisService
  ) { }

  onLogin(){

    if(this.phone.length != 11 || isNaN(Number(this.phone))){
      this.phoneError = true; 
      return;
    }
    if(this.password.length < 8){
      this.passwordError = true;
      return;
    }

    this.isLoading = true;

    const loginData = {phoneNumber: this.phone, password: this.password};

    this.http.post(this.apiUrl, loginData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response?.result) { 
          localStorage.setItem('userName', response.data?.fullname || 'User');
          localStorage.setItem("token", response.data?.secure_key || '');
          localStorage.setItem("fitnasyum_backend_data", JSON.stringify(response?.data || {}));

          setTimeout(() => {
            this.router.navigate(['/tabs']).then(() => {
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
  ngOnInit() {
  }
  clear(){
    this.phoneError = false;
    this.passwordError = false;
    this.apiError = false;
  }

}
