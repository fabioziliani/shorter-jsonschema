"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const tests = [
    // 'number',
    // 'num',
    // 'string',
    {
        "name?": 'string',
        surname: 'string',
        age: 'number',
        speed: 'number?'
    }
];
const conf = {
    nameToSchemas: {
        'num': {
            type: 'number',
            minimum: '256'
        },
        'number?': {
            oneOf: [
                {
                    type: 'number'
                },
                { type: 'null' }
            ]
        }
    },
    default: {
        object: {
            additionalProperties: false
        },
        number: {
            exclusiveMinimum: 1024
        },
        string: {
            maxLength: 256
        }
    }
};
const compile = index_1.compiler(conf);
for (const t of tests)
    console.log(`-----
Input:
${JSON.stringify(t, null, 2)}

Output:
${JSON.stringify(compile(t), null, 2)}

`);
//# sourceMappingURL=test.js.map