"use strict";
const service_locator_1 = require("../service_locator");
const server_back_1 = require('./server/back/server_back');
const http_1 = require("http");
const fs_1 = require("fs");
class ServerBackService extends service_locator_1.Service {
    constructor() {
        super(...arguments);
        this.httpServer = http_1.createServer((request, response) => this.dispatchRequest(request, response));
    }
    dispatchRequest(serverRequest, serverResponse) {
        let request = new server_back_1.BackRequest(serverRequest, serverResponse);
        try {
            request.createTextResponse('text/javascript', fs_1.readFileSync('htdocs/' + serverRequest.url).toString()).send();
        }
        catch (e) {
            request.loadPostData().then(() => this.router.dispatchRequest(request)).then((response) => response.send());
        }
    }
    listen(port, host) {
        let httpServer = this.httpServer;
        httpServer.addListener("error", function (error) {
            console.log(error);
        });
        httpServer.listen(port, host);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerBackService;
//# sourceMappingURL=server.js.map