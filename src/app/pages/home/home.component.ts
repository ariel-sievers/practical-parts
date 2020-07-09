import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/services/shop.service';
import { Slide } from 'src/app/components/carousel/carousel.component';
import { SlideshowService } from 'src/app/services/slideshow.service';
import { ProductsService, Product } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  slides:      Slide[];
  newProducts: Product[];

  cardBody:  HTMLCollectionOf<Element>;

  constructor(public shopService: ShopService, public productsService: ProductsService,
    public slideshowService: SlideshowService, public router: Router) {}

  ngOnInit() {
    this.slides = this.getSlideshow();
    this.loadCache();
    this.newProducts = this.getNewProducts();
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

  /**
   * Get a list of products that were created less than or equal to 6 months ago.
   * Products will not show if they are not currently published on the site.
   */
  getNewProducts(): Product[] {
    if (this.newProducts) { return; }

    const today                      = new Date();
    const todayUTC                   = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

    const desiredProducts: Product[] = []
    
    this.productsService.getProducts().subscribe( data => {
      for (const product of data) {
        const createdAt    = new Date(product.createdAt);
        const createdAtUTC = Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
  
        // product with id 451235673709 should not be shown since it is not a real product
        // sold by Practical Parts
        if (this.productsService.getDifferenceInMonths(createdAtUTC, todayUTC) <= 12
          && product.publishedAt !== null && product.id !== 4516235673709) {
          
          const dateNoTime  = createdAt.toString().split(" ");
          product.createdAt =  `${dateNoTime[0]} ${dateNoTime[1]} ${dateNoTime[2]} ${dateNoTime[3]}`;
          desiredProducts.push(product);
        }
      }
    });

    return desiredProducts;
  }

}
