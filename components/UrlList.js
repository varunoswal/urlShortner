var React = require('react');

function UrlList (props){
	var index = 0;
	let listOfUrls = props.urls.map(url => <ShortURL key={index++} sourceURL={url.sourceURL} shortURL={url.shortURL} />);
	let viewToggle = listOfUrls.length == 0 ? " hide":" show";
	return(
		<div className="panel panel-default">
			<div className="col-xs-1 col-sm-1 col-md-1"></div>
			<div className="col-xs-12 col-sm-10 col-md-9">			
					<div className= {"panel-heading" + viewToggle} >
						<div className="col-xs-12 col-md-6">
							<p className="lead">Short URL</p>
						</div>
						<div className="col-xs-12 col-md-6">
							<p className="lead">Source URL</p>
						</div>
					</div>
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
			<div className="row">
				<div className="col-xs-12 col-md-6">
						<a className="listLink" target='_blank' href={props.shortURL}>
							{props.shortURL}
						</a>
				</div>		
				<div className="col-xs-12 col-md-6">						
							{props.sourceURL}						
				</div>
			</div>
		</li>
		);
}

module.exports = UrlList;