var MainUI = React.createClass({
  shortenURL: function() {
      var userURL = $("#userURL").val();
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
    return (
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
    )
  }
});

ReactDOM.render(<MainUI />, document.getElementById('app'));