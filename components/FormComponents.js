var React = require('react');

function Form(props){
  return (
    <div className="container center-block" id={props.formID}>
      <div className="form-group" id={props.formGroupID}>
        <div className="col-xs-1 col-sm-1 col-md-2"></div>
        <div className="col-xs-8 col-sm-8 col-md-7">
          <input type="text" className="form-control" id={props.tbID} placeholder={props.placeholder} />
        </div>
        <div className="col-xs-1 col-sm-1 col-md-1">
          <button type="button" id={props.btnID} className="btn btn-md btn-info" onClick={function(){props.btnAction()}}>{props.btnLabel}</button>
        </div>
      </div>
    </div>
  )
}

var FormComponents = {"Form": Form};
module.exports = FormComponents;