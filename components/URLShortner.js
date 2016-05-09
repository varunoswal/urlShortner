var React = require('react');
var UrlList = require("./UrlList");
var helpers = require('../helpers/helpers');
var {Form, FormTextBox, FormButton} = require("./FormComponents");


var URLShortner = React.createClass({
  getInitialState(){
    // local storage urls
    // short url on current pange
    return{
      urlList:[]
    };
  },
  
  componentWillMount(){
    // Function naming paradigm: prop -> onSubmitUser={this.handleSubmitUser} onHandleUser={this.handleHandleUser}

    // REGEXP function that fits needs of all 3 components **** 

    // get past urls from local storage if exists and state component state
  },

  // Can IMPROVE
  shortenURL() {
    var formID = "#shortForm";
    var url = $("#userURL").val().trim();
    let isValid = helpers.isValidURL(url);

    if(!isValid)
    {
      helpers.popErrMsg('#userURL', "Invalid URL: No spaces or symbols allowed");
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
