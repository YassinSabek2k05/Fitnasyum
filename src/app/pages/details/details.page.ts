import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { FunctionsService } from 'src/app/services/functions.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';

register();
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiperInstance: any;
  heights: number[] = [140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200];
  currentYear: number = (new Date()).getFullYear();
  month: string = '';
  year: number = 0;
  day: number = 0;
  years: number[] = this.updateYears();
  days: number[] = ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28].concat(this.currentDaysCount()));
  diseases: String = 'no';
  diseasesTypes: { [key: string]: boolean } = {
    heart: false,
    cholestrol: false,
    diabetes1: true,
    diabetes2: false,
    anemia: false,
    other: false,
  };
  selectedDiseasesType: string = '';
  tmp: number[] = [];
  fatLevel: number = 0;
  level: String = 'Intermediate';
  smoke: String = 'no';
  goal: String = 'Get Fitter';
  weights: number[] = Array.from({ length: 13 }, (_, i) => 40 + i * 10);
  minDate = '1900-01-01';
  maxDate = new Date().toISOString().split('T')[0]; // Today's date
  selectedDate: string = '1990-01-21';
  selectedGender: string = '';
  selectedWeight: number = 0;
  selectedHeight: number = 0;
  selectedAccountType: String = '';
  public progress = 0;
  isLoading: boolean = false;
  apiError: boolean = false;
  apiErrorMessage: string = '';
  alertButtons = ['Retry'];
  apiUrl = "https://fitnasyumapis.the-marketscene.com/auth/insertCustomerHealthInfo";
  constructor(
    public fun: FunctionsService,
    private http: HttpClient,
    private router: Router,
    private apiService: ApisService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Ensure Swiper is initialized after view loads
    this.swiperInstance = this.swiperRef?.nativeElement?.swiper;
    this.disableSwiping();
  }

  enableSwiping() {
    if (this.swiperInstance) {
      this.swiperInstance.allowSlidePrev = true;
      this.swiperInstance.allowSlideNext = true;
      this.swiperInstance.allowTouchMove = true;
      this.swiperInstance.update(); // 🚀 Force Swiper to update settings
    }
  }

  disableSwiping() {
    if (this.swiperInstance) {
      this.swiperInstance.allowSlidePrev = false;
      this.swiperInstance.allowSlideNext = false;
      this.swiperInstance.allowTouchMove = false;
      this.swiperInstance.update(); // 🚀 Force Swiper to apply new settings
    }
  }

  getNumberOfSlides() {
    if (this.swiperInstance) {
      return this.swiperInstance.slides.length;
    }
    return 0;
  }
  goNext() {
    if (!this.validateCurrentSlide()) return;
    if (this.swiperInstance) {
      this.progressCurrent();
      this.swiperInstance.slideNext();
      console.log(this.swiperInstance.activeIndex);
      console.log(this.getNumberOfSlides());
    }

  }

  validateCurrentSlide(): boolean {
    const index = this.swiperInstance.activeIndex;
    switch (index) {
      case 0: return !!this.selectedGender;
      case 1: return !!this.selectedDate;
      case 2: return this.selectedWeight >= 30;
      case 3: return this.selectedHeight >= 140;
      case 4: return this.fatLevel > 0;
      case 5: return !!this.level;
      case 6: 
        if (this.diseases === "no") return true;
        if (this.diseases === "yes" && this.selectedDiseasesType) return true;
        return false;
      case 7: return !!this.smoke;
      case 8: return !!this.goal;
      default: return true;
    }
  }

  insertHelathInfoApi() {

    const id_customer =  this.apiService.CustomerData?.id_customer;

    if(id_customer) {

      const apiData = {
        id_customer: id_customer,
        gender: this.selectedGender,
        birth_date: this.selectedDate, 
        weight: this.selectedWeight,
        height: this.selectedHeight,
        fat_level: this.fatLevel,
        fitness_level: this.level,
        is_diseased: this.diseases,
        disease_type: this.selectedDiseasesType,
        is_smoke: this.smoke,
        goal: this.goal,
        account_type: this.selectedAccountType,
      };

      this.http.post(this.apiUrl, apiData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response?.result) { 
  
            setTimeout(() => {
              this.router.navigate(['/tabs']).then(() => {
                window.location.reload();
              });
            }, 100); 
  
          } else {
            this.apiErrorMessage = response?.message || 'Unexpected error occurred';
            this.apiError = true;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.apiErrorMessage = error?.error?.message || 'An error occurred.';
          this.apiError = true;
        }
      });

    }
    
  }
  
  getActiveIndex() {
    if (this.swiperInstance) {
      return this.swiperInstance.activeIndex + 1;
    }
    return 0;
  }
  goPrev() {
    if (this.swiperInstance) {
      this.swiperInstance.slidePrev();
      this.progress -= 1 / this.getNumberOfSlides();
    }
  }
  logActiveIndex() {
    console.log(this.swiperRef?.nativeElement.swiper.activeIndex);
  }
  getStartBtn() {
    this.insertHelathInfoApi();
  }
  genderFocus(state: string) {
    if (state == this.selectedGender)
      return "focus";
    return "";
  }
  maleSelect() {
    this.selectedGender = 'male';
    console.log(this.selectedGender);

  }
  femaleSelect() {
    this.selectedGender = 'female';
    console.log(this.selectedGender);
  }
  progressCurrent() {
    this.progress = this.getActiveIndex() / (this.getNumberOfSlides() - 1);
  }
  Next() {
    console.log((new Date()).getFullYear());
    if (this.year == 0 || this.month == '' || this.day == 0) {
      return;
    }
    console.log('Year:', this.year);
    console.log('Month:', this.month);
    console.log('Day:', this.day);
  }
  updateYears() {
    this.tmp = [];
    for (let i = this.currentYear; i >= 1900; i--) {
      this.tmp.push(i);
    }
    this.years = this.tmp;
    return this.years;
  }
  updateDays() {
    this.days = ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28].concat(this.currentDaysCount()));
  }
  onMonthChange(event: CustomEvent) {
    this.updateDays();
    this.month = event.detail.value;
  }
  onYearChange(event: CustomEvent) {
    this.updateDays();
    this.year = event.detail.value;
  }
  onDayChange(event: CustomEvent) {
    this.day = event.detail.value;
  }
  currentDaysCount() {
    if (this.month == 'January' || this.month == 'March' || this.month == 'May' || this.month == 'July' || this.month == 'August' || this.month == 'October' || this.month == 'December') {
      return [29, 30, 31];
    } else if (this.month == 'April' || this.month == 'June' || this.month == 'September' || this.month == 'November') {
      return [29, 30];
    }
    else if (this.month == 'February') {
      if (this.year % 4 === 0) {
        if (this.year % 100 === 0 && this.year % 400 !== 0) {
          return [];
        }
        return [29];
      }
    }
    return [];
  }

  onWieghtChange(event: CustomEvent) {
    this.selectedWeight = event.detail.value;
    console.log(event.detail.value);
  }

  onHeightChange(event: CustomEvent) {
    this.selectedHeight = event.detail.value;
    console.log(event.detail.value);
  }
  focusFat(i: number) {
    if (i == this.fatLevel)
      return "clickedFat";
    return "";
  }
  selectFat(i: number) {
    this.fatLevel = i;
    console.log(i);
  }
  levelFocus(level: String) {
    if (level == this.level)
      return "clickedLevel";
    return "";
  }
  levelChange(str: String): void {
    this.level = str;
    console.log(str);
  }
  diseasesFocus(diseases: String) {
    if (diseases == this.diseases)
      return "clickedLevel";
    return "";
  }
  diseasesChange(str: String): void {
    this.diseases = str;
    console.log(str);
  }
  diseasesNo() {
    if (this.diseases == 'yes') {
      return "visible";
    }
    return "hidden";
  }
  diseaseTypeFocus(diseases: string) {
    if (this.diseasesTypes[diseases])
      return "clickedDisease";
    return "unclickedDisease";
  }
  diseaseTypeChange(str: string): void {
    this.diseasesTypes[str] = !this.diseasesTypes[str];
    this.selectedDiseasesType = str;
    console.log(this.selectedDiseasesType);
  }
  //smoke

  smokeFocus(smoke: String) {
    if (smoke == this.smoke)
      return "clickedLevel";
    return "";
  }
  smokeChange(str: String): void {
    this.smoke = str;
    console.log(str);
  }
  //goal
  goalFocus(goal: String) {
    if (goal == this.goal)
      return "clickedLevel";
    return "";
  }
  goalChange(str: String): void {
    this.goal = str;
    console.log(str);
  }

  selectAccountType(type: string) {
    this.selectedAccountType = type;
    console.log(this.selectedAccountType);
    this.goNext();
  }



  onDateChange(ev: any) {
    this.selectedDate = ev.detail.value;
    console.log('Selected Date:', this.selectedDate);
  }
  btnView(str: String) {
    if (str == 'role' && (this.getActiveIndex() == 10)) {
      console.log(this.getActiveIndex());
      return "visible";
    }
    else if (str == 'next' && !(this.getActiveIndex() == 11 || this.getActiveIndex() == 10)) {
      return "visible";
    }
    else if (str == 'ready' && this.getActiveIndex() == 11)
      return "visible";
    return "hidden";
  }

  clear(){
    this.apiError = false;
  }

}
