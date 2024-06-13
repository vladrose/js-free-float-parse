declare type Options = {
    precision?: number;
    min?: number;
    max?: number;
    /**
     * Returns dot as float divider
     * */
    dot?: boolean;
};
export default function jsFreeFloatParse(input: string, options?: Options): readonly [string, number];
export {};
//# sourceMappingURL=index.d.ts.map