/**
 * 4 levels by default: debug < info < warn < error
 * All methods (log, debug, info, ...) return true if logged, else false
 */
class Logger {
    /**
     * 
     * @param {*} args 
     * @param {*} args.component: name of the file usuaully
     */
    constructor(args = {}) {
        args = {
            ...{ component: undefined, minLevel: 'DEBUG', ts: null },
            ...args
        }
        if (typeof args.component === 'undefined') throw new Error('argument component of Logger must be provided')
        let e = `argument minLevel of Logger must be one of ${Object.keys(Logger.levels)}. Got - ${args.minLevel}`
        if (typeof Logger.levels[args.minLevel] === 'undefined') throw new Error(e)

        this.minLevel = Logger.levels[args.minLevel]
        this.ts = args.ts || (() => (new Date()).toISOString())
        this.component = args.component
    }

    static levels = {
        'DEBUG': 0,
        'INFO': 1,
        'WARN': 2,
        'ERROR': 3
    }

    log(...msgs) {
        // alias for info
        return this.info(...msgs)
    }

    debug(...msgs) {
        let level = 'DEBUG'
        if (Logger.levels[level] >= this.minLevel) {
            return this.#print(level, ...msgs)
        } else {
            return false
        }
    }

    info(...msgs) {
        let level = 'INFO'
        if (Logger.levels[level] >= this.minLevel) {
            return this.#print(level, ...msgs)
        } else {
            return false
        }
    }

    warn(...msgs) {
        let level = 'WARN'
        if (Logger.levels[level] >= this.minLevel) {
            return this.#print(level, ...msgs)
        } else {
            return false
        }
    }

    error(...msgs) {
        let level = 'ERROR'
        if (Logger.levels[level] >= this.minLevel) {
            return this.#print(level, ...msgs)
        } else {
            return false
        }
    }

    #print(level, ...msgs) {
        console.log(`[${this.ts()}][${level}][${this.component}]${msgs.map(msg => (typeof msg === 'object' ? JSON.stringify(msg) : msg) + ' ').join('')}`)
        return true
    }
}

function NodeToPythonArgs(n) {
    let p
    // if (Array.isArray(n)) {
    //     p = JSON.st'(' + n.join(',') + ')'
    //     return p
    // }
    switch (typeof n) {
        case 'object':
            // can be object or null
            if (n) {
                if (Array.isArray(n)) {
                    // is array
                    p = n.map(x => generatePyFunctionArgs(x))
                } else {
                    // is object
                    for (k of n) {
                        p[k] = generatePyFunctionArgs(n[k])
                        p = JSON.stringify(p)
                    }

                }

            } else {
                p = 'None'
            }
            break;
        case 'function':
            // get the name, and process args that are reflected by func in node-land
            let args = n().map(singleArg => generatePyFunctionArgs(singleArg))
            // add x square brackets for x+1 e.g. [] if [[]] exists            
            // count x (no of starting square braces)
            let x = 0
            function countx(args) {
                if (Array.isArray(args[0])) {
                    x++
                    countx(args[0])
                }
            }
            countx(args)

            p = n.name + `(${'['.repeat(x) + args + ']'.repeat(x)})`
            break;
        case 'boolean':
            if (n) {
                p = 'True'
            } else {
                p = 'False'
            }
            break;
        case 'number':
            p = n
            break;
        case 'undefined':
            p = 'None'
            break;
        case 'string':
            p = JSON.stringify(n) // "'" + n + "'"
            break;
        default:
            p = n
            break;
    }
    return p
}

function generatePyFunctionArgs(obj) {
    if (typeof obj !== 'object') {
        // primitives, function
        return NodeToPythonArgs(obj)
    }
    else if (Array.isArray(obj)) {
        // array
        return NodeToPythonArgs(obj)
    }
    else if (obj && Object.keys(obj)) {
        // object, not nulls
        return Object.keys(obj).map(k => (`${k}=` + NodeToPythonArgs(obj[k]))).join(',')
    } else {
        // null
        // don't know what came here; return as is
        return NodeToPythonArgs(obj)
    }
}

module.exports = {
    generatePyFunctionArgs,
    Logger
}