// 25.12.2020


export class Component extends HTMLElement {
  static _dom_promise = null;
  
  
  static tag_body = 'x_body';
  static tag_prefix = 'x';
  
  
  _body = null;
  _root = null;
  _template = null;
  
  
  built = this._build();
  
  
  
  
  static async _dom_promise_create({css_url, html_url} = {}) {
    let template = document.createElement('template');
    
    if (html_url) {
      template.innerHTML = await (await fetch(html_url)).text();
    }
    
    if (css_url) {
      let link = document.createElement('link');
      link.href = css_url;
      link.rel = 'stylesheet';
      link.setAttribute('sync', true);
      template.content.prepend(link);
    }
    
    return template.content;
  }
  
  
  
  
  static init(js_url = null, {css_url = true, html_url = true} = {}) {
    if (js_url) {
      let url_part = js_url.replace(/\.\w+$/, '');
      css_url = css_url ? url_part + '.css' : null;
      html_url = html_url ? url_part + '.html' : null;
      this._dom_promise = this._dom_promise_create({css_url, html_url});
    }
    
    let tag = this.tag_prefix + '-' + this.name.toLowerCase();
    customElements.define(tag, this);
  }
  
  
  
  
  async _build() {
    if (!this.constructor._dom_promise || this._root) return;
    
    let dom = (await this.constructor._dom_promise).cloneNode(true);
    this._body = dom.querySelector(this.constructor.tag_body);
    this._template = dom.querySelector('template')?.content;
    
    this._root = this.attachShadow({mode: 'closed'});
    this._root.append(dom);
    
    await this._resources_wait();
  }
  
  
  async _resources_wait() {
    let elements = this._root.querySelectorAll('[sync]');
    
    if (!elements.length) return;
    
    let promise_executor = (element, fulfill, reject) => {
      element.addEventListener('error', reject);
      element.addEventListener('load', fulfill);
    };
    let promises = [...elements].map((element) => new Promise(promise_executor.bind(null, element)));
    await Promise.allSettled(promises);
  }
  
  
  
  
  dispatchEvent_async(event) {
    setTimeout(() => this.dispatchEvent(event));
  }
}


Component.init();
