import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-card-actions',
  template: `
    <div>
      <ng-content select="button"></ng-content>
      <ng-content select="a"></ng-content>
    </div>
  `,
  styleUrls: ['./card-actions.component.sass']
})
export class CardActionsComponent implements OnInit {

  constructor() { 
  }

  ngOnInit() {

  }

}
