import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {
  paddingBottomValue: string = '10px';

  constructor(private platform: Platform) {
    if (this.platform.is('ios')) {
      this.paddingBottomValue = '18px';
      // document.querySelector('body').style.setProperty('padding-bottom', '30px !important');
    }
  }

}
