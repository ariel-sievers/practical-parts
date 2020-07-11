import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
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

  constructor(public shopService: ShopService, public productsService: ProductsService,
    public slideshowService: SlideshowService, public router: Router, private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.slides = this.getSlideshow();
    this.loadCache();
    this.newProducts = this.getNewProducts();

    console.log(this.el.nativeElement.querySelectorAll('app-card').forEach(c => c.querySelectorAll('app-generic-image').length))

    // keep card from getting too long due to product description
    this.el.nativeElement.querySelectorAll('app-card-body').forEach(cardBody => {
      this.renderer.appendChild(cardBody, this.renderer.createElement('div'));

      const divs = cardBody.querySelectorAll('div');

      this.renderer.setStyle(divs[0], 'height', '200px');
      this.renderer.setStyle(divs[0], 'margin-bottom', '1rem');
      this.renderer.addClass(divs[1], 'fade');
    })

    this.el.nativeElement.querySelectorAll('app-card-actions').forEach(cardActions => {
      const div = cardActions.querySelector('div');

      this.renderer.setStyle(div, 'position', 'absolute');
      this.renderer.setStyle(div, 'bottom', '-4px');
    })

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
        if (this.productsService.getDifferenceInMonths(createdAtUTC, todayUTC) <= 6
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
