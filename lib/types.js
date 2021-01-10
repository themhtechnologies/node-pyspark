const types = {
    DataType: (...args) => function DataType() { return args },
    NullType: (...args) => function NullType() { return args },
    StringType: (...args) => function StringType() { return args },
    BinaryType: (...args) => function BinaryType() { return args },
    BooleanType: (...args) => function BooleanType() { return args },
    DateType: (...args) => function DateType() { return args },
    TimestampType: (...args) => function TimestampType() { return args },
    DecimalType: (...args) => function DecimalType() { return args },
    DoubleType: (...args) => function DoubleType() { return args },
    FloatType: (...args) => function FloatType() { return args },
    ByteType: (...args) => function ByteType() { return args },
    IntegerType: (...args) => function IntegerType() { return args },
    LongType: (...args) => function LongType() { return args },
    ShortType: (...args) => function ShortType() { return args },
    ArrayType: (...args) => function ArrayType() { return args },
    MapType: (...args) => function MapType() { return args },
    StructField: (...args) => function StructField() { return args },
    StructType: (...args) => function StructType() { return args }
}

module.exports = types;