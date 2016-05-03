var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
var helpers = require('./helpers');

window.ipAddress = "http://localhost:5000"
// window.ipAddress = "http://52.37.140.113"

var ShortListURLS = React.createClass({
  getInitialState: function() {
    return {
      listData:[]
    };
  },

  componentWillMount: function(){
    this.getTopTen();
  },

  getTopTen: function(){
    var results=[];
    var _this = this;
    helpers.getTopTen()
        .then(function(data){
            _this.results = data["top_ten"];
            _this.setState({
                    listData:data["top_ten"]
                })
        });
  },

  render: function(){
    var index = 0;
    var tableRows = this.state.listData.map(function(url){
      return(
        <TableRow key={index++} id={url[0]} source={url[1]} visits={url[2]} />
      );
    });
    if (this.state.listData.length > 0)
        return(
            <div className="table-responsive">
                <table className="table table-hover table-striped">
                    <thead className="tableHead">
                        <tr>
                            <th><b>Short URL</b></th>
                            <th><b>Source URL</b></th>
                            <th><b>Number of Visits</b></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
          );
     else
        return(
            <div className="table-responsive">
                {null}
            </div>
        );
  }
});

var TableRow = React.createClass({
    render: function(){
        var _this = this;
        var link = window.ipAddress+"/"+this.props.id;
        return(
            <tr id={"row" + _this.props.key}>
                <td className="rowItem"><a target="_blank" href={link}>{"short.ly/"+this.props.id}</a></td>
                <td className="rowItem">{this.props.source}</td>
                <td className="rowItem">{this.props.visits}</td>
            </tr>
        )
    }
});

var Customizer = React.createClass({

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
    var _this = this;
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

var VisitTracker = React.createClass({
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
                // alert("Visited " + data['num_visits'] + " times");
                $('#visitModal').modal('show')
                _this.setState(
                    {numVisits: data['num_visits']}
                )
            });
      }  
  },

  render: function(){
    var _this = this;
    var visits = this.state.numVisits;
    return (
      <div className="visitForm">
        <Form formID="trackForm" formGroupID="urlInput2" tbID="trackURL" placeholder="Enter short URL to track visits" btnID="trackBtn" btnAction={this.getNumVisits} btnLabel="Track"/>
        <TextBoxModal id='visitsModal' header='URL Visit Info' numVisits={visits} />
      </div>
    )
  }
});


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


var URLShortner = React.createClass({

  shortenURL: function() {
    var _this = this;
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
    var _this = this;
    return(
        <Form formID="shortForm" formGroupID="urlInput" tbID="userURL" placeholder="Enter URL to shorten" btnID="shortURLBtn" btnAction={this.shortenURL} btnLabel="Shorten"/>
      );
  }
});

var TextBoxModal = React.createClass({
    render: function() {
        var _this = this;

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

var NavBarButton = React.createClass({

  render: function(){
    var _this = this;
    return(
      <li>
        <button type="button" id={this.props.id} className="btn btn-md btn-link" onClick={function(){_this.props.fun()}}>
          {this.props.btn_label}
        </button>
      </li>
    )
  }
});

var NavBar = React.createClass({
  render:function(){
    var _this = this;
    return(
      <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container">
             <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="">Shorten ur URLs</a>
             </div>
             <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav navbar-right">
                    <NavBarButton className="navBarBtn" id="shortBtn"  btn_label="Shorten" fun={ function(){_this.props.changeView("main")} } />
                    <NavBarButton className="navBarBtn" id="customBtn" btn_label="Customize" fun={ function(){_this.props.changeView("custom")} } />
                    <NavBarButton className="navBarBtn" id="trackBtn" btn_label="Track" fun={ function(){_this.props.changeView("track")} } />
                    <NavBarButton className="navBarBtn" id="topTenBtn" btn_label="Top 10" fun={ function(){_this.props.changeView("topten")} } />
                </ul>
             </div>
          </div>
      </nav>
      )
  }
});

var MainUI = React.createClass({
  getInitialState: function() {
    return {
      view:"main" ,
      listData:[]
    };
  },

  changeView: function(newView)
  {
    this.setState({
      view:newView
    })
  },

  returnView: function(){
    var _this = this;
    var view = this.state.view;
    
    switch (view){
      case "main":
        return <URLShortner />
      case "track":
        return <VisitTracker />
      case "topten":
        return <ShortListURLS />;
      case "custom":
        return <Customizer />
    }
  },

  render: function(){
    var _this = this;
    var view = this.state.view;
    return (
      <div className="container-fluid">
        <NavBar changeView = {_this.changeView} />
        <div className="container">
          {this.returnView(view)}
        </div>
      </div>
    )
  }
});

// console.log('before render');
ReactDOM.render(<MainUI />, document.getElementById('app'));