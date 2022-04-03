var http = require("http");

var myModule = require('./node04_custom_module_create');

var server=http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    response.write("상품코드==>"+ myModule.productCode);
    response.write("<br/>상품명==>"+ myModule.productName);
    
    response.write("<br/>plus(100,400)==>"+myModule.plus(100,400));
    response.write("<br/>minus(100,400)==>"+myModule.minus(100,400));
    response.end("<br/>gugudan(8)<br/>"+myModule.gugudan(8));
    
}).listen(10003, function(){
    console.log("server start... http://127.0.0.1:10003");
});