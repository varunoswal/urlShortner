var axios = require('axios');

var helpers = {
    removeErrorClass: function(id){
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

    popErrMsg: function (id, msg) {
        $(id).tooltip({
            'show':true,
            'placement': 'left',
            'title': msg
        });

        $(id).tooltip('show');

        setTimeout(function(){$(id).tooltip('hide');}, 5000);
    },

    trackVisits: function(url){
        let apiPath =  window.ipAddress+'/getNumVisits';
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
                console.log(response);
                return response.data;
            })
            .catch(function (response) {
                console.log(response);
            });
    },

    isValidURL: function(url){
        // Allow only if passes no space and symbols check
        var pattern = new RegExp("\\s");
        var pattern2 = /[-!$%^&*@#()_+|~=`{}\[\]";'<>?,]/;
        if(pattern2.test(url) || pattern.test(url))
            return false;
        else
            return true;
    },

    isValidCustomExtension: function(url){
        var pattern3 = /[^A-Za-z0-9 ]/;
        if(pattern3.test(url) || url.length > 20 || this.isValidURL(url)==false)
            return false;
        else
            return true;
    },

    getShortURL: function (url) {
        let apiPath =  window.ipAddress+'/getShortURL';
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

    createCustomURL: function (sourceURL, customURL) {
        let apiPath =  window.ipAddress+'/createCustomURL';
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
                console.log(response);
                return response.data;
            })
            .catch(function (response) {
                console.log(response);
            });
    },

    getTopTen: function(){
        let apiPath =  window.ipAddress+'/getTopTen';

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