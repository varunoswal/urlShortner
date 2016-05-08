var React = require('react');

function NavBarButton (props){
  return(
    <li>
      <button type="button" id={props.id} className="btn btn-md btn-link" onClick={function(){props.fun()}}>
        {props.btn_label}
      </button>
    </li>
  )
}

function NavBar (props) {
  return(
    <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
           <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="">Shorten ur URLs</a>
           </div>
           <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                  <NavBarButton className="navBarBtn" id="shortBtn"  btn_label="Shorten" fun={ function(){props.changeView("main")} } />
                  <NavBarButton className="navBarBtn" id="customBtn" btn_label="Customize" fun={ function(){props.changeView("custom")} } />
                  <NavBarButton className="navBarBtn" id="trackBtn" btn_label="Track" fun={ function(){props.changeView("track")} } />
                  <NavBarButton className="navBarBtn" id="topTenBtn" btn_label="Top 10" fun={ function(){props.changeView("topten")} } />
              </ul>
           </div>
        </div>
    </nav>
    )
}

var NavBarComponents = {"NavBar": NavBar, "NavBarButton": NavBarButton};
module.exports = NavBarComponents;