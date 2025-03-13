import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false,
})
export class DetailsPage implements OnInit {
  playState: boolean = false;
  workout: boolean = false;
  id: string | null = null;
  data: any;
  constructor(private route: ActivatedRoute ) { }
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiperInstance: any;
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadData(this.id);
  }
  workouts = [
    { title: 'Yoga', image: 'assets/yoga.png' },
    { title: 'Upper Body', image: 'assets/upper-body.png' },
    { title: 'Build Muscle', image: 'assets/muscle.png' },
  ];
  loadData(id: string | null) {
    if(!id) return;
    
    const details: { [key: string]: { title: string; description: string, image: string, setsDetails: number[] } } = {
      '1': {
        title: 'Advance Workout',
        description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet',
        image: 'assets/imgs/edgar-chaparro-sHfo3.png',
        setsDetails: [16,12,30]
      },
      "2": {
        title: 'Title 2',
        description: 'Description 2',
        image: 'assets/imgs/edgar-chaparro-sHfo3.png',
        setsDetails: [16,12,30]

      },
      '3': {
        title: 'Title 3',
        description: 'Description 3',
        image: 'assets/imgs/edgar-chaparro-sHfo3.png',
        setsDetails: [16,12,30]
      },
    }
    this.data = details[id] || { title: 'Not Found', description: 'Not Found' };
  }
  getSetsDetails(i:number){
    return this.data.setsDetails[i];
  }
  switchToWorkout(i: number) {
    if(i === 1 && !this.workout) {
      return 'show'; 
    };
    if(i === 2 && this.workout) {
      return 'show';
    }
    return 'hide';
  }
  switchWorkout(){
    this.workout = !this.workout;
  }
  play(){
    this.playState = true;
  }
  pause(){
    this.playState = false;
  }
  playPauseBtnView(btn: string){
    if(btn == "play" && !this.playState) {
      return 'show'; 
    };
    if(btn == "pause" && this.playState) {
      return 'show';
    }
    return 'hide';
  }
  getMovesLeft(){
    return 11;
  }

}
