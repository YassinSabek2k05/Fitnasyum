import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { homePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    homePageRoutingModule
  ],
  declarations: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule { }
