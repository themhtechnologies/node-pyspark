declare function _exports(opts: any): (...args: any[]) => any;
declare namespace _exports {
    export { pythonBridge };
    export { PythonException };
    export { PythonBridgeNotConnected };
    export { isPythonException };
    export { json };
    export { serializePython };
}
export = _exports;
declare function pythonBridge(opts: any): (...args: any[]) => any;
declare namespace pythonBridge { }
declare class PythonException extends Error {
    constructor(exc: any);
    error: any;
    exception: any;
    traceback: any;
    format: any;
}
declare class PythonBridgeNotConnected extends Error {
}
declare function isPythonException(name: any, exc: any): boolean | ((exc: any) => boolean);
declare function json(text_nodes: any, ...args: any[]): any;
declare function serializePython(value: any): any;
