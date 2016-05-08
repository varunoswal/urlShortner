var React = require('react');
var NavBarComponents = require("./NavBarComponents");
var TableComponents = require("./TopTenComponents");
var FormComponents = require("./FormComponents");

var Form = FormComponents.Form;

var TopTenTable = TableComponents.TopTenTable;
var TableRow = TableComponents.TableRow;

var NavBar = NavBarComponents.NavBar;
var NavBarButton = NavBarComponents.NavBarButton;

var URLShortner = require("./URLShortner");
var URLCustomizer = require("./URLCustomizer");
var URLTracker = require("./URLTracker");

//First - App Component
var Main = React.createClass({
  getInitialState: function() {
    return {
      view:"main"
    };
  },

  changeView: function(newView)
  {
    this.setState({
      view:newView
    })
  },

  returnView: function(){
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

  render: function(){
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