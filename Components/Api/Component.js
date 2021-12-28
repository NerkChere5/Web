// 25.12.2020


export class Component extends HTMLElement {
  static _dom_promise = null;
  
  
  _body = null;
  _root = null;
  
  
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
      let url = js_url.replace(/\.js$/, '');
      css_url = css_url ? `${url}.css` : null;
      html_url = html_url ? `${url}.html` : null;
      this._dom_promise = this._dom_promise_create({css_url, html_url});
    }
    
    let tag = 'c-' + this.name.replace(/_/g, '-').toLowerCase();
    customElements.define(tag, this);
  }
  
  
  
  
  async _build() {
    if (!this.constructor._dom_promise || this._root) return;
    
    let dom = (await this.constructor._dom_promise).cloneNode(true);
    this._body = dom.querySelector(`x_${this.constructor.name}`);
    this._root = this.attachShadow({mode: 'closed'});
    this._root.append(dom);
    
    let elements = this._root.querySelectorAll('[sync]');
    
    if (!elements.length) return;
    
    let promises = [...elements].map((element) => new Promise((fulfill, reject) => {
      element.onerror = reject;
      element.onload = fulfill;
    }));
    await Promise.allSettled(promises);
  }
  
  
  
  
  dispatchEvent_async(event) {
    setTimeout(() => this.dispatchEvent(event));
  }
}


Component.init();
