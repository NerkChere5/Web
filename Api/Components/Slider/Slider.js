// 3.04.2021


import {Component} from '../Component.js';




class Slider extends Component {
  _arrows = null;
  _delay = null;
  _item_num = null;
  _item_prev_num = null;
  _meta_points = null;
  _point = null;
  _timer = null;
  
  
  
  
  get item_num() {
    return this._item_num;
  }
  
  set item_num(num) {
    if (!this.children.length || this._body.hasAttribute('_animation_dir')) return;
    
    this._item_prev_num = this._item_num;
    this._item_num = (this.children.length + num % this.children.length) % this.children.length || 0;
    
    if (this._item_num == this._item_prev_num) return;
    
    this.children[this._item_num].slot = 'item';
    this._meta_points.children[this._item_num].setAttribute('_active', '');
    
    if (this._item_prev_num == null) return;
    
    this.children[this._item_prev_num].slot = 'item_prev';
    this._meta_points.children[this._item_prev_num].removeAttribute('_active');
    
    this._body.setAttribute('_animation_dir', num > this._item_prev_num);
  }
  
  
  
  
  async _build() {
    await super._build();
    
    let slot = this._root.querySelector('slot');
    this._arrows = this._root.querySelectorAll('x_arrow');
    this._meta_points = this._root.querySelector('x_meta_points');
    this._point = this._root.querySelector('template').content.querySelector('x_point');
    
    slot.addEventListener('animationend', this._on_animationend__item.bind(this));
    this._arrows[0].addEventListener('pointerdown', () => this.item_num--);
    this._arrows[1].addEventListener('pointerdown', () => this.item_num++);
    this._meta_points.addEventListener('pointerdown', this._on_pointerdown__meta_points.bind(this));
    
    this.refresh();
  }
  
  
  _item_delayChange() {
    clearTimeout(this._timer);
    
    if (!this._delay) return;
    
    this._timer = setTimeout(() => this.item_num++, this._delay);
  }
  
  
  _on_animationend__item() {
    this.children[this._item_prev_num].slot = '';
    this._body.removeAttribute('_animation_dir');
    
    // this._item_num ? this._arrows[0].removeAttribute('hidden') : this._arrows[0].setAttribute('hidden', true);
    
    this._item_delayChange();
  }
  
  
  _on_pointerdown__meta_points(event) {
    if (event.target == this._meta_points) return;
    
    this.item_num = event.target.num;
  }
  
  
  _points_create() {
    this._meta_points.textContent = '';
    
    for (let i = 0; i < this.children.length; i++) {
      let point = this._point.cloneNode(true);
      point.num = i;
      
      this._meta_points.append(point);
    }
  }
  
  
  
  
  refresh() {
    this._delay = +this.getAttribute('delay');
    this._item_num = null;
    this._item_prev_num = null;
    this._body.removeAttribute('_animation_dir');
    
    this._points_create();
    this.item_num = 0;
    
    this._item_delayChange();
  }
}


Slider.init(import.meta.url);
