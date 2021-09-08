type Mock = unknown;
type MockImport = {
    mockImport: (url: string, module: unknown) => Mock;
    reImport: (url: string) => Promise<Mock>;
    stopAll: () => void;
    stop: (path: string) => void;
};

export declare function createMockImport(url: string): MockImport;

