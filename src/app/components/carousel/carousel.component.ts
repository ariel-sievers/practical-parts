import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.sass']
})
export class CarouselComponent implements OnInit, AfterViewInit {
  @Input() slides;
  currentSlide:     number;                
  imageWidth:       number;
  carousel:         HTMLElement;
  carouselSlides:   NodeListOf<HTMLElement>;

  ngOnInit(): void {
    this.currentSlide = 1;
  }

  ngAfterViewInit(): void {
    this.carousel       = document.querySelector('.slides');
    this.carouselSlides = document.querySelectorAll('.slide');
    this.imageWidth     = this.carouselSlides[0].clientWidth;

    this.carousel.style.transform = `translateX(${ this.currentSlide * -this.imageWidth }px)`;

    // checks whether to disable the transition and loop back around
    this.carousel.addEventListener('transitionend', () => {
      if (this.carouselSlides[this.currentSlide].id === 'lastClone') {
        this.resetToEnd();
      }
      if (this.carouselSlides[this.currentSlide].id === 'firstClone') {
        this.resetToStart();
      }
    })
  }

  /**
   * Go to the previous slide.
   */
  onPrev(): void {
    if (this.currentSlide <= 0) { return; }
    this.carousel.style.transition = 'transform 0.4s ease-in-out';
    this.currentSlide--;
    this.carousel.style.transform  = `translateX(${ this.currentSlide * -this.imageWidth }px)`;
  }

  /**
   * Go to the next slide.
   */
  onNext(): void {
    if (this.currentSlide >= this.carouselSlides.length - 1) { return; }
    this.carousel.style.transition = 'transform 0.4s ease-in-out';
    this.currentSlide++;
    this.carousel.style.transform  = `translateX(${ this.currentSlide * -this.imageWidth }px)`;
  }

  /**
   * Reset to the first image.
   */
  resetToStart(): void {
    this.carousel.style.transition = 'none';
    this.currentSlide              = this.carouselSlides.length - this.currentSlide;
    this.carousel.style.transform  = `translateX(${ this.currentSlide * -this.imageWidth }px)`;
  }

  /**
   * Reset to the last image.
   */
  resetToEnd(): void {
    this.carousel.style.transition = 'none';
    this.currentSlide              = this.carouselSlides.length - 2;
    this.carousel.style.transform  = `translateX(${ this.currentSlide * -this.imageWidth }px)`;
  }

  

}
