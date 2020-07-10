import { Component, OnInit, Input, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-card-body',
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./card-body.component.sass']
})
export class CardBodyComponent implements OnInit {
  @Input() innerHTML: string;                    // value to change the innerHTML to

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit() {
    if (this.innerHTML) {

      this.el.nativeElement.innerHTML = `<div>${this.innerHTML}</div>`;

      this.renderer.setStyle(this.el.nativeElement, 'padding', '1rem');

      this.el.nativeElement.querySelectorAll('p, span').forEach(p => 
        this.renderer.setStyle(p, 'text-decoration', 'none')
      );


      // change li list-style
      this.el.nativeElement.querySelectorAll('li').forEach(listItem => {
        this.renderer.setStyle(listItem, 'list-style-type', 'none');
        listItem.innerHTML = '⚙️&nbsp;&nbsp;&nbsp;' + listItem.innerHTML;
        this.renderer.setStyle(listItem, 'text-indent', '-2.2rem')
      });

    }
  }


}
