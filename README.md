# node-pyspark

This module brings Apache Spark API to nodejs.

**WARNING**
This package is still in its early stages of development, and not all pyspark APIs have been ported yet.

## Usage
The API is very similar to the pyspark API with some notable differences:
- All Functions and methods take an object argument. The keys of which represent the function parameters in pyspark
- Most functions are synchronous (in perception), but some return a promise and can be awaited upon

```js
// importing is similar to that in pyspark
const { SparkSession, DataFrame, types, } = require('./index').sql;

// create a dataframe
df = spark.createDataFrame({ data: [1, 2, 3], schema: types.IntegerType() })

// show returns a promise
await df.show()

```

## APIs implemented

> pyspark APIs that have been ported to node-pyspark

| Class/Object    | API               |
| --------------- | ----------------- |
| Builder         | appName           |
| Builder         | config            |
| Builder         | appName           |
| Builder         | enableHiveSupport |
| Builder         | master            |
| Builder         | getOrCreate       |
| SparkSession    | range             |
| SparkSession    | createDataFrame   |
| SparkSession    | sql               |
| SparkSession    | stop              |
| SparkSession    | table             |
| SparkSession    | put               |
| DataFrameReader | csv               |
| DataFrameReader | format            |
| DataFrameReader | jdbc              |
| DataFrameReader | json              |
| DataFrameReader | load              |
| DataFrameReader | option            |
| DataFrameReader | orc               |
| DataFrameReader | parquet           |
| DataFrameReader | schema            |
| DataFrameReader | table             |
| DataFrameReader | text              |
| DataFrameWriter | bucketBy          |
| DataFrameWriter | csv               |
| DataFrameWriter | format            |
| DataFrameWriter | insertInto        |
| DataFrameWriter | jdbc              |
| DataFrameWriter | json              |
| DataFrameWriter | mode              |
| DataFrameWriter | option            |
| DataFrameWriter | orc               |
| DataFrameWriter | parquet           |
| DataFrameWriter | partitionBy       |
| DataFrameWriter | save              |
| DataFrameWriter | saveAsTable       |
| DataFrameWriter | sortBy            |
| DataFrameWriter | text              |
| DataFrame       | agg               |
| DataFrame       | alias             |
| DataFrame       | approxQuantile    |
| DataFrame       | cache             |
| DataFrame       | checkpoint        |
| DataFrame       | coalesce          |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
| DataFrame       |                   |
