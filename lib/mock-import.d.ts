type Mock = unknown;
type TwoStrings = [
    string,
    string[],
];

export type Stack = TwoStrings | [];

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
export declare function enableNestedImports(): void;
export declare function disableNestedImports(): void; 
