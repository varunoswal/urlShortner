var VisitTracker = React.createClass({
  getNumVisits: function() {
      var shortURL = $("#shortURL").val();
      // Call url checker on shorturl ^ and allow only if passes 

      $.ajax({
          url: window.ipAddress+"/getNumVisits",
          type:"POST",
          datatype: "json",
          data:{"url": shortURL},
          success: function(data){          
              alert(data['num_visits']);
          }.bind(this),
          error: function(xhr, status, err){
              console.error("/getShortURL failed: ", status, err.toString())
          }.bind(this)
      });
  },

  render: function(){
    var _this = this;
    return (
      <div className="container center-block" id="mainForm">
         <div className="form-group" id="urlInput">
             <div className="col-md-2"></div>
             <div className="col-md-5">
              <input type="text" className="form-control" id="shortURL" placeholder="Enter short URL to track visits" />
             </div>
             <div className="col-md-2">
                  <button type="button" id="shortBtn" className="btn btn-md btn-info" onClick={function(){_this.getNumVisits()}}>Track</button>
             </div>
         </div>
      </div>
    )
  }
});

var URLShortner = React.createClass({
  shortenURL: function() {
    var userURL = $("#userURL").val();
    // Call url checker on ^ and allow only if passes no space and symbols check

    $.ajax({
        url: window.ipAddress+"/getShortURL",
        type:"POST",
        datatype: "json",
        data:{"url": userURL},
        success: function(data){          
            var link = "<a href='" + data['url'] + "'>";
            $("#mainForm").append(link + data['url'] + "</a>");
        }.bind(this),
        error: function(xhr, status, err){
            console.error("/getShortURL failed: ", status, err.toString())
        }.bind(this)
    });
  },

  render: function(){
    var _this = this;

    return(
        <div className="container center-block" id="mainForm">
           <div className="form-group" id="urlInput">
               <div className="col-md-2"></div>
               <div className="col-md-5">
                <input type="text" className="form-control" id="userURL" placeholder="Enter URL to shorten" />
               </div>
               <div className="col-md-2">
                    <button type="button" id="shortBtn" className="btn btn-md btn-info" onClick={function(){_this.shortenURL()}}>Shorten</button>
               </div>
           </div>
        </div>
      );
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
                <a className="navbar-brand" href="#">Shorten ur URLs</a>
             </div>
             <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav navbar-right">
                  <li><button type="button" id="shortBtn" className="btn btn-md btn-link" onClick={function(){_this.props.changeView("custom")}}>Customize</button></li>
                  <li><button type="button" id="shortBtn" className="btn btn-md btn-link" onClick={function(){_this.props.changeView("track")}}>Track</button></li>
                  <li><button type="button" id="shortBtn" className="btn btn-md btn-link" onClick={function(){_this.props.changeView("topten")}}>Top 10</button></li>
                  <li><button type="button" id="shortBtn" className="btn btn-md btn-link" onClick={function(){_this.props.changeView("lasthundred")}}>Last 100</button></li>
                </ul>
             </div>
          </div>
      </nav>
      )
  }
})

var MainUI = React.createClass({
  getInitialState: function() {
    return {
      view:"main" ,
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

    if(view == "main")
    {
      return(
          <URLShortner />
        );
    }
    else if(view == "track")
    {
      return(
          <VisitTracker />
        );
    }
  },

  render: function(){
    var _this = this;
    var view = this.state.view;
    // alert(view);

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

ReactDOM.render(<MainUI />, document.getElementById('app'));