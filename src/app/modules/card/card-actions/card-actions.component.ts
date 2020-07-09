import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-actions',
  //templateUrl: './card-actions.component.html',
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./card-actions.component.sass']
})
export class CardActionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
