var React = require('react');

function UrlList (props){
	var index = 0;
	let listOfUrls = props.urls.map(url => <ShortURL key={index++} url={url} />);
	return(
		<div className="panel panel-default">
			<div className="col-xs-1 col-sm-1 col-md-1"></div>
			<div className="col-xs-12 col-sm-10 col-md-9">			
			  	<ul className="list-group">
			  		{listOfUrls}
			  	</ul>
			</div>
		</div>	
		);   	
}

// Needs Styling
function ShortURL(props)
{
	return (
		<li className="list-group-item">
			<a target='_blank' href={props.url}>
				{props.url}
			</a>
		</li>
		);
}

module.exports = UrlList;