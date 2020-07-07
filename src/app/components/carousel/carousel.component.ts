import { Component, OnInit, Input, AfterViewInit, HostListener} from '@angular/core';

export interface Slide {
  src: string;
  description?: string;
  link?: string;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.sass']
})
export class CarouselComponent implements OnInit, AfterViewInit {

  // slide variables
  @Input() slides:     Slide[];
  currentSlide:        number;
  currentDescription:  string;
  currentLink:         string;                
  imageWidth:          number;

  // HTML elements
  carousel:            HTMLElement;
  carouselSlides:      NodeListOf<HTMLElement>;

  // timer
  slideshowTimer:      NodeJS.Timer;

  ngOnInit(): void {
    this.currentSlide       = 1;
    this.currentDescription = this.getSlideDescription(this.currentSlide);
    this.currentLink        = this.getSlideLink(this.currentSlide);
    //this.slideshowTimer     = setInterval( () => { this.onNext(); }, 7000);
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(this.carouselSlides[0].clientWidth)
    this.imageWidth = this.carouselSlides[0].clientWidth;
    this.goToSlide(1);
  }

  /**
   * Get a slide's description according to its index.
   * @param slideIndex index of the slide to get a description from
   */
  getSlideDescription(slideIndex: number): string {
    if (slideIndex <= 0 || slideIndex > this.slides.length) { return; }

    let description = this.slides[slideIndex - 1].description;

    // shorten description if its length is greater than 44 characters
    if (description && description.length > 44) { description = description.substr(0, 44); }

    console.log("DESCRIPTION FOUND: " + (description ? description : "none"));

    return description ? description : "";
  }

  /**
   * Get a slide's linkn according to its index.
   * @param slideIndex index of the slide to get a link from
   */
  getSlideLink(slideIndex: number): string {
    if (slideIndex <= 0 || slideIndex > this.slides.length) { return; }

    const link = this.slides[slideIndex - 1].link
    console.log("LINK FOUND: " + (link ? link : "none"));

    return link ? link : ""
  }

  /**
   * Go to the previous slide.
   */
  onPrev(): void {
    if (this.currentSlide <= 0) { return; }
    this.carousel.style.transition = 'transform 0.5s ease-in-out';
    this.currentSlide--;
    this.currentDescription        = this.getSlideDescription(this.currentSlide);
    this.currentLink               = this.getSlideLink(this.currentSlide);
    this.carousel.style.transform  = `translateX(${ this.currentSlide * -this.imageWidth }px)`;

    this.restartTimer();
  }

  /**
   * Go to the next slide.
   */
  onNext(): void {
    if (this.currentSlide >= this.carouselSlides.length - 1) { return; }
    this.carousel.style.transition = 'transform 0.5s ease-in-out';
    this.currentSlide++;
    this.currentDescription        = this.getSlideDescription(this.currentSlide);
    this.currentLink               = this.getSlideLink(this.currentSlide);
    this.carousel.style.transform  = `translateX(${ this.currentSlide * -this.imageWidth }px)`;

    this.restartTimer();
  }

  /**
   * Changes the current slide according to a specified index number.
   * @param slideIndex index of the slide to go to
   */
  goToSlide(slideIndex: number): void {
    if (slideIndex <= 0 || slideIndex >= this.carouselSlides.length - 1) { return; }
    this.carousel.style.transition = 'transform 0.5s ease-in-out';
    this.currentSlide              = slideIndex;
    this.currentDescription        = this.getSlideDescription(this.currentSlide);
    this.currentLink               = this.getSlideLink(this.currentSlide);
    this.carousel.style.transform  = `translateX(${ this.currentSlide * -this.imageWidth }px)`;

    this.restartTimer();
  }

  /**
   * Reset to the first image.
   */
  resetToStart(): void {
    this.carousel.style.transition = 'none';
    this.currentSlide              = this.carouselSlides.length - this.currentSlide;
    this.currentDescription        = this.getSlideDescription(this.currentSlide);
    this.currentLink               = this.getSlideLink(this.currentSlide);
    this.carousel.style.transform  = `translateX(${ this.currentSlide * -this.imageWidth }px)`;
  }

  /**
   * Reset to the last image.
   */
  resetToEnd(): void {
    this.carousel.style.transition = 'none';
    this.currentSlide              = this.carouselSlides.length - 2;
    this.currentDescription        = this.getSlideDescription(this.currentSlide);
    this.currentLink               = this.getSlideLink(this.currentSlide);
    this.carousel.style.transform  = `translateX(${ this.currentSlide * -this.imageWidth }px)`;
  }

  /**
   * Restart the interval timer which automates the slideshow.
   */
  restartTimer(): void {
    clearInterval(this.slideshowTimer);
    this.slideshowTimer = setInterval( () => { this.onNext() }, 7000);
  }

}
