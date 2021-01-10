const { SparkSession, DataFrame, types, } = require('./index').sql;

let spark;

; (async () => {
    spark = SparkSession.builder.appName("SimpleApp").getOrCreate()

    // // // test0
    // console.log('~~~ test0')
    // df = spark.createDataFrame({ data: [1, 2, 3], schema: types.IntegerType() })
    // await df.show()

    // // // test1
    // console.log('~~~ test1')
    // df1 = spark.range({ start: 5 })
    // await df1.show()

    // // test2
    // console.log('~~~ test2')
    // await df1.createOrReplaceTempView({ name: 'tabledf1' })
    // let df2 = spark.sql({ sqlQuery: 'select * from tabledf1 where id >= 2' })
    // await df2.show()

    // // test3
    // console.log('~~~ test3')
    // await df1.limit(1).show()
    // await df1.limit({num: 1}).show()

    // // test4
    // console.log('~~~ test4')
    // // await spark.read.csv({ path: '/mnt/c/Users/mannh/Downloads/bigdataxx/owid-covid-data.csv' }).show()
    // await spark.read.csv({ path: '/mnt/c/Users/mannh/Downloads/bigdata/owid-covid-data.csv' }).show()

    // // // test 5
    // console.log('~~~ test5')
    // spark.read.csv({ path: '/mnt/c/Users/mannh/Downloads/bigdata/owid-covid-data.csv' }).createOrReplaceTempView('tabledf5')    
    // await spark.sql('select * from tabledf5 limit 5').show()

    // // // test 6
    // console.log('~~~ test6')
    // df6 = spark.read.csv({ path: '/mnt/c/Users/mannh/Downloads/bigdata/owid-covid-data.csv', header: true })
    // data1 = await df6.get()
    // data2 = await df6.get({ num: 3 })
    // console.log('getting two dfs ->', data1.length, data2.length)

    // // test 7
    // console.log('~~~ test7')
    // df7 = spark.put({ data: [{ 'col_1': 3, 'col_2': 'a' }, { 'col_1': 2, 'col_2': 'b' }] })
    // await df7.show()
    // await df7.printSchema()

    // // test 8:
    // console.log('~~~ test8')
    // df8 = spark.range({ start: 10 })
    // df81 = df8.describe()
    // console.log('describe ->', await df81.get())

    // // test 9:
    // console.log('~~~ test9')
    // // df = spark.read.csv('/mnt/c/Users/mannh/Downloads/bigdata/deleted_freebase.tar.gz')
    // df9 = spark.read.csv({
    //     path: '/mnt/c/Users/mannh/Downloads/bigdata/deleted_freebase.tar.gz',
    //     schema: types.StructType([
    //         types.StructField("creation_timestamp", types.LongType(), true), 
    //         types.StructField("creator", types.StringType(), true),
    //         types.StructField("deletion_timestamp", types.StringType(), true),
    //         types.StructField("deletor", types.StringType(), true),
    //         types.StructField("subject", types.StringType(), true),
    //         types.StructField("predicate", types.StringType(), true),
    //         types.StructField("object", types.StringType(), true),
    //         types.StructField("language_code", types.StringType(), true),
    //     ])
    // })
    // await df9.show()

    // // test 10: write
    // console.log('~~~ test10')
    // df10 = spark.put({ data: [{ 'col_1': 3, 'col_2': 'a' }, { 'col_1': 2, 'col_2': 'b' }] })
    // await df10.write.csv({ path: '/mnt/c/Users/mannh/Downloads/bigdata/oouutt', mode: 'overwrite'})

    // test 11: spark.table('table11')
    console.log('~~~ test11')
    await spark.range({ start: 1, end: 11 }).createOrReplaceGlobalTempView('table11')
    let df11 = await spark.table('global_temp.table11')
    await df11.show()

    spark.stop()
    // setTimeout( async () => spark.stop(), 15000);
})().catch(e => {
    // error object contains: 'error', 'exception', 'traceback', 'format'
    console.log('~~~ ERROR ~~~', e)
    spark.stop()
});
