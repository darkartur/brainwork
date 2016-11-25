import { DataBaseService } from "./db";

export default class DataBaseFrontService implements DataBaseService {

    private fetch<J>(url: string): Promise<J> {
        return (window['fetch'](url).then(
            response => response.json()
        ) as Promise<J>);
    }

    loadAll(resourceName: string) {
        return this.fetch(`/api/${resourceName}`);
    }
    loadOne(resourceName: string, id: number) {
        return this.fetch(`/api/${resourceName}/${id}`);
    }

    create() {
        return null;
    }

    delete() {
        return null;
    }
}

