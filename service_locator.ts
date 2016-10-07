import Router from "./services/router";
import { ServerService } from "./services/server/server";
import { DataBaseService } from "./services/db/db";

interface Options {
    router: (sl: ServiceLocator) => Router;
    server: (sl: ServiceLocator) => ServerService;
    db: DataBaseService;
}

interface ServiceInitializer<S> {
    (sl: ServiceLocator): S;
}

export default class ServiceLocator {

    constructor(private options: Options) {}

    getRouter = this.registerService<Router>(this.options.router);
    getServer = this.registerService<ServerService>(this.options.server);
    getDataBase = this.registerService<DataBaseService>(this.options.db);

    private registerService<S>(initializer: ServiceInitializer<S> | S): () => S {

        if (typeof initializer !== 'function') {
            return () => <S>initializer;
        }

        let instance: S;

        return (): S => {

            if (!instance) {
                instance = (<ServiceInitializer<S>>initializer)(this);
            }

            return instance;
        };
    }
}

export class Service {

    constructor(private serviceLocator: ServiceLocator) {}

    get router(): Router { return this.serviceLocator.getRouter() }
    get server(): ServerService { return this.serviceLocator.getServer() }
    get db(): DataBaseService { return this.serviceLocator.getDataBase() }

}
