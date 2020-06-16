import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  shop: any;
  email: string;
  domain: string;

  constructor(private shopService: ShopService, public router: Router) {}

  ngOnInit() {
    this.testRequest();
  }


  testRequest(): void {
    this.shopService.getShop().subscribe(
      data => {
        this.shop = data,
        this.email = data.email,
        this.domain = data.domain
        console.log(this.shop) },
      err => console.log(err),
      () => console.log('done loading shop information')
    )
  }

}
