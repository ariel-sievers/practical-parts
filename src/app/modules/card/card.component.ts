import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  //templateUrl: './card.component.html',
  template: `
    <div class="text-regular">

      <!-- header content -->
      <ng-content select="app-card-header"></ng-content>

      <!-- card image -->
      <ng-content select="[cardImage]"></ng-content>

      <!-- other content -->
      <ng-content></ng-content>

      <!-- body content -->
      <ng-content select="app-card-body"></ng-content>

      <!-- buttons and links -->
      <ng-content select="app-card-actions"></ng-content>

      <!-- footer content -->
      <ng-content select="app-card-footer"></ng-content>

    </div>
  `,
  styleUrls: ['./card.component.sass']
})
export class CardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
