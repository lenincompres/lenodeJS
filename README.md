# LenodeJS
LenodeJS allows you to create web applications coding completely on JS, no hmtl, css or actual DOM, but a virtual tree.

Create DOM elements as Lenodes passing a **model object** and a **style object**:
```js
/* Creating a node (DOM element) 
The first word in a camelCase is the tag. Subsequent ones are classes. You may also use _ as in 'div_info'
*/
var myNode =  new Lenode({
  div_info: {
    h2_title: 'Home page',
    p_description: 'Welcome to the template for a Lenode project.'
  },
  button_hello: 'Hello'
}, {
  margin: '4em 5em',
  textAlign: 'center',
  div_info: {
    fontFamily: 'serif',
  }
});
```
You may also pass `.json` and/or `.css` files as model and style to create a Lenode. Subnodes can be accessed as well as their methods and properties. `myNode.buttonEnter.onclick = foo;` or `myNode.divInfo.addClass('selected');`, etc.

Lenodes can also be added to another indicating a parent node and a name: `new Lenode(model, style, name, parent)` or from a parent node, by invoking the `add` method: `parentNode.add(childLenode, name)`.

## Creating an App
Invoking `Lenode.app(attr)` will return a root Lenode (of the extended class Lehead). The root node will be also assigned to `document.lehead`.
```js
// app.js
import Lenode from './Lenode.js';

var app = Lenode.app({
  title: 'Project Name',
  icon: 'assets/images/icon',
  styles: ['reset.css'],
  scripts: ['auxiliary.js'],
  //Pages may be existing Lenodes, Classes extending Lenode or model objects to be turned Lenodes
  pages: {
    home: myNode, //instance of a Lenode
    page: Page, //imported or declared class
    info: {
      h3Title: 'Info page',
      pDesc: 'Page created from a model object.'
    }
  },
  // An optional body container may be a Lenode or created from a model obj
  body: {
    header: { // header, main and footer are unique, do not need a class
      h1Logo: 'Project Name'
    },
    main: {},
    footer: {
      // Attributes are preceded by _ 
      _style: 'position:absolute;bottom:0;left:0;width:100%;',
      // Arrays are turned into 'ul' tags with 'il' items
      list: [
        'Project name version 0.0.1',
        Lenode.link('info', 'Learn More')
      ]
    }
  }
});
```
The Lenode `app` or `lehead` has special methods to handle navigation, queries and routing. The most common is `app.goto(page)` that loads a page onto the container's main Lenode.
### The Index Page
This is all the HTML you will need: the `index.html`.
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script type="module" src="app.js" defer></script>
</head>
<body></body>
</html>
```
### Deploiment
LenodeJS is designed to work without the need of other libraries or dependecies, not even npm. However, it is built in ECMAScript 2018; you will need a transpiler to have it work in browsers that do not support it. `Chrome` is golden.
