import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FunctionsService } from './functions.service';
import { interval, Subject } from 'rxjs';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { takeUntil } from "rxjs/operators"
import * as CryptoJS from 'crypto-js';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { FirebaseAuthService } from '../firebase/auth/firebase-auth.service';
import { SpinTheWheelModal } from '../spin-the-wheel-modal/spin-the-wheel-modal.page';
export interface Product {
  [x: string]: any;
  id?;
  name;
  category_id?;
  price?;
  images?;
  description?;
}
export interface User {
  [x: string]: any;
  id_customer?: string;
  firstname?: String;
  id_gender?: string;
  fullname?: string;
  customer_group_name?: String;
  lastname?: String;
  email?: String;
  avatarURL?: string;
  avatar_url?: string;
  phoneNumber?: string;
  date_add?: string;
  address?: string;
  position?: String;
  telephone?: String;
  profile_image?: String;
}
export interface Shift {
  user_id?: String;
  shift_date?: Date;
  shift_start_time: String;
  shift_end_time: String;
  extra_feature_object: String;
  hour_rate: String;
  total_rate: String;
  total_working_hour: String;
  notes: String;
}
@Injectable({
  providedIn: 'root'
})
export class ApisService {
  [x: string]: any;
  //https://apis-jazeera-paints.delicals.com/
  //https://apis-jazeera-paints.delicals.com/
  //http://ashanak.jazeerapaints.com/
  urlPrefix = "https://apis.ashanak.jazeerapaints.com/";
  urlPrefixPayment = "https://apis.ashanak.jazeerapaints.com/";
  encryptionKey: string = 'MarketSceneJP';
  products_array: Product[];
  category_products = [];
  userwalletamount; userTotalPoints; PointsRedmedBefore;
  CustomerData: User;
  showMobileRecharge = false;
  showOptionalSignUp = true;
  products_catl_imgs = [];
  schwabe_products = [];
  networksArray = [];
  show_rooms: any;
  appCommi = 5;
  subscribe;
  positions;
  softwares;
  homepageSlider = ['', '', ''];
  showGuestLogin = true;
  bypassPhoneNumbers = [];
  lastNotif;
  pharmacyOwner: boolean = true;
  thirdTierPerc: any = 0;
  secondTierPerc: any = 0;
  firstTierPerc: any = 0;
  tempImage: string = '';
  nextExpireCreditDataObj = { date_added: "خطء", expiration_date: "خطء", points_value: "خطء" }
  allMovementsWallet = [];
  notifier = new Subject();
  isCustomerEligableForSpinAndWin = false;
  alreadySpinOpenedThisSession = false;
  constructor(private modalController: ModalController, private httpClient: HttpClient, private auth: FirebaseAuthService, private fun: FunctionsService, private barcode: BarcodeScanner) {
    this.setUserData();
    this.getWalletAmount();
    this.getTiersData();
    this.getProductsAndCategories();
    // this.getBebastaProviderListOfServices(146)
    //this.getBebastaRechargeGetServiceInputParamter(283813)
    //this.getBebastaproviderList(11);
    setTimeout(() => {
      this.RealTimeUpdate();
    }, 1000);
    setTimeout(() => {
      //this.qrCodeGenerate(this.CustomerData.refer_code);
      // this.fromBarCodeToPoints('TQ9MRUI08RT8J26GD9N46KWSM0EAH3RALJAZEERA');
    }, 5000);
  }
  post(url, body) {
    let requestUrl = `${this.urlPrefix}${url}`;
    // Retrieve the token (e.g., from local storage or a service)
    const token = localStorage.getItem('token'); // Adjust the token retrieval method if needed
    //const { iv, encryptedData } = this.encryptWithIV(, secretKey);
    const strignifedBody = JSON.stringify(body);
    const bodyEncrypted = this.encryptString(strignifedBody, this.encryptionKey, true);
    // Set the headers with the token 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.httpClient.post(requestUrl, { encryptedData: bodyEncrypted }, { headers }).toPromise();
  }
  encryptString(text, secretkey, raw) {
    let iv = CryptoJS.SHA256(secretkey).toString().substring(0, 16)
    iv = CryptoJS.enc.Utf8.parse(iv)
    let encrypted = CryptoJS.AES.encrypt(text, secretkey, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    let encryptedString = encrypted.toString()
    if (raw) { return encryptedString }
    // + durch _ ersetzen wegen GET Übergabe Problem (+ als Leerzeichen vom PHP angenommen und deswegen falsch enkodiert)
    return encryptedString.replace(/\+/g, '_')
  }
  post_outside(url, body) {
    return this.httpClient.post(url, body).toPromise();
  }
  post_for_files(url, body) {
    let requestUrl = `${this.urlPrefix}${url}`;
    return this.httpClient.post(requestUrl, body).toPromise();
  }
  RealTimeUpdate() {
    this.subscribe = interval(10000).subscribe(x => {
      if (this.CustomerData?.id_customer) {
        this.getWalletAmount();
        this.getUserLastNotification();
        this.getTiersData()
        this.checkIfAccountBlocked();
      }
    });
  }
  getBebastaRechargeGetServiceInputParamter(service_id) {
    this.post('bebasata/BebastaRechargeGetServiceInputParamter', { "id_customer": this.CustomerData.id_customer, "service_id": service_id }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err);
    })
  }
  getBebastaproviderList(service_id) {
    this.post('bebasata/BebastaGetProviderList', { "id_customer": this.CustomerData.id_customer, "service_id": service_id }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err);
    })
  }
  getBebastaProviderListOfServices(provider_id) {
    this.post('bebasata/BebastaGetServiceListForProvider', { "id_customer": this.CustomerData.id_customer, "service_id": provider_id }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err);
    })
  }
  copounApply(CopounCode) {
    if (!CopounCode) return this.fun.errorToast("من فضلك ادخل الكوبون");
    if (CopounCode.length < 5) return this.fun.errorToast("ادخل كوبون صحيح");
    console.log(CopounCode);
    this.fun.presentLoader();
    this.post("coupons/Redeem", { "userId": this.CustomerData.id_customer, "code": CopounCode }).then((res) => {
      console.log(res);
      let message = '';
      if (res['result']) {
        this.fun.presentToast(" تم اضافة" + res['amount'] + "نقطة الى محفطتك ", false, "bottom", 10000);
      } else {
        this.fun.errorToast(res['message']);
      }
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      this.fun.loadingController.dismiss();
    })
  }
  checkIfAccountBlocked() {
    if (this.CustomerData.id_customer.length > 0) {
      this.post('auth/CheckIfUserActive', { "customer_id": this.CustomerData.id_customer }).then((res) => {
        if (res['result']) {
        } else {
          this.fun.errorToast(res['message']);
          this.auth.signOut().subscribe((res) => {
            localStorage.clear();
            this.CustomerData = {};
            this.fun.navigate('firebase/auth/sign-in', false);
          })
        }
      }).catch((err) => { })
    }
  }

  getTiersData() {

    if (this.userTotalPoints) {

      this.thirdTierPerc = (this.userTotalPoints / 25000).toFixed(2);
      this.secondTierPerc = (this.userTotalPoints / 50000).toFixed(2);
      this.firstTierPerc = (this.userTotalPoints / 100000).toFixed(2);
      if (this.thirdTierPerc >= 1) {
        this.secondTierPerc = (this.userTotalPoints / 50000).toFixed(2);
        this.thirdTierPerc = 1;
      }
      if (this.secondTierPerc >= 1) {
        this.firstTierPerc = (this.userTotalPoints / 100000).toFixed(2);
        this.secondTierPerc = 1
      }
      if (this.firstTierPerc > 1) {
        this.firstTierPerc = 1;
      }

    }
  }
  /* account deletion function */
  async accountDeactivate() {
    this.fun.presentLoader()
    return this.post("auth/deleteAcc", { "Token": "HELLOFROMTHEOTHERSIDE", "customer_id": this.CustomerData.id_customer });
  }
  getPointsForAchiv(tier) {
    switch (tier) {
      case 'thirdtier':
        if (this.userTotalPoints >= 25000) {
          return 25000;
        } else {
          return this.userTotalPoints;
        }
        break;
      case 'secondtier':
        if (this.userTotalPoints >= 50000) {
          return 50000;
        } else {
          return this.userTotalPoints;
        }
        break;
      case 'firsttier':
        if (this.userTotalPoints >= 100000) {
          return 100000;
        } else {
          return this.userTotalPoints;
        }
        break;
    }
  }
  postWithHeaders(url, body) {
    let head = new HttpHeaders();
    head.append("Accept", 'application/json');
    head.append('Content-Type', 'application/json');
    const formData = new FormData();
    //for
    Object.keys(body).forEach(function (key, index) {
      // console.log(body[key]);
      formData.append(key, body[key]);
    })
    let requestUrl = `${this.urlPrefixPayment}${url}`;
    return this.httpClient.post(requestUrl, formData, { headers: head }).toPromise();
  }
  postWithHeaderstest(url, body) {
    let head = new HttpHeaders();
    head.append("Accept", 'application/json');
    head.append('Content-Type', 'application/json');
    const formData = new FormData();
    //for
    Object.keys(body).forEach(function (key, index) {
      // console.log(body[key]);
      formData.append(key, body[key]);
    })
    let requestUrl = `${this.urlPrefixPayment}${url}`;
    return this.httpClient.post(requestUrl, formData, { headers: head });
  }
  checkForUpdate() {
    return this.post("auth/AppVersion", {});
  }
  qrCodeGenerate() {
    this.barcode.encode(this.barcode.Encode.TEXT_TYPE, this.CustomerData.refer_code).then((encodedData) => {
      console.log(encodedData);
      const tempImage = "file://" + encodedData.file;
      this.tempImage = tempImage;
    }, (err) => {
      console.log('Error occured : ' + err);
    }).catch(err => {
      console.log('hereiam', err);
    })
  }
  getWalletAmount() {
    if (this.CustomerData?.id_customer) {
      this.post("auth/walletAmount", { "user_id": this.CustomerData.id_customer })
        .then((values: any) => {
          console.log(values);
          this.userwalletamount = values.data.amount ? values.data.amount : 0
          this.userTotalPoints = values.data.totalPoints ? values.data.totalPoints : "0";
          this.PointsRedmedBefore = (Number(this.userTotalPoints) - Number(this.userwalletamount)).toString()
          this.nextExpireCreditDataObj = values.nextExpireDate ? values.nextExpireDate : this.nextExpireCreditDataObj;
          this.allMovementsWallet = values.all_movements ? values.all_movements : this.allMovementsWallet;
          if (this.userTotalPoints >= 25000 && this.CustomerData.position !== 'silver_customer' && this.CustomerData.position != 'gold_customer' && this.CustomerData.position != 'plat_customer') {
            // this.fun.presentToast("مبروك انت الان على الشريحة الفضي و تم اضافة ١٢٠٠ نقطة في رصيد نقاطك", false, "middle", 3000);
            //then update customer data onback end and on memory and add extra points.
            this.post("wallet/UpgradeProfile", { "token": "c6d01ceb06b92a7ceca9a9b0db410ff1", "customer_id": this.CustomerData.id_customer, "nextLevel": "silver_customer" }).then((res => {
              if (res['result']) {
                this.CustomerData = res['user_data'];
                localStorage.setItem('jazeera_backend_data', JSON.stringify(res['user_data']));
                this.fun.presentToast(res['message'], false, "middle", 10000);
              } else {
                this.CustomerData = res['user_data'];
                localStorage.setItem('jazeera_backend_data', JSON.stringify(res['user_data']));
                this.fun.errorToast(res['message'])
              }
            }))
          }
          if (this.userTotalPoints >= 50000 && this.CustomerData.position != 'gold_customer' && this.CustomerData.position != 'plat_customer') {
            this.post("wallet/UpgradeProfile", { "token": "c6d01ceb06b92a7ceca9a9b0db410ff1", "customer_id": this.CustomerData.id_customer, "nextLevel": "gold_customer" }).then((res => {
              console.log(res)
              if (res['result']) {
                this.CustomerData = res['user_data'];
                localStorage.setItem('jazeera_backend_data', JSON.stringify(res['user_data']));
                this.fun.presentToast(res['message'], false, "middle", 10000);
              } else {
                this.CustomerData = res['user_data'];
                localStorage.setItem('jazeera_backend_data', JSON.stringify(res['user_data']));
                this.fun.errorToast(res['message'])
              }
            }))
          }
          if (this.userTotalPoints >= 100000 && this.CustomerData.position != 'plat_customer') {
            this.post("wallet/UpgradeProfile", { "token": "c6d01ceb06b92a7ceca9a9b0db410ff1", "customer_id": this.CustomerData.id_customer, "nextLevel": "plat_customer" }).then((res => {
              console.log(res)
              if (res['result']) {
                this.CustomerData = res['user_data'];
                localStorage.setItem('jazeera_backend_data', JSON.stringify(res['user_data']));
                this.fun.presentToast(res['message'], false, "middle", 10000);
              } else {
                this.CustomerData = res['user_data'];
                localStorage.setItem('jazeera_backend_data', JSON.stringify(res['user_data']));
                this.fun.errorToast(res['message'])
              }
            }))

          }

        }).catch((err) => {
          console.log(err);
        })
    }
  }
  openBarCodeReader() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      disableSuccessBeep: false,
      prompt: 'يرجى تسكين شكل الكود بالكامل داخل المربع ',
      resultDisplayDuration: 500,
      formats: 'EAN_13,EAN_8,CODE_39,CODE_93,CODE_128,PDF_417,EAN_13,EAN_8,QR_CODE,PDF_417',
      orientation: 'portrait',
    };
    this.barcode.scan(options).then((barcode_data) => {
      /* this.fun.presentToast(JSON.stringify(barcode_data), false, 'bottom', 10000); */
      this.fromBarCodeToPoints(barcode_data['text']);
    }).catch((err) => {
      console.log(this.fun.errorToast(err));
    })
  }
  getShowrooms() {
    this.post('auth/GetShowRooms', {}).then((res) => {
      this.show_rooms = res['data'];
      return this.show_rooms;
    })
  }
  getProductsAndCategories() {
    this.post('auth/GetProductsAndCategories', {}).then(res => {

      this.products_array = res['products'];
      this.category_products = res['categories'];
      /*       console.log(res['products'], 'products is here');
            console.log(res['categories'], 'categories is here'); */
    }).catch((err) => {
      console.log(err);
    })
  }
  fromBarCodeToPoints(qrCodeValue) {
    const token = "c6d01ceb06b92a7ceca9a9b0db410ff1";
    this.fun.presentLoader();
    this.post("wallet/FromCodeToPoints", { "token": token, "customer_id": this.CustomerData.id_customer, "qr_code": qrCodeValue }).then((res) => {
      console.log(res);
      if (res['result']) {
        this.fun.presentToast(res['message'], false, 'bottom', 10000);
      } else {
        this.fun.errorToast(res['message']);
      }
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      this.fun.loadingController.dismiss();
    })
  }

  getUserLastNotification() {
    this.post('notifications/GetLastNotif', { "user_id": this.CustomerData?.id_customer }).then(res => {
      this.isCustomerEligableForSpinAndWin = true;
      //this.openSpinAndWin({});
      this.lastNotif = res['data'];
    }).catch(err => {
      console.log(err)
    })
  }
  setUserData() {
    const UserObj = localStorage.getItem("jazeera_backend_data");
    if (UserObj) {
      this.CustomerData = JSON.parse(UserObj);
      this.getUserLastNotification();
      this.getWalletAmount();
      //(this.CustomerData.refer_code);
    }
  }
  async openSpinAndWin(segements) {
    if (this.isCustomerEligableForSpinAndWin && !this.alreadySpinOpenedThisSession) {
      const modal = await this.modalController.create({
        component: SpinTheWheelModal,
        swipeToClose: true,
        componentProps: {
          'saa': segements,
        },
        cssClass: 'spin-and-win-modal',
      });
      await modal.present();
      this.alreadySpinOpenedThisSession = true;
    } else {

    }
  }
}
