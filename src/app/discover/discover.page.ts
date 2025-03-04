import { Component, ViewChild } from '@angular/core';
import { IonInput, IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-Discover',
  templateUrl: 'discover.page.html',
  styleUrls: ['discover.page.scss'],
  standalone: false,
})
export class DiscoverPage {

  constructor() {}
  public data = [
    'Amsterdam',
    'Buenos Aires',
    'Cairo',
    'Geneva',
    'Hong Kong',
    'Istanbul',
    'London',
    'Madrid',
    'New York',
    'Panama City',
  ];
  public recentSearches = ['Abs', 'Build Muscle', 'Yoga', 'Mountain Climbers', 'Cross Fit', 'Squats', 'Lunges', 'Upper Body'];
  public results = [...this.data.slice(0, 3)];
  autocompleteItems = ["hello", "world", "foo", "bar"];
  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.results = this.data.filter((d) => d.toLowerCase().includes(query));
    this.results = this.results.slice(0, 3);
  }
  @ViewChild('searchBar') searchBar!: IonSearchbar;

  ionViewDidEnter() {
    this.searchBar.setFocus();
  }
  setPlaceHolder(str: string) {
    this.searchBar.value = str;
  }
}
