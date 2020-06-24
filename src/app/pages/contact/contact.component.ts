import { Component, OnInit } from '@angular/core';
import { ShopService, Address } from 'src/app/services/shop.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.sass']
})
export class ContactComponent implements OnInit {
  contactInfo: string[];

  constructor(private shopService: ShopService) { }

  ngOnInit() {
    this.getContactInformation();
  }

  /**
   * Get contact information from the cache stored in ShopService, with the data
   * stored in the following order:
   * - Index 0 : customer email
   * - Index 1 : store phone number
   * - Index 2 : store owner
   */
  getContactInformation(): void {
    this.shopService.getShopContactInfo().subscribe(
      data => {
        this.contactInfo = data,
        console.log(this.contactInfo) },
      err => console.log(err),
      () => console.log('done loading shop information')
    )
  }

}
