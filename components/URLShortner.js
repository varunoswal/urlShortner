var React = require('react');
var helpers = require('../helpers/helpers');
var {Form} = require("./FormComponents");

var URLShortner = React.createClass({

  // Can IMPROVE
  shortenURL: function() {
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

  render: function(){
    return(
        <Form formID="shortForm" formGroupID="urlInput" tbID="userURL" placeholder="Enter URL to shorten" btnID="shortURLBtn" btnAction={this.shortenURL} btnLabel="Shorten"/>
      );
  }
});
module.exports = URLShortner;
