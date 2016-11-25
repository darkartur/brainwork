export interface DataBaseService {
    loadAll<R>(resourceName: string): Promise<R[]>;
    loadOne<R>(resourceName: string, id: number): Promise<R[]>;
    create<R>(resourceName: string, data: R): Promise<R>;
    delete<R>(resourceName: string, id: number): Promise<void>;
}
