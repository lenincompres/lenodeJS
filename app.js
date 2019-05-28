import Lenode from './Lenode.js';

const projectName = 'Project Name';
const version = '0.0.1';
const author = 'Lenino';
const authorSite = 'http://lenino.net';

//creating a page by instantiating a Lenode({model obj}, {style obj})
var homepage = new Lenode({
  h2Title: 'Home page',
  pDescription: 'Welcome to the template for a Lenode project.',
  buttonEnter: 'enter'
}, {
  margin: '2em .5em'
});

//creating the app, this becomes document.lehead
var app = Lenode.app({
  title: projectName,
  icon: 'assets/images/icon',
  styles: ['reset.css'],
  scripts: [],
  container: { //creating the container from a model obj
    _style: 'width:100%;max-width:800px;height:100vh;margin:0 auto;padding:.5em 1em;background:silver;', //inline styling
    header: {
      h1Logo: Lenode.link('', projectName)
    },
    main: {},
    footer: {
      _style: 'font-size:.86em; position:absolute;bottom:0;left:0;width:100%;',
      list: [Lenode.link('', projectName + ' ' + version),
        'Created by ' + Lenode.link(authorSite, author),
        'Powered by ' + Lenode.link('http://lenodejs.org', 'LenodeJS')
      ]
    }
  },
  pages: {
    home: homepage //Lenode instances, model obj or Classes extending Lenode
  }
});

//sample of adding style to instatiated Lenode, in this case footer
app.container.footer.addStyle({ //text, style obj or css file
  textAlign: 'center',
  li: {
    display: 'inline-block',
    ':not(:first-child):before': {
      content: '"•"',
      margin: '0 .5em'
    }
  }
});

//adding a page AFTER creating the app (document.lehead = app)
app.addPage({
  h3_hello: 'Hello world'
}, 'hello');

//sample of adding actions
homepage.buttonEnter.onclick = () => app.goto('hello');