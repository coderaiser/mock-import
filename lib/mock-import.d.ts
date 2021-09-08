type Mock = unknown;
export type Stack = [string, string, []] | [];
export interface TraceOptions {
    stack: Stack;
}
type MockImport = {
    mockImport: (url: string, module: unknown) => Mock;
    traceImport: (url: string, options: TraceOptions) => void;
    reImport: (url: string) => Promise<Mock>;
    reTrace: (url: string) => Promise<Mock>;
    stopAll: () => void;
    stop: (path: string) => void;
};

export declare function createMockImport(url: string): MockImport;

