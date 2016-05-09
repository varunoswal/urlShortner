var React = require('react');
var {TopTenTable} = require("./TopTenComponents");
var {NavBar} = require("./NavBarComponents");
var URLShortner = require("./URLShortner");
var URLCustomizer = require("./URLCustomizer");
var URLTracker = require("./URLTracker");

var Main = React.createClass({
  getInitialState() {
    return {
      view:"main"
    };
  },

  changeView(newView){
    this.setState({
      view:newView
    })
  },

  returnView(){
    var view = this.state.view;
    
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
    var view = this.state.view;
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