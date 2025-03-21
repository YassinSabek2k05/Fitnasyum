import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, NavController, AlertController, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {
  searchHistoryArray = [];
  activeItemDetailData: any;
  constructor(private router: Router,
    public loadingController: LoadingController,
    private toastController: ToastController,
    private nav: NavController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    public alertController: AlertController) {
    // this.checkIfUserHasSearchHistory();
  }
  navigate(link: any, forward?: any) {
    if (forward) {
      this.nav.navigateForward('/' + link);
    } else {
      this.router.navigateByUrl('/' + link, {
        replaceUrl: true
      });
    }
  }
  async presentLoader() {
    const loading = await this.loadingController.create({
      message: 'Loading',
      duration: 2500,
    });
    return await loading.present();
  }
  checkIfUserHasSearchHistory() {
    var searchHistory = localStorage.getItem('searchHistoryArray');
    if (searchHistory) {
      this.searchHistoryArray = JSON.parse(searchHistory)
      console.log("feeh ")
    } else {
      localStorage.setItem('searchHistoryArray', JSON.stringify([]))
    }
  }

  async presentToast(message: string, show_button: boolean, position: any, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      position: position,
      duration: duration,
      color: "success"
    });
    toast.present();
  }
  openNotifiPage() {
    this.navigate("app/notifications", true);
  }
  //present alert
  async showAlert(message: string, header: string, subheader: string, btns: any) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: btns
    });
    await alert.present();
  }
  async errorToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      color: "danger",
      duration: 10000,
    });
    toast.present();
  }

}
