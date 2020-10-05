

import { compiler, Conf, ShortJsonSchema } from './index'


const tests: ShortJsonSchema[] = [
	// 'number',
	// 'num',
	// 'string',
	{
		"name?": 'string',
		surname: 'string',
		age: 'number',
		speed: 'number?'
	}
]

const conf: Conf = {
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
}

const compile = compiler(conf)

for (const t of tests)
	console.log(`-----
Input:
${JSON.stringify(t, null, 2)}

Output:
${JSON.stringify(compile(t), null, 2)}

`)