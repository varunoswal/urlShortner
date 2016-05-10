var React = require('react');
var UrlList = require("./UrlList");
var helpers = require('../helpers/helpers');
var {Form, FormTextBox, FormButton} = require("./FormComponents");


var URLShortner = React.createClass({
  getInitialState(){
    // local storage urls
    return{
      urlList:[]
    };
  },

  shortenURL() {
    var formID = "#shortForm";
    var url = $("#userURL").val().trim();
    var isValid = helpers.isValidURL("#userURL");

    if(!isValid)
    {
      $(formID).addClass("has-error");  
    }
    else
    {
     helpers.removeErrorClass(formID);

      helpers.getShortURL(url)
        .then(data => {            
            this.setState({
              urlList:[data['url'], ...this.state.urlList]
            });
        });
    }
  },

  render(){
    var urls = this.state.urlList;
    return(
        <div className="jumbotron">
          <h2>URL Shortner</h2>
          <Form formID="shortForm" formGroupID="urlInput">
            <FormTextBox tbID="userURL" placeholder="Enter URL shorten" />
            <FormButton btnID="shortURLBtn" onBtnAction={this.shortenURL} btnLabel="Shorten" />
          </Form>
          <br />
          <UrlList urls={urls}/>
        </div>  
      );
  }
});
module.exports = URLShortner;
