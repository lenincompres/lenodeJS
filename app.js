import Lenode from './Lenode.min.js';

/* You may create pages importing classes that extend Lenode
import Page from './Page.js';
*/

// Or instantiate Lenode, passing a modelObj and styleObj
var homepage = new Lenode({
  // The first word in a camelCase is the tag. Subsequent ones are classes. You may also use _ as in 'div_info'
  divInfo: {
    h2Title: 'Home page',
    pDescription: 'Welcome to the template for a Lenode project.'
  },
  buttonHello: 'Hello'
}, {
  margin: '4em 5em',
  textAlign: 'center',
  divInfo: {
    fontFamily: 'serif',
  }
});

// Create the app or "lehead". Which will be assigned to document.lehead
const projectName = 'Project Name';
const version = '0.0.1';
const lenodeLink = 'https://github.com/lenincompres/lenodeJS';
var app = Lenode.app({
  title: projectName,
  icon: 'assets/images/icon',
  styles: ['reset.css'],
  scripts: [],
  //Pages may be existing Lenodes, Classes extending Lenode or model objects to be turned into a Lenode
  pages: {
    home: homepage,
    // page: Page,
    info: {
      h3Title: 'Info page',
      pDesc: 'Page created from a model object.'
    }
  },
  // An optional container may be a Lenode or created from a model obj
  container: {
    header: { // header, main and footer are unique, do not need a class
      h1Logo: projectName
    },
    main: {},
    footer: {
      // Attributes are preceded by _ 
      _style: 'position:absolute;bottom:0;left:0;width:100%;',
      // Arrays are turned into 'ul' tags with 'il' items
      list: [
        Lenode.link('info', projectName + ' ' + version),
        'Powered by ' + Lenode.link(lenodeLink, 'LenodeJS')
      ]
    }
  }
});

//adding style to existing Lenode. Use CSS text, style obj or .css file
app.container.addStyle({
  width: '100%',
  maxWidth: '800px',
  height: '100vh',
  margin: '0 auto',
  background: 'aliceblue',
  main: {
    margin: '1em'
  },
  header: {
    background: 'lightslategray',
    padding: '.5em 1em'
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

//adding a page AFTER the app is created. Use a model object, Lenode instance or Class that extends Lenode.
app.addPage({
  h3Hello: 'Hello Page',
  pDescription: 'Created after the app was declared.'
}, 'hello');

//adding actions
app.container.header.onclick = () => app.goto();
homepage.buttonHello.onclick = b => app.goto(b._text.toLowerCase());