# lenodeJS
LenodeJS allows you to code completely on JS, no hmtl, css or actual DOM, but a virtual tree.

Create DOM elements as Lenodes passing a **model object** and a **style object**:
```js
//Creating a node (DOM element) 

var myNode = new Lenode({
  divInfo: { //the first word of camelCase is used as tag. You may also use div_info
    h2Title: 'Home page',
    pDescription: 'Welcome to the template for a Lenode project.'
  },
  buttonEnter: 'enter'
}, {
  marginTop: '2em',
  divInfo: {  //you may nest selectors
    h2:{
      color: 'gray'
    }
  }
})
```
You may also pass `.json` and/or `.css` files as model and style to create a Lenode. Subnodes can be accessed as well as their methods and properties. `myNode.buttonEnter.onclick = foo;` or `myNode.divInfo.addClass('selected');`, etc.

Lenodes can also be added to another indicating a parent node and a name: `new Lenode(model, style, name, parent)` or from a parent node, by invoking the `add` method: `parentNode.add(childLenode, name)`.

## Creating an App
Invoking `Lenode.app(attr)` will return a root Lenode (of the extended class Lehead). The root node will be also assigned to `document.lehead`.
```js
// app.js
import Lenode from './Lenode.js';

// ... declaration of any variables ...

var app = Lenode.app({
  title: projectName,
  icon: 'assets/images/icon',
  styles: ['reset.css'],
  scripts: ['auxiliar.js'],
  //set an optional container from a model object, Lenode instance or Class that extends Lenode
  container: {
    header: {
      h1Logo: projectName
    },
    main: {}, //the container must have a main node where pages are inserted
    footer: {
      credits: [projectName, version, authorSite, author, 'LenodeJS']
    }
  },
  //pages may also be model objects, Lenode instances or Classes that extend Lenode
  pages: {
    home: new Lenode(modelObj, styleObj),
    bio: { h1Title: 'Bio Title', pBio: 'This is the bio text.' },
    info: Info, //class or imported module that extends Lenode (to be instantiated)
    contanct: new Contact() //instance of class that extends Lenode
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
