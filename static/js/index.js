var React = require('react');
var ReactDOM = require('react-dom');
var Main = require("../../components/Main");
window.ipAddress = "http://localhost:5000"
// window.ipAddress = "http://52.37.140.113"
// console.log('before render changed');
ReactDOM.render(<Main />, document.getElementById('app'));