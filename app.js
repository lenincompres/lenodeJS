import Lenode from './Lenode.js';
/* 
Create pages importing classes that extend Lenode
import Homepage from './Homepage.js';

Or declaring them
*/
class HomePage extends Lenode {
  constructor() {
    // pass a model and style object (optional) to constructor
    super({
      splash: {
        h2_title: 'Welcome',
        p_description: 'This is a template for LenodeJS.</br>This page is created from a class that extends Lenode.'
      },
      button_hello: 'Hello'
      /* 
      The model object creates DOM elements. 
      If the first word in camelCase is a tag, it will used as such, and subsequent words will be classes.
      If no tag is indicated, "div" is used and the name becomes a class.
      You may also use "_" instead of camelCase: "div_className". 
      */
    }, {
      margin: '4em',
      textAlign: 'center',
      splash: {
        fontFamily: 'serif',
      }
      /* 
      The style object is turned to CSS. camelCase properties are separated by "-", and selectors by ".". 
      Nesting selectors is suported.
      */
    });
    this.button_hello.onclick = btn => alert(btn._text);
  }
};

//You may also create pages by instantiating Lenode
var contact = new Lenode({
  h3_title: 'Contact Page',
  p_description: 'Created from a Lenode object.',
  input_text: {
    _placeholder: 'placeholder' // Preceed attributes with "_" 
  },
  button_contact: 'Contact'
});
contact.button_contact.onclick = () => alert(contact.input_text._value);

// Create the app or "lehead" using "Lenode.app(attr)". This will also assign the app to document.lehead
var app = Lenode.app({
  title: 'LenodeJS Project',
  icon: 'assets/images/icon',
  styles: ['reset.css'],
  scripts: [],
  pages: {
    home: HomePage,
    contact: contact,
    about: {  // You may use model objects to be turned into Lenodes
      h3_title: 'About Page',
      p_desc: 'Created from a model object.'
    }
  },
  // Setting a body container is optional. It may be created from a Lenode or a model object, or a class extending Lenode.
  container: { 
    header: {
      h1_logo: 'LenodeJS Project'
    },
    main: {}, // The first "main" encoutered is where pages will be loaded
    footer: {
      _style: 'position:absolute;bottom:0;width:100%;',
      menu: [ // Arrays are turned into 'ul' tags with 'il' items
        Lenode.link('about', 'About'),
        Lenode.link('contact', 'Contact')
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
    margin: '1em 2em'
  },
  header: {
    fontFamily: 'fantasy',
    background: 'var(--medium)',
    color: 'var(--blank)',
  },
  footer: {
    _li: { // "_" are replaced by space selecting all descendants, not just immediate children
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
  },
  'header,footer':{ // apply styles to multiple selectors with ",". Överrides other styles.
    textAlign: 'center',
    padding: '.1em 1em .5em'
  }
});

// and add actions
app.container.header.onclick = () => app.goto();

// You may also add pages with "addPage(page, name)". The page may be a Lenode or model object, or a class that extends Lenode.
app.addPage({
  h3: 'More Page',
  p: 'Created after the app was declared.',
  h4: Lenode.link('https://github.com/lenincompres/lenodeJS', 'LenodeJS')
}, 'more');
app.container.footer.menu.add(Lenode.link('more','More'));