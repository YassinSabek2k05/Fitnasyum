import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FunctionsService } from './functions.service';
import { interval, Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { ModalController } from '@ionic/angular';

export interface Product {
  id?: number;
  name: string;
  category_id?: number;
  price?: number;
  images?: string[];
  description?: string;
}

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

export interface Shift {
  user_id?: string;
  shift_date?: Date;
  shift_start_time: string;
  shift_end_time: string;
  extra_feature_object: string;
  hour_rate: string;
  total_rate: string;
  total_working_hour: string;
  notes: string;
}

interface ApiResponse {
  result?: boolean;
  message?: string;
  user_data?: User;
  data?: any;
  products?: Product[];
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
  urlPrefix = 'https://fitnasyumapis.laviedentalcenter.com/';
  urlPrefixPayment = 'https://fitnasyumapis.laviedentalcenter.com/';
  encryptionKey: string = 'MarketSceneJP';
  products_array: Product[] = [];
  category_products: any[] = [];
  userwalletamount: number = 0;
  userTotalPoints: number = 0;
  PointsRedmedBefore: number = 0;
  CustomerData: User = {};
  showMobileRecharge: boolean = false;
  showOptionalSignUp: boolean = true;
  products_catl_imgs: any[] = [];
  schwabe_products: any[] = [];
  networksArray: any[] = [];
  show_rooms: any = null;
  appCommi: number = 5;
  subscribe: any = null;
  positions: any = null;
  softwares: any = null;
  homepageSlider: string[] = ['', '', ''];
  showGuestLogin: boolean = true;
  bypassPhoneNumbers: string[] = [];
  lastNotif: any = null;
  pharmacyOwner: boolean = true;
  thirdTierPerc: number = 0;
  secondTierPerc: number = 0;
  firstTierPerc: number = 0;
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
        this.getWalletAmount();
        this.getUserLastNotification();
        this.getTiersData();
        this.checkIfAccountBlocked();
      }
    });
  }

  getBebastaRechargeGetServiceInputParamter(service_id: number) {
    this.post('bebasata/BebastaRechargeGetServiceInputParamter', {
      id_customer: this.CustomerData.id_customer,
      service_id: service_id,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getBebastaproviderList(service_id: number) {
    this.post('bebasata/BebastaGetProviderList', {
      id_customer: this.CustomerData.id_customer,
      service_id: service_id,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getBebastaProviderListOfServices(provider_id: number) {
    this.post('bebasata/BebastaGetServiceListForProvider', {
      id_customer: this.CustomerData.id_customer,
      service_id: provider_id,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
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

  getTiersData() {
    if (this.userTotalPoints) {
      this.thirdTierPerc = Number((this.userTotalPoints / 25000).toFixed(2));
      this.secondTierPerc = Number((this.userTotalPoints / 50000).toFixed(2));
      this.firstTierPerc = Number((this.userTotalPoints / 100000).toFixed(2));
      if (this.thirdTierPerc >= 1) {
        this.secondTierPerc = Number((this.userTotalPoints / 50000).toFixed(2));
        this.thirdTierPerc = 1;
      }
      if (this.secondTierPerc >= 1) {
        this.firstTierPerc = Number((this.userTotalPoints / 100000).toFixed(2));
        this.secondTierPerc = 1;
      }
      if (this.firstTierPerc > 1) {
        this.firstTierPerc = 1;
      }
    }
  }

  async accountDeactivate(): Promise<ApiResponse | undefined> {
    await this.fun.presentLoader();
    return this.post('auth/deleteAcc', {
      Token: 'HELLOFROMTHEOTHERSIDE',
      customer_id: this.CustomerData.id_customer,
    });
  }

  getPointsForAchiv(tier: string): number | undefined {
    switch (tier) {
      case 'thirdtier':
        return this.userTotalPoints >= 25000 ? 25000 : this.userTotalPoints;
      case 'secondtier':
        return this.userTotalPoints >= 50000 ? 50000 : this.userTotalPoints;
      case 'firsttier':
        return this.userTotalPoints >= 100000 ? 100000 : this.userTotalPoints;
      default:
        return undefined;
    }
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

  getWalletAmount() {
    if (this.CustomerData?.id_customer) {
      this.post('auth/walletAmount', { user_id: this.CustomerData.id_customer })
        .then((values: ApiResponse | undefined) => {
          console.log(values);
          this.userwalletamount = values?.data?.amount || 0;
          this.userTotalPoints = Number(values?.data?.totalPoints || '0');
          this.PointsRedmedBefore = this.userTotalPoints - this.userwalletamount;
          this.nextExpireCreditDataObj = values?.nextExpireDate || this.nextExpireCreditDataObj;
          this.allMovementsWallet = values?.all_movements || this.allMovementsWallet;
          if (
            this.userTotalPoints >= 25000 &&
            this.CustomerData.position !== 'silver_customer' &&
            this.CustomerData.position !== 'gold_customer' &&
            this.CustomerData.position !== 'plat_customer'
          ) {
            this.post('wallet/UpgradeProfile', {
              token: 'c6d01ceb06b92a7ceca9a9b0db410ff1',
              customer_id: this.CustomerData.id_customer,
              nextLevel: 'silver_customer',
            }).then((res) => {
              if (res?.result) {
                this.CustomerData = res.user_data || {};
                if (res.user_data) {
                  localStorage.setItem('fitnasyum_backend_data', JSON.stringify(res.user_data));
                }
                this.fun.presentToast(res.message || 'Upgraded', false, 'middle', 10000);
              } else {
                this.CustomerData = res?.user_data || {};
                if (res?.user_data) {
                  localStorage.setItem('fitnasyum_backend_data', JSON.stringify(res.user_data));
                }
                this.fun.errorToast(res?.message || 'Error');
              }
            });
          }
          if (
            this.userTotalPoints >= 50000 &&
            this.CustomerData.position !== 'gold_customer' &&
            this.CustomerData.position !== 'plat_customer'
          ) {
            this.post('wallet/UpgradeProfile', {
              token: 'c6d01ceb06b92a7ceca9a9b0db410ff1',
              customer_id: this.CustomerData.id_customer,
              nextLevel: 'gold_customer',
            }).then((res) => {
              if (res?.result) {
                this.CustomerData = res.user_data || {};
                if (res.user_data) {
                  localStorage.setItem('fitnasyum_backend_data', JSON.stringify(res.user_data));
                }
                this.fun.presentToast(res.message || 'Upgraded', false, 'middle', 10000);
              } else {
                this.CustomerData = res?.user_data || {};
                if (res?.user_data) {
                  localStorage.setItem('fitnasyum_backend_data', JSON.stringify(res.user_data));
                }
                this.fun.errorToast(res?.message || 'Error');
              }
            });
          }
          if (this.userTotalPoints >= 100000 && this.CustomerData.position !== 'plat_customer') {
            this.post('wallet/UpgradeProfile', {
              token: 'c6d01ceb06b92a7ceca9a9b0db410ff1',
              customer_id: this.CustomerData.id_customer,
              nextLevel: 'plat_customer',
            }).then((res) => {
              if (res?.result) {
                this.CustomerData = res.user_data || {};
                if (res.user_data) {
                  localStorage.setItem('fitnasyum_backend_data', JSON.stringify(res.user_data));
                }
                this.fun.presentToast(res.message || 'Upgraded', false, 'middle', 10000);
              } else {
                this.CustomerData = res?.user_data || {};
                if (res?.user_data) {
                  localStorage.setItem('fitnasyum_backend_data', JSON.stringify(res.user_data));
                }
                this.fun.errorToast(res?.message || 'Error');
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  getShowrooms() {
    this.post('auth/GetShowRooms', {})
      .then((res) => {
        this.show_rooms = res?.data || null;
        return this.show_rooms;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getProductsAndCategories() {
    this.post('auth/GetProductsAndCategories', {})
      .then((res) => {
        this.products_array = res?.products || [];
        this.category_products = res?.categories || [];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  fromBarCodeToPoints(qrCodeValue: string) {
    const token = 'c6d01ceb06b92a7ceca9a9b0db410ff1';
    this.fun.presentLoader();
    this.post('wallet/FromCodeToPoints', {
      token: token,
      customer_id: this.CustomerData.id_customer,
      qr_code: qrCodeValue,
    })
      .then((res) => {
        console.log(res);
        if (res?.result) {
          this.fun.presentToast(res.message || 'Success', false, 'bottom', 10000);
        } else {
          this.fun.errorToast(res?.message || 'Error');
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.fun.loadingController.dismiss();
      });
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