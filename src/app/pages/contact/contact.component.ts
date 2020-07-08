import { Component, OnInit } from '@angular/core';
import { ShopService, Address } from 'src/app/services/shop.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.sass']
})
export class ContactComponent implements OnInit {
  contactInfo: string[];
  hoursAvailable?: string; // times for contact by phone

  constructor(private shopService: ShopService) { }

  ngOnInit() {
    this.getContactInformation();
    if (!this.hoursAvailable) {
      this.hoursAvailable = this.setConstantHoursAvailable("10AM", "11PM", true, true);
    }
  }

  /**
   * Returns a string representing hours available. For example:
   * "11AM-2PM Monday-Friday"
   * 
   * @param initialTime starting time; must occur before endTime; i.e. "11AM"
   * @param endTime ending time; must occur after initialTime; i.e. "2PM"
   * @param weekdays whether to include weekdays in availability
   * @param weekends whether to include weekends in availability
   * @param specificDays a string representing specific days; i.e. "Monday-Friday"
   */
  setConstantHoursAvailable(initialTime: string, endTime: string, 
    weekdays: boolean, weekends: boolean, specificDays?: string): string {
      let hours = `${initialTime}-${endTime}`;

      if (weekdays) {
        hours = hours.concat(" weekdays");
        if (weekends) {
          hours = hours.concat(" and weekends");
        }
      } else if (weekends) {
        hours = hours.concat(" weekends");
      } else if (specificDays) {
        hours = hours.concat(` ${specificDays}`);
      }

      return hours;
  }

  /**
   * Returns a string of the available hours for specified days of the week, with each
   * day(s) on a separate line; For example:
   * "11AM-2PM Monday-Thursday
   *  10AM-3PM Saturday"
   * 
   * @param availableHours a map with a string of day(s) as the key, and its start and end times for
   *   those days as the value; i.e. { "Monday-Thursday", { initialTime: "11AM", endTime: "2PM"} }
   */
  setSpecificHoursAvailable(availableHours: Map<string, { initialTime: string, endTime: string }>): string {
    let hours = "";
    for (const days of availableHours.keys()) {
      hours = hours.concat(`${availableHours.get(days).initialTime}-${availableHours.get(days).endTime} ${days}<br>`);
    }
    return hours;
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
        this.contactInfo = data
      },
      err => console.log(err),
      () => console.log('done loading shop information')
    )
  }

}
