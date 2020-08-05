import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, publishReplay, refCount, timeout, catchError } from 'rxjs/operators';

export interface Address {
  address1: string,
  address2: string,
  city: string,
  province: string,
  zip: string,
  country: string
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  readonly url     = `/.netlify/functions/shop`;

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
      this.contactInfo = this.http.get(`${this.url}?fieldType=contactInfo`)
      .pipe(
          map( data => {
            const email = data['shop']['customer_email']
            const phone = this.toPhoneFormat(data['shop']['phone']);
            const owner = data['shop']['shop_owner'];

            return [ email, phone, owner ];
          }),
          publishReplay(3), 
          refCount(),
          catchError(e => {
            return of(null);
          })
        )
    }

    return this.contactInfo;
  }

  /**
   * Get the shop's address from the Shopify Admin API.
   */
  getShopAddress(): Observable<Address> {
    if (!this.address) {
      this.address = this.http.get(`${this.url}?fieldType=address`)
      .pipe(
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
          refCount(),
          catchError(e => {
            return of(null);
          })
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
