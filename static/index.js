window.ipAddress = "http://localhost:5000"

var shortBtn = document.getElementById('shortBtn');

shortBtn.addEventListener('click', shortenURL);

function shortenURL(event) {
    var userURL = $("#userURL").val();
    alert('works: ' + userURL);

    $.ajax({
        url: window.ipAddress+"/getShortURL",
        type:"POST",
        datatype: "json",
        data:{"url": userURL},
        success: function(data){
            alert(data["url"]);
            $("#mainForm").append("<a href='/'>" + data['url'] + "</a>");
        }.bind(this),
        error: function(xhr, status, err){
            console.error("/getShortURL failed: ", status, err.toString())
        }.bind(this)
    });
}