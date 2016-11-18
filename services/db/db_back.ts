import * as fs from 'fs';
import { DataBaseService } from "./db";

export default class DataBaseBackService implements DataBaseService {

    loadAll<R>(resourceName: string): Promise<R[]> {
        return this.loadAllFilenames(resourceName).then(
            filenames => this.loadByFilenames<R>(resourceName, filenames)
        )
    }

    loadOne<R>(resourceName: string, id: number) {
        return this.loadResource<R>(
            resourceName,
            this.generateFilename(id)
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
        console.log('loadByFilenames');
        return Promise.all<R>(filenames.map(
            filename => this.loadResource(resourceName, filename)
        ));
    }

    private loadResource<R>(resourceName: string, filename: string): Promise<R> {
        console.log('loadResource');
        return new Promise<R>( resolve => fs.readFile(
            this.getResourceDirectoryName(resourceName) + '/' + filename,
            (err, data) => resolve(JSON.parse(data.toString()))
        ));
    }
    
}

