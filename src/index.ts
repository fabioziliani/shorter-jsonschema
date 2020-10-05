
import * as rfdc from 'rfdc'

const clone = rfdc()

export type LongJsonSchema = {
	type: string
	[k: string]: any
}

function isLong(short: ShortJsonSchema): short is LongJsonSchema {
	return (short as any).type != null
}



export type ShortNames = 'string' | 'number' | 'integer' | 'boolean' | 'null' | string

/** Object abbreviation */
export type ShortObjectSchema = { [name: string]: ShortJsonSchema }

export type ShortJsonSchema = LongJsonSchema | ShortNames | ShortJsonSchema[] | ShortObjectSchema


export type Conf = {
	nameToSchemas?: {
		[name: string]: LongJsonSchema
	}
	default?: {
		[type: string]: { [k: string]: any }
	}
}


export function expandType(conf: Conf, short: ShortJsonSchema): LongJsonSchema {
	if (isLong(short))
		return short

	if (typeof short === 'string') {
		const maybeLong = conf.nameToSchemas && conf.nameToSchemas[short]
		if (maybeLong != null)
			return clone(maybeLong)

		return {
			type: short
		}
	}

	if (Array.isArray(short)) {
		if (short.length == 0)
			return { type: 'array' }
		if (short.length == 1)
			return {
				type: 'array',
				items: expandType(conf, short[0])
			}
		return {
			type: 'array',
			items: short.map(s => expandType(conf, s))
		}
	}

	const obj: LongJsonSchema = {
		type: 'object'
	}

	for (const k in short)
		obj[k] = expandType(conf, short[k])
	return obj
}



//TODO devo clonare i risultati? se uno schema viene riciclato diventa semplicemente riespanso
//diventa un problema solo se viene riciclato sotto diverse configurazioni
//introdurre un parametro che attiva la clonazione di tutto?

function applyDefaults(conf: Conf, long: LongJsonSchema) {
	//TODO $ref?

	if (typeof long.type === 'string' && conf.default) {
		const defs = conf.default[long.type]
		if (defs) {
			for (const k in defs) {
				//ignoring num range. see below
				if (k !== 'minimum' && k !== 'exclusiveMinimum' && k !== 'maximum' && k !== 'exclusiveMaximum') {
					if (long[k] == null)
						long[k] = defs[k]
				}

				//apply min or exMin only if both are not applied
				if ((defs.minimum != null || defs.exclusiveMinimum != null) && long.minimum == null && long.exclusiveMinimum == null) {
					if (defs.minimum != null)
						long.minimum = defs.minimum
					if (defs.exclusiveMinimum != null)
						long.exclusiveMinimum = defs.exclusiveMinimum
				}

				//same for max
				if ((defs.maximum != null || defs.exclusiveMaximum != null) && long.maximum == null && long.exclusiveMaximum == null) {
					if (defs.maximum != null)
						long.maximum = defs.maximum
					if (defs.exclusiveMaximum != null)
						long.exclusiveMaximum = defs.exclusiveMaximum
				}
			}
		}
	}

	//ricorsioni
	if (long.type == 'array') {
		if (long.items != null) {
			if (Array.isArray(long.items)) {
				for (const x of long.items)
					applyDefaults(conf, x)
			}
			else {
				applyDefaults(conf, long.items)
			}
		}
	}
	else if (long.type == 'object') {
		//TODO max properties?
		if (long.properties) {
			for (const k in long.properties)
				applyDefaults(conf, long.properties[k])
		}
	}

	for (const k of ['anyOf', 'oneOf', 'allOf'])
		if (Array.isArray(long[k]))
			for (const l of long[k])
				applyDefaults(conf, l)
}


function compile(conf: Conf, short: ShortJsonSchema) {
	const long = expandType(conf, short)
	applyDefaults(conf, long)
	return long
}

export function compiler(conf: Conf) {
	function c(short: ShortJsonSchema) {
		return compile(conf, short)
	}
	return c
}