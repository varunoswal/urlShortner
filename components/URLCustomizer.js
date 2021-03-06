var React = require('react');
var UrlList = require("./UrlList");
var helpers = require('../helpers/helpers');
var {Form, FormTextBox, FormButton} = require("./FormComponents");

var URLCustomizer = React.createClass({
  getInitialState:function(){
    return {
      urlList:[]
    }
  },

  insertCustURL() {
      var tbID = "#urlInput1";
      var tbID2 = "#urlInput2";
      var sourceURL = $("#sourceURL").val().trim();
      var customURL= $("#custURL").val().trim();
      var isValid = helpers.isValidURL("#sourceURL");
      
      if(!isValid)
      {
        $(tbID).addClass("has-error");
      }
      else if(!helpers.isValidCustomExtension("#custURL"))
      {        
        helpers.removeErrorClass(tbID);
        $(tbID2).addClass("has-error");
      }
      else
      {
        helpers.removeErrorClass(tbID);
        helpers.removeErrorClass(tbID2);
        helpers.createCustomURL(sourceURL, customURL)
          .then(data => {              
              if (data['url'].shortURL !== false)
              {
                this.setState({
                  urlList:[data['url'], ...this.state.urlList]
                });
              }
              else
              {
                helpers.popErrMsg(tbID2, "Custom URL is already in use, choose another one");
              }              
          });
      }
  },

  render(){
    var urls = this.state.urlList;
    return(
        <div className="jumbotron">
        <h2>URL Customizer</h2>
          <Form formID="sourceURLForm" formGroupID="urlInput1">
            <FormTextBox tbID="sourceURL" placeholder="Enter source URL which the customized URL should redirect to" />
            {null}
          </Form>
          <br />
          <Form formID="customURLForm" formGroupID="urlInput2">
            <FormTextBox tbID="custURL" placeholder="Enter your own URL extension such as myURL or cust0mURL" />
            <FormButton btnID="custBtn" onBtnAction={this.insertCustURL} btnLabel="Customize" />
          </Form>
          <br />
          <UrlList urls={urls}/>
        </div>
      )
  }
});

module.exports = URLCustomizer;
