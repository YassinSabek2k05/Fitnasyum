import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
  standalone: false
})
export class ItemsPage implements OnInit {
  type: string | null = null;
  workouts = [
    { name: 'Yoga', image: 'assets/yoga.png', type: 'yoga' },
    { name: 'Upper Body', image: 'assets/upper-body.png', type: 'upper-body' },
    { name: 'Build Muscles', image: 'assets/build-muscles.png', type: 'build-muscles' },
    { name: 'ABS', image: 'assets/abs.png', type: 'abs' },
    { name: 'Cardio', image: 'assets/cardio.png', type: 'cardio' },
    { name: 'Cross Fit', image: 'assets/crossfit.png', type: 'crossfit' }
  ];
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type'); // Get parameter
    console.log('Type:', this.type);
  }
  openWorkout(workout: any) {
    this.router.navigate(['/tabs/items', workout.type]); // Navigate with workout type
  }
}
