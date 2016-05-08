var React = require('react');

var Form = React.createClass({
  render: function(){
    var _this = this;
    return (
      <div className="container center-block" id={this.props.formID}>
        <div className="form-group" id={this.props.formGroupID}>
          <div className="col-xs-1 col-sm-1 col-md-2"></div>
          <div className="col-xs-8 col-sm-8 col-md-7">
            <input type="text" className="form-control" id={this.props.tbID} placeholder={this.props.placeholder} />
          </div>
          <div className="col-xs-1 col-sm-1 col-md-1">
            <button type="button" id={this.props.btnID} className="btn btn-md btn-info" onClick={function(){_this.props.btnAction()}}>{this.props.btnLabel}</button>
          </div>
        </div>
      </div>
    )
  }
});

var FormComponents = {"Form": Form};
module.exports = FormComponents;