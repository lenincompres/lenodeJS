/* 
  LenodeJS v1.0 | 20190530 
  https://github.com/lenincompres/lenodeJS 
  Create by: Lenin Compres
  License: none (public domain)
  Sample App and Crash Course
*/

import Lenode from './lib/Lenode.js';

// Create pages importing classes that extend Lenode, like so:
// import HomePage from './HomePage.js';

// Or declare them right here
class HomePage extends Lenode {
  constructor() { // Pass "model" and "style" objects to super constructor
    super({ // The "model" will create a DOM elements' tree.
      splash: { // Names become the element's class,
        h2: 'Welcome', // unless recognized as a tag.
        p: 'This page is created from a class that extends Lenode.',
        p_extra: '❤' // Beware of duplicating names in an object.
      }, // Use "_" to separate tag and class.
      helloBtn: {
        _tag: 'button', // You may also specify tags as a prop,
        _value: 'Hi', // and lead with "_" for any attribute
        _text: 'Say hello' // or inner "text" and "html".
      }
    }, { // The style object will create the class' CSS. 
      margin: '4em', // Property values are strings
      textAlign: 'center', // camelCase properties get separated by "-"
      splash: { // You may nest selectors for child elements.
        h2: { // It recognizes tags.
          fontFamily: 'var(--hypeFont)',
          $after: { // "$" become ":" and append to parent: "h2:after".
            content: '"!"' // Use quotes for "content" values.
          }
        },
        p_extra: { // "_" become "." for "tag.class"
          color: 'var(--hot)'
        },
        _done: { // Leading "_" appends the parent: ".splash.done"
          borderBottom: 'solid 2px var(--light)',
          h2$after: { // This also invokes "h2:after"
            content: '"!!!"'
          }
        }
      },
      splash_done: { // This also invokes ".splash.done"
        backgroundColor: 'white'
      }
    });
    // Once constructed, you may access child nodes, methods and properties
    this.helloBtn.onclick = this.sayHello;
  }
  // You may create methods
  sayHello = btn => { // The "onclick" function passes the calling Lenode
    this.splash.addClass('done');
    this.splash.h2._text = btn._value;
    btn.setStyle('display', 'none');
  };
};

// You may also create pages by instantiating Lenode
var contact = new Lenode({
  h3: 'Contact Page',
  p: 'This one is created from a Lenode object.',
  input: {
    _placeholder: 'Message'
  },
  button: 'Send'
}); // A style object is optional.
contact.button.onclick = () => alert(contact.input._value);

// Create the web app passing settings to "Lenode.app()".
var app = Lenode.app({
  title: 'Lenode Project', // Give it a title,
  icon: 'assets/icon', // a path to the favicon .png,
  styles: ['reset.css'], // styles to be linked
  scripts: [], // and .js files.
  pages: {
    home: HomePage, // The default page is named "home".
    contact: contact, // Names become the url route "url/?contact/"
    about: { // You may use a model to create a page
      h3: 'About Page',
      p: 'This one is created from a model object.',
      extra: {
        _html: '&#x25C6; <i>Right on!</i>', // Model objects allow html
        _style: 'color:var(--accent)' // and inline styles
      }
    }
  },
  container: { // You may set a body container from a Lenode,
    header: { // Or from a model, or class that extends Lenode.
      h1: 'Lenode Project'
    },
    main: { // Pages will load into the first "main" element
      _id: 'target' // or an element with an id of "target".
    },
    footer: {
      _style: 'position:absolute;bottom:0;width:100%;',
      pages: [ // Arrays become "ul" lists with "li" items
        Lenode.link('about', 'About'), // This returns an html link
        Lenode.link('contact', 'Contact') // given a name and text.
      ]
    }
  }
});
// The app is globally available as "document.lehead"

// You may add styles to existing Lenodes. This may be CSS string, style obj or .css file to link
app.container.addStyle({
  position: 'relative',
  width: '100%',
  maxWidth: '800px',
  height: '100vh',
  margin: '0 auto',
  background: 'var(--blank)',
  backgroundImage: 'linear-gradient(white, var(--light))',
  main: {
    margin: '1em 2.5em'
  },
  header: {
    cursor: 'pointer',
    font: 'small-caps 1em var(--headFont)',
    background: 'var(--dark)',
    color: 'var(--blank)',
  },
  footer: {
    background: 'white',
    __li: { // Lead with "__" for all descendants, not just immediate. 
      display: 'inline-block',
      ':not(:first-child):before': { // Use string for complex selectors.
        content: '"•"',
        margin: '0 .5em'
      }
    }
  },
  'header, footer': { // "," separates multiple selectors.
    textAlign: 'center', // This overrides individual styles.
    padding: '.34em 1em'
  }
});

// You may access created Lenodes.
app.container.header.onclick = () => app.goto();
// The "goto" method loads a page given its name; it default to "home".

// You may add pages to the app with "addPage(page, name)".
app.addPage({
  h3: 'Source Page',
  p: 'This one is created after the app is declared.',
  a: {
    _href: 'https://github.com/lenincompres/lenodeJS',
    _text: 'LenodeJS',
    _target: '_blank'
  }
}, 'source'); // Pages need a name.

// You may "add" new Lenodes to existing ones.
app.container.footer.pages.add(Lenode.link('source', 'Source'));
// If it is a list, it gets added as an item.

/*
LenodeJS works without the need of other libraries or dependecies.
You do not need npm or running a build, just put it in a server.
However, it is built with ECMAScript 2018. You will need a transpiler to have it work in browsers that do not support it.
*/