var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    fs.readFile(__dirname+'/img/10.jpg', function(e, imgSrc){   //비동기식(error,data)
        if(!e){
            res.writeHead(200, {'Content-Type':'image/jpeg'});
            res.write(imgSrc);
            res.end();
        }
    });
});

server.listen(10006, function () {
    console.log('server start... http://127.0.0.1:10006');
});