export declare type LongJsonSchema = {
    type: string;
    [k: string]: any;
};
export declare type ShortNames = 'string' | 'number' | 'integer' | 'boolean' | 'null' | string;
/** Object abbreviation */
export declare type ShortObjectSchema = {
    [name: string]: ShortJsonSchema;
};
export declare type ShortJsonSchema = LongJsonSchema | ShortNames | ShortJsonSchema[] | ShortObjectSchema;
export declare type Conf = {
    nameToSchemas?: {
        [name: string]: LongJsonSchema;
    };
    default?: {
        [type: string]: {
            [k: string]: any;
        };
    };
};
export declare function expandType(conf: Conf, short: ShortJsonSchema): LongJsonSchema;
export declare function compiler(conf: Conf): (short: ShortJsonSchema) => LongJsonSchema;
