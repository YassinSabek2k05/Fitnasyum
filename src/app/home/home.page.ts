import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { FunctionsService } from '../services/functions.service';
import { Router } from '@angular/router';
import { ApisService } from '../services/apis.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiperInstance: any;

  userName: string = 'User';
  customerData: any = {};
  isPopoverOpen = false;
  popoverEvent: any;

  workouts = [
    { title: 'Yoga', image: 'assets/yoga.png' },
    { title: 'Upper Body', image: 'assets/upper-body.png' },
    { title: 'Build Muscle', image: 'assets/muscle.png' },
  ];
  challenges = [
    { title: '30 days Crunch', image: 'assets/30-challeng.png' },
    { title: '31 days Plank', image: 'assets/31days.png' },
    { title: '20 days squats', image: 'assets/20days.png' }];
  constructor(public fun: FunctionsService, private router: Router, public apiService: ApisService) { }

  ngOnInit() {

    this.apiService.isHealthInfoRegistered().then((isRegistered) => {
      if (!isRegistered) {
        this.router.navigate(['/details']);
      }
    });

    this.customerData = this.apiService.CustomerData;
    this.userName = this.customerData.fullname || 'User';
  }

  navToItems(type: any) {
    console.log('hi am here');
    this.router.navigate(['/tabs/items', type])
  }
  navToDetails(objectData: any, type: string) {
    console.log(objectData);
    this.fun.activeItemDetailData = objectData;
    this.router.navigate(['/tabs/item-details/' + objectData.id])
  }


  openPopover(ev: Event) {
    this.popoverEvent = ev;
    this.isPopoverOpen = true;
  }

  logout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    this.isPopoverOpen = false;

    setTimeout(() => {
      this.router.navigate(['/welcome']);
    }, 100);
  }

}
