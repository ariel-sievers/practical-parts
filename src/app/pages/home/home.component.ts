import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/services/shop.service';
import { Slide } from 'src/app/components/carousel/carousel.component';
import { SlideshowService } from 'src/app/services/slideshow.service';
import { ProductsService, Product } from 'src/app/services/products.service';
import { CollectionsService } from 'src/app/services/collections.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  slides:      Slide[];
  newProducts: Product[];

  showNew:     boolean;                  // for hiding/showing new products

  isLoading:   BehaviorSubject<boolean>; // loading new products

  constructor(public shopService: ShopService, public productsService: ProductsService,
    public collectionsService: CollectionsService, public slideshowService: SlideshowService,
    public router: Router ) {}

  ngOnInit() {
    this.slides = this.getSlideshow();
    this.loadCache();
    this.isLoading   = this.productsService.isLoading;
  }

  private loadCache() {
    this.shopService.getShopContactInfo().subscribe();
    this.shopService.getShopAddress().subscribe();
    this.collectionsService.getCustomCollections().subscribe();
    this.collectionsService.getSmartCollections().subscribe();
  }

  /**
   * Get slideshow from slideshow service.
   */
  getSlideshow(): Slide[] {
    return this.slideshowService.getSlides();
  }

  /**
   * Get a list of products that were created less than or equal to 6 months ago.
   * Products will not show if they are not currently published on the site.
   */
  getNewProducts(): Product[] {
    this.showNew = !this.showNew;

    if (this.newProducts) { return; }
    this.newProducts = this.productsService.getNewProducts();
  }

}
