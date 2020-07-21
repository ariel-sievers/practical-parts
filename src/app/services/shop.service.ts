import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { HTTP_OPTIONS } from 'src/assets/http-options';

export interface Address {
  address1: string,
  address2: string,
  city: string,
  province: string,
  zip: string,
  country: string
}

const httpOptions = HTTP_OPTIONS;

const version            = environment.API_VERSION;
const shop               = 'practical-parts';
const contactInfoFields  = 'customer_email,phone,shop_owner';
const addressFields      = 'address1,address2,city,province,zip,country';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  readonly url     = `https://cors-anywhere.herokuapp.com/https://${shop}.myshopify.com/admin/api/${version}/shop.json`;

  address:     Observable<Address>;
  contactInfo: Observable<string[]>;

  constructor(private http: HttpClient) { }

  /**
   * Formats a 10 digit string so that it matches the following format:
   * (XXX) XXX-XXXX
   * @param phone phone number to format
   */
  private toPhoneFormat(phone: string): string {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }

  /**
   * Get the shop's email, phone, and owner from the Shopify Admin API.
   */
  getShopContactInfo(): Observable<string[]> {
    if (!this.contactInfo) {
      this.contactInfo = this.http.get(this.url + `?fields=${contactInfoFields}`,
        httpOptions).pipe(
          map( data => {
            const email = data['shop']['customer_email']
            const phone = this.toPhoneFormat(data['shop']['phone']);
            const owner = data['shop']['shop_owner'];

            return [ email, phone, owner ];
          }),
          publishReplay(3), 
          refCount()
        )
    }

    return this.contactInfo;
  }

  /**
   * Get the shop's address from the Shopify Admin API.
   */
  getShopAddress(): Observable<Address> {
    if (!this.address) {
      this.address = this.http.get(this.url + `?fields=${addressFields}`,
        httpOptions).pipe(
          map( data => {
            const address1  = data['shop']['address1'];
            const address2  = data['shop']['address2'];
            const city      = data['shop']['city'];
            const province  = data['shop']['province'];
            const zip       = data['shop']['zip'];
            const country   = data['shop']['country'];

            return { address1, address2, city, province, zip, country };
          }),
          publishReplay(1), 
          refCount()
      )
    }

    return this.address;
  }

  /**
   * Clear caches containing shop information.
   */
  clearCache() {
    this.contactInfo = null;
    this.address     = null;
  }

}
