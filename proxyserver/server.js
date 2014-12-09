var http = require('http'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer({}),
    url = require('url');
var addresses = ['server1','server2'];

http.createServer(function(req, res) {
    
    var serv = addresses.shift();
   
    switch(serv)
    {
        case 'server1':
            proxy.web(req, res, { target: 'http://localhost:8488' })
            console.log('toserver 1');
            addresses.push(serv);

            break;
        case 'server2':
            proxy.web(req, res, { target: 'http://localhost:8489' });
            console.log('toserver 2');
            addresses.push(serv);
            break;
       /* default:
            proxy.web(req, res, { target: 'http://localhost:8488' })
             addresses.push(serv);;
             console.log('toserver 1');*/
    }
}).listen(9000, function() {
    console.log('proxy listening on port 9000');
});