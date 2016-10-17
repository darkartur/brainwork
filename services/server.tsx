import { Service, default as ServiceLocator } from "../service_locator";
import { ServerService, Response } from "./server/server";
import { BackRequest, HTMLTemplate } from "./server/back/server_back";
import { createServer, ServerRequest, ServerResponse } from "http";
import { existsSync, statSync, createReadStream } from "fs";
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

        let staticPath = 'htdocs/' + serverRequest.url;

        if (existsSync(staticPath)) {
            let stat = statSync(staticPath);

            serverResponse.writeHead(200, {
                'Content-Type': mime.lookup(serverRequest.url),
                'Content-Length': stat.size
            });

            let readStream = createReadStream(staticPath);
            // We replaced all the event handlers with a simple call to readStream.pipe()
            readStream.pipe(serverResponse);
            return;
        }

        request.loadPostData().then<Response>(
            () => this.router.dispatchRequest(request)
        ).then(
            (response) => response.send()
        );
    }

    listen(port: number, host: string) {

        let httpServer = this.httpServer;

        httpServer.addListener("error", function (error) {
            console.log(error);
        });

        httpServer.listen(port, host);
    }
    
}



