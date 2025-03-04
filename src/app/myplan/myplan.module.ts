import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyplanPage } from './myplan.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { MyplanPageRoutingModule } from './myplan-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MyplanPageRoutingModule
  ],
  declarations: [MyplanPage]
})
export class MyplanPageModule { }