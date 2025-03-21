import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { ApisService } from './services/apis.service';
import { AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  routerHidden = true;
  isLoading = false;
  constructor(private router: Router, private apis: ApisService, private alertController: AlertController) {
    this.checkForUpdate();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000); // Small delay for smooth transition
      }
    });
  }
  checkForUpdate() {
    this.apis.checkForUpdate()
      .then((res: any) => {
        console.log(res);
        if (res['bypassPhoneNumbers']) {
          this.apis.bypassPhoneNumbers = res['bypassPhoneNumbers'];
        }
        if (res['homepageSlider']) {
          this.apis.homepageSlider = res['homepageSlider'];
        }
        if (res['blogs']) {
          this.apis.blogs = res['blogs'];
        }
        /*         let platformData = res[Capacitor.getPlatform()];
                this.appVersion.getVersionNumber().then((value) => {
                  if (platformData.version != value) {
                    this.presentAlertConfirm(this.translate.instant(platformData.title), this.translate.instant(platformData.message), platformData.minor)
                  }
                }).catch((err) => {
                  console.log(err);
                }) */
      }).catch((err) => {
        console.log(err);
      })
  }
  async presentAlertConfirm(title: string, msg: string, minor: string) {
    let btns = [];
    if (minor) {
      btns = [
        {
          text: 'Update',
          handler: () => {
            //   this.updateButtonClicked();
          }
        }
      ]
    } else {
      btns = [
        {
          text: "Cancel",
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah: any) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Update',
          handler: () => {
            // this.updateButtonClicked();
          }
        }
      ]
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: msg,
      backdropDismiss: minor ? false : true,
      buttons: btns
    });

    await alert.present();
  }
}
