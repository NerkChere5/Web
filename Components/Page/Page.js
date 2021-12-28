import {Component} from '../Api/Component.js';

import '../Slider/Slider.js';


class Page extends Component {
  
  async _build() {
    await super._build();
    
    let slider = this._body.querySelector('c-slider');
    await slider.built;
    
    let slotChildren = this._body.querySelector('slot[name="sliderBox"]').assignedElements();
    
    slider.append(...slotChildren);
    
    slider.refresh();
    
    let address = this._body.querySelector('slot[name="backAddress"]').assignedElements()[0].textContent;
    this._body.querySelector('#back').addEventListener('click', () => location = address);
  }
}


Page.init(import.meta.url);
