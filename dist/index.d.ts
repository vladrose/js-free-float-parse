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
     * The number of decimal places to include in the output. Doesn't change the string passed!
     * If precision = 8 and input is "0.00000001" function returns ["0.00000001", 1e-8]
     * */
    precision?: number;
};
export default function jsFreeFloatParse(input: string, options?: JsFreeFloatParseOptions): readonly [string, number];
export {};
//# sourceMappingURL=index.d.ts.map