import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-title',
  //templateUrl: './card-title.component.html',
  template: `
    <h2 class="text-left">
      <ng-content></ng-content>
    </h2>
  `,
  styleUrls: ['./card-title.component.sass']
})
export class CardTitleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
