export interface IStreamProgress {
    init(): Promise<void>;

    progress(callback: (progressBytes: number, totalBytes: number) => void): Promise<any>;
}
