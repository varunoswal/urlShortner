var React = require('react');
var helpers = require('../helpers/helpers');
var FormComponents = require("./FormComponents");
var Form = FormComponents.Form;

// Can Improve
var URLCustomizer = React.createClass({

  insertCustURL: function() {
      var tbID = "#urlInput1";
      var tbID2 = "#urlInput2";
      var sourceURL = $("#sourceURL").val();
      var customURL= $("#custURL").val();
      var isValid = helpers.isValidURL(sourceURL);
      
      if(!isValid)
      {
          helpers.popErrMsg("#sourceURL", "Invalid URL: No spaces or symbols allowed");
          $(tbID).addClass("has-error");
      }
      else if(!helpers.isValidCustomExtension(customURL))
      {
        helpers.popErrMsg("#custURL", "Invalid Custom Extension: No spaces or symbols allowed");
        $(tbID2).addClass("has-error");

        if (isValid)
            helpers.removeErrorClass(tbID);
      }
      else
      {
        helpers.removeErrorClass(tbID);
        helpers.removeErrorClass(tbID2);
        helpers.createCustomURL(sourceURL, customURL)
            .then(function(data){
                var link = "<a target='_blank' href='" + data['url'] + "'>" + data['url'] + "</a>";
                $(tbID2).append(link);
            });

      }
  },

  render: function(){
    return(
        <div className="container center-block" id="customForm">
          <div className="container center-block" id="customForm">
              <div className="form-group" id="urlInput1">
                  <div className="col-xs-1 col-sm-1 col-md-2"></div>
                  <div className="col-xs-8 col-sm-8 col-md-7">
                   <input type="text" className="form-control" id="sourceURL" placeholder="Enter source URL which the customized URL should redirect to" />
                  </div>          
              </div>
          </div>
          <br />
          <Form formID="customFormMain" formGroupID="urlInput2" tbID="custURL" placeholder="Enter your own URL extension such as myURL or cust0mURL" btnID="custBtn" btnAction={this.insertCustURL} btnLabel="Customize"/>
        </div>
      )
  }
});

module.exports = URLCustomizer;
