import { ServerRequest, ServerResponse } from "http";
import { Request, Response, HTTPMethod } from '../server';
import { parse as parseQS } from 'querystring';
import React = require('react');
import ReactDOMServer = require('react-dom/server');
import {Form as MultipartyForm} from 'multiparty';

const headTemplate = (title: string, jsPaths: string[], stylePaths: string[] = []) => `<head>
    <title>${title}</title>
    ${jsPaths.map(path => `<script src="${path}"></script>`).join('\r\n')}
    ${stylePaths.map(path => `<link href="${path}" rel="stylesheet"/>`).join('\r\n')}
</head>`;

const bodyTemplate = (content, appId) => `<body>
    <div id="${appId}">${content}</div>
</body>`;

interface HTMLOptions {
    content: string;
    title: string;
    jsPaths: string[];
    stylePaths?: string[];
}

export interface HTMLTemplate {
    (content: string): string;
}


export const htmlTemplate = ({ content, title, jsPaths, stylePaths }: HTMLOptions) => `<!DOCTYPE "html">
<html>
${headTemplate(
    title,
    jsPaths,
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
            (data) => this.postData = data
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

    createRedirectResponse(location: string): Response {
        return {
            send: () => this.send(
                302,
                { 'Location': location }
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
    let [contentType] = request.headers['content-type'].split(';');
    switch (contentType) {
        case "multipart/form-data":
            return parsePostMultipart<TResponse>(request);
        default:
            return parsePostQS<TResponse>(request)
    }
}

function parsePostMultipart<TResponse>(request: ServerRequest): Promise<TResponse> {
    const uploadDir = 'public_html/uploads';
    const form = new MultipartyForm({
        autoFiles: true,
        uploadDir
    });

    return new Promise<TResponse>((resolve) => form.parse(request, (error, fields, files) => {

        Object.keys(files).forEach(fieldName => {
            let file = files[fieldName][0];

            fields[fieldName] = file.path.replace(uploadDir + '/', '');


        });
        resolve(fields);
    }));
}

function parsePostQS<TResponse>(request: ServerRequest) {
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
