import { Service } from "../service_locator";
import { Request, HTTPMethod, Response } from "./server/server";

interface RouteOptions {
    pattern: RegExp;
    method: HTTPMethod;
}

export interface ActionCallback<D> {
    (request: Request<D>, matches: RegExpMatchArray): Promise<Response> | Response;
}

export const route = (path: string, method: HTTPMethod = HTTPMethod.GET) => (target: Router, propertyKey: string) => {
    target.addRoute(
        {
            pattern: new RegExp(path),
            method: method
        },
        (request) => target[propertyKey].call(this, request)
    );
};


class Route<D> {
    constructor(
        private options: RouteOptions,
        private action: ActionCallback<D>
    ) {}

    execute(request: Request<D>): Promise<Response> {
        var matches: RegExpMatchArray;

        if (this.options.method !== request.getMethod()) {
            return;
        }

        matches = this.options.pattern.exec(request.getUrl());

        if (!matches) {
            return;
        }

        return Promise.resolve<Response>(this.action(request, matches));
    }


}

export default class Router extends Service {

    dispatchRequest(request: Request<any>): Promise<Response> {
        var l: number = this.routes.length,
            result: Promise<Response>;

        for (let i = 0; i < l; i++) {
            result = this.routes[i].execute(request);
            if (result) {
                return result;
            }
        }
    }

    addRoute<D>(options: RouteOptions, callback: ActionCallback<D>) {
        if (!this.routes) {
            this.routes = [];
        }

        this.routes.push(new Route(options, callback));
    }

    private routes: Route<any>[];

}
