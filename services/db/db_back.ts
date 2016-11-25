import * as fs from 'fs';
import { DataBaseService } from "./db";

export interface ResourceData {
    id: number;
}

export default class DataBaseBackService implements DataBaseService {

    loadAll<R extends ResourceData>(resourceName: string): Promise<R[]> {
        return this.loadAllFilenames(resourceName).then(
            filenames => this.loadByFilenames<R>(resourceName, filenames)
        )
    }

    loadOne<R extends ResourceData>(resourceName: string, id: number) {
        return this.loadResource<R>(
            resourceName,
            this.generateFilename(id)
        );
    }

    create<R extends ResourceData>(resourceName: string, data: R): Promise<R> {
        return this.calculateNextId(resourceName).then<R>(id => {
            let identifiedData = Object.assign({}, data, { id });

            return this.saveResource(
                resourceName,
                this.generateFilename(id),
                identifiedData
            ).then(() => identifiedData)
        });
    }

    delete(resourceName: string, id: number): Promise<void> {
        return this.removeResource(resourceName, this.generateFilename(id));
    }

    private calculateNextId(resourceName: string): Promise<number> {
        return this.loadAllFilenames(resourceName).then(
            (filenames) => filenames.length ? parseInt(filenames.pop()) + 1 : 1
        );
    }

    private saveResource(resourceName: string, filename: string, data: any): Promise<void> {
        return new Promise<void>(resolve => fs.writeFile(
            this.getResourcePath(resourceName, filename),
            JSON.stringify(data),
            (err, data) => resolve())
        );
    }

    private generateFilename(id: number) {
        return id + '.json';
    }

    private getResourceDirectoryName(resourceName: string): string {
        return './data/' + resourceName + '/';
    }

    private loadAllFilenames(resourceName: string): Promise<string[]> {
        return new Promise<string[]>( resolve => fs.readdir(
            this.getResourceDirectoryName(resourceName),
            (err, files) => resolve(files)
        ));
    }

    private loadByFilenames<R>(resourceName: string, filenames: string[]): Promise<R[]> {
        return Promise.all<R>(filenames.map(
            filename => this.loadResource(resourceName, filename)
        ));
    }

    private loadResource<R>(resourceName: string, filename: string): Promise<R> {
        return new Promise<R>( resolve => fs.readFile(
            this.getResourcePath(resourceName, filename),
            (err, data) => resolve(JSON.parse(data.toString()))
        ));
    }

    private removeResource(resourceName: string, filename: string): Promise<void> {
        return new Promise<void>( resolve => fs.unlink(
            this.getResourcePath(resourceName, filename),
            err => resolve()
        ));
    }

    private getResourcePath(resourceName: string, filename: string) {
        return this.getResourceDirectoryName(resourceName) + '/' + filename;
    }
    
}

