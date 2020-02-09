import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Client from 'shopify-buy';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// Initializing a client
const client = Client.buildClient({
  domain: 'practical-parts.myshopify.com',
  storefrontAccessToken: '5537dfc17f46cf7b6a7cc6f4e6d73162'
});
