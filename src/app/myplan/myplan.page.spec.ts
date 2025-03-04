import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { MyplanPage } from './myplan.page';

describe('MyplanPage', () => {
  let component: MyplanPage;
  let fixture: ComponentFixture<MyplanPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyplanPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MyplanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
