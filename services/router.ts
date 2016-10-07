import { Service } from "../service_locator";
import { Request, HTTPMethod, Response } from "./server/server";

interface RouteOptions {
    pattern: RegExp;
    method: HTTPMethod;
}

interface actionCallback<D> {
    (request: Request<D>, matches: RegExpMatchArray): Promise<Response> | Response;
}

class Route<D> {
    constructor(
        private options: RouteOptions,
        private action: actionCallback<D>
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

    protected addRoute<D>(options: RouteOptions, callback: actionCallback<D>) {
        this.routes.push(new Route(options, callback));
    }

    private routes: Route<any>[] = [];

}
