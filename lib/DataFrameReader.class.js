const DataFrame = require('./DataFrame.class');
const {generatePyFunctionArgs } = require('./utils');

class DataFrameReader {
    constructor(SparkSessionUID) {
        if (typeof SparkSessionUID === 'undefined') throw new Error("Argument SparkSessionUID must be provided")
        this.DataFrameReaderUID = 'dfr_' + (new Date()).getTime() // generate some uid here
        this.SparkSessionUID = SparkSessionUID
        python.ex([`${this.DataFrameReaderUID} = ${this.SparkSessionUID}.read`])
    }

    /**
     * 
     * @param {*} args : path, schema = null, sep = null, encoding = null, quote = null, escape = null, comment = null, header = null, inferSchema = null, ignoreLeadingWhiteSpace = null, ignoreTrailingWhiteSpace = null, nullValue = null, nanValue = null, positiveInf = null, negativeInf = null, dateFormat = null, timestampFormat = null, maxColumns = null, maxCharsPerColumn = null, maxMalformedLogPerPartition = null, mode = null, columnNameOfCorruptRecord = null, multiLine = null, charToEscapeQuoteEscaping = null, samplingRatio = null, enforceSchema = null, emptyValue = null, locale = null, lineSep = null, pathGlobFilter = null, recursiveFileLookup = null
     *                   required = path
     */
    csv(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ schema: null, sep: null, encoding: null, quote: null, escape: null, comment: null, header: null, inferSchema: null, ignoreLeadingWhiteSpace: null, ignoreTrailingWhiteSpace: null, nullValue: null, nanValue: null, positiveInf: null, negativeInf: null, dateFormat: null, timestampFormat: null, maxColumns: null, maxCharsPerColumn: null, maxMalformedLogPerPartition: null, mode: null, columnNameOfCorruptRecord: null, multiLine: null, charToEscapeQuoteEscaping: null, samplingRatio: null, enforceSchema: null, emptyValue: null, locale: null, lineSep: null, pathGlobFilter: null, recursiveFileLookup: null },
                ...args
            }
            if (typeof args.path === 'undefined') throw new Error("Argument path of method csv must be provided")
        }

        let DataFrameUID = DataFrame.generateUID()
        python.ex([`${DataFrameUID} = ${this.DataFrameReaderUID}.csv(${generatePyFunctionArgs(args)})`]) //.catch(e => {throw e}) //.catch(e => {meta.error = e})
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    format(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.source === 'undefined') throw new Error("Argument source of method format must be provided")
        }

        python.ex([`${this.DataFrameReaderUID}.format(${generatePyFunctionArgs(args)})`])
        return this
    }

    /**
     * 
     * @param {*} args - url, table, column=None, lowerBound=None, upperBound=None, numPartitions=None, predicates=None, properties=None
     * 
     */
    jdbc(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ column: null, lowerBound: null, upperBound: null, numPartitions: null, predicates: null, properties: null },
                ...args
            }
            if (typeof args.url === 'undefined') throw new Error("Argument url of method jdbc must be provided")
            if (typeof args.table === 'undefined') throw new Error("Argument table of method jdbc must be provided")
        }
        // let df = new DataFrame(this.SparkSessionUID)
        let DataFrameUID = DataFrame.generateUID()
        python.ex([`${DataFrameUID} = ${this.DataFrameReaderUID}.jdbc(${generatePyFunctionArgs(args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * 
     * @param {*} args - path, schema=None, primitivesAsString=None, prefersDecimal=None, allowComments=None, allowUnquotedFieldNames=None, allowSingleQuotes=None, allowNumericLeadingZero=None, allowBackslashEscapingAnyCharacter=None, mode=None, columnNameOfCorruptRecord=None, dateFormat=None, timestampFormat=None, multiLine=None, allowUnquotedControlChars=None, lineSep=None, samplingRatio=None, dropFieldIfAllNull=None, encoding=None, locale=None, pathGlobFilter=None, recursiveFileLookup=None
     * @param {*} args.schema – an optional pyspark.sql.types.StructType for the input schema or a DDL-formatted string (For example col0 INT, col1 DOUBLE)
     * @param {string} args.mode - PERMISSIVE: when it meets a corrupted record, puts the malformed string into a field configured by columnNameOfCorruptRecord, and sets malformed fields to null. To keep corrupt records, an user can set a string type field named columnNameOfCorruptRecord in an user-defined schema. If a schema does not have the field, it drops corrupt records during parsing. When inferring a schema, it implicitly adds a columnNameOfCorruptRecord field in an output schema.
     *                             DROPMALFORMED: ignores the whole corrupted records.
     *                             FAILFAST: throws an exception when it meets corrupted records
     */
    json(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ schema: null, primitivesAsString: false, prefersDecimal: false, allowComments: false, allowUnquotedFieldNames: false, allowSingleQuotes: true, allowNumericLeadingZero: false, allowBackslashEscapingAnyCharacter: false, mode: 'PERMISSIVE', columnNameOfCorruptRecord: null, dateFormat: 'yyyy-MM-dd', timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]", multiLine: true, allowUnquotedControlChars: null, lineSep: null, samplingRatio: null, dropFieldIfAllNull: false, encoding: null, locale: null, pathGlobFilter: null, recursiveFileLookup: null },
                ...args
            }
            if (typeof args.path === 'undefined') throw new Error("Argument path of method json must be provided")
        }

        // let df = new DataFrame(this.SparkSessionUID)
        let DataFrameUID = DataFrame.generateUID()

        python.ex([`${DataFrameUID} = ${this.DataFrameReaderUID}.json(${generatePyFunctionArgs(args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * 
     * @param {*} args - path=None, format=None, schema=None, **options
     * @params {*} args.options - any additional key-values can be provided as well
     */
    load(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ path: null, format: 'parquet', schema: null },
                ...args
            }
        }

        // let df = new DataFrame(this.SparkSessionUID)
        let DataFrameUID = DataFrame.generateUID()

        python.ex([`${DataFrameUID} = ${this.DataFrameReaderUID}.load(${generatePyFunctionArgs(args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * 
     * @param {*} args 
     * @param {*} args.timeZone - Region-based zone ID: It should have the form ‘area/city’, such as ‘America/Los_Angeles’.
     *                          - Zone offset: It should be in the format ‘(+|-)HH:mm’, for example ‘-08:00’ or ‘+01:00’. Also ‘UTC’ and ‘Z’ are supported as aliases of ‘+00:00’.
     * @param {*} args.pathGlobFilter - an optional glob pattern to only include files with paths matching
     *                                  the pattern. The syntax follows org.apache.hadoop.fs.GlobFilter. It does not change the behavior of partition discovery.
     */
    option(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
        }

        python.ex([`${this.DataFrameReaderUID}.option(${generatePyFunctionArgs(args)})`])
        return this
    }

    /**
     * 
     * @param {*} args - path, mergeSchema=None, pathGlobFilter=None, recursiveFileLookup=None
     */
    orc(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ mergeSchema: null, pathGlobFilter: null, recursiveFileLookup: null },
                ...args
            }
            if (typeof args.path === 'undefined') throw new Error("Argument path of method orc must be provided")
        }

        // let df = new DataFrame(this.SparkSessionUID)
        let DataFrameUID = DataFrame.generateUID()

        python.ex([`${DataFrameUID} = ${this.DataFrameReaderUID}.orc(${generatePyFunctionArgs(args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * 
     * @param {*} args - *paths, **options
     */
    parquet(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ mergeSchema: null, pathGlobFilter: null, recursiveFileLookup: null },
                ...args
            }
            if (typeof args.paths === 'undefined') throw new Error("Argument path of method parquet must be provided")
        }

        // paths requires some special treatment here
        // let df = new DataFrame(this.SparkSessionUID)
        let DataFrameUID = DataFrame.generateUID()
        python.ex([`${DataFrameUID} = ${this.DataFrameReaderUID}.parquet(${args.paths}, ${generatePyFunctionArgs(args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * 
     * @param {*} args 
     */
    schema(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.schema === 'undefined') throw new Error("Argument schema of method schema must be provided")
        }

        python.ex([`${this.DataFrameReaderUID}.schema(${generatePyFunctionArgs(args)})`])
        return this
    }

    /**
     * Returns the specified table as a DataFrame
     * @param {*} args 
     */
    table(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.tableName === 'undefined') throw new Error("Argument tableName of method table must be provided")
        }

        // let df = new DataFrame(this.SparkSessionUID)
        let DataFrameUID = DataFrame.generateUID()

        python.ex([`${DataFrameUID} = ${this.DataFrameReaderUID}.table(${generatePyFunctionArgs(args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * 
     * @param {*} args - paths, wholetext=False, lineSep=None, pathGlobFilter=None, recursiveFileLookup=None
     * @param {*} args.paths - string, or list of strings, for input path(s).
     */
    text(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ wholetext: true, lineSep: null, pathGlobFilter: null, recursiveFileLookup: null },
                ...args
            }
            if (typeof args.paths === 'undefined') throw new Error("Argument paths of method text must be provided")
        }

        // let df = new DataFrame(this.SparkSessionUID)
        let DataFrameUID = DataFrame.generateUID()

        python.ex([`${DataFrameUID} = ${this.DataFrameReaderUID}.text(${generatePyFunctionArgs(args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }
}

module.exports = DataFrameReader