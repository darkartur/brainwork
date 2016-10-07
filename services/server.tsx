import { Service } from "../service_locator";
import { ServerService, Response } from "./server/server";

import { BackRequest } from './server/back/server_back';

import { createServer, ServerRequest, ServerResponse } from "http";
import { readFileSync } from "fs";

export default class ServerBackService extends Service implements ServerService {

    private httpServer = createServer(
        (request, response) => this.dispatchRequest(request as ServerRequest, response)
    );

    private dispatchRequest(serverRequest: ServerRequest, serverResponse: ServerResponse) {


        let request = new BackRequest(serverRequest, serverResponse);

        try {
            request.createTextResponse(
                'text/javascript',
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



