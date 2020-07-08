import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

export interface Product {
  id:          number,
  title:       string,
  handle:      string,
  description: string,
  images:      {}[],
  createdAt:   string,
  publishedAt: string
}

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': `Basic ${environment.BASE_64_STRING}` 
  })
};

const version        = environment.API_VERSION;
const shop           = 'practical-parts';
const productFields  = 'id,title,handle,body_html,images,created_at,published_at';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  readonly url = `https://cors-anywhere.herokuapp.com/https://${shop}.myshopify.com/admin/api/${version}/products.json`;

  products: Observable<Product[]>;

  constructor(private http: HttpClient) { }

  /**
   * Return an observable of a list of products sold in the store.
   */
  getProducts(): Observable<Product[]> {
    if (!this.products) {
      this.products = this.http.get(this.url + `?fields=${productFields}`,
        httpOptions).pipe(
          map ( data => {
            const desiredProducts: Product[] = [];
            const products = data['products'];
            for (const product of products) {
              const id            = product['id'];
              const title         = product['title'];
              const handle        = product['handle'];
              const description   = product['body_html'];
              const images        = product['images'];
              const createdAt     = product['created_at'];
              const publishedAt   = product['published_at'];

              const newProduct    = { id, title, handle, description, images, createdAt, publishedAt };
              desiredProducts.push(newProduct);
            }
            return desiredProducts;
          }),
          publishReplay(1), 
          refCount()
      )
    }
      return this.products;
  }

  /**
   * Return the difference in months between two dates.
   * @param utc1 First date in UTC format
   * @param utc2 Second date in UTC format
   */
  getDifferenceInMonths(utc1: number, utc2: number): number {
    const _MS_PER_MONTH = 1000 * 60 * 43800;

    return Math.floor(Math.abs(utc2 - utc1) / _MS_PER_MONTH);
  }

  /**
   * Clear caches containing product information.
   */
  clearCache() {
    this.products = null;
  }
}