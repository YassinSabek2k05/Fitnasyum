import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'items/:type',
        loadChildren: () => import('../pages/items/items.module').then(m => m.ItemsPageModule)
      },
      {
        path: 'item-details/:id',
        loadChildren: () => import('../pages/item-details/item-details.module').then(m => m.ItemDetailsPageModule),
      },
      {
        path: 'discover',
        loadChildren: () => import('../discover/discover.module').then(m => m.DiscoverPageModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('../notification/notification.module').then(m => m.NotificationPageModule)
      },
      {
        path: 'myplan',
        loadChildren: () => import('../myplan/myplan.module').then(m => m.MyplanPageModule)
      },
      {
        path: '',
        redirectTo: 'home', // ✅ Correct redirect
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

