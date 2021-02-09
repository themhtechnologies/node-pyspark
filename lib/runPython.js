const pythonBridge = require('../node4py');
const { meta } = require('./meta')
const Logger = require('./utils').Logger


let logger = new Logger({ component: __filename.split(/[\\/]/).pop(), minLevel: process.env['Logger_minLevel'] || 'DEBUG'})

/**
 * node to python
 * error object contains: 'error', 'exception', 'traceback', 'format'
 */

let _python = pythonBridge()
// take the original .ex and modify it to check for errors
// python._ex = python.ex

async function runPython(isExecute, ...args) {
    let startTime = (new Date()).getTime()
    let timeTaken

    _python.queue(() => {
        logger.debug('[START]', { "code": args })
    })

    
    let pyCallee = isExecute ? _python.ex : _python

    let toReturn = pyCallee(...args).catch(e => {
        logger.warn('[EXCEPTION HANDLED - added to meta]', { "code": args, "e.exception.message": e.exception?.message })
        meta.addError(e)
    }).finally( ()=> {
        timeTaken = ((new Date()).getTime() - startTime)/1000
        if (!logger.debug(`[END]`, { "code": args, "timeInSec": timeTaken})) {
            // logLevel > debug
            // so show limited code
            logger.info(`[END]`, { "code": args.toString().slice(0,50), "timeInSec": timeTaken})
        }
    })

    // python.queue(() => {
    //     logger.debug('[END]', { "code": args }, `[Time-taken = ${timeTaken} sec]`)
    // })

    return toReturn
}

python = async (...args) => runPython(false, ...args)
python.ex = async (...args) => runPython(true, ...args)
python.lock = _python.lock
python.pid = _python.pid
python.connected = _python.connected
python.Exception = _python.Exception
python.isException = _python.isException
python.disconnect = _python.disconnect
python.end = _python.end
python.kill = _python.kill
python.stdin = _python.stdin
python.stdout = _python.stdout
python.stderr = _python.stderr
python.stdio = _python.stdio
python.queue = _python.queue

module.exports = python