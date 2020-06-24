import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(public shopService: ShopService, public router: Router) {}

  ngOnInit() {
    this.loadCache();
  }

  private loadCache() {
    this.shopService.getShopContactInfo().subscribe();
    this.shopService.getShopAddress().subscribe();
  }

}
