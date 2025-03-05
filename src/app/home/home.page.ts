import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { FunctionsService } from '../services/functions.service';
import { Router } from '@angular/router';
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
  workouts = [
    { title: 'Yoga', image: 'assets/yoga.png' },
    { title: 'Upper Body', image: 'assets/upper-body.png' },
    { title: 'Build Muscle', image: 'assets/muscle.png' },
  ];
  challenges = [
    { title: '30 days Crunch', image: 'assets/30-challeng.png' },
    { title: '31 days Plank', image: 'assets/31days.png' },
    { title: '20 days squats', image: 'assets/20days.png' }];
  blogs = [
    { title: 'How to combat stress', image: 'assets/bruce-mars.png' },
    { title: '5 Tips to get more active', image: 'assets/blog-2.png' },
    { title: '5 simple exercises', image: 'assets/3rd-blog.png' }
  ]
  constructor(public fun: FunctionsService, private router: Router) { }
  navToItems(type: any) {
    console.log('hi am here');
    this.router.navigate(['/tabs/items', type])
  }
}
