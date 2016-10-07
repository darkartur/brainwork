"use strict";
const react_dom_1 = require('react-dom');
const service_locator_1 = require("../../../service_locator");
const server_1 = require("../server");
class FrontRequest {
    getUrl() {
        return location.pathname;
    }
    getMethod() {
        return server_1.HTTPMethod.GET;
    }
    getPostData() {
        return {};
    }
    createJsxResponse(jsx) {
        return { send: () => react_dom_1.render(jsx, document.getElementById('app')) };
    }
    createRedirectResponse() {
        return { send: () => console.log('redirect') };
    }
    createJsonResponse(object) {
        return { send: () => console.log('json', object) };
    }
}
class ServerFrontService extends service_locator_1.Service {
    listen() {
        document.addEventListener('DOMContentLoaded', () => {
            this.router.dispatchRequest(new FrontRequest()).then(response => response.send());
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerFrontService;
//# sourceMappingURL=front_server.js.map