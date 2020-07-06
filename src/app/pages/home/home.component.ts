import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/services/shop.service';
import { Slide } from 'src/app/components/carousel/carousel.component';
import { SlideshowService } from 'src/app/services/slideshow.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  slides: Slide[];

  constructor(public shopService: ShopService, public slideshowService: SlideshowService, public router: Router) {}

  ngOnInit() {
    this.loadCache();
    this.slides = this.getSlideshow();
  }

  private loadCache() {
    this.shopService.getShopContactInfo().subscribe();
    this.shopService.getShopAddress().subscribe();
  }

  /**
   * Get slideshow from slideshow service.
   */
  getSlideshow(): Slide[] {
    return this.slideshowService.getSlides();
  }

}
