/**
 * prerequisites: 
 *  python (v3 has been tested)
 *  pyspark (pip install pyspark)
 */

// const python = require('./lib/runPython');
const SparkSession = require('./lib/SparkSession.class');
const types = require('./lib/types');

/**
 * Create a proxy object that takes care of unimplemented methods and properties by executing them directly in py-land
 * @param {*} classRef - Reference to the class
 * @param  {...any} args - Arguments to the class constructor
 * 
 * ** WARNING **
 * This function is not full proof. e.g. there is not way of knowing if something is to be returned or not, e.g. 
 * returning an existing or a new df needs to serialized but python bridge would throw an error
 * 
 * NOT USING YET. FOR FUTURE USAGE
 * 
 */
function createProxy(classRef, ...args) {
    return new Proxy(new classRef(...args), { //eval(`new ${className}(${args})`
        get: function (target, name, receiver) {
            if (name in target.__proto__) { // assume methods live on the prototype
                return function (...args) {
                    console.log(`~~~ calling PROTO = ${target} method = ${name}`);
                    return target[name](...args)
                    // we now have access to both methodName and arguments
                };
            } else if (Reflect.get(target, name, receiver)) {
                // instance var
                console.log(`~~~ calling REFLECT = ${target} method = ${name}`);
                return Reflect.get(target, name, receiver);
            } else {
                // direct execute in py-land
                console.log(`~~~ calling PYLAND = ${target} method = ${name}`);

                return (async function (...args) {
                    let data = await python([`${target[classRef.UIDName]}.${name}${args.length > 0 ? '(' + args + ')' : ''}`])
                    return data
                })()

            }
        }
    });
}


/**
 * nodespark
 */
module.exports = {
    sql: {
        SparkSession,
        types
    },
    python: python // direct access to python bridge
}