import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-subtitle',
  //templateUrl: './card-subtitle.component.html',
  template: `
    <small class="text-left">
      <ng-content></ng-content>
    </small>
  `,
  styleUrls: ['./card-subtitle.component.sass']
})
export class CardSubtitleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
