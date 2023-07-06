type Mock = unknown;

export type Stack = [string, string, []] | [];

export interface TraceOptions {
    stack: Stack;
}type MockImport = {
    mockImport: () => Mock;
    traceImport: () => void;
    reImport: () => Promise<Mock>;
    reTrace: () => Promise<Mock>;
    stopAll: () => void;
    stop: () => void;
};

export declare function createMockImport(url: string): MockImport;
