/* 
   LenodeJS v1.0 | 20190530 
   sample app 
   https://github.com/lenincompres/lenodeJS 
   Create by: Lenin Compres
   License: none (public domain)
*/

import Lenode from './Lenode.js';

/* 
// Create pages importing classes that extend Lenode, like so:
import HomePage from './HomePage.js';
*/

class HomePage extends Lenode { // Or declare them right here
  constructor() { // Pass "model" and "style" objects to super constructor
    super({ // The model will create DOM elements in a tree.
      splash: { // Names become the element's class. 
        h2: 'Welcome', // Unless Lenode recognizes them as a tag.
        p: 'This page was created from a class that extends Lenode.', // Beware of duplicating names in an object
        p_desc: 'LenodeJS template' // You may indicade a tag and class separated by "_"
      },
      helloBtn: {
        _tag: 'button', // You may indicate the tag as a prop like this
        _value: 'Hello!', // Preceding "_" works for any element attribute
        _text: 'Say hello' // It also evokes inner "text" and "html"
      }
    }, { // The style object will be turned into CSS for this class. 
      margin: '4em', // Property values are always strings
      textAlign: 'center', // Properties in camelCase get separated by "-"
      splash: { // You may nest selectors for child elements.
        p_desc: { // Use "_" for "tag.class" selectors
          color: 'var(--medium)' // All CSS values work.
        },
        _done: { // Preciding "_" appends the parent selector as ".splash.done"
          borderBottom: 'solid 1px var(--medium)' // Shorthand works
        },
        h2: {
          $after: { // "$" becomes ":" and appends the parent selector as "h2:after"
            content: '"!"' // You need quotes for "content" values
          }
        }
      }
    });

    // You may now access child nodes and their methods and properties
    this.helloBtn.onclick = btn => {
      alert(btn._value);
      this.splash.addClass('done');
      this.splash.h2._text = 'Hi!';
      btn.setStyle('display', 'none');
    }
  }
};

// You may also create pages by instantiating Lenode
var contact = new Lenode({
  h3: 'Contact Page',
  p: 'Created from a Lenode object.',
  input: {
    _placeholder: 'Message'
  },
  button: 'Send'
}); // A style object is optional.
contact.button.onclick = () => alert(contact.input._value);

// Now create a web app using "Lenode.app()" with settings.
var app = Lenode.app({
  title: 'LenodeJS Project', // Indicate the title of the page/app
  icon: 'assets/images/icon', // the path to the icon .png
  styles: ['reset.css'], // any additional styles to be linked
  scripts: [], // and JS files
  pages: { // Set the pages in the app.
    home: HomePage, // The default page should be named "home"
    contact: contact, // Page names become their url route "url/?contact/"
    about: { // You may use a model object to create a page
      h3: 'About Page',
      p: 'Created from a model object.'
    }
  },
  container: { // Set an optional body container from a Lenode, model object, or class that extens Lenode.
    header: {
      h1: 'LenodeJS Project'
    },
    main: { // Pages are loaded into the first "main" encoutered
      _id: 'target' // or an element with a "target" id.
    },
    footer: {
      _style: 'position:absolute;bottom:0;width:100%;', // You may set inline style as a prop
      pages: [ // Arrays are turned into 'ul' lists with 'il' items
        Lenode.link('about', 'About'), // "Lenode.link" creates html links
        Lenode.link('contact', 'Contact') // Pass a page name and link text
      ]
    }
  }
});
// The app is also available as "document.lehead"

// You may add styles to existing Lenodes. Use CSS text, style obj or .css file to be linked
app.container.addStyle({
  position: 'relative',
  width: '100%',
  maxWidth: '800px',
  height: '100vh',
  margin: '0 auto',
  background: 'var(--blank)',
  main: {
    margin: '1em 2em'
  },
  header: {
    cursor: 'pointer',
    fontFamily: 'fantasy',
    background: 'var(--medium)',
    color: 'var(--blank)',
  },
  footer: {
    __li: { // Use "__" to select all descendants, not just immediate ones
      display: 'inline-block',
      $before: {
        content: '"•"',
        margin: '0 .5em'
      },
      ':first-child:before': { // You may use complex selectors as strings
        content: '""',
        margin: '0'
      }
    }
  },
  'header, footer': { // Apply styles to multiple selectors with "," overriding their individual styles.
    textAlign: 'center',
    padding: '.1em 1em .5em'
  }
});

// You may add actions to existing Lenodes.
app.container.header.onclick = () => app.goto();
// The "goto" method takes you any page name passed, defaulting to "home".

// You may add pages with "addPage(page, name)".
app.addPage({
  h3: 'More Page',
  p: 'Created after the app was declared.',
  a: {
    _href: 'https://github.com/lenincompres/lenodeJS',
    _text: 'LenodeJS',
    _target: '_blank'
  }
}, 'more');

// You may add Lenodes to existing ones.
app.container.footer.pages.add(Lenode.link('more', 'More'));
// If the parent is a list, Lenode knows to add as an item.

/*
 Enjoy!
*/