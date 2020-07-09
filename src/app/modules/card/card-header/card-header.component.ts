import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-card-header',
  //templateUrl: './card-header.component.html',
  template: `
    <div>
      <ng-content select="app-card-title"></ng-content>
      <ng-content select="app-card-subtitle"></ng-content>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./card-header.component.sass']
})
export class CardHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
