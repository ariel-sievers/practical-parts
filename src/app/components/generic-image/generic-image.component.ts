import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generic-image',
  template: `
    <i class="fas fa-image fa-9x"></i>
    <small><ng-content></ng-content></small>
  `,
  styleUrls: ['./generic-image.component.sass']
})
export class GenericImageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
