import { Injectable } from '@angular/core';
import { Slide } from '../components/carousel/carousel.component';
import { SLIDES } from 'src/assets/SLIDES';

@Injectable({
  providedIn: 'root'
})
export class SlideshowService {
  slides: Slide[];

  // TODO: eventually, slides should be obtained from form submission api
  // and changes should submit include a form submission of the entire slides array.
  // For now, slides are obtained from a ts file and their images from Netlify's large media option.

  constructor() { }

  /**
   * Add a slide to the slideshow.
   * @param src url for image
   * @param description description of image/slide
   * @param link link to a page
   */
  addSlide(src: string, description: string, link: string) {
    // TODO: submit as a form to Netlify forms
    this.slides.push({src: src, description: description, link: link});
  }

  /**
   * Remove a slide from the slideshow.
   * @param slideIndex position of the slide
   */
  removeSlide(slideIndex: number) {
    this.slides = this.slides.filter(s => this.slides[slideIndex] !== s);
  }

  /**
   * Get a slide by its position.
   * @param slideIndex position of the slide
   */
  getSlide(slideIndex: number): Slide {
    return this.slides[slideIndex];
  }

  /**
   * Get all slides in the presentation.
   */
  getSlides(): Slide[] {
    // TODO: get from Netlify form submissions API if slides array is empty
    if (!this.slides) { return SLIDES; }
    return this.slides;
  }

  /**
   * Change a slide according to its position/index.
   * @param slideIndex slide position
   * @param newSrc new image url
   * @param newDescription new slide description
   * @param newLink new link to a page
   */
  editSlide(slideIndex: number, newSrc: string, newDescription: string, newLink: string) {
    let slide = this.getSlide(slideIndex);
    slide = {src: newSrc, description: newDescription, link: newLink};
    this.slides[slideIndex] = slide;
  }

}
