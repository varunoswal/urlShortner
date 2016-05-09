var React = require('react');
var helpers = require('../helpers/helpers');
var {Form, FormTextBox, FormButton} = require("./FormComponents");

// Can Improve
var URLCustomizer = React.createClass({

  insertCustURL() {
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

  render(){
    return(
        <div>
          <Form formID="sourceURLForm" formGroupID="urlInput1">
            <FormTextBox tbID="sourceURL" placeholder="Enter source URL which the customized URL should redirect to" />
            {null}
          </Form>
          <br />
          <Form formID="customURLForm" formGroupID="urlInput2">
            <FormTextBox tbID="custURL" placeholder="Enter your own URL extension such as myURL or cust0mURL" />
            <FormButton btnID="custBtn" onBtnAction={this.insertCustURL} btnLabel="Customize" />
          </Form>
        </div>
      )
  }
});

module.exports = URLCustomizer;
