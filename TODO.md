# FEATURES
- implement :
    - cache() in DataFrame class
    - spark.catalog.uncacheTable("tableName")
    - spark.catalog.cacheTable("tableName")
    - column class
      - then implement DataFrame.colRegex
- other pyspark.sql classes eg. udf
- take out bluebird
- make use of a uuid pkg - current implementation may cause issues
- generate t.ds using `SparkSession.builder.appName("SimpleApp").getOrCreate()`
  
# BUGS
- 


# DONE
- every method takes in an object called args, BUT should be able to take the actual type if only only argument exists. Implemented something like:
    - describe(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{ cols: [] },
                ...args
            }
        }
        ....
- error handling is not perfect
- some debug logging to see what is getting executed in py-land
- separate out classes into class.js
