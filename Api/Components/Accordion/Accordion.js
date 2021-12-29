import {Component} from '../Component.js';




class Accordion extends Component {
  
  
  async _build() {
    await super._build();
    
    let _slides = this._body.querySelector('slot').assignedElements()
    
    for (let slide of _slides) {
      slide.addEventListener('mouseenter', () => {
        clear_active_classes()
        slide.classList.add('active')
      })
    }
    
    function clear_active_classes() {
      _slides.forEach((slide) => {
        slide.classList.remove('active')
      })
    }
  }
}


Accordion.init(import.meta.url);
