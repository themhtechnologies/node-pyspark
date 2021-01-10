const DataFrame = require('./DataFrame.class');
const DataFrameReader = require('./DataFrameReader.class');
const { generatePyFunctionArgs } = require('./utils');
const { meta } = require('./meta')

class Builder {
    constructor() {
        // python = pythonBridge();
        this.BuilderUID = 'builder_' + (new Date()).getTime() // TODO
        python.ex([`
                from pyspark.sql import SparkSession;
                from pyspark.sql.types import *;
                import pandas as pd;
                ${this.BuilderUID} = SparkSession.builder;
            `])
    }

    appName(appName) {
        python.ex([`${this.BuilderUID}${appName ? '.appName("' + appName + '")' : ''}`])
        return this
    }

    config(key, value, conf) {
        python.ex([`${this.BuilderUID}${key ? '.config("' + key + '","' + value + ')' : ''}`])
        return this
    }

    enableHiveSupport() {
        python.ex([`${this.BuilderUID}.enableHiveSupport()`])
        return this
    }

    master(master) {
        python.ex([`${this.BuilderUID}${master ? '.master("' + master + ')' : ''}`])
        return this
    }

    getOrCreate() {
        return new SparkSession(this.BuilderUID)
    }
}

class SparkSession {
    constructor(BuilderUID) {
        /**
            Do not use the constructor directly. use Builder
            
            But if you have to use this:
            spark = await new SparkSession()
            df = await spark.createDataFrame([1,2,3], Types.IntegerType())
            df.show()
         */
        this.SparkSessionUID = 'spark_' + (new Date()).getTime() // TODO
        this.BuilderUID = BuilderUID

        python.ex([`${this.SparkSessionUID} = ${this.BuilderUID}.getOrCreate();`])
        this.read = new DataFrameReader(this.SparkSessionUID)
    }

    static builder = new Builder()


    // TODO
    //catalog = returns Catalog

    // TODO
    // conf = 

    /**
     * 
     * @param {*} args - start, end = null, step = 1, numPartitions = null
     * @param {number} args.start
     * @param {number} args.end
     * @param {number} args.step
     * @param {number} args.numPartitions
     * @returns {DataFrame}
     */
    range(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ end: null, step: 1, numPartitions: null },
                ...args
            }
            if (typeof args.start === 'undefined') throw new Error("Argument start of method range must be provided")
        }

        // let df = new DataFrame(this.SparkSessionUID)
        // let df = createProxy(DataFrame, this.SparkSessionUID) // FUTURE USAGE using PROXY
        let DataFrameUID = DataFrame.generateUID()
        python.ex([`${DataFrameUID} = ${this.SparkSessionUID}.range(${generatePyFunctionArgs(args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * 
     * @param {*} args - data, schema = null, samplingRatio = null, verifySchema = true
     */
    createDataFrame(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ schema: null, samplingRatio: null, verifySchema: true },
                ...args
            }
            if (typeof args.data === 'undefined') throw new Error("Argument data of method createDataFrame must be provided")
        }

        // special treatment for data
        let data = args.data || args
        data = JSON.stringify(data)
        delete args.data
        // let df = new DataFrame(this.SparkSessionUID)
        let DataFrameUID = DataFrame.generateUID()
        python.ex([`${DataFrameUID} = ${this.SparkSessionUID}.createDataFrame(${data}, ${generatePyFunctionArgs(args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * 
     * @param {object} args 
     * @param {string} args.sqlQuery - the actual query 
     */
    sql(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.sqlQuery === 'undefined') throw new Error("Argument sqlQuery of method sql must be provided")
        }

        // let df = new DataFrame(this.SparkSessionUID)
        let DataFrameUID = DataFrame.generateUID()
        python.ex([`${DataFrameUID} = ${this.SparkSessionUID}.sql(${generatePyFunctionArgs(args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    stop() {
        python.ex([`${this.SparkSessionUID}.stop()`])
        python.end()
    }

    /**
     * Returns the specified table as a DataFrame
     * @param {object} args - tableName
     * @param {string} args.tableName
     * @returns {DataFrame}
     */
    async table(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.tableName === 'undefined') throw new Error("Argument tableName of method table must be provided")
        }

        let DataFrameUID = DataFrame.generateUID()
        await python.ex([`${DataFrameUID} = ${this.SparkSessionUID}.table(${generatePyFunctionArgs(args.tableName || args)})`])
        if (meta.error) {
            throw meta.error
        }
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * Creates a dataframe
     * NON STANDARD API
     * @param {object} args 
     * @param {array} args.columns - Column names to use. If the passed data do not have names associated with them, this argument provides names for the columns. Otherwise this argument indicates the order of the columns in the result (any names not found in the data will become all-NA columns)
     * @param {array} args.excludes - Columns or fields to exclude
     * @param {boolean} args.coerce_float - Attempt to convert values of non-string, non-numeric objects (like decimal.Decimal) to floating point, useful for SQL result sets.
     * @returns {DataFrame}
     */
    put(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ columns: null, coerce_float: false, exclude: null },
                ...args
            }
            if (typeof args.data === 'undefined') throw new Error("Argument data of method put must be provided")
        }

        // let df = new DataFrame(this.SparkSessionUID)
        // generate DataFrameUID
        let DataFrameUID = DataFrame.generateUID()
        // special treatment for data, to avoid converting data into python lingo
        let data = JSON.stringify(args.data)
        delete args.data
        python.ex([`${DataFrameUID} = ${this.SparkSessionUID}.createDataFrame(pd.DataFrame.from_records(${data}, ${generatePyFunctionArgs(args)}))`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }
}

module.exports = SparkSession;