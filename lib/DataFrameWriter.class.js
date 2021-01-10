const python = require('./runPython');
const {generatePyFunctionArgs } = require('./utils');
const meta = require('./meta')

class DataFrameWriter {
    constructor(DataFrameUID) {
        if (typeof DataFrameUID === 'undefined') throw new Error("Argument DataFrameUID must be provided")
        this.DataFrameWriterUID = 'dfw_' + (new Date()).getTime() // generate some uid here
        this.DataFrameUID = DataFrameUID
        python.ex([`${this.DataFrameWriterUID} = ${this.DataFrameUID}.write`])
    }

    /**
     * Buckets the output by the given columns.If specified, the output is laid out on the file system similar to Hive’s bucketing scheme
     * @param {object} args - numBuckets, col, *cols
     * @param {array} args.cols - array of col
     */
    bucketBy(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.numBuckets === 'undefined') throw new Error("Argument numBuckets of method bucketBy must be provided")
            if (typeof args.col === 'undefined') throw new Error("Argument numBuckets of method bucketBy must be provided")
        }

        // special treatment for cols
        let cols = args.cols
        delete args.cols
        python.ex([`${this.DataFrameWriterUID}.bucketBy(${generatePyFunctionArgs(args)} ${cols.length > 0 ? ',' + cols : ''})`])
        return this
    }

    /**
     * 
     * @param {*} args - path, mode=None, compression=None, sep=None, quote=None, escape=None, header=None, nullValue=None, escapeQuotes=None, quoteAll=None, dateFormat=None, timestampFormat=None, ignoreLeadingWhiteSpace=None, ignoreTrailingWhiteSpace=None, charToEscapeQuoteEscaping=None, encoding=None, emptyValue=None, lineSep=None
     */
    async csv(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ mode: null, compression: null, sep: null, quote: null, escape: null, header: null, nullValue: null, escapeQuotes: null, quoteAll: null, dateFormat: null, timestampFormat: null, ignoreLeadingWhiteSpace: null, ignoreTrailingWhiteSpace: null, charToEscapeQuoteEscaping: null, encoding: null, emptyValue: null, lineSep: null },
                ...args
            }
            if (typeof args.path === 'undefined') throw new Error("Argument path of method csv must be provided")
        }

        await python.ex([`${this.DataFrameWriterUID}.csv(${generatePyFunctionArgs(args)})`])
    }

    /**
     * 
     * @param {object} args
     * @param {string} args.source – string, name of the data source, e.g. 'json', 'parquet'
     */
    format(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.source === 'undefined') throw new Error("Argument source of method format must be provided")
        }

        python.ex([`${this.DataFrameWriterUID}.format(${generatePyFunctionArgs(args)})`])
        return this
    }

    /**
     * 
     * @param {object} args - tableName, overwrite=None
     */
    async insertInto(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ overwrite: null },
                ...args
            }
            if (typeof args.tableName === 'undefined') throw new Error("Argument tableName of method insertInto must be provided")
        }

        await python.ex([`${this.DataFrameWriterUID}.insertInto(${generatePyFunctionArgs(args)})`])
    }

    /**
     * 
     * @param {*} args - url, table, mode=None, properties=None
     * @param {*} args.url – a JDBC URL of the form jdbc:subprotocol:subname
     * @param {*} args.table – Name of the table in the external database.
     * @param {*} args.mode – specifies the behavior of the save operation when data already exists.
     *                          append: Append contents of this DataFrame to existing data.
     *                          overwrite: Overwrite existing data.
     *                          ignore: Silently ignore this operation if data already exists.
     *                          error or errorifexists (default case): Throw an exception if data already exists.
     * @param {*} args.properties – a dictionary of JDBC database connection arguments. Normally at least properties “user” and “password” with their corresponding values. For example { ‘user’ : ‘SYSTEM’, ‘password’ : ‘mypassword’ }
     */
    async jdbc(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ mode: null, properties: null },
                ...args
            }
            if (typeof args.url === 'undefined') throw new Error("Argument url of method jdbc must be provided")
            if (typeof args.table === 'undefined') throw new Error("Argument table of method jdbc must be provided")
        }

        await python.ex([` ${this.DataFrameWriterUID}.jdbc(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Saves the content of the DataFrame in JSON format (JSON Lines text format or newline-delimited JSON) at the specified path
     * @param {*} args - path, mode=None, compression=None, dateFormat=None, timestampFormat=None, lineSep=None, encoding=None, ignoreNullFields=None
     * @param {*} args.schema – an optional pyspark.sql.types.StructType for the input schema or a DDL-formatted string (For example col0 INT, col1 DOUBLE)
     * @param {string} args.mode - PERMISSIVE: when it meets a corrupted record, puts the malformed string into a field configured by columnNameOfCorruptRecord, and sets malformed fields to null. To keep corrupt records, an user can set a string type field named columnNameOfCorruptRecord in an user-defined schema. If a schema does not have the field, it drops corrupt records during parsing. When inferring a schema, it implicitly adds a columnNameOfCorruptRecord field in an output schema.
     *                             DROPMALFORMED: ignores the whole corrupted records.
     *                             FAILFAST: throws an exception when it meets corrupted records
     */
    async json(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ mode: null, compression: null, dateFormat: null, timestampFormat: null, lineSep: null, encoding: null, ignoreNullFields: null },
                ...args
            }
            if (typeof args.path === 'undefined') throw new Error("Argument path of method json must be provided")
        }

        await python.ex([`${this.DataFrameWriterUID}.json(${generatePyFunctionArgs(args)})`])
    }

    /**
     * 
     * @param {*} args - saveMode
     * @param {*} args.saveMode - Specifies the behavior when data or table already exists
     *                              append: Append contents of this DataFrame to existing data.
     *                              overwrite: Overwrite existing data.
     *                              error or errorifexists: Throw an exception if data already exists.
     *                              ignore: Silently ignore this operation if data already exists.
     */
    mode(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.saveMode === 'undefined') throw new Error("Argument saveMode of method mode must be provided")
        }

        python.ex([`${this.DataFrameWriterUID}.mode(${generatePyFunctionArgs(args)})`])
        return this
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

        python.ex([`${this.DataFrameWriterUID}.format(${generatePyFunctionArgs(args)})`])
        return this
    }

    /**
     * 
     * @param {*} args - path, mode=None, partitionBy=None, compression=None
     */
    async orc(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ mode: null, partitionBy: null, compression: null },
                ...args
            }
            if (typeof args.path === 'undefined') throw new Error("Argument path of method orc must be provided")
        }

        await python.ex([`${this.DataFrameWriterUID}.orc(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Saves the content of the DataFrame in Parquet format at the specified path
     * @param {*} args - path, mode=None, partitionBy=None, compression=None
     * @param {*} args.path – the path in any Hadoop supported file system
     * @param {*} args.mode –  specifies the behavior of the save operation when data already exists.
     *                          append: Append contents of this DataFrame to existing data.
     *                          overwrite: Overwrite existing data.
     *                          ignore: Silently ignore this operation if data already exists.
     *                          error or errorifexists (default case): Throw an exception if data already exists.
     * @param {*} args.partitionBy – names of partitioning columns
     * @param {*} args.compression – compression codec to use when saving to file. This can be one of the known case-insensitive shorten names (none, uncompressed, snappy, gzip, lzo, brotli, lz4, and zstd). This will override spark.sql.parquet.compression.codec. If None is set, it uses the value specified in spark.sql.parquet.compression.codec.
     */
    async parquet(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ mode: null, partitionBy: null, compression: null },
                ...args
            }
            if (typeof args.path === 'undefined') throw new Error("Argument path of method parquet must be provided")
        }

        await python.ex([`${this.DataFrameWriterUID}.parquet(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Partitions the output by the given columns on the file system. If specified, the output is laid out on the file system similar to Hive’s partitioning scheme
     * @param {*} args - *cols
     * @param {*} args.cols
     */
    partitionBy(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.cols === 'undefined') throw new Error("Argument cols of method partitionBy must be provided")
        }

        python.ex([`${this.DataFrameWriterUID}.partitionBy(${args.cols || args})`])
        return this
    }

    /**
     * Saves the contents of the DataFrame to a data source. The data source is specified by the format and a set of options. 
     * If format is not specified, the default data source configured by spark.sql.sources.default will be used
     * @param {*} args - path=None, format=None, mode=None, partitionBy=None, **options
     */
    async save(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ path: null, format: null, mode: null, partitionBy: null, options: {} },
                ...args
            }
        }

        await python.ex([`${this.DataFrameWriterUID}.save(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Saves the content of the DataFrame as the specified table.In the case the table already exists, 
     * behavior of this function depends on the save mode, 
     * specified by the mode function (default to throwing an exception). When mode is Overwrite, 
     * the schema of the DataFrame does not need to be the same as that of the existing table.
     * @param {*} args - name, format=None, mode=None, partitionBy=None, **options
     * @param {*} args.name – the table name
     * @param {*} args.format – the format used to save
     * @param {*} args.mode – one of append, overwrite, error, errorifexists, ignore (default: error)
     * @param {*} args.partitionBy – names of partitioning columns
     * @param {*} args.options – all other string options
     */
    async saveAsTable(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ format: null, mode: null, partitionBy: null, options: {} },
                ...args
            }
            if (typeof args.name === 'undefined') throw new Error("Argument name of method saveAsTable must be provided")
        }

        await python.ex([`${this.DataFrameWriterUID}.saveAsTable(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Sorts the output in each bucket by the given columns on the file system
     * @param {object} args - col, *cols
     * @param {array} args.cols - array of col
     */
    sortBy(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.col === 'undefined') throw new Error("Argument numBuckets of method bucketBy must be provided")
        }

        // special treatment for cols
        let cols = args.cols
        delete args.cols
        python.ex([`${this.DataFrameWriterUID}.sortBy(${generatePyFunctionArgs(args)} ${cols.length > 0 ? ',' + cols : ''})`])
        return this
    }

    /**
     * 
     * @param {*} args - path, compression=None, lineSep=None
     */
    async text(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ compression: null, lineSep: null },
                ...args
            }
            if (typeof args.path === 'undefined') throw new Error("Argument path of method text must be provided")
        }

        await python.ex([`${this.DataFrameWriterUID}.text(${generatePyFunctionArgs(args)})`])
    }
}

module.exports = DataFrameWriter;