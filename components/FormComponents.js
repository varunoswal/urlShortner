var React = require('react');

// Form Container - Holds markup for child components
function Form(props){
  // console.log(props.children);
  return (
    <div className="container center-block" id={props.formID}>
      <div className="form-group" id={props.formGroupID}>
        <div className="col-xs-1 col-sm-1 col-md-2"></div>
        <div className="col-xs-8 col-sm-8 col-md-7">
          {props.children[0]}
        </div>
        <div className="col-xs-1 col-sm-1 col-md-1">
          {props.children[1]}
        </div>
      </div>
    </div>
  );
}

function FormButton(props){
  return(
      <button type="button" className="btn btn-md btn-info" 
        id={props.btnID} 
        onClick={() => {props.onBtnAction()}}>
        {props.btnLabel}
      </button>
    );
}

function FormTextBox(props){
  return(
      <input type="text" className="form-control" 
        id={props.tbID} 
        placeholder={props.placeholder} 
      />
    );
}

var FormComponents = {"Form": Form, "FormButton": FormButton, "FormTextBox": FormTextBox};
module.exports = FormComponents;