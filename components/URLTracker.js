var React = require('react');
var helpers = require('../helpers/helpers');
var FormComponents = require("./FormComponents");
var Form = FormComponents.Form;


// Not First
var URLTracker = React.createClass({
    getInitialState: function(){
        return{
            numVisits: -1
        }
    },

    getNumVisits: function() {
      var _this = this;
      var tbID = "#trackForm";
      var url = $("#trackURL").val().trim();
      var isValid = helpers.isValidURL(url);

      if(!isValid)
      {
        helpers.popErrMsg("#trackURL", "Invalid URL: No spaces or symbols allowed");
        $(tbID).addClass("has-error");
      }
      else
      {
        helpers.removeErrorClass(tbID);

        helpers.trackVisits(url)
            .then(function(data){
                $('#visitModal').modal('show')
                _this.setState(
                    {numVisits: data['num_visits']}
                )
            });
      }  
  },

  render: function(){
    var visits = this.state.numVisits;
    return (
      <div className="visitForm">
        <Form formID="trackForm" formGroupID="urlInput2" tbID="trackURL" placeholder="Enter short URL to track visits" btnID="trackBtn" btnAction={this.getNumVisits} btnLabel="Track"/>
        <TextBoxModal id='visitModal' header='URL Visit Info' numVisits={visits} />
      </div>
    )
  }
});

var TextBoxModal = React.createClass({
  render: function() {
      return (
          <div className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                  <div className="modal-content">
                      <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 className="modal-title"> {this.props.header} </h4>
                      </div>
                      <div className="modal-body">
                          URL has been visited {this.props.numVisits} times
                      </div>
                  </div>
              </div>
          </div>
      );
  }
});

module.exports = URLTracker;
