import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, publishReplay, refCount, timeout, catchError } from 'rxjs/operators';
import { HTTP_OPTIONS } from 'src/assets/http-options';
import { LoadingService } from './loading.service';

export interface Variant {
  id:       number,
  title:    string,
  price:    string,
  quantity: number
}

export interface Product {
  id:          number,
  title:       string,
  handle:      string,
  description: string,
  images:      {}[],
  options:     {}[],
  variants:    Variant[],
  createdAt:   string,
  publishedAt: string
}

const httpOptions = HTTP_OPTIONS;

const version        = environment.API_VERSION;
const shop           = 'practical-parts';
const productFields  = 'id,title,handle,body_html,images,options,variants,created_at,published_at';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  readonly url = `https://cors-anywhere.herokuapp.com/https://${shop}.myshopify.com/admin/api/${version}/products.json`;

  products:    Observable<Product[]>;

  isLoading:   BehaviorSubject<boolean> = this.loadingService.isLoading;

  constructor(private http: HttpClient, public loadingService: LoadingService) { }

  /**
   * Return an observable of a list of products sold in the store.
   */
  getProducts(): Observable<Product[]> {
    if (!this.products) {
      this.products = this.http.get(this.url + `?fields=${productFields}`,
        httpOptions).pipe(
          map( data => {
            const desiredProducts: Product[] = [];
            const products                   = data['products'];
            for (const product of products) {
              const id                  = product['id'];
              const title               = product['title'];
              const handle              = product['handle'];
              const description         = product['body_html'];
              const images              = product['images'];
              const options             = product['options']

              const variants: Variant[] = [];
              const productVariants     = product['variants'];
              for (const variant of productVariants) {
                const id         = variant.id;
                const title      = variant.title;
                const price      = variant.price;
                const quantity   = variant.inventory_quantity;

                const newVariant = { id, title, price, quantity };
                variants.push(newVariant);
              }

              const createdAt          = product['created_at'];
              const publishedAt        = product['published_at'];

              const newProduct         = { id, title, handle, description, images, options, variants, createdAt, publishedAt };
              desiredProducts.push(newProduct);
            }
            return desiredProducts;
          }),
          publishReplay(1), 
          refCount(),
          timeout(30000),
          catchError(e => {
            return of(null);
          })
      )
    }
    return this.products;
  }

  /**
   * Get products from a particular collection.
   * @param collectionId the id of the collection to get products from
   */
  getProductsByCollection(collectionId: number): Observable<Product[]> {
    return this.http.get(this.url + `?fields=${productFields}&collection_id=${collectionId}`,
      httpOptions).pipe(
        map( data => {
          const desiredProducts: Product[] = [];
          const products                   = data['products'];

          for (const product of products) {
            const id            = product['id'];
            const title         = product['title'];
            const handle        = product['handle'];
            const description   = product['body_html'];
            const images        = product['images'];
            const options       = product['options'];

            const variants: Variant[] = [];
            const productVariants     = product['variants'];
            for (const variant of productVariants) {
              const id         = variant.id;
              const title      = variant.title;
              const price      = variant.price;
              const quantity   = variant.inventory_quantity;

              const newVariant = { id, title, price, quantity };
              variants.push(newVariant);
            }

            const createdAt     = product['created_at'];
            const publishedAt   = product['published_at'];

            const newProduct    = { id, title, handle, description, images, options, variants, createdAt, publishedAt };
            desiredProducts.push(newProduct);
          }

          return desiredProducts;
        }),
        timeout(30000),
        catchError(e => {
          return of(null);
        })
      )
  }

  /**
   * Return the difference in months between two dates.
   * @param utc1 First date in UTC format
   * @param utc2 Second date in UTC format
   */
  private differenceInMonths(utc1: number, utc2: number): number {
    const _MS_PER_MONTH = 1000 * 60 * 43800;

    return Math.floor(Math.abs(utc2 - utc1) / _MS_PER_MONTH);
  }

  /**
   * Get a list of products that were created less than or equal to 6 months ago.
   * Products will not show if they are not currently published on the site.
   */
  getNewProducts(): Product[] {
    const today                      = new Date();
    const todayUTC                   = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

    const desiredProducts: Product[] = []

    this.loadingService.start();
    
    this.getProducts().subscribe(
      data => {
        if (data) {
          for (const product of data) {
            const createdAt    = new Date(product.createdAt);
            const createdAtUTC = Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
      
            // product with id 451235673709 should not be shown since it is not a real product
            // sold by Practical Parts
            if (this.differenceInMonths(createdAtUTC, todayUTC) <= 12
              && product.publishedAt !== null && product.id !== 4516235673709) {
              
              const dateNoTime  = createdAt.toString().split(" ");
              product.createdAt =  `${dateNoTime[0]} ${dateNoTime[1]} ${dateNoTime[2]} ${dateNoTime[3]}`;
              desiredProducts.push(product);
            }
          }
        }
      },
    err => { },
    () => {
      this.loadingService.end();
    });

    return desiredProducts;
  }

  /**
   * Clear caches containing product information.
   */
  clearCache() {
    this.products    = null;
  }
}
