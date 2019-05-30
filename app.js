import Lenode from './Lenode.js';

/* 
Create pages importing classes that extend Lenode
import Homepage from './Homepage.js';

Or declaring them
*/
class HomePage extends Lenode {
  constructor() {
    // pass model and style objects (optional) to the super method
    super({
      divSplash: {
        h2Title: 'Welcome',
        pDescription: 'This is a template for LenodeJS.</br>This page is created from a class that extends Lenode.'
      },
      buttonHello: 'Hello'
      /* 
      The model object creates DOM elements. 
      First words in camelCase are tags; subsequent words and any starting with uppercase are considered classes. 
      If no tag is indicated, "div" is used and the name becomes a class.
      You may also use "_" instead of uppercase to divide names: "div_splash". 
      */
    }, {
      margin: '5em !important',
      textAlign: 'center',
      divSplash: {
        fontFamily: 'serif',
      }
      /* 
      The style object is turned to CSS. camelCase properties are separated by "-", and selectors by ".". 
      Nesting selectors is suported.
      */
    });
    this.buttonHello.onclick = btn => app.goto(btn._text.toLowerCase());
  }
};

//You may also create pages by instantiating Lenode
var contact = new Lenode({
  h3Title: 'Contact Page',
  pDescription: 'Created from a Lenode object.',
  inputText: {
    _placeholder: 'placeholder' // Preceed attributes with "_" 
  },
  buttonContact: 'Contact'
});
contact.buttonContact.onclick = () => alert(contact.inputText._value);

// Create the app or "lehead" using "Lenode.app(attr)". This will also assign the app to document.lehead
var app = Lenode.app({
  title: 'LenodeJS Project',
  icon: 'assets/images/icon',
  styles: ['reset.css'],
  scripts: [],
  pages: {
    home: HomePage,
    contact: contact,
    info: {  // You may use model objects to be turned into Lenodes
      h3Title: 'Info Page',
      pDesc: 'Created from a model object.'
    }
  },
  // The body container may be created from a Lenode object, Class extending Lenode, or a model object to be turned into Lenode
  container: {   // This is optional
    header: {
      h1Logo: 'LenodeJS Project'
    },
    main: {}, // The first "main" encoutered is where pages will be loaded
    footer: {
      _style: 'position:absolute;bottom:0;left:0;width:100%;',
      menu: [ // Arrays are turned into 'ul' tags with 'il' items
        Lenode.link('info', 'Lenode Project 0.0.1'),
        Lenode.link('contact', 'Contact'),
        Lenode.link('https://github.com/lenincompres/lenodeJS', 'Powered by LenodeJS')
      ]
    }
  }
});

// You may add styles to an existing Lenode. Use CSS text, style obj or .css file to be linked
app.container.addStyle({
  width: '100%',
  maxWidth: '800px',
  height: '100vh',
  margin: '0 auto',
  background: 'var(--blank)',
  main: {
    margin: '1em'
  },
  header: {
    background: 'var(--medium)',
    color: 'var(--blank)',
    padding: '.1em 1em .5em'
  },
  footer: {
    textAlign: 'center',
    _li: { // "_" is replaced for a space, applyng to all descendant selectors, not just immediate children
      display: 'inline-block',
      $before: { // "$" is replaced for ":"
        content: '"•"',
        margin: '0 .5em'
      },
      ':first-child:before': { // you may use selectors as strings
        content: '""',
        margin: '0'
      }
    }
  }
});

// and add actions
app.container.header.onclick = () => app.goto();

// You may also add pages with "addPage(page, name)". The page may be a Lenode or model object, or a class that extends Lenode.
app.addPage({
  h3Hello: 'Hello Page',
  pDescription: 'Created after the app was declared.'
}, 'hello');