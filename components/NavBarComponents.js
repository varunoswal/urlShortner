var React = require('react');

function NavBar (props) {  
  let NavBarButtonItems = NavButtonGenerator(props);
  return(
    <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
           <div className="navbar-header">
              <button type="button" id="navbarCollapser" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="">Short.ly</a>
           </div>
           <div id="navbar" className="navbar-collapse collapse">              
              <ul className="nav navbar-nav navbar-right">
                {NavBarButtonItems}                      
              </ul>
           </div>
        </div>
    </nav>
    )
}

function NavButtonGenerator(props){
  // Defines current set of navbar buttons and passes a view change prop function
  const NavBarButtons = [
    {
      id: "shortBtn",
      btn_label: "Shorten",
      func: () => {props.changeView("main")}
    },
    {
      id: "customBtn",
      btn_label: "Customize",
      func: () => {props.changeView("custom")}
    },
    {
      id: "trackBtn",
      btn_label: "Track",
      func: () => {props.changeView("track")}
    },
    {
      id: "topTenBtn",
      btn_label: "Top 10",
      func: () => {props.changeView("topten")}
    },
  ];
  var key = 0;
  let NavBarButtonItems = NavBarButtons.map(button => {
    return(
        <li key={key++}>
          <NavBarButton className="navBarBtn" id={button.id} btn_label={button.btn_label} func={button.func} />
        </li>
      );
  });
  return NavBarButtonItems;
}

function NavBarButton (props){
  return(
    <button type="button" id={props.id} className="btn btn-md btn-link" onClick={ () => {props.func()} }>
      {props.btn_label}
    </button>
  );
}

var NavBarComponents = {"NavBar": NavBar};
module.exports = NavBarComponents;