import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyplanPage } from './myplan.page';

const routes: Routes = [
  {
    path: '',
    component: MyplanPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyplanPageRoutingModule { }
