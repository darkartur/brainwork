export interface ServerService {
    listen(port: number, host: string);
}
export enum HTTPMethod {
    GET, POST
}

export interface Request<D> {
    getUrl(): string;
    getMethod(): HTTPMethod;
    getPostData(): D;
    createJsxResponse(jsx: JSX.Element): Response;
    createRedirectResponse(location: string): Response;
    createJsonResponse(object: Object): Response;
}

export interface Response {
    send();
}
