import { ServerRequest, ServerResponse } from "http";
import { Request, Response, HTTPMethod } from '../server';
import { parse as parseQS } from 'querystring';
import React = require('react');
import ReactDOMServer = require('react-dom/server');

const headTemplate = (title: string, jsPath: string, stylePaths: string[] = []) => `<head>
    <title>${title}</title>
    <script src="${jsPath}"></script>
    ${stylePaths.map(path => `<link href="${path}" rel="stylesheet"/>`).join('\r\n')}
</head>`;

const bodyTemplate = (content, appId) => `<body>
    <div id="${appId}">${content}</div>
</body>`;

interface HTMLOptions {
    content: string;
    title: string;
    jsPath: string;
    stylePaths?: string[];
}

export interface HTMLTemplate {
    (content: string): string;
}


export const htmlTemplate = ({ content, title, jsPath, stylePaths }: HTMLOptions) => `<!DOCTYPE "html">
<html>
${headTemplate(
    title,
    jsPath,
    stylePaths
)}
${bodyTemplate(content, 'app')}
</html>`;

export class BackRequest<D> implements Request<D> {

    constructor(
        private serverRequest: ServerRequest,
        private serverResponse: ServerResponse,
        private htmlTemplate: HTMLTemplate
    ) {}

    getUrl(): string {
        return this.serverRequest.url;
    }

    getMethod(): HTTPMethod {
        return strToMethod(this.serverRequest.method);
    }

    private postData: D;

    loadPostData(): Promise<D> {
        return this.getMethod() === HTTPMethod.POST ? parsePost<D>(this.serverRequest).then(
            (data) => {
                this.postData = data;
            }
        ) : Promise.resolve<any>({});
    }

    getPostData(): D {
        return this.postData;
    }

    createJsxResponse(jsx: JSX.Element): Response {
        return this.createTextResponse(
            'text/html',
            this.htmlTemplate(ReactDOMServer.renderToString(jsx))
        );
    }

    createRedirectResponse(): Response {
        return {
            send: () => this.send(
                302,
                { 'Location': '/' }
            )
        }
    }

    createJsonResponse(object: Object): Response {
        return this.createTextResponse(
            'application/json',
            JSON.stringify(object)
        );
    }

    createTextResponse(contentType: string, text: string): Response {
        return {
            send: () => this.send(
                200,
                {"Content-Type": `${contentType}; charset=utf-8`},
                text
            )
        }
    }


    private send(status: number, headers: any, content?: string ) {
        let serverResponse = this.serverResponse;

        serverResponse.writeHead(status, headers);

        if (content) {
            serverResponse.write(content);
        }

        serverResponse.end();
    }


}

function strToMethod(str: string): HTTPMethod {
    return HTTPMethod[str.toUpperCase()];
}

function parsePost<TResponse extends Object>(request: ServerRequest): Promise<TResponse> {
    return new Promise<TResponse>((resolve) => {
        var data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });
        request.on('end', () => {
            resolve(parseQS(data));
        });
    });
}
