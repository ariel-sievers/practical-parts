import { Component, OnInit } from '@angular/core';
import Client from 'shopify-buy';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // Initializing a client
    const client = Client.buildClient({
      domain: 'practical-parts.myshopify.com',
      storefrontAccessToken: '5537dfc17f46cf7b6a7cc6f4e6d73162'
    });

  }

}
