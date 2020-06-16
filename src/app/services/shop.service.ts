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
  readonly version = environment.API_VERSION;
  readonly shop = 'practical-parts';

  constructor(private http: HttpClient) { }

  getShop(): Observable<any> {
    return this.http.get(`https://cors-anywhere.herokuapp.com/https://${this.shop}.myshopify.com/admin/api/${this.version}/shop.json`,
      httpOptions).pipe(
        map( data => {
          const email = data['shop']['email'];
          const domain = data['shop']['domain'];
          return { email, domain };
        })
      );
}
}
