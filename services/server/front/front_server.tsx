import {render} from 'react-dom';
import { Service } from "../../../service_locator";
import React = require('react');
import ReactDOMServer = require('react-dom/server');
import { ServerService, Request, Response, HTTPMethod } from "../server";


class FrontRequest implements Request<any> {
    getUrl(): string {
        return location.pathname;
    }

    getMethod(): HTTPMethod {
        return HTTPMethod.GET;
    }

    getPostData(): any {
        return {};
    }

    createJsxResponse(jsx: JSX.Element): Response {
        return { send: () => render(jsx, document.getElementById('app')) }
    }

    createRedirectResponse(): Response {
        return { send: () => console.log('redirect') }
    }

    createJsonResponse(object: Object): Response {
        return { send: () => console.log('json', object) }
    }
}

export default class ServerFrontService extends Service implements ServerService {


    listen() {

        document.addEventListener('DOMContentLoaded', () => {
            this.router.dispatchRequest(
                new FrontRequest()
            ).then(
                response => response.send()
            );
        });
    }
    
}

