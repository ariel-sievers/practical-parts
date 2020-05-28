import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': `Basic ${environment.BASE_64_STRING}` 
  })
};

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  readonly username = environment.ADMIN_API_KEY;
  readonly password = environment.ADMIN_PASSWORD;
  readonly shop = 'practical-parts';


  constructor(private http: HttpClient) { }

  getShop(): Observable<any> {
    return this.http.get(`https://cors-anywhere.herokuapp.com/https://${this.shop}.myshopify.com/admin/api/2020-04/shop.json`,
      httpOptions).pipe(
        map( data => {
/*           let info: Map<string, string> = new Map();
          for (const key in data['shop']) {
            info.set(key, data['shop'][key]);
          } */
          const email = data['shop']['email'];
          const domain = data['shop']['domain'];
          return { email, domain };
        })
      );
}
}
