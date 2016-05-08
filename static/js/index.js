var React = require('react');
var ReactDOM = require('react-dom');
var helpers = require('./helpers');

// var NavBarComponents = require("../../components/NavBarComponents");
// var TableComponents = require("../../components/TopTenComponents");
// var FormComponents = require("../../components/FormComponents");
var Main = require("../../components/Main");

// var Form = FormComponents.Form;

// var TopTenTable = TableComponents.TopTenTable;
// var TableRow = TableComponents.TableRow;

// var NavBar = NavBarComponents.NavBar;
// var NavBarButton = NavBarComponents.NavBarButton;

window.ipAddress = "http://localhost:5000"
// window.ipAddress = "http://52.37.140.113"




console.log('before render changed');
ReactDOM.render(<Main />, document.getElementById('app'));