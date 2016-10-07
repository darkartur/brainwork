"use strict";
const server_1 = require('../server');
const querystring_1 = require('querystring');
const ReactDOMServer = require('react-dom/server');
class BackRequest {
    constructor(serverRequest, serverResponse) {
        this.serverRequest = serverRequest;
        this.serverResponse = serverResponse;
    }
    getUrl() {
        return this.serverRequest.url;
    }
    getMethod() {
        return strToMethod(this.serverRequest.method);
    }
    loadPostData() {
        return this.getMethod() === server_1.HTTPMethod.POST ? parsePost(this.serverRequest).then((data) => {
            this.postData = data;
        }) : Promise.resolve({});
    }
    getPostData() {
        return this.postData;
    }
    createJsxResponse(jsx) {
        return this.createTextResponse('text/html', `<!DOCTYPE "html">
<html>
<head>
    <title>ScrumTracker :: Список задач</title>
    <script src="bundle.js"></script>
</head>
<body>
    <div id="app">${ReactDOMServer.renderToString(jsx)}</div>
</body>
</html>`);
    }
    createRedirectResponse() {
        return {
            send: () => this.send(302, { 'Location': '/' })
        };
    }
    createJsonResponse(object) {
        return this.createTextResponse('application/json', JSON.stringify(object));
    }
    createTextResponse(contentType, text) {
        return {
            send: () => this.send(200, { "Content-Type": `${contentType}; charset=utf-8` }, text)
        };
    }
    send(status, headers, content) {
        let serverResponse = this.serverResponse;
        serverResponse.writeHead(status, headers);
        if (content) {
            serverResponse.write(content);
        }
        serverResponse.end();
    }
}
exports.BackRequest = BackRequest;
function strToMethod(str) {
    return server_1.HTTPMethod[str.toUpperCase()];
}
function parsePost(request) {
    return new Promise((resolve) => {
        var data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });
        request.on('end', () => {
            resolve(querystring_1.parse(data));
        });
    });
}
//# sourceMappingURL=server_back.js.map