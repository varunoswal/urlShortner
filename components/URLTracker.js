var React = require('react');
var helpers = require('../helpers/helpers');
var {Form, FormTextBox, FormButton} = require("./FormComponents");

var URLTracker = React.createClass({
    getInitialState(){
        return{
            urlInfo:null
        }
    },

    getNumVisits() {
      var tbID = "#trackForm";
      var url = $("#trackURL").val().trim();
      console.log('calling');
      var isValid = helpers.isValidURL("#trackURL");
      if(!isValid)
      {
        $(tbID).addClass("has-error");
      }
      else
      {
        helpers.removeErrorClass(tbID);
        helpers.trackVisits(url)
            .then(data => {
                if(data['url_info'] != null)
                {
                  this.setState(
                      {urlInfo: data['url_info']}
                  )
                  
                  $('#visitModal').modal('show');
                }
                else
                {
                  helpers.popErrMsg('#trackURL', "URL does not exist in database");
                }
            });
      }  
    },

    render(){
      let urlInfo = this.state.urlInfo;
      let inputUrl = $("#trackURL").val();
      return (
        <div className="jumbotron visitForm">
          <h2>URL Tracker</h2>
          <Form formID="trackForm" formGroupID="urlInput">
            <FormTextBox tbID="trackURL" placeholder="Enter short URL to track visits" />
            <FormButton btnID="trackBtn" onBtnAction={this.getNumVisits} btnLabel="Track" />
          </Form>
          <TextBoxModal id='visitModal' header='URL Info' urlInfo={urlInfo} inputUrl={inputUrl} />
        </div>
      )
    }
});

function TextBoxModal(props){
  if (props.urlInfo != null){
    return (
        <div className="modal fade" id={props.id} tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title"> {props.header} </h4>
                    </div>
                    <div className="modal-body">
                      <ul>
                        <li className="modal-list-item">
                          <p className="lead">
                            Visits: {props.urlInfo['views']}
                          </p>
                        </li>                        
                        <li className="modal-list-item">
                          <p className="lead">
                            Source: <a target='_blank' href={props.urlInfo['source_url']}>
                                      {props.urlInfo['source_url']}
                                    </a>
                          </p>
                        </li>
                        <li className="modal-list-item">
                          <p className="lead">
                            Date Created: {props.urlInfo['date_created'].substring(0,16)}
                          </p>
                        </li>
                      </ul>                        
                    </div>
                </div>
            </div>
        </div>
    );
  }  
  else{
    return(null);
  } 
}

module.exports = URLTracker;