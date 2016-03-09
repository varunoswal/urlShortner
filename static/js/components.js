var ShortListURLS = React.createClass({
  getInitialState: function() {
    return {
      listData:[] ,
    };
  },

  componentWillMount: function(){
    this.getTopTen();
  },

  getTopTen: function(){
    var _this = this;

    $.ajax({
      url: window.ipAddress + "/getTopTen",
      type: "GET",
      success: function(data){
        _this.setState({
          listData:data["top_ten"]
        })
      }.bind(this),
      error: function(xhr, status, err){
        console.error("/getTopTen failed: ", status, err.toString());
      }.bind(this)
    });
  },

  render: function(){
    var index = 0;
    var tableRows = this.state.listData.map(function(url){
      return(
        <TableRow key={index++} id={url[0]} source={url[1]} visits={url[2]} />
      );
    });

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
  }
});

var LongListURLS = React.createClass({
  getInitialState: function() {
    return {
      listData:[] ,
    };
  },

  componentWillMount: function(){
    this.getLastHundred();
  },

  getLastHundred: function(){
    var _this = this;
    $.ajax({
      url: window.ipAddress + "/getLastHundred",
      type: "GET",
      success: function(data){
        //alert(data["top_ten"][0].length);
        _this.setState({
          listData:data["last_hundred"]
        })
      }.bind(this),
      error: function(xhr, status, err){
        console.error("/getLastHundred failed: ", status, err.toString());
      }.bind(this)
    });
  },

  render: function(){
    var index = 0;
    var tableRows = this.state.listData.map(function(url){
      return(
        <TableRow key={index++} id={url[0]} source={url[1]} visits={url[2]} />
      );
    });

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
  }
});

var TableRow = React.createClass({
    render: function(){
        var _this = this;
        return(
            <tr id={"row" + _this.props.key}>
                <td className="rowItem">{_this.props.id}</td>
                <td className="rowItem">{_this.props.source}</td>
                <td className="rowItem">{_this.props.visits}</td>
            </tr>
        )
    }
});

var Customizer = React.createClass({
  insertCustURL: function() {
      var tbID = "#urlInput1";
      var tbID2 = "#urlInput2";
      var url1 = $("#sourceURL").val();
      var url2= $("#custURL").val();


      // Allow only if passes no space and symbols check
      var pattern1 = new RegExp("\\s");
      var pattern2 = /[-!$%^&*#()_+|~=`{}\[\]";'<>?,]/;
      var pattern3 = /[^A-Za-z0-9 ]/;
      
      if(pattern2.test(url1) || pattern1.test(url1))
      {
        
        $(tbID).addClass("has-error");  
      }
      else if(pattern3.test(url2) || pattern2.test(url1) || pattern1.test(url2) || url2.length > 20)
      {
        alert('not an');
        $(tbID2).addClass("has-error");  
      }
      else
      {
        if($(tbID).hasClass('has-error'))
        {
          $(tbID).removeClass("has-error");
          $(tbID).addClass("has-success");
        }
        else
        {
          $(tbID).addClass("has-success"); 
          $(tbID2).addClass("has-success"); 
        }

        // $.ajax({
        //     url: window.ipAddress+"/insertCustURL",
        //     type:"POST",
        //     datatype: "json",
        //     data:{"url": shortURL},
        //     success: function(data){          
        //         alert(data['num_visits']);
        //     }.bind(this),
        //     error: function(xhr, status, err){
        //         console.error("/getNumVisits failed: ", status, err.toString());
        //     }.bind(this)
        // });

      } 
  },

  render: function(){
    var _this = this;
    return(

        <div className="container center-block" id="customForm">
          <div className="container center-block" id="customForm">
              <div className="form-group" id="urlInput1">
                  <div className="col-md-3"></div>
                  <div className="col-md-5">
                   <input type="text" className="form-control" id="sourceURL" placeholder="Enter URL to which the customized URL will be redirect" />
                  </div>          
              </div>
          </div>
          <br /><br />
          <div className="container center-block" id="customForm">
             <div className="form-group" id="urlInput2">
                 <div className="col-md-3"></div>
                 <div className="col-md-5">
                  <input type="text" className="form-control" id="custURL" placeholder="Enter a custom URL extension such as CustomURL or C00Lurl" />
                 </div>
                 <div className="col-md-1">
                      <button type="button" id="shortBtn" className="btn btn-md btn-info" onClick={function(){_this.insertCustURL()}}>Customize</button>
                 </div>
             </div>
          </div>
        </div>
      )
  }
});

var VisitTracker = React.createClass({
  getNumVisits: function() {
      var tbID = "#trackForm";
      var url = $("#trackURL").val();
      // Call url checker on shorturl ^ and allow only if passes 

      // Allow only if passes no space and symbols check
      var pattern = new RegExp("\\s");
      var pattern2 = /[-!$%^&*#()_+|~=`{}\[\]";'<>?,]/;
      
      if(pattern2.test(url) || pattern.test(url))
      {
        $(tbID).addClass("has-error");  
      }
      else
      {
        if($(tbID).hasClass('has-error'))
        {
          $(tbID).removeClass("has-error");
          $(tbID).addClass("has-success");
        }
        else
        {
          $(tbID).addClass("has-success"); 
        }

        $.ajax({
            url: window.ipAddress+"/getNumVisits",
            type:"POST",
            datatype: "json",
            data:{"url": url},
            success: function(data){          
                alert("Visited " + data['num_visits'] + " times");
            }.bind(this),
            error: function(xhr, status, err){
                console.error("/getNumVisits failed: ", status, err.toString());
            }.bind(this)
        });
      }  
  },

  render: function(){
    var _this = this;
    return (
      <div className="container center-block" id="trackForm">
         <div className="form-group" id="urlInput">
             <div className="col-md-3"></div>
             <div className="col-md-5">
              <input type="text" className="form-control" id="trackURL" placeholder="Enter short URL to track visits" />
             </div>
             <div className="col-md-1">
                  <button type="button" id="shortBtn" className="btn btn-md btn-info" onClick={function(){_this.getNumVisits()}}>Track</button>
             </div>
         </div>
      </div>
    )
  }
});

var URLShortner = React.createClass({
  shortenURL: function() {
    var tbID = "#shortForm";
    var url = $("#userURL").val().trim();

    // Allow only if passes no space and symbols check
    var pattern = new RegExp("\\s");
    var pattern2 = /[-!$%^&*#()_+|~=`{}\[\]";'<>?,]/;
    
    if(pattern2.test(url) || pattern.test(url))
    {
      $(tbID).addClass("has-error");  
    }
    else
    {
      if($(tbID).hasClass('has-error'))
      {
        $(tbID).removeClass("has-error");
        $(tbID).addClass("has-success");
      }
      else
      {
        $(tbID).addClass("has-success"); 
      }

      $.ajax({
          url: window.ipAddress+"/getShortURL",
          type:"POST",
          datatype: "json",
          data:{"url": url},
          success: function(data){          
              var link = "<a href='" + data['url'] + "'>";
              $(tbID).append(link + data['url'] + "</a>");
          }.bind(this),
          error: function(xhr, status, err){
              console.error("/getShortURL failed: ", status, err.toString());
          }.bind(this)
      });

    }  
  },

  render: function(){
    var _this = this;

    return(
        <div className="container center-block" id="shortForm">
           <div className="form-group" id="urlInput">
               <div className="col-md-3"></div>
               <div className="col-md-5">
                <input type="text" className="form-control" id="userURL" placeholder="Enter URL to shorten" />
               </div>
               <div className="col-md-1">
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
                <a className="navbar-brand" href="">Shorten ur URLs</a>
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
      view:"custom" ,
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
    else if(view == "topten")
    {
        return(
            <ShortListURLS />
        );
    }
    else if(view == "lasthundred")
        return(
            <LongListURLS />
        );
    else if(view == "custom")
    {
        return(
          <Customizer />
        );
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

ReactDOM.render(<MainUI />, document.getElementById('app'));