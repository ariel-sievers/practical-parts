import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-footer',
  //templateUrl: './card-footer.component.html',
  template: `
    <div>
      <hr>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./card-footer.component.sass']
})
export class CardFooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
