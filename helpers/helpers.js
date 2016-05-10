var axios = require('axios');
var XRegExp = require('xregexp');
var ipAddress = "http://localhost:5000";
// var ipAddress = "http://52.37.140.113";

var helpers = {
    // modify with classnames package from npm
    removeErrorClass(id){
        if($(id).hasClass('has-error'))
        {
            $(id).removeClass("has-error");
            $(id).addClass("has-success");
        }
        else
        {
            $(id).addClass("has-success");
        }
    },

    popErrMsg (id, msg) {
        $(id).tooltip({
            'show':true,
            'placement': 'top',
            'title': msg
        });

        $(id).tooltip('show');
        setTimeout(function(){$(id).tooltip('destroy');}, 6000);
    },

    trackVisits(url){
        let apiPath =  ipAddress+'/trackURLInfo';
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        };
        return axios.post(apiPath,
            {url: url},
            config
            )
            .then(function (response) {
                // console.log(response);
                return response.data;
            })
            .catch(function (response) {
                console.log(response);
            });
    },

    isValidURL(tbID){
        var url = $(tbID).val().trim();
        var pattern = new RegExp("\\s");
        var pattern2 = /[-!$%^&*@#()_+|=?~`{}\[\]";'<>,]/;

        // Check if URL has any space characters
        if (url.length == 0)
        {
            this.popErrMsg(tbID, "Please enter a URL");   
            return false;
        }
        else if(pattern.test(url))
        {
            this.popErrMsg(tbID, "Invalid URL: No spaces allowed");
            return false;
        }

        // Check if URI scheme is http or https -> if not, return false
        var schemeRegex =XRegExp('^(?<scheme> [^:/?]+ ) ://  ', 'x');
        var schemeParts = XRegExp.exec(url, schemeRegex);        

        if(schemeParts != null)
        {      
            var scheme = schemeParts.scheme;
            if(scheme === "http" || scheme === "https")
            {                
                url = url.substring(schemeParts[0].length, url.length);
            }
            else
            {                
                this.popErrMsg(tbID, "Invalid URL: Only http or https URL schemes allowed");
                return false;
            }    
        }

        // Check if domain name has at least one dot and no symbols
        var hostRegex = XRegExp('(?<host>   [^/?]+  ) ', 'x');        
        var hostParts = XRegExp.exec(url, hostRegex);
        if(!hostParts.host.includes('.') || pattern2.test(hostParts.host))
        {
            this.popErrMsg(tbID, "Invalid URL: Please verify domain name");
            return false;
        }
        else
        {
            // Remainder is path and query string
            url = url.substring(hostParts.host.length, url.length); 
        }
    
        return true;
    },

    isValidCustomExtension(tbID){
        var url = $(tbID).val().trim();
        var pattern = new RegExp("\\s");
        var pattern2 = /[-!$%^&*@#()_+|~`{}\[\]";'<>,]/;
        var pattern3 = /[^A-Za-z0-9 ]/;
        if(url.length == 0)
        {
            this.popErrMsg(tbID, "Please enter a URL");   
            return false;
        }
        else if(pattern3.test(url) || url.length > 20 || (pattern.test(url) || pattern2.test(url) ))
        {   
            this.popErrMsg(tbID, "Invalid Custom Extension: No spaces or symbols allowed");
            return false;
        }

        return true;    
    },

    getShortURL (url) {
        let apiPath =  ipAddress+'/getShortURL';
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        };
        return axios.post(apiPath,
            {url: url},
            config
            )
            .then(function (response) {
                // console.log(response);
                return response.data;
            })
            .catch(function (response) {
                console.log(response);
            });
    },

    createCustomURL (sourceURL, customURL) {
        let apiPath =  ipAddress+'/createCustomURL';
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        };
        return axios.post(apiPath,
            {sourceURL: sourceURL, customURL: customURL},
            config
            )
            .then(function (response) {
                // console.log(response);
                return response.data;
            })
            .catch(function (response) {
                console.log(response);
            });
    },

    getTopTen(){
        let apiPath =  ipAddress+'/getTopTen';

        return axios({
            method: 'get',
            url: apiPath,
        })
        .then(function (response) {
            // console.log(response);
            return response.data;
        })
        .catch(function (response) {
            console.log(response);
        });
    }
};

module.exports = helpers;