import { Service, default as ServiceLocator } from "../service_locator";
import { ServerService, Response } from "./server/server";

import { BackRequest, HTMLTemplate } from './server/back/server_back';

import { createServer, ServerRequest, ServerResponse } from "http";
import { readFileSync } from "fs";
import * as mime from "mime";

export default class ServerBackService extends Service implements ServerService {

    constructor(sl: ServiceLocator, private htmlTemplate: HTMLTemplate) {
        super(sl);
    }

    private httpServer = createServer(
        (request, response) => this.dispatchRequest(request as ServerRequest, response)
    );

    private dispatchRequest(serverRequest: ServerRequest, serverResponse: ServerResponse) {


        let request = new BackRequest(serverRequest, serverResponse, this.htmlTemplate);

        try {
            request.createTextResponse(
                mime.lookup(serverRequest.url),
                readFileSync('htdocs/' + serverRequest.url).toString()
            ).send();
        } catch (e) {
            request.loadPostData().then<Response>(
                () => this.router.dispatchRequest(request)
            ).then(
                (response) => response.send()
            );
        }
    }

    listen(port: number, host: string) {

        let httpServer = this.httpServer;

        httpServer.addListener("error", function (error) {
            console.log(error);
        });

        httpServer.listen(port, host);
    }
    
}



