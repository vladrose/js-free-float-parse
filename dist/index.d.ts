type JsFreeFloatParseOptions = {
    /**
     * The minimum allowable value. Defaults to -Infinity.
     * */
    min?: number;
    /**
     * The maximum allowable value. Defaults to Infinity.
     * */
    max?: number;
    /**
     * If set to true, the function will use a dot as the decimal separator.
     * If false, it will use a comma. Defaults to comma.
     * */
    dot?: boolean;
    /**
     * The number of decimal places to include in the float output. Does not round the number, just cut
     * */
    decimals?: number;
};
export default function jsFreeFloatParse(input: string, options?: JsFreeFloatParseOptions): readonly [string, number];
export {};
//# sourceMappingURL=index.d.ts.map