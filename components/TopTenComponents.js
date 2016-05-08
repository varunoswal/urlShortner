var React = require('react');
var helpers = require('../helpers/helpers');

var TopTenTable = React.createClass({
  getInitialState: function() {
    return {
      listData:[]
    };
  },

  componentWillMount: function(){
    this.getTopTen();
  },

  getTopTen: function(){
    var _this = this;
    helpers.getTopTen()
      .then(function(data){
        _this.setState({
                listData:data["top_ten"]
            })
      });
  },

  render: function(){
    var index = 0;
    var tableRows = this.state.listData.map(function(url){
      return(
        <TableRow key={index++} rowIndex={index++} id={url[0]} source={url[1]} visits={url[2]} />
      );
    });

    if (this.state.listData.length > 0)
    {
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
    else
    {      
      return(null);
    }
  }
});

function TableRow(props){
  let link = window.ipAddress + "/" + props.id;
  return(
        <tr id={"row" + props.rowIndex}>
          <td className="rowItem"><a target="_blank" href={link}>{"short.ly/"+props.id}</a></td>
          <td className="rowItem">{props.source}</td>
          <td className="rowItem">{props.visits}</td>
        </tr>
    )
}

var TopTenTable = {"TopTenTable": TopTenTable, "TableRow": TableRow};
module.exports = TopTenTable;