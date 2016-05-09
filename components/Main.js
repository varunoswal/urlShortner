var React = require('react');
var URLTracker = require("./URLTracker");
var URLShortner = require("./URLShortner");
var { NavBar } = require("./NavBarComponents");
var URLCustomizer = require("./URLCustomizer");
var { TopTenTable } = require("./TopTenComponents");

var Main = React.createClass({
  getInitialState() {
    return {
      view:"main"
    };
  },

  changeView(newView){
    // Enable collapse from NavBarButtons when in mobile view
    let toggleClass = document.getElementById("navbarCollapser").className;
    if (!toggleClass.includes("collapsed"))
    {
      $('#navbar').collapse('toggle');
    }

    this.setState({
      view:newView
    })
  },

  returnView(){
    let view = this.state.view;
    
    switch (view){
      case "main":
        return <URLShortner />
      case "track":
        return <URLTracker />
      case "topten":
        return <TopTenTable />;
      case "custom":
        return <URLCustomizer />
    }
  },

  render(){
    let view = this.state.view;
    
    return (
      <div className="container-fluid">
        <NavBar changeView={this.changeView} />
        <div className="container">
          {this.returnView(view)}          
        </div>        
      </div>
    )
  }
});

module.exports = Main;