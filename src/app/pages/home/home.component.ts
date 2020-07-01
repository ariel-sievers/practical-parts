import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/services/shop.service';
import { Slide } from 'src/app/components/carousel/carousel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  slides: Slide[] = [
    { src: "https://i.imgur.com/5mXfwr1.jpg", description: "Introducing our new product, the clamp thing" },
    { src: "https://www.atomix.com.au/media/2017/07/StockPhotoBanner.jpg", description: "Click here to learn more about us", link: "/about" },
    { src: "https://www.liveabout.com/thmb/s6wcupyhjrstpTmxv_3K8kLIPYM=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/feet-face-599c412c22fa3a0011d92add.jpg" },
    { src: "https://assets.classicfm.com/2019/11/superman-violin-1553266007-view-0.jpg", description: "Sleep well knowing you saved $$$" }
  ]

  constructor(public shopService: ShopService, public router: Router) {}

  ngOnInit() {
    this.loadCache();
  }

  private loadCache() {
    this.shopService.getShopContactInfo().subscribe();
    this.shopService.getShopAddress().subscribe();
  }

}
