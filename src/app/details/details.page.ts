import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false,
})
export class DetailsPage implements OnInit {
  workout: boolean = true;
  id: string | null = null;
  data: any;
  constructor(private route: ActivatedRoute ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadData(this.id);
  }
  loadData(id: string | null) {
    if(!id) return;

    const details: { [key: string]: { title: string; description: string, image: string, setsDetails: number[] } } = {
      '1': {
        title: 'Advance Workout',
        description: 'Description 1',
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

}
