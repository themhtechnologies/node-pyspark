const python = require('./runPython');
const DataFrameWriter = require('./DataFrameWriter.class');
const { generatePyFunctionArgs } = require('./utils');
const { meta } = require('./meta')

class DataFrame {
    constructor(SparkSessionUID, DataFrameUID) {
        if (typeof SparkSessionUID === 'undefined') throw new Error("Argument SparkSessionUID must be provided")
        if (typeof DataFrameUID === 'undefined') throw new Error("Argument DataFrameUID must be provided")
        // this.DataFrameUID = 'df_' + (new Date()).getTime() // generate some uid here
        this.DataFrameUID = DataFrameUID // || DataFrame.generateUID()
        this.SparkSessionUID = SparkSessionUID
        this.write = new DataFrameWriter(this.DataFrameUID)

        Object.defineProperty(this, 'columns', {
            get: () => {
                columns()
            }
        })
    }

    static UIDName = 'DataFrameUID'
    static generateUID() {
        return 'df_' + (new Date()).getTime() // generate some uid here
    }


    /**
     * Aggregate on the entire DataFrame without groups
     * (shorthand for df.groupBy.agg()).
     * @param {Object} args - *exprs
     * @param {Array.<Object>|Array.<Function>} args.exprs - array of objects/functions
     * @returns {DataFrame}
     */
    agg(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.exprs === 'undefined') throw new Error("Argument exprs of method agg must be provided")
        }

        let DataFrameUID = DataFrame.generateUID()
        python.ex([`${DataFrameUID} = ${this.DataFrameUID}.agg(${generatePyFunctionArgs(args.exprs || args)})`])
        /**
         * @type {DataFrame}
         */
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * Returns a new DataFrame with an alias set.
     * 
     * Parameters
     * alias – string, an alias name to be set for the DataFrame.
     * @param {Object} args - alias
     * @param {string} args.alias
     * @returns {DataFrame}
     */
    alias(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.alias === 'undefined') throw new Error("Argument alias of method alias must be provided")
        }
        let DataFrameUID = DataFrame.generateUID()
        python.ex([`${DataFrameUID} = ${this.DataFrameUID}.alias(${generatePyFunctionArgs(args)})`])
        /**
         * @type {DataFrame}
         */
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df

    }

    /**
     * Calculates the approximate quantiles of numerical columns of a
     * DataFrame.
     * The result of this algorithm has the following deterministic bound:
     * If the DataFrame has N elements and if we request the quantile at
     * probability p up to error err, then the algorithm will return
     * a sample x from the DataFrame so that the exact rank of x is
     * close to (p * N). More precisely,
     * 
     * floor((p - err) * N) <= rank(x) <= ceil((p + err) * N).
     * 
     * This method implements a variation of the Greenwald-Khanna
     * algorithm (with some speed optimizations). The algorithm was first
     * present in [[https://doi.org/10.1145/375663.375670
     * Space-efficient Online Computation of Quantile Summaries]]
     * by Greenwald and Khanna.
     * Note that null values will be ignored in numerical columns before calculation.
     * For columns only containing null values, an empty list is returned.
     * 
     * Parameters
     * 
     * col – str, list.
     * Can be a single column name, or a list of names for multiple columns.
     * probabilities – a list of quantile probabilities
     * Each number must belong to [0, 1].
     * For example 0 is the minimum, 0.5 is the median, 1 is the maximum.
     * relativeError – The relative target precision to achieve
     * (>= 0). If set to zero, the exact quantiles are computed, which
     * could be very expensive. Note that values greater than 1 are
     * accepted but give the same result as 1.
     * 
     * 
     * Returns
     * the approximate quantiles at the given probabilities. If
     * the input col is a string, the output is a list of floats. If the
     * input col is a list or tuple of strings, the output is also a
     * list, but each element in it is a list of floats, i.e., the output
     * is a list of list of floats.
     * 
     * 
     * 
     * Changed in version 2.2: Added support for multiple columns.
     * 
     * 
     * New in version 2.0.
     * @param {Object} args - col, probabilities, relativeError
     * @param {string|Array.<string>} args.col
     * @param {Array.<number>} args.probabilities
     * @param {number} args.relativeError
     * @returns {Array}
     */
    async approxQuantile(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.col === 'undefined') throw new Error("Argument col of method approxQuantile must be provided")
            if (typeof args.probabilities === 'undefined') throw new Error("Argument probabilities of method approxQuantile must be provided")
            if (typeof args.relativeError === 'undefined') throw new Error("Argument relativeError of method approxQuantile must be provided")
        }

        /**
         * @type {Array}
         */
        let data = await python([`${this.DataFrameUID}.approxQuantile(${generatePyFunctionArgs(args)})`])
        if (meta.error) {
            throw meta.error
        }
        return data
    }

    /**
     * Persists the DataFrame with the default storage level (MEMORY_AND_DISK).
     * 
     * Note
     * The default storage level has changed to MEMORY_AND_DISK to match Scala in 2.0.
     * 
     * 
     * New in version 1.3.
     * @param {*} args - None
     * @returns {DataFrame}
     */
    cache(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
        }

        python.ex([`${this.DataFrameUID}.cache(${generatePyFunctionArgs(args)})`])
        return this
    }

    /**
     * Returns a checkpointed version of this Dataset. Checkpointing can be used to truncate the
     * logical plan of this DataFrame, which is especially useful in iterative algorithms
     * where the plan may grow exponentially. It will be saved to files inside the checkpoint
     * directory set with SparkContext.setCheckpointDir().
     * 
     * Parameters
     * eager – Whether to checkpoint this DataFrame immediately
     * Note
     * Experimental
     * 
     * New in version 2.1.
     * @param {Object} args - eager=True
     * @param {boolean} args.eager
     * @returns {DataFrame}
     */
    checkpoint(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ eager: true },
                ...args
            }
        }

        python.ex([`${this.DataFrameUID}.checkpoint(${generatePyFunctionArgs(args)})`])
        return this
    }

    /**
     * Returns a new DataFrame that has exactly numPartitions partitions.
     * 
     * Parameters
     * numPartitions – int, to specify the target number of partitions
     * 
     * 
     * Similar to coalesce defined on an RDD, this operation results in a
     * narrow dependency, e.g. if you go from 1000 partitions to 100 partitions,
     * there will not be a shuffle, instead each of the 100 new partitions will
     * claim 10 of the current partitions. If a larger number of partitions is requested,
     * it will stay at the current number of partitions.
     * However, if you’re doing a drastic coalesce, e.g. to numPartitions = 1,
     * this may result in your computation taking place on fewer nodes than
     * you like (e.g. one node in the case of numPartitions = 1). To avoid this,
     * you can call repartition(). This will add a shuffle step, but means the
     * current upstream partitions will be executed in parallel (per whatever
     * the current partitioning is).
     * @param {Object} args - numPartitions
     * @param {object} args.numPartitions
     * @returns {DataFrame}
     */
    coalesce(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.numPartitions === 'undefined') throw new Error("Argument numPartitions of method coalesce must be provided")
        }

        python.ex([`${this.DataFrameUID}.coalesce(${generatePyFunctionArgs(args)})`])
        return this
    }

    /**
     * Selects column based on the column name specified as a regex and returns it
     * as Column.
     * 
     * Parameters
     * colName – string, column name specified as a regex.
     * @param {object} args - colName
     */
    // TODO
    // colRegex(args = {}) {
    //     if (args && typeof args === 'object' && !Array.isArray(args)) {
    //         args = {
    //             ...{},
    //             ...args
    //         }
    //         if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method colRegex must be provided")
    //     }

    //     python.ex([`${this.DataFrameUID}.colRegex(${generatePyFunctionArgs(args)})`])
    // }

    /**
     * Returns all the records as a list of Row.
     * @param {*} args - None
     */
    async collect(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
        }

        await python.ex([`${this.DataFrameUID}.collect(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns all column names as a list.
     */
    async columns() {
        let data = await python([`${this.DataFrameUID}.columns`])
        if (meta.error) {
            throw meta.error
        }
        return data
    }

    /**
     * Calculates the correlation of two columns of a DataFrame as a double value.
     * Currently only supports the Pearson Correlation Coefficient.
     * DataFrame.corr() and DataFrameStatFunctions.corr() are aliases of each other.
     * 
     * Parameters
     * 
     * col1 – The name of the first column
     * col2 – The name of the second column
     * method – The correlation method. Currently only supports “pearson”
     * 
     * New in version 1.4.
     * @param {Object} args - col1, col2, method=None
     * @param {string} args.col1
     * @param {string} args.col1
     * @param {string} args.method
     * @returns {number}
     */
    async corr(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ method: 'pearson' },
                ...args
            }
            if (typeof args.col1 === 'undefined') throw new Error("Argument col1 of method corr must be provided")
            if (typeof args.col2 === 'undefined') throw new Error("Argument col2 of method corr must be provided")
        }

        let data = await python([`${this.DataFrameUID}.corr(${generatePyFunctionArgs(args)})`])
        if (meta.error) {
            throw meta.error
        }
        return data
    }

    /**
     * Returns the number of rows in this DataFrame.
     * @param {object} args - 
     */
    async count(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
        }

        await python.ex([`${this.DataFrameUID}.count(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Calculate the sample covariance for the given columns, specified by their names, as a
     * double value. DataFrame.cov() and DataFrameStatFunctions.cov() are aliases.
     * 
     * Parameters
     * 
     * col1 – The name of the first column
     * col2 – The name of the second column
     * 
     * 
     * 
     * 
     * New in version 1.4.
     * @param {object} args - col1, col2
     */
    cov(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method cov must be provided")
        }

        python.ex([`${this.DataFrameUID}.cov(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Creates a global temporary view with this DataFrame.
     * The lifetime of this temporary view is tied to this Spark application.
     * throws TempTableAlreadyExistsException, if the view name already exists in the
     * catalog.
     * @param {object} args - name
     */
    createGlobalTempView(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method createGlobalTempView must be provided")
        }

        python.ex([`${this.DataFrameUID}.createGlobalTempView(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Creates or replaces a global temporary view using the given name.
     * The lifetime of this temporary view is tied to this Spark application.
     * @param {object} args - name
     */
    async createOrReplaceGlobalTempView(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method createOrReplaceGlobalTempView must be provided")
        }

        await python.ex([`${this.DataFrameUID}.createOrReplaceGlobalTempView(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Creates or replaces a local temporary view with this DataFrame.
     * The lifetime of this temporary table is tied to the SparkSession
     * that was used to create this DataFrame.
     * @param {object} args - name
     */
    async createOrReplaceTempView(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.name === 'undefined') throw new Error("Argument name of method createOrReplaceTempView must be provided")
        }

        await python.ex([`${this.DataFrameUID}.createOrReplaceTempView(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Creates a local temporary view with this DataFrame.
     * The lifetime of this temporary table is tied to the SparkSession
     * that was used to create this DataFrame.
     * throws TempTableAlreadyExistsException, if the view name already exists in the
     * catalog.
     * @param {object} args - name
     */
    createTempView(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method createTempView must be provided")
        }

        python.ex([`${this.DataFrameUID}.createTempView(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns the cartesian product with another DataFrame.
     * 
     * Parameters
     * other – Right side of the cartesian product.
     * @param {object} args - other
     */
    crossJoin(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method crossJoin must be provided")
        }

        python.ex([`${this.DataFrameUID}.crossJoin(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Computes a pair-wise frequency table of the given columns. Also known as a contingency
     * table. The number of distinct values for each column should be less than 1e4. At most 1e6
     * non-zero pair frequencies will be returned.
     * The first column of each row will be the distinct values of col1 and the column names
     * will be the distinct values of col2. The name of the first column will be $col1_$col2.
     * Pairs that have no occurrences will have zero as their counts.
     * DataFrame.crosstab() and DataFrameStatFunctions.crosstab() are aliases.
     * 
     * Parameters
     * 
     * col1 – The name of the first column. Distinct items will make the first item of
     * each row.
     * col2 – The name of the second column. Distinct items will make the column names
     * of the DataFrame.
     * 
     * 
     * 
     * 
     * New in version 1.4.
     * @param {object} args - col1, col2
     */
    crosstab(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method crosstab must be provided")
        }

        python.ex([`${this.DataFrameUID}.crosstab(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Create a multi-dimensional cube for the current DataFrame using
     * the specified columns, so we can run aggregations on them.
     * @param {object} args - *cols
     */
    cube(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method cube must be provided")
        }

        python.ex([`${this.DataFrameUID}.cube(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Computes basic statistics for numeric and string columns.
     * This include count, mean, stddev, min, and max. If no columns are
     * given, this function computes statistics for all numerical or string columns.
     * 
     * Note
     * This function is meant for exploratory data analysis, as we make no
     * guarantee about the backward compatibility of the schema of the resulting
     * DataFrame.
     * @param {object} args - *cols
     */
    describe(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ cols: [] },
                ...args
            }
        }

        let DataFrameUID = DataFrame.generateUID()
        python.ex([`${DataFrameUID} = ${this.DataFrameUID}.describe(${generatePyFunctionArgs(args.cols ? args.cols : args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * Returns a new DataFrame containing the distinct rows in this DataFrame.
     * @param {object} args - 
     */
    distinct(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method distinct must be provided")
        }

        python.ex([`${this.DataFrameUID}.distinct(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a new DataFrame that drops the specified column.
     * This is a no-op if schema doesn’t contain the given column name(s).
     * 
     * Parameters
     * cols – a string name of the column to drop, or a
     * Column to drop, or a list of string name of the columns to drop.
     * @param {object} args - *cols
     */
    drop(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method drop must be provided")
        }

        python.ex([`${this.DataFrameUID}.drop(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Return a new DataFrame with duplicate rows removed,
     * optionally only considering certain columns.
     * For a static batch DataFrame, it just drops duplicate rows. For a streaming
     * DataFrame, it will keep all data across triggers as intermediate state to drop
     * duplicates rows. You can use withWatermark() to limit how late the duplicate data can
     * be and system will accordingly limit the state. In addition, too late data older than
     * watermark will be dropped to avoid any possibility of duplicates.
     * drop_duplicates() is an alias for dropDuplicates().
     * @param {object} args - subset=None
     */
    dropDuplicates(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method dropDuplicates must be provided")
        }

        python.ex([`${this.DataFrameUID}.dropDuplicates(${generatePyFunctionArgs(args)})`])
    }

    /**
     * drop_duplicates() is an alias for dropDuplicates().
     * 
     * New in version 1.4.
     * @param {object} args - subset=None
     */
    drop_duplicates(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method drop_duplicates must be provided")
        }

        python.ex([`${this.DataFrameUID}.drop_duplicates(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a new DataFrame omitting rows with null values.
     * DataFrame.dropna() and DataFrameNaFunctions.drop() are aliases of each other.
     * 
     * Parameters
     * 
     * how – ‘any’ or ‘all’.
     * If ‘any’, drop a row if it contains any nulls.
     * If ‘all’, drop a row only if all its values are null.
     * thresh – int, default None
     * If specified, drop rows that have less than thresh non-null values.
     * This overwrites the how parameter.
     * subset – optional list of column names to consider.
     * @param {object} args - how='any', thresh=None, subset=None
     */
    dropna(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method dropna must be provided")
        }

        python.ex([`${this.DataFrameUID}.dropna(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns all column names and their data types as a list.
     */
    dtypes = ''

    /**
     * Return a new DataFrame containing rows in this DataFrame but
     * not in another DataFrame while preserving duplicates.
     * This is equivalent to EXCEPT ALL in SQL.
     * @param {object} args - other
     */
    exceptAll(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method exceptAll must be provided")
        }

        python.ex([`${this.DataFrameUID}.exceptAll(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Prints the (logical and physical) plans to the console for debugging purpose.
     * 
     * Parameters
     * 
     * extended – boolean, default False. If False, prints only the physical plan.
     * When this is a string without specifying the mode, it works as the mode is
     * specified.
     * mode – specifies the expected output format of plans.
     * 
     * simple: Print only a physical plan.
     * extended: Print both logical and physical plans.
     * codegen: Print a physical plan and generated codes if they are available.
     * cost: Print a logical plan and statistics if they are available.
     * formatted: Split explain output into two sections: a physical plan outline                 and node details.
     * @param {object} args - extended=None, mode=None
     */
    explain(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method explain must be provided")
        }

        python.ex([`${this.DataFrameUID}.explain(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Replace null values, alias for na.fill().
     * DataFrame.fillna() and DataFrameNaFunctions.fill() are aliases of each other.
     * 
     * Parameters
     * 
     * value – int, long, float, string, bool or dict.
     * Value to replace null values with.
     * If the value is a dict, then subset is ignored and value must be a mapping
     * from column name (string) to replacement value. The replacement value must be
     * an int, long, float, boolean, or string.
     * subset – optional list of column names to consider.
     * Columns specified in subset that do not have matching data type are ignored.
     * For example, if value is a string, and subset contains a non-string column,
     * then the non-string column is simply ignored.
     * @param {object} args - value, subset=None
     */
    fillna(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method fillna must be provided")
        }

        python.ex([`${this.DataFrameUID}.fillna(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Filters rows using the given condition.
     * where() is an alias for filter().
     * 
     * Parameters
     * condition – a Column of types.BooleanType
     * or a string of SQL expression.
     * @param {object} args - condition
     */
    filter(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method filter must be provided")
        }

        python.ex([`${this.DataFrameUID}.filter(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns the first row as a Row.
     * @param {object} args - 
     */
    first(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method first must be provided")
        }

        python.ex([`${this.DataFrameUID}.first(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Applies the f function to all Row of this DataFrame.
     * This is a shorthand for df.rdd.foreach().
     * @param {object} args - f
     */
    foreach(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method foreach must be provided")
        }

        python.ex([`${this.DataFrameUID}.foreach(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Applies the f function to each partition of this DataFrame.
     * This a shorthand for df.rdd.foreachPartition().
     * @param {object} args - f
     */
    foreachPartition(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method foreachPartition must be provided")
        }

        python.ex([`${this.DataFrameUID}.foreachPartition(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Finding frequent items for columns, possibly with false positives. Using the
     * frequent element count algorithm described in
     * “https://doi.org/10.1145/762471.762473, proposed by Karp, Schenker, and Papadimitriou”.
     * DataFrame.freqItems() and DataFrameStatFunctions.freqItems() are aliases.
     * 
     * Note
     * This function is meant for exploratory data analysis, as we make no
     * guarantee about the backward compatibility of the schema of the resulting
     * DataFrame.
     * 
     * 
     * Parameters
     * 
     * cols – Names of the columns to calculate frequent items for as a list or tuple of
     * strings.
     * support – The frequency with which to consider an item ‘frequent’. Default is 1%.
     * The support must be greater than 1e-4.
     * 
     * 
     * 
     * 
     * New in version 1.4.
     * @param {object} args - cols, support=None
     */
    freqItems(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method freqItems must be provided")
        }

        python.ex([`${this.DataFrameUID}.freqItems(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Groups the DataFrame using the specified columns,
     * so we can run aggregation on them. See GroupedData
     * for all the available aggregate functions.
     * groupby() is an alias for groupBy().
     * 
     * Parameters
     * cols – list of columns to group by.
     * Each element should be a column name (string) or an expression (Column).
     * @param {object} args - *cols
     */
    groupBy(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method groupBy must be provided")
        }

        python.ex([`${this.DataFrameUID}.groupBy(${generatePyFunctionArgs(args)})`])
    }

    /**
     * groupby() is an alias for groupBy().
     * 
     * New in version 1.4.
     * @param {object} args - *cols
     */
    groupby(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method groupby must be provided")
        }

        python.ex([`${this.DataFrameUID}.groupby(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns the first n rows.
     * 
     * Note
     * This method should only be used if the resulting array is expected
     * to be small, as all the data is loaded into the driver’s memory.
     * 
     * 
     * Parameters
     * n – int, default 1. Number of rows to return.
     * 
     * Returns
     * If n is greater than 1, return a list of Row.
     * If n is 1, return a single Row.
     * @param {object} args - n=None
     */
    head(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method head must be provided")
        }

        python.ex([`${this.DataFrameUID}.head(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Specifies some hint on the current DataFrame.
     * 
     * Parameters
     * 
     * name – A name of the hint.
     * parameters – Optional parameters.
     * 
     * 
     * Returns
     * DataFrame
     * @param {object} args - name, *parameters
     */
    hint(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method hint must be provided")
        }

        python.ex([`${this.DataFrameUID}.hint(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Return a new DataFrame containing rows only in
     * both this DataFrame and another DataFrame.
     * This is equivalent to INTERSECT in SQL.
     * 
     * New in version 1.3.
     * @param {object} args - other
     */
    intersect(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method intersect must be provided")
        }

        python.ex([`${this.DataFrameUID}.intersect(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Return a new DataFrame containing rows in both this DataFrame
     * and another DataFrame while preserving duplicates.
     * This is equivalent to INTERSECT ALL in SQL.
     * @param {object} args - other
     */
    intersectAll(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method intersectAll must be provided")
        }

        python.ex([`${this.DataFrameUID}.intersectAll(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns True if the collect() and take() methods can be run locally
     * (without any Spark executors).
     * 
     * New in version 1.3.
     * @param {object} args - 
     */
    isLocal(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method isLocal must be provided")
        }

        python.ex([`${this.DataFrameUID}.isLocal(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns True if this Dataset contains one or more sources that continuously
     * return data as it arrives. A Dataset that reads data from a streaming source
     * must be executed as a StreamingQuery using the start() method in
     * DataStreamWriter.  Methods that return a single answer, (e.g., count() or
     * collect()) will throw an AnalysisException when there is a streaming
     * source present.
     * 
     * Note
     * Evolving
     * 
     * 
     * New in version 2.0.
     */
    isStreaming = ''

    /**
     * Joins with another DataFrame, using the given join expression.
     * 
     * Parameters
     * 
     * other – Right side of the join
     * on – a string for the join column name, a list of column names,
     * a join expression (Column), or a list of Columns.
     * If on is a string or a list of strings indicating the name of the join column(s),
     * the column(s) must exist on both sides, and this performs an equi-join.
     * how – str, default inner. Must be one of: inner, cross, outer,
     * full, fullouter, full_outer, left, leftouter, left_outer,
     * right, rightouter, right_outer, semi, leftsemi, left_semi,
     * anti, leftanti and left_anti.
     * 
     * 
     * 
     * The following performs a full outer join between df1 and df2.
     * @param {object} args - other, on=None, how=None
     */
    join(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method join must be provided")
        }

        python.ex([`${this.DataFrameUID}.join(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Limits the result count to the number specified.
     * @param {object} args - num
     */
    limit(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.num === 'undefined') throw new Error("Argument num of method limit must be provided")
        }

        let DataFrameUID = DataFrame.generateUID()
        python.ex([`${DataFrameUID} = ${this.DataFrameUID}.limit(${generatePyFunctionArgs(args)})`])
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
    }

    /**
     * Returns a locally checkpointed version of this Dataset. Checkpointing can be used to
     * truncate the logical plan of this DataFrame, which is especially useful in
     * iterative algorithms where the plan may grow exponentially. Local checkpoints are
     * stored in the executors using the caching subsystem and therefore they are not reliable.
     * 
     * Parameters
     * eager – Whether to checkpoint this DataFrame immediately
     * 
     * 
     * 
     * Note
     * Experimental
     * 
     * 
     * New in version 2.3.
     * @param {object} args - eager=True
     */
    localCheckpoint(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method localCheckpoint must be provided")
        }

        python.ex([`${this.DataFrameUID}.localCheckpoint(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Maps an iterator of batches in the current DataFrame using a Python native
     * function that takes and outputs a pandas DataFrame, and returns the result as a
     * DataFrame.
     * The function should take an iterator of pandas.DataFrames and return
     * another iterator of pandas.DataFrames. All columns are passed
     * together as an iterator of pandas.DataFrames to the function and the
     * returned iterator of pandas.DataFrames are combined as a DataFrame.
     * Each pandas.DataFrame size can be controlled by
     * spark.sql.execution.arrow.maxRecordsPerBatch.
     * 
     * Parameters
     * 
     * func – a Python native function that takes an iterator of pandas.DataFrames, and
     * outputs an iterator of pandas.DataFrames.
     * schema – the return type of the func in PySpark. The value can be either a
     * pyspark.sql.types.DataType object or a DDL-formatted type string.
     * @param {object} args - func, schema
     */
    mapInPandas(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method mapInPandas must be provided")
        }

        python.ex([`${this.DataFrameUID}.mapInPandas(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a DataFrameNaFunctions for handling missing values.
     * 
     * New in version 1.3.1.
     */
    na = ''

    /**
     * Returns a new DataFrame sorted by the specified column(s).
     * 
     * Parameters
     * 
     * cols – list of Column or column names to sort by.
     * ascending – boolean or list of boolean (default True).
     * Sort ascending vs. descending. Specify list for multiple sort orders.
     * If a list is specified, length of the list must equal length of the cols.
     * @param {object} args - *cols, **kwargs
     */
    orderBy(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method orderBy must be provided")
        }

        python.ex([`${this.DataFrameUID}.orderBy(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Sets the storage level to persist the contents of the DataFrame across
     * operations after the first time it is computed. This can only be used to assign
     * a new storage level if the DataFrame does not have a storage level set yet.
     * If no storage level is specified defaults to (MEMORY_AND_DISK).
     * 
     * Note
     * The default storage level has changed to MEMORY_AND_DISK to match Scala in 2.0.
     * 
     * 
     * New in version 1.3.
     * @param {object} args - storageLevel=StorageLevel(True, True, False, False, 1
     */
    persist(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method persist must be provided")
        }

        python.ex([`${this.DataFrameUID}.persist(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Prints out the schema in the tree format.
     * @param {object} args - 
     */
    async printSchema(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
        }

        await python.ex([`${this.DataFrameUID}.printSchema(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Randomly splits this DataFrame with the provided weights.
     * 
     * Parameters
     * 
     * weights – list of doubles as weights with which to split the DataFrame.
     * Weights will be normalized if they don’t sum up to 1.0.
     * seed – The seed for sampling.
     * @param {object} args - weights, seed=None
     */
    randomSplit(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method randomSplit must be provided")
        }

        python.ex([`${this.DataFrameUID}.randomSplit(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns the content as an pyspark.RDD of Row.
     * 
     * New in version 1.3.
     */
    rdd = ''

    /**
     * Registers this DataFrame as a temporary table using the given name.
     * The lifetime of this temporary table is tied to the SparkSession
     * that was used to create this DataFrame.
     * @param {object} args - name
     */
    registerTempTable(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method registerTempTable must be provided")
        }

        python.ex([`${this.DataFrameUID}.registerTempTable(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a new DataFrame partitioned by the given partitioning expressions. The
     * resulting DataFrame is hash partitioned.
     * 
     * Parameters
     * numPartitions – can be an int to specify the target number of partitions or a Column.
     * If it is a Column, it will be used as the first partitioning column. If not specified,
     * the default number of partitions is used.
     * 
     * 
     * 
     * Changed in version 1.6: Added optional arguments to specify the partitioning columns. Also made numPartitions
     * optional if partitioning columns are specified.
     * @param {object} args - numPartitions, *cols
     */
    repartition(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method repartition must be provided")
        }

        python.ex([`${this.DataFrameUID}.repartition(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a new DataFrame partitioned by the given partitioning expressions. The
     * resulting DataFrame is range partitioned.
     * 
     * Parameters
     * numPartitions – can be an int to specify the target number of partitions or a Column.
     * If it is a Column, it will be used as the first partitioning column. If not specified,
     * the default number of partitions is used.
     * 
     * 
     * At least one partition-by expression must be specified.
     * When no explicit sort order is specified, “ascending nulls first” is assumed.
     * Note that due to performance reasons this method uses sampling to estimate the ranges.
     * Hence, the output may not be consistent, since sampling can return different values.
     * The sample size can be controlled by the config
     * spark.sql.execution.rangeExchange.sampleSizePerPartition.
     * @param {object} args - numPartitions, *cols
     */
    repartitionByRange(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method repartitionByRange must be provided")
        }

        python.ex([`${this.DataFrameUID}.repartitionByRange(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a new DataFrame replacing a value with another value.
     * DataFrame.replace() and DataFrameNaFunctions.replace() are
     * aliases of each other.
     * Values to_replace and value must have the same type and can only be numerics, booleans,
     * or strings. Value can have None. When replacing, the new value will be cast
     * to the type of the existing column.
     * For numeric replacements all values to be replaced should have unique
     * floating point representation. In case of conflicts (for example with {42: -1, 42.0: 1})
     * and arbitrary replacement will be used.
     * 
     * Parameters
     * 
     * to_replace – bool, int, long, float, string, list or dict.
     * Value to be replaced.
     * If the value is a dict, then value is ignored or can be omitted, and to_replace
     * must be a mapping between a value and a replacement.
     * value – bool, int, long, float, string, list or None.
     * The replacement value must be a bool, int, long, float, string or None. If value is a
     * list, value should be of the same length and type as to_replace.
     * If value is a scalar and to_replace is a sequence, then value is
     * used as a replacement for each item in to_replace.
     * subset – optional list of column names to consider.
     * Columns specified in subset that do not have matching data type are ignored.
     * For example, if value is a string, and subset contains a non-string column,
     * then the non-string column is simply ignored.
     * @param {object} args - to_replace, value=<no value>, subset=None
     */
    replace(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method replace must be provided")
        }

        python.ex([`${this.DataFrameUID}.replace(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Create a multi-dimensional rollup for the current DataFrame using
     * the specified columns, so we can run aggregation on them.
     * @param {object} args - *cols
     */
    rollup(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method rollup must be provided")
        }

        python.ex([`${this.DataFrameUID}.rollup(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a sampled subset of this DataFrame.
     * 
     * Parameters
     * 
     * withReplacement – Sample with replacement or not (default False).
     * fraction – Fraction of rows to generate, range [0.0, 1.0].
     * seed – Seed for sampling (default a random seed).
     * 
     * 
     * 
     * 
     * Note
     * This is not guaranteed to provide exactly the fraction specified of the total
     * count of the given DataFrame.
     * 
     * 
     * Note
     * fraction is required and, withReplacement and seed are optional.
     * @param {object} args - withReplacement=None, fraction=None, seed=None
     */
    sample(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method sample must be provided")
        }

        python.ex([`${this.DataFrameUID}.sample(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a stratified sample without replacement based on the
     * fraction given on each stratum.
     * 
     * Parameters
     * 
     * col – column that defines strata
     * fractions – sampling fraction for each stratum. If a stratum is not
     * specified, we treat its fraction as zero.
     * seed – random seed
     * 
     * 
     * Returns
     * a new DataFrame that represents the stratified sample
     * @param {object} args - col, fractions, seed=None
     */
    sampleBy(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method sampleBy must be provided")
        }

        python.ex([`${this.DataFrameUID}.sampleBy(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns the schema of this DataFrame as a pyspark.sql.types.StructType.
     */
    schema = ''

    /**
     * Projects a set of expressions and returns a new DataFrame.
     * 
     * Parameters
     * cols – list of column names (string) or expressions (Column).
     * If one of the column names is ‘*’, that column is expanded to include all columns
     * in the current DataFrame.
     * @param {object} args - *cols
     */
    select(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method select must be provided")
        }

        python.ex([`${this.DataFrameUID}.select(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Projects a set of SQL expressions and returns a new DataFrame.
     * This is a variant of select() that accepts SQL expressions.
     * @param {object} args - *expr
     */
    selectExpr(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method selectExpr must be provided")
        }

        python.ex([`${this.DataFrameUID}.selectExpr(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Prints the first n rows to the console.
     * 
     * Parameters
     * 
     * n – Number of rows to show.
     * truncate – If set to True, truncate strings longer than 20 chars by default.
     * If set to a number greater than one, truncates long strings to length truncate
     * and align cells right.
     * vertical – If set to True, print output rows vertically (one line
     * per column value).
     * @param {object} args - n=20, truncate=True, vertical=False
     */
    async show(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ n: 20, truncate: true, vertical: false },
                ...args
            }
        }
        await python.ex([`${this.DataFrameUID}.show(${generatePyFunctionArgs(args)})`])
        if (meta.error) {
            throw meta.error
        }
    }

    /**
     * Returns a new DataFrame sorted by the specified column(s).
     * 
     * Parameters
     * 
     * cols – list of Column or column names to sort by.
     * ascending – boolean or list of boolean (default True).
     * Sort ascending vs. descending. Specify list for multiple sort orders.
     * If a list is specified, length of the list must equal length of the cols.
     * @param {object} args - *cols, **kwargs
     */
    sort(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method sort must be provided")
        }

        python.ex([`${this.DataFrameUID}.sort(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a new DataFrame with each partition sorted by the specified column(s).
     * 
     * Parameters
     * 
     * cols – list of Column or column names to sort by.
     * ascending – boolean or list of boolean (default True).
     * Sort ascending vs. descending. Specify list for multiple sort orders.
     * If a list is specified, length of the list must equal length of the cols.
     * @param {object} args - *cols, **kwargs
     */
    sortWithinPartitions(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method sortWithinPartitions must be provided")
        }

        python.ex([`${this.DataFrameUID}.sortWithinPartitions(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a DataFrameStatFunctions for statistic functions.
     * 
     * New in version 1.4.
     */
    stat = ''

    /**
     * Get the DataFrame’s current storage level.
     */
    storageLevel = ''

    /**
     * Return a new DataFrame containing rows in this DataFrame
     * but not in another DataFrame.
     * This is equivalent to EXCEPT DISTINCT in SQL.
     * 
     * New in version 1.3.
     * @param {object} args - other
     */
    subtract(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method subtract must be provided")
        }

        python.ex([`${this.DataFrameUID}.subtract(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Computes specified statistics for numeric and string columns. Available statistics are:
     * - count
     * - mean
     * - stddev
     * - min
     * - max
     * - arbitrary approximate percentiles specified as a percentage (eg, 75%)
     * If no statistics are given, this function computes count, mean, stddev, min,
     * approximate quartiles (percentiles at 25%, 50%, and 75%), and max.
     * 
     * Note
     * This function is meant for exploratory data analysis, as we make no
     * guarantee about the backward compatibility of the schema of the resulting
     * DataFrame.
     * @param {object} args - *statistics
     */
    summary(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method summary must be provided")
        }

        python.ex([`${this.DataFrameUID}.summary(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns the last num rows as a list of Row.
     * Running tail requires moving data into the application’s driver process, and doing so with
     * a very large num can crash the driver process with OutOfMemoryError.
     * @param {object} args - num
     */
    tail(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method tail must be provided")
        }

        python.ex([`${this.DataFrameUID}.tail(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns the first num rows as a list of Row.
     * @param {object} args - num
     */
    take(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method take must be provided")
        }

        python.ex([`${this.DataFrameUID}.take(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a new DataFrame that with new specified column names
     * 
     * Parameters
     * cols – list of new column names (string)
     * @param {object} args - *cols
     */
    toDF(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method toDF must be provided")
        }

        python.ex([`${this.DataFrameUID}.toDF(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Converts a DataFrame into a RDD of string.
     * Each row is turned into a JSON document as one element in the returned RDD.
     * @param {object} args - use_unicode=True
     */
    toJSON(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method toJSON must be provided")
        }

        python.ex([`${this.DataFrameUID}.toJSON(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns an iterator that contains all of the rows in this DataFrame.
     * The iterator will consume as much memory as the largest partition in this
     * DataFrame. With prefetch it may consume up to the memory of the 2 largest
     * partitions.
     * 
     * Parameters
     * prefetchPartitions – If Spark should pre-fetch the next partition
     * before it is needed.
     * @param {object} args - prefetchPartitions=False
     */
    toLocalIterator(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method toLocalIterator must be provided")
        }

        python.ex([`${this.DataFrameUID}.toLocalIterator(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns the contents of this DataFrame as Pandas pandas.DataFrame.
     * This is only available if Pandas is installed and available.
     * 
     * Note
     * This method should only be used if the resulting Pandas’s DataFrame is
     * expected to be small, as all the data is loaded into the driver’s memory.
     * 
     * 
     * Note
     * Usage with spark.sql.execution.arrow.pyspark.enabled=True is experimental.
     * @param {object} args - 
     */
    toPandas(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method toPandas must be provided")
        }

        python.ex([`${this.DataFrameUID}.toPandas(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a new DataFrame. Concise syntax for chaining custom transformations.
     * 
     * Parameters
     * func – a function that takes and returns a DataFrame.
     * @param {object} args - func
     */
    transform(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method transform must be provided")
        }

        python.ex([`${this.DataFrameUID}.transform(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Return a new DataFrame containing union of rows in this and another
     * DataFrame.
     * This is equivalent to UNION ALL in SQL. To do a SQL-style set union
     * (that does deduplication of elements), use this function followed by distinct().
     * Also as standard in SQL, this function resolves columns by position (not by name).
     * 
     * New in version 2.0.
     * @param {object} args - other
     */
    union(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method union must be provided")
        }

        python.ex([`${this.DataFrameUID}.union(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Return a new DataFrame containing union of rows in this and another
     * DataFrame.
     * This is equivalent to UNION ALL in SQL. To do a SQL-style set union
     * (that does deduplication of elements), use this function followed by distinct().
     * Also as standard in SQL, this function resolves columns by position (not by name).
     * 
     * New in version 1.3.
     * @param {object} args - other
     */
    unionAll(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method unionAll must be provided")
        }

        python.ex([`${this.DataFrameUID}.unionAll(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a new DataFrame containing union of rows in this and another
     * DataFrame.
     * This is different from both UNION ALL and UNION DISTINCT in SQL. To do a SQL-style set
     * union (that does deduplication of elements), use this function followed by distinct().
     * The difference between this function and union() is that this function
     * resolves columns by name (not by position):
     * @param {object} args - other
     */
    unionByName(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method unionByName must be provided")
        }

        python.ex([`${this.DataFrameUID}.unionByName(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Marks the DataFrame as non-persistent, and remove all blocks for it from
     * memory and disk.
     * 
     * Note
     * blocking default has changed to False to match Scala in 2.0.
     * 
     * 
     * New in version 1.3.
     * @param {object} args - blocking=False
     */
    unpersist(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method unpersist must be provided")
        }

        python.ex([`${this.DataFrameUID}.unpersist(${generatePyFunctionArgs(args)})`])
    }

    /**
     * where() is an alias for filter().
     * 
     * New in version 1.3.
     * @param {object} args - condition
     */
    where(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method where must be provided")
        }

        python.ex([`${this.DataFrameUID}.where(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a new DataFrame by adding a column or replacing the
     * existing column that has the same name.
     * The column expression must be an expression over this DataFrame; attempting to add
     * a column from some other DataFrame will raise an error.
     * 
     * Parameters
     * 
     * colName – string, name of the new column.
     * col – a Column expression for the new column.
     * 
     * 
     * 
     * 
     * Note
     * This method introduces a projection internally. Therefore, calling it multiple
     * times, for instance, via loops in order to add multiple columns can generate big
     * plans which can cause performance issues and even StackOverflowException.
     * To avoid this, use select() with the multiple columns at once.
     * @param {object} args - colName, col
     */
    withColumn(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method withColumn must be provided")
        }

        python.ex([`${this.DataFrameUID}.withColumn(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Returns a new DataFrame by renaming an existing column.
     * This is a no-op if schema doesn’t contain the given column name.
     * 
     * Parameters
     * 
     * existing – string, name of the existing column to rename.
     * new – string, new name of the column.
     * @param {object} args - existing, new
     */
    withColumnRenamed(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method withColumnRenamed must be provided")
        }

        python.ex([`${this.DataFrameUID}.withColumnRenamed(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Defines an event time watermark for this DataFrame. A watermark tracks a point
     * in time before which we assume no more late data is going to arrive.
     * 
     * Spark will use this watermark for several purposes:
     * To know when a given time window aggregation can be finalized and thus can be emitted
     * when using output modes that do not allow updates.
     * To minimize the amount of state that we need to keep for on-going aggregations.
     * 
     * 
     * 
     * The current watermark is computed by looking at the MAX(eventTime) seen across
     * all of the partitions in the query minus a user specified delayThreshold.  Due to the cost
     * of coordinating this value across partitions, the actual watermark used is only guaranteed
     * to be at least delayThreshold behind the actual event time.  In some cases we may still
     * process records that arrive more than delayThreshold late.
     * 
     * Parameters
     * 
     * eventTime – the name of the column that contains the event time of the row.
     * delayThreshold – the minimum delay to wait to data to arrive late, relative to the
     * latest record that has been processed in the form of an interval
     * (e.g. “1 minute” or “5 hours”).
     * 
     * 
     * 
     * 
     * Note
     * Evolving
     * @param {object} args - eventTime, delayThreshold
     */
    withWatermark(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method withWatermark must be provided")
        }

        python.ex([`${this.DataFrameUID}.withWatermark(${generatePyFunctionArgs(args)})`])
    }

    /**
     * Interface for saving the content of the non-streaming DataFrame out into external
     * storage.
     * 
     * Returns
     * DataFrameWriter
     * 
     * 
     * 
     * New in version 1.4.
     */
    // write = '' // !!! covered in constructor

    /**
     * Interface for saving the content of the streaming DataFrame out into external
     * storage.
     * 
     * Note
     * Evolving.
     * 
     * 
     * Returns
     * DataStreamWriter
     * 
     * 
     * 
     * New in version 2.0.
     */
    writeStream = ''

    /**
     * Get values from py-land into node-land
     * NON STANDARD API
     * 
     * @param {object} args 
     * @param {number} args.num: number of rows to return
     * @param {string} args.orient: one of 'dict', 'list', 'series', 'split', 'records', 'index'
     */
    async get(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ num: -1, orient: 'records' },
                ...args
            }
        }
        let data = await python([`${this.DataFrameUID}${args.num >= 0 ? '.limit(' + args.num + ')' : ''}.toPandas().to_dict(${generatePyFunctionArgs(args.orient)})`])
        if (meta.error) {
            throw meta.error
        }
        return data
    }
}

module.exports = DataFrame;