import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { DiscoverPage } from './discover.page';

describe('DiscoverPage', () => {
  let component: DiscoverPage;
  let fixture: ComponentFixture<DiscoverPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscoverPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
