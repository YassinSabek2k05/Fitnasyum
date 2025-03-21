import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FunctionsService } from 'src/app/services/functions.service';
@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
  standalone: false
})
export class ItemDetailsPage implements OnInit {
  itemId: string | null = null;
  constructor(private route: ActivatedRoute, private router: Router, public fun: FunctionsService) { }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('type'); // Get parameter
    console.log('Type:', this.itemId);
    if (!this.fun.activeItemDetailData?.title) {
      console.log('not settled');
      this.router.navigateByUrl('/tabs');
    }
  }

}
