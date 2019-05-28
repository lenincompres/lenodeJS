export default class Lenode {

  constructor(model = {}, style = false, name, parent) {
    new.target.name !== 'Lenode' ? this._class = new.target.name : null;
    this._name = !name ? this._class : name;
    if (Lenode.isNode(model)) { //a node element is provided
      this._node = model;
      this._tag = model.tagName.toLowerCase();
      [...model.children].forEach(node => new Lenode(node, false, node.tagName, this));
      !this._name ? this._name = model.tagName.toLowerCase() : null;
      parent ? this.parent = parent : null; //should it be added to parent?
    } else { //it is an object to be nodified
      var classes = name ? name.replace(/\./g,'_').split('_') : [];
      this._tag = Array.isArray(model) ? 'ul' : classes.length > 1 ? classes.shift() : 'div';
      this._class && !classes.includes(this._class) ? classes.push(this._class) : null;
      this._node = Lenode.createNode(this._tag, classes, parent ? parent._node : null);
      typeof model === 'string' ? model.endsWith('.json') ?
        this.buildJSON(model) : this.build({_html:model}) : 
        this.build(model);
      parent ? parent.replaceChild(this, this._name) : null;
    }
    this._id = !isNaN(document.lenodeIndexer) ? document.lenodeIndexer += 1 : document.lenodeIndexer = 0;
    this._style = this.addStyle(style);
  }

  /* ---------------- MAIN LENODE METHODS --------------- */

  setup() {}

  end() {}

  add(model, name, prepend = false) {
    var child;
    if (model && model._isLenode && model._parent !== this) {
      this[model._name] ? this[model._name].remove() : null;
      name ? model._name = name : 'main';
      this._node[prepend ? 'prepend' : 'appendChild'](model._node);
      model._parent ? model._parent[model._name] = undefined : null;
      model._parent = this;
      child = model;
      name ? model.addClass(name) : name = model._name; //inherits name  in case of declaration
    } else {
      child = Lenode.nodify(model, this._list ? 'li_item' : name, this, prepend);
      if (child && child._node) {
        child._parent = this;
        child._list ? child._list.forEach((li, i) => li._index = i) : null;
      }
    }
    if (Array.isArray(this._list)) {
      child._index = this._list.length;
      this._list.push(child);
      return child;
    }
    return this[name] = child;
  }

  addStyle(style) {
    if (!style) return;
    !this._class ? this.setAttribute('class', this._class = 'lenode-' + this._id) : null;
    if (style === true)
      return document.lehead.addResource(`css/${this._class}.css`);
    if (typeof style === 'string' && style.endsWith('.css'))
      return document.lehead.addResource(style);
    var styleNode = {
      _html: Lenode.stylize(style, this._class),
      _tag: 'style',
      _type: 'text/css'
    };
    return document.lehead ? document.lehead.replaceChild(styleNode, 'style_' + this._class) : this.replaceChild(styleNode, 'style_' + this._class, true);
  }

  build(model = {}, style) {
    //this._children.forEach(child => child.remove());
    this._html = '';
    Array.isArray(model) ? this._list = model.map(o => Lenode.nodify(o, 'li_item', this)) :
      Object.keys(model).forEach(key => this.add(model[key], key));
    style ? this.addStyle(style) : null;
    return this;
  }

  replace(model){
    return this._parent ? this._parent.replaceChild(model, this) : null;
  }

  replaceChild(model, child, prepend = false) { //replaces a children lenode
    var name = child && typeof child === 'string' ? child :
      child ? child._name :
      model._name ? name = model._name : null;
    if (!this[name] || !this[name]._node)
      return this.add(model, name, prepend);
    var oldNode = this[name]._node;
    child = model._isLenode ? model : Lenode.nodify(model, name, this);
    child._name !== name ? child.addClass(name)._name = name : null;
    this._node.insertBefore(child._node, oldNode);
    oldNode.remove();
    child._parent = this;
    return this[name] = child;
  }

  remove() { //removes this lenode on the parent
    this._node.remove();
    this._style ? this._style.remove() : null;
    this.parent ? delete this.parent[this._name] : null;
    delete this;
    return 
  }

  update(model = {}) { //updates this lenode
    return this.parent.replaceChild(model, this._name);
  }

  addJSON(url, name, mapper, prepend = false) {
    return Lenode.getJSON(url, mapper).then(r => {
      var r = this.add(r, name, prepend);
      this.setup();
      return r;
    });
  }

  buildJSON(url, mapper) {
    return Lenode.getJSON(url, mapper).then(r => {
      var r = this.build(r);
      this.setup();
      return r;
    });
  }

  updateJSON(url, mapper) {
    return Lenode.getJSON(url, mapper).then(r => {
      var r = this.update(r);
      this.setup();
      return r;
    });
  }

  get _children() {
    return Array.isArray(this._list) ? this._list :
      Object.keys(this).map(key => this[key]).filter(child => child && child._isLenode);
  }

  /* ---------------- LENODE LIST METHODS --------------- */

  transfer(item, destination) { //Will also remove the item without passing it to another list
    if (!Array.isArray(this._list)) return this;
    var spliced = this._list.splice(this._list.reduce((a, b) => a !== null ? a : b === item ? b._index : null, null), 1)[0]; //extracts the item
    destination ? destination.add(spliced) : null; //pushes item into destination list
    return this.refresh();
  }

  refresh() { //makes sure the _node reflects the _list, updates _index
    if (!Array.isArray(this._list)) return this;
    [...this._node.querySelectorAll('li')].forEach(li => li.remove()); //removes all nodes
    this._list.forEach((item, i) => { //adds them back in, in the correct order
      item._index = i;
      item._parent = this;
      this._node.appendChild(item._node);
    });
    return this;
  }

  shuffle() {
    if (!Array.isArray(this._list)) return this;
    var newList = [];
    this._list.forEach(item => newList.splice(Math.round(Math.random() * newList.length), 0, item));
    this._list = newList;
    return this.refresh();
  }

  itemAt(i) {
    if (!Array.isArray(this._list)) return null;
    return this._list[i];
  }

  forEach(func) {
    return this._list.forEach(func);
  }

  map(func) {
    return this._list.map(func);
  }

  reduce(func) {
    return this._list.reduce(func);
  }

  filter(func) {
    return this._list.filter(func);
  }

  get _length() {
    return this._list.length;
  }

  /* ---------------- STYLE METHODS --------------- */

  getStyle(prop) {
    return this._node.style[prop];
  }

  setStyle(prop, value) {
    this._node.style[prop] = value;
    return this;
  }

  setStyles(input = {}) {
    Object.keys(input).forEach(prop => this.setStyle(prop, input[prop]));
    return this;
  }

  hasClass(cls) {
    return this._node.classList.contains(cls);
  }

  addClass(cls, transition = false) {
    return this.setClass(cls, true, transition);
  }

  removeClass(cls, transition = false) {
    return this.setClass(cls, false, transition);
  }

  toggleClass(cls, transition = false) {
    return this.setClass(cls, !this.hasClass(cls), transition);
  }

  setClass(cls, add = true, transition = false) {
    if (transition) this._node.style.transition = typeof transition === 'number' ? `${transition}s` : transition;
    cls = !Array.isArray(cls) && typeof cls === 'string' ? cls.split(' ') : [];
    add ? this._node.classList.add(...cls) : this._node.classList.remove(...cls);
    return this;
  }

  flashClass(cls, duration = 1, callBack = null, transition = false) {
    this.addClass(cls, transition);
    setTimeout(e => {
      this.removeClass(cls);
      typeof callBack === "function" ? callBack() : null;
    }, duration * 1000);
    return this;
  }

  runClasses(classes, duration = 1, callBack, transition = false) {
    if (!classes || !classes.length) return;
    var cls = classes.shift();
    if (!cls) return;
    if (classes.length) {
      this.flashClass(cls, duration, this.runClasses(classes, duration, callBack, transition), transition);
    } else {
      this.addClass(cls, transition);
      callBack ? callBack() : null;
    }
    return this;
  }

  /* ---------------- NODE EQUIVALENCE METHODS --------------- */

  handleEvent(eventName, func) {
    this._node[eventName] = e => {
      e.stopPropagation();
      func(e);
    }
  }
  set onclick(func) {
    this.handleEvent('onclick', () => func(this));
  }
  set onchange(func) {
    this.handleEvent('onchange', () => func(this));
  }
  set onblur(func) {
    this.handleEvent('onblur', () => func(this));
  }

  click() {
    return this._node.click();
  }

  querySelector(selector) {
    return this._node.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this._node.querySelectorAll(selector);
  }

  setAttribute(attribute, value) {
    return this._node.setAttribute(attribute, value);
  }

  getAttribute(attribute) {
    return this._node.getAttribute(attribute);
  }

  get _attributes(){
    var attr = this._node.attributes;
    var val = {};
    Object.keys(attr).map(k => val[attr[k].name] = attr[k].value);
    return val;
  }

  set _html(html) {
    this._node.innerHTML = html;
  }
  set _text(text) {
    this._node.innerText = text;
  }
  set _value(text) {
    this._node.value = text;
  }
  get _isLenode() {
    return Lenode.isNode(this._node);
  }
  get _html() {
    return this._node.innerHTML;
  }
  get _text() {
    return this._node.innerText;
  }
  get _value() {
    return this._node.value;
  }

  /* ---------------- STATIC METHODS --------------- */

  static app(attr){
    return new Lehead(attr);
  }

  static nodify(model = {}, name, parent, prepend = false) { //turns an object and children into nested html nodes
    if (model === undefined || model === null || name === '_tag') return;
    if (Lenode.isNode(model)) return new Lenode(model, false, name, parent);
    if(!name) console.log(model);
    const isAttr = name.startsWith('_');
    var tag = Array.isArray(model) ? 'ul' :
      model._tag ? model._tag : //tag indicated in a prop
      ['header', 'main', 'footer', 'style'].includes(name) || isAttr ? name : 'div'; //no tag indicated
    if(tag === 'style'){
      //for future, being able to add a style tag with stylize
    }
    var className = isAttr ? null : name;
    var classes = className;
    var nameArr = name.replace(/([A-Z])/g, "_$1").toLowerCase().split('_'); //breaks down complex names
    if (!isAttr && !model._tag && nameArr.length > 1) {
      tag = nameArr.shift(); //tag indicated in the name
      className = nameArr.pop();
      classes = [className, ...nameArr];
    }
    delete model._tag;
    if (isAttr && parent) { //input meant as attribute
      ['_html', '_text'].includes(tag) ? null :
        name === '_class' ? parent.addClass(model) : 
        parent.setAttribute(name.replace(/\_/g, ''), model);
      return parent[name] = model;
    }
    if (['boolean', 'number', 'string'].includes(typeof model)) { //end lenodes (no children)
      var node = this.createNode(tag, classes, parent._node, {}, prepend);
      node.innerHTML = model;
      return new Lenode(node, false, name, this, prepend);
    }
    ['script', 'link', 'meta', 'style'].includes(tag) ? classes = null : null; //creates child lenode and nodifies grand children
    var child = new Lenode(this.createNode(tag, classes, parent._node, {}, prepend), false, name, parent);
    this._name = name;
    tag === 'ul' ? child._list = model.map(o => Lenode.nodify(o, 'li_item', child)) :
      Object.keys(model).forEach(key => child.add(model[key], key));
    return child;
  }

  static stylize(model, name) { //similar to nodify, turns object into css
    if (!model) return;
    if (typeof model === 'string') return model;
    !name ? new.target ? name = new.target.name : name = this._name : null;
    var style = !name.startsWith('.') ? '.' + name : name;
    if (name.includes('@media')) {
      var mediaStart = name.indexOf('@media');
      style += ' {\n';
      Object.keys(model).forEach(sel => {
        style += Lenode.stylize(model[sel], name.substr(0, mediaStart) + sel.replace(/__/g, ' .').replace(/_/g, '.').replace(/\$/g, ':').replace(/&/g, ''));
      });
      style += '}\n';
      return style;
    }
    //initial props
    style += ' {\n';
    Object.keys(model).forEach(prop => {
      if (['string', 'number'].includes(typeof model[prop])) {
        style += '  ' + prop.replace(/([A-Z])/g, "-$1").toLowerCase() + ': ' + model[prop] + ';\n';
        delete model[prop];
      } else if (prop.includes(',')) { //if commas, assign props to multiple selector children
        prop.split(',').map(sel => sel.trim())
          .forEach(sel => Lenode.assign(!model[sel] ? model[sel] = {} : model[sel], model[prop]));
        delete model[prop];
      }
    });
    style += '}\n';
    //nested or children selectors
    Object.keys(model).forEach(sel => {
      var space = '.:_$>&'.includes(sel.charAt(0)) ? '' : ' ';
      style += Lenode.stylize(model[sel], name + space + sel.replace(/__/g, ' .').replace(/_/g, '.').replace(/\$/g, ':').replace(/&/g, ''));
    });
    return style;
  }

  static link(page, text, isPage = true, target = '_blank'){
    page.startsWith('http') ? isPage = false : null;
    !text ? text = page : null;
    return isPage ? `<a onclick=lehead.goto("${page}")>${text}</a>` :
    `<a href="${page}" target="${target}">${text}</a>`;
  }

  static createNode(tag = 'div', classes, parentNode, props = {}, prepend = false) {
    var node = document.createElement(tag);
    if (!Lenode.isNode(node)) return;
    if (classes) node.className = Array.isArray(classes) ? classes.join(' ') : classes;
    parentNode ? parentNode[prepend ? 'prepend' : 'appendChild'](node) : null;
    Object.keys(props).forEach(k => node.setAttribute(k, props[k]));
    return node;
  }

  static assign(target, source) { //line Object.assign, but nested
    if (!source) return target;
    var ok = {};
    var wary = Object.keys(source).filter(i => ['string', 'number', 'boolean']
      .includes(typeof source[i]) ? (ok[i] = source[i]) && false : true);
    Object.assign(target, ok);
    wary.forEach(w => Lenode.assign(!target[w] ? target[w] = {} : target[w], source[w]));
    return target;
  }

  static isNode(obj) {
    try {
      return obj instanceof HTMLElement;
    } catch (e) {
      return (typeof obj === "object") && (obj._nodeType === 1) && (typeof obj.style === "object") && (typeof obj.ownerDocument === "object");
    }
  }

  static getJSON(url, mapper) {
    return fetch(url).then(r => r.text()).then(r => JSON.parse(r)).then(r => mapper ? r.map(mapper) : r);
  }
}

// ---------------------   Leahead is the actual app / root / document.lehead

export class Lehead extends Lenode {

  constructor(attr = {}) {
    super(document.head);
    const _attr = this._attributes;
    this._args = [];
    this._count = 1;
    this._data = {};
    this._pages = attr.pages ? attr.pages : _attr.pages;
    this._home = attr.homepage ? attr.homepage : _attr.homepage ? _attr.homepage : 'home';
    this.container = attr.container ? attr.container : _attr.container;
    var title = attr.title ? attr.title : _attr.title;
    !this.container._isLenode ? this.container = new Lenode(this.container) : null;
    title ? this.add(title, 'title_site') : null;
    var icon = attr.icon ? attr.icon : _attr.icon;
    icon ? this.addResource(icon.endsWith('.png') ? icon : `${icon}.png`) : null;
    var noscale = attr.noscale ? attr.noscale : typeof _attr.noscale === 'string';
    if (!noscale) this.add({
      _tag: 'meta',
      _name: 'viewport',
      _content: 'width=device-width,initial-scale=1,shrink-to-fit=no'
    }, 'viewport');
    var styles = attr.styles ? attr.styles : [];
    _attr.styles ? styles = [...styles, ..._attr.styles.split(' ')] : null;
    styles.forEach((css, i) => {
      css = css.trim();
      css.search('{') > -1 ? this.add({
          _tag: 'style',
          _html: css,
          _type: 'text/css'
        }, `style_${i}`) :
        this.addResource(css.search(/.css|http/) > -1 ? css : `${css}.css`, 'css');
    });
    var scripts = attr.scripts ? attr.scripts : [];
    _attr.scripts ? scripts = [...scripts, ..._attr.scripts.split(' ')] : null;
    scripts.forEach(src => {
      src = src.trim();
      this.addResource(src.endsWith('.js') ? src : `${src}.js`, 'js');
    });
    //container
    document.lehead = this;
    document.lebody = new Lenode(document.body);
    this.loadNode(this.container);
    //to get query string on popstate
    window.addEventListener('popstate', () => this.getQuery());
    this.getQuery();//this.route(window.location.href.split('?')[1]);
  }
  
  getId(){
    return this._count += 1;
  }

  addResource(path, type) { //adds js/css/icons to the head tag
    type = type ? type : path.split('.').pop();
    const name = path.replace(/\/|\./g, '_');
    var node = {};
    type === 'js' ? node._src = path : node._href = path;
    node._tag = type === 'js' ? 'script' : 'link';
    node._type = type === 'js' ? 'text/javascript' :
      type === 'css' ? 'text/css' : type === 'png' ? 'image/png' : null;
    type === 'css' ? node._rel = 'stylesheet' : type === 'png' ? node._rel = 'icon' : null;
    return this.replaceChild(node, name);
  }
  
  addPage(page, name){
    !name && page._name ? name = page._name : null;
    if(!name) return console.log('Page needs a name to be added');
    this._pages[name] = page;
    this.getQuery();
  }

  addModule(name, loadPage = true) {
    if (!this._src) {
      this._src = this._attributes.src;
      if (!this._src) {
        var script = null;
        ['Lehead', 'app', 'App', 'index'].filter(s => !script ? script = this.querySelector(`script[src$="${s}.js"]`) : false);
        this._src = script ? script.getAttribute('src').split('/')[0] : 'src';
      };
      !this._src.endsWith('/') ? this._src += '/' : null;
    }
    const inst = !loadPage ? `document.lehead.setPage(new ${name}())` :
      `new ${name}()`;
    const mod = this.replaceChild({
      _tag: 'script',
      _type: 'module',
      _html: `import ${name} from './${this._src + name}.js'; ${inst};`
    }, name);
    return loadPage ? this._pageModule = mod : mod;
  }

  loadNode(node, isPage = true) {
    if (!node) this.setPage();
    if (node._isLenode) return this.setPage(node);
    if (typeof node === 'function') return this.loadNode(new node());
    if (typeof node !== 'string') return this.loadNode(new Lenode(node));
    if (this._pages[node]) return this.loadNode(this._pages[node]);
    this.setPage(new Lenode({p_message:`Cannot access <b>${node}</b> page.`}));
    this.addModule(node, isPage);
  }
  
  setPage(page) {
    !page ? page = new Lenode({}) : !page._isLenode ? page = new Lenode(page) : null;
    if(page !== this.container) return document.lepage = document.lebody.container.main.replaceChild(page, 'page');
    //set a container
    document.lebody.replaceChild(page, 'container');
    !page.main ? page.add({}, 'main') : null;
    document.lepage ? document.lehead.route(document.lepage._name) : null;
  }

  goto(pageName) { //goes to page calling end function of current
    if(this._pageName === pageName) return;
    var delay = document.lepage && document.lepage.end ? document.lepage.end() : 0;
    setTimeout(() => this.route(pageName), delay * 1000);
    return this;
  }

  route(pageName) { //goed to another page
    if (pageName) {
      this._args = pageName.split('/');
      pageName = this._args.shift();
    } else {
      pageName = this._home;
      typeof pageName === 'function' ? pageName = pageName.name : null;
      this._args = [];
    }
    if(this._pageName === pageName) return;
    if (!pageName) return;
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${pageName}` + '/' + this._args.join('/');
    window.history.pushState({
      path: newurl
    }, '', newurl);
    this._pageModule && this._pageModule.remove ? this._pageModule.remove() : null;
    this._pageName = pageName;
    this.loadNode(pageName);
  }

  getQuery(e) { //gets query string. First argument is the page
    var page, query = window.location.href.split('?')[1];
    if (query) {
      this._args = query.split('/');
      page = this._args.shift();
    };
    !page ? page = this._home : null;
    const current = document.lepage ? document.lepage._name : null;
    page !== current ? this.goto(page) : new Lebody();
    return page;
  };

  setCookie(cname, cvalue, exdays = 30) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = 'expires=' + d.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
  }

  getCookie(name) {
    name += '=';
    var ca = decodeURIComponent(document.cookie).split(';')
      .filter(c => c.trim().startsWith(name))[0];
    return ca ? ca.substr(name.length) : '';
  }

}