/**
 * Helps to construct the initial js methods from pyspark documentation
 */

methodNames = [...document.querySelectorAll('[id^=pyspark\\.sql\\.DataFrame\\.]')].map(x=> x.textContent.replace('[source]¶', '').split('(')[0].trim().replace('¶', ''))

methodArgs = [...document.querySelectorAll('[id^=pyspark\\.sql\\.DataFrame\\.]')].map(x=> { y = x.textContent.replace('[source]¶', '').match(/\((.*?)\)/); return y ? y[1]: null})

methodDescription = [...document.querySelectorAll('[id^=pyspark\\.sql\\.DataFrame\\.]')].map( x=> x.nextElementSibling.textContent.split('>>>')[0].trim().split('\n').map(x => '     * '+x).join('\n'))


function createCode(name, args, desc) {
    if (name.match(/property\s.+/)) {
        // is a property
        name = name.split('property ')[1]
        return `
    /**
${desc}
     */
    ${name} = ''    
`
    }
    else {
        return `
    /**
${desc}
     * @param {Object} args - ${args}
     * @param {*} args.${args}
     * @returns {DataFrame ???}
     */
    ${name}(args = {}) {
        if (args && typeof args === 'object' && !Array.isArray(args)) {
            args = {
                ...{},
                ...args
            }
            // if (typeof args.xxx === 'undefined') throw new Error("Argument xxx of method ${name} must be provided")
        }

        // ** MANUALLY CHOOSE 1 OPTION
        /*
        // OPTION 1
        python.ex([\`\${this\.DataFrameUID}.${name}(\${generatePyFunctionArgs(args)})\`])
        // return this

        // OPTION 2.1
        let DataFrameUID = DataFrame.generateUID()
        python.ex([\`\${DataFrameUID} = ${DataFrameUID}.describe(\${generatePyFunctionArgs(args.cols ? args.cols : args)})\`])        
        let df = new DataFrame(this.SparkSessionUID, DataFrameUID)
        return df
        
        // OPTION 2.2
        let data = await python([\`\${this.DataFrameUID}\${args.num >= 0 ? '.limit(' + args.num + ')' : ''}.toPandas().to_dict(\${generatePyFunctionArgs(args.orient)})\`])
        if (meta.error) {
            throw meta.error
        }
        return data

        */

        // ** MANUALLY MAKE ASYNC IF REQUIRED
        /*
        // add after 'await python....'
        if (meta.error) {
            throw meta.error
        }
        */
    }
`
    }
    
}

if (!(methodNames.length === methodArgs.length && methodArgs.length === methodDescription.length)) {
    throw new Error('Something went wrong with the counts')
}

res = methodNames.map((name, idx) => {
    return createCode(name, methodArgs[idx], methodDescription[idx])
}).join('');

copy(res);