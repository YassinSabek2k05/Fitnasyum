import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FunctionsService } from './functions.service';
import { interval, Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { ModalController } from '@ionic/angular';


export interface User {
  id_customer?: string;
  firstname?: string;
  id_gender?: string;
  fullname?: string;
  customer_group_name?: string;
  lastname?: string;
  email?: string;
  avatarURL?: string;
  avatar_url?: string;
  phoneNumber?: string;
  date_add?: string;
  address?: string;
  position?: string;
  telephone?: string;
  profile_image?: string;
}
interface ApiResponse {
  result?: boolean;
  message?: string;
  user_data?: User;
  data?: any;
  categories?: any[];
  amount?: number;
  totalPoints?: string;
  nextExpireDate?: { date_added: string; expiration_date: string; points_value: string };
  all_movements?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ApisService {
  urlPrefix = 'https://fitnasyumapis.the-marketscene.com/';
  urlPrefixPayment = 'https://fitnasyumapis.the-marketscene.com/';
  encryptionKey: string = 'MarketSceneJP';
  CustomerData: User = {};
  homepageSlider: string[] = ['', '', ''];

  bypassPhoneNumbers: string[] = [];
  lastNotif: any = null;


  blogs: any = [];
  subscribe: any = null;
  tempImage: string = '';
  nextExpireCreditDataObj = { date_added: 'خطء', expiration_date: 'خطء', points_value: 'خطء' };
  allMovementsWallet: any[] = [];
  notifier = new Subject<void>();
  isCustomerEligableForSpinAndWin: boolean = false;
  alreadySpinOpenedThisSession: boolean = false;

  constructor(
    private modalController: ModalController,
    private httpClient: HttpClient,
    private fun: FunctionsService
  ) {
    this.setUserData();
  }

  // setCustomerData(data: User) {
  //   this.CustomerData = data;
  // }

  getCustomerData(): User {
    return this.CustomerData;
  }

  post(url: string, body: any): Promise<ApiResponse | undefined> {
    const requestUrl = `${this.urlPrefix}${url}`;
    const token = localStorage.getItem('token') || '';
    const strignifedBody = JSON.stringify(body);
    const bodyEncrypted = this.encryptString(strignifedBody, this.encryptionKey, true);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.post<ApiResponse>(requestUrl, { encryptedData: bodyEncrypted }, { headers }).toPromise();
  }

  encryptString(text: string, secretkey: string, raw: boolean): string {
    const iv = CryptoJS.enc.Utf8.parse(CryptoJS.SHA256(secretkey).toString().substring(0, 16));
    const encrypted = CryptoJS.AES.encrypt(text, secretkey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const encryptedString = encrypted.toString();
    return raw ? encryptedString : encryptedString.replace(/\+/g, '_');
  }

  post_outside(url: string, body: any): Promise<any> {
    return this.httpClient.post(url, body).toPromise();
  }

  post_for_files(url: string, body: any): Promise<any> {
    const requestUrl = `${this.urlPrefix}${url}`;
    return this.httpClient.post(requestUrl, body).toPromise();
  }

  RealTimeUpdate() {
    this.subscribe = interval(10000).subscribe(() => {
      if (this.CustomerData?.id_customer) {
        this.getUserLastNotification();
        this.checkIfAccountBlocked();
      }
    });
  }

  async copounApply(CopounCode: string): Promise<void> {
    if (!CopounCode) {
      await this.fun.errorToast('من فضلك ادخل الكوبون');
      return;
    }
    if (CopounCode.length < 5) {
      await this.fun.errorToast('ادخل كوبون صحيح');
      return;
    }
    console.log(CopounCode);
    await this.fun.presentLoader();
    try {
      const res = await this.post('coupons/Redeem', { userId: this.CustomerData.id_customer, code: CopounCode });
      console.log(res);
      if (res?.result) {
        await this.fun.presentToast(`تم اضافة ${res.amount} نقطة الى محفطتك`, false, 'bottom', 10000);
      } else {
        await this.fun.errorToast(res?.message || 'Error');
      }
    } catch (err) {
      console.log(err);
    } finally {
      await this.fun.loadingController.dismiss();
    }
  }

  checkIfAccountBlocked() {
    if (this.CustomerData.id_customer && this.CustomerData.id_customer.length > 0) {
      this.post('auth/CheckIfUserActive', { customer_id: this.CustomerData.id_customer })
        .then((res) => {
          if (!res?.result) {
            this.fun.errorToast(res?.message || 'Account blocked');
            localStorage.clear();
            this.CustomerData = {};
            this.fun.navigate('firebase/auth/sign-in', false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  async accountDeactivate(): Promise<ApiResponse | undefined> {
    await this.fun.presentLoader();
    return this.post('auth/deleteAcc', {
      Token: 'HELLOFROMTHEOTHERSIDE',
      customer_id: this.CustomerData.id_customer,
    });
  }
  postWithHeaders(url: string, body: any): Promise<any> {
    const head = new HttpHeaders()
      .append('Accept', 'application/json')
      .append('Content-Type', 'application/json');
    const formData = new FormData();
    Object.keys(body).forEach((key) => {
      formData.append(key, body[key]);
    });
    const requestUrl = `${this.urlPrefixPayment}${url}`;
    return this.httpClient.post(requestUrl, formData, { headers: head }).toPromise();
  }

  postWithHeaderstest(url: string, body: any): any {
    const head = new HttpHeaders()
      .append('Accept', 'application/json')
      .append('Content-Type', 'application/json');
    const formData = new FormData();
    Object.keys(body).forEach((key) => {
      formData.append(key, body[key]);
    });
    const requestUrl = `${this.urlPrefixPayment}${url}`;
    return this.httpClient.post(requestUrl, formData, { headers: head });
  }

  checkForUpdate(): Promise<ApiResponse | undefined> {
    return this.post('auth/AppVersion', {});
  }






  getUserLastNotification() {
    this.post('notifications/GetLastNotif', { user_id: this.CustomerData?.id_customer })
      .then((res) => {
        this.isCustomerEligableForSpinAndWin = true;
        this.lastNotif = res?.data || null;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setUserData() {
    const UserObj = localStorage.getItem('fitnasyum_backend_data');
    if (UserObj) {
      this.CustomerData = JSON.parse(UserObj);
    }
  }

  isHealthInfoRegistered() {
    return this.post('auth/isHealthInfoRegistered', { id_customer: this.CustomerData?.id_customer })
      .then((res) => {
        return res?.result || false;
      })
      .catch((err) => {
        console.error('Error checking health info registration:', err);
        return false;
      });
  }


}