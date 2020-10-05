"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const tests = [
    'number',
    'num',
    'string'
];
const conf = {
    nameToSchemas: {
        'num': {
            type: 'number',
            minimum: '256'
        }
    },
    default: {
        'number': {
            exclusiveMinimum: ' 1024'
        }
    }
};
const compile = index_1.compiler(conf);
for (const t of tests)
    console.log(t, compile(t));
//# sourceMappingURL=test.js.map