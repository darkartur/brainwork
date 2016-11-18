export interface DataBaseService {
    loadAll<R>(resourceName: string): Promise<R[]>;
    loadOne<R>(resourceName: string, id: number): Promise<R[]>;
}
