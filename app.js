import Lenode from './Lenode.js';

/* Create pages importing classes that extend Lenode
import Homepage from './Homepage.js';

Or declaring them passing model and style objects (optional) to ther super method */
class Homepage extends Lenode {
  constructor() {
    super({
      divInfo: {
        h2Title: 'Welcome',
        pDescription: 'This is a template for LenodeJS.</br>This page is created from a class that extends Lenode.'
      },
      buttonHello: 'Hello'
    }, {
      margin: '5em !important',
      textAlign: 'center',
      divInfo: {
        fontFamily: 'serif',
      }
    });
    // The model object creates DOM elements. The first word in camelCases are tags; subsequent words are classes. You may also use "_" to divide them: "div_info". 
    // The style object is turned to CSS. camelCase is separated by "-" for properties, and by "." for selectors. It supports nesting.

    this.buttonHello.onclick = b => app.goto(b._text.toLowerCase());
  }
};
var homepage = new Lenode({
  divInfo: {
    h2Title: 'Welcome',
    pDescription: 'This is a template for LenodeJS.</br>This page is created from a class that extends Lenode.'
  },
  buttonHello: 'Hello'
}, {
  margin: '5em !important',
  textAlign: 'center',
  divInfo: {
    fontFamily: 'serif',
  }
});
homepage.buttonHello.onclick = b => app.goto(b._text.toLowerCase());

// Create the app or "lehead" using "Lenode.app(attr)". Which will also assign the app to document.lehead
var app = Lenode.app({
  title: 'LenodeJS Project',
  icon: 'assets/images/icon',
  styles: ['reset.css'],
  scripts: [],
  // Pages may be Classes extending Lenode, or model objects to be turned into Lenodes
  pages: {
    home: homepage,
    info: {
      h3Title: 'Info Page',
      pDesc: 'Created from a model object.'
    }
  },
  // An optional body container may be created from a Class extending Lenode, or a model object to be turned into Lenode
  container: {
    header: { // "header", "main" and "footer" tags do not need a class
      h1Logo: 'LenodeJS Project'
    },
    main: {}, // The first "main" encoutered is where pages will be loaded
    footer: {
      _style: 'position:absolute;bottom:0;left:0;width:100%;', // Preceed attributes with "_" 
      menu: [ // Arrays are turned into 'ul' tags with 'il' items
        Lenode.link('info', 'Lenode Project 0.0.1'),
        Lenode.link('https://github.com/lenincompres/lenodeJS', 'Powered by LenodeJS')
      ]
    }
  }
});

// You may add styles to an existing Lenode; use CSS text, style obj or .css file to be linked
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
    li: {
      display: 'inline-block',
      ':not(:first-child):before': {
        content: '"•"',
        margin: '0 .5em'
      }
    }
  }
});

// You may add pages after the app is created. Use a model object, Lenode instance, or Class that extends Lenode.
app.addPage({
  h3Hello: 'Hello Page',
  pDescription: 'Created after the app was declared.'
}, 'hello');

// Actions
app.container.header.onclick = () => app.goto();