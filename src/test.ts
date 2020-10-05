

import { compiler, Conf, ShortJsonSchema } from './index'


const tests: ShortJsonSchema[] = [
	'number',
	'num',
	'string'
]

const conf: Conf = {
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
}

const compile = compiler(conf)

for (const t of tests)
	console.log(t, compile(t))