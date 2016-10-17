"use strict";
const service_locator_1 = require("../service_locator");
class Route {
    constructor(options, action) {
        this.options = options;
        this.action = action;
    }
    execute(request) {
        var matches;
        if (this.options.method !== request.getMethod()) {
            return;
        }
        matches = this.options.pattern.exec(request.getUrl());
        if (!matches) {
            return;
        }
        return Promise.resolve(this.action(request, matches));
    }
}
class Router extends service_locator_1.Service {
    constructor(...args) {
        super(...args);
        this.routes = [];
    }
    dispatchRequest(request) {
        var l = this.routes.length, result;
        for (let i = 0; i < l; i++) {
            result = this.routes[i].execute(request);
            if (result) {
                return result;
            }
        }
    }
    addRoute(options, callback) {
        this.routes.push(new Route(options, callback));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Router;
//# sourceMappingURL=router.js.map