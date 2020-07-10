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

  constructor(private renderer: Renderer2, private el: ElementRef) { 
  }

  ngOnInit() {

    // classes are not recognized inside ng-content
    this.el.nativeElement.querySelectorAll('button').forEach(button => {
      if (button.className === '.btn-regular') {
        this.renderer.addClass(button, 'btn-regular');
      } else if (button.className === '.btn-main') {
        this.renderer.addClass(button, 'btn-main');
      } else if (button.className === '.btn-dark-accent') {
        this.renderer.addClass(button, 'btn-dark-accent');
      } else if (button.className === '.btn-light-accent') {
        this.renderer.addClass(button, 'btn-light-accent');
      } else if (button.className === '.btn-danger') {
        this.renderer.addClass(button, 'btn-danger');
      } else if (button.className === '.btn-success') {
        this.renderer.addClass(button, 'btn-success');
      }

      console.log(button.className)
      this.renderer.removeClass(button, button.className.split(' ')[0])
    });

  }

}
