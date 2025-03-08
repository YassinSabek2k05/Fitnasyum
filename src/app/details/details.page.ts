import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false,
})
export class DetailsPage implements OnInit {
  id: string | null = null;
  data: any;
  constructor(private route: ActivatedRoute ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadData(this.id);
  }
  loadData(id: string | null) {
    if(!id) return;

    const details: { [key: string]: { title: string; description: string } } = {
      '1': {
        title: 'Title 1',
        description: 'Description 1'
      },
      "2": {
        title: 'Title 2',
        description: 'Description 2'
      },
      '3': {
        title: 'Title 3',
        description: 'Description 3'
      },
    }
    this.data = details[id] || { title: 'Not Found', description: 'Not Found' };
  }

}
