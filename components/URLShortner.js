var React = require('react');
var helpers = require('../helpers/helpers');
var {Form, FormTextBox, FormButton} = require("./FormComponents");

var URLShortner = React.createClass({
  getInitialState(){
    // local storage urls
    // short url on current pange
    return{
      results:null
    };
  },
  
  componentWillMount(){

    // DROPDOWN OF RESULTING SHORT URL - this and customizer
    // REGEXP function that fits needs of all 3 components
    // get past urls from local storage if exists and state component state
  },

  // Can IMPROVE
  shortenURL() {
    var tbID = "#shortForm";
    var url = $("#userURL").val().trim();
    var isValid = helpers.isValidURL(url);

    if(!isValid)
    {
      helpers.popErrMsg('#userURL', "Invalid URL: No spaces or symbols allowed");
      $(tbID).addClass("has-error");  
    }
    else
    {
     helpers.removeErrorClass(tbID);

      helpers.getShortURL(url)
        .then(function(data){
            var link = "<a target='_blank' href='" + data['url'] + "'>" + data['url'] + "</a>";
            $(tbID).append(link);
        });
    }
  },

  render(){
    return(
        <Form formID="shortForm" formGroupID="urlInput">
          <FormTextBox tbID="userURL" placeholder="Enter URL shorten" />
          <FormButton btnID="shortURLBtn" onBtnAction={this.shortenURL} btnLabel="Shorten" />
        </Form>
      );
  }
});
module.exports = URLShortner;
