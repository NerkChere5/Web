import {Component} from '../Component.js';




class Carousel extends Component {
  _angle = 0;
  _arrows = [];
  _plane = null;
  _position = 0;
  _slide_angle_delta = 0;
  _slide_template = null;
  _slides = [];
  
  
  
  
  async _build() {
    await super._build();
    
    this._arrows = [...this._body.querySelectorAll('.arrow')];
    this._plane = this._body.querySelector('.plane');
    this._slide_template = this._template.querySelector('.slide');
    
    this._slides_create();
    this._body.addEventListener('click', this._on_click.bind(this));
  }
  
  
  _on_click(event) {
    if (!this._arrows.includes(event.target)) return;
    
    let shift = event.target == this._arrows[0] ? -1 : 1;
    this.turn(shift);
  }
  
  
  _slides_create() {
    let slides_meta = this.querySelectorAll('meta[name="slide"]');
    this._slide_angle_delta = 360 / slides_meta.length;
    this._slides = [];
    
    for (let i = 0; i < slides_meta.length; i++) {
      let meta = slides_meta[i];
      
      let slide = this._slide_template.cloneNode(true);
      let slide_image = slide.querySelector('.slide_image');
      let slide_title = slide.querySelector('.slide_title');
      slide.href = meta.dataset['page_url'];
      slide.style.setProperty('--_slide_angle', `${this._slide_angle_delta * i}deg`);
      slide_image.src = meta.dataset['image_src'];
      slide_title.textContent = meta.dataset['title'];
      
      this._slides.push(slide);
    }
    
    this._plane.append(...this._slides);
  }
  
  
  
  
  turn(shift) {
    this._position += shift;
    let angle = this._slide_angle_delta * this._position;
    this.style.setProperty('--plane_angle_turn', `${angle}deg`);
  }
}


Carousel.init(import.meta.url);
