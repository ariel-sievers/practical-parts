import { Component, OnInit } from '@angular/core';
import { Sponsor } from 'src/app/sponsor';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {
  sponsors?: Sponsor[];

  readonly baseUrl: string = '../../../assets/img/';

  constructor() { }

  ngOnInit() {
    this.loadSponsors();
  }

  /**
   * Get the sponsor image file names from the sponsor image service.
   */
  loadSponsors() {
    if (!this.sponsors) {
      this.sponsors = []
    }
    
    // TODO: remove later when service is implemented
    // (an idea of implementation is shown below)
    /**
     * for (const sponsor of sponsorList) {
     *    this.sponsors.push(sponsor)
     * }
     */
    this.sponsors.push({fileName: 'edina_reality.jpg', url: 'https://www.edinarealty.com/'});
  }

}
