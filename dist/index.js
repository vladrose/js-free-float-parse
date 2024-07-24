"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decimal_js_1 = __importDefault(require("decimal.js"));
function replaceDotByComma(input, dot = false) {
    return dot ? input : input.replace(".", ",");
}
function jsFreeFloatParse(input, options) {
    try {
        const { min = -Infinity, max = Infinity, dot = false, precision } = options || {};
        let outputString = "";
        let outputNumber = new decimal_js_1.default(0);
        function result() {
            return [outputString, outputNumber.toNumber()];
        }
        if (!input) {
            return result();
        }
        // Some short exceptions
        switch (true) {
            case input === ",":
            case input === ".": {
                outputString = dot ? "0.0" : "0,0";
                return result();
            }
            case input === "0,":
            case input === "0.": {
                outputString = dot ? "0." : "0,";
                return result();
            }
            case input === "-": {
                outputString = "-";
                return result();
            }
            case input === "-0": {
                outputString = "-0";
                return result();
            }
            case input === "-0,":
            case input === "-0.": {
                outputString = dot ? "-0." : "-0,";
                return result();
            }
        }
        // E cases
        switch (true) {
            case input.includes("e+"):
            case input.includes("e-"): {
                // Number stays the same
                outputNumber = new decimal_js_1.default(input);
                // Split the number into coefficient and exponent parts
                const [coefficientStr, exponentStr] = input.split('e');
                // Parse the exponent part into an integer
                const exponent = parseInt(exponentStr, 10);
                // Split the coefficient part into integer and decimal parts
                const [integerPart, decimalPart = ''] = coefficientStr.replaceAll(".", ",").split(',');
                // When the exponent is positive
                if (exponent > 0) {
                    // Calculate the length of the decimal part
                    const totalDecimalLength = decimalPart.length;
                    if (totalDecimalLength > exponent) {
                        // If the decimal part is longer than the exponent
                        // Move the decimal point to the right within the decimal part
                        const newIntegerPart = integerPart + decimalPart.slice(0, exponent);
                        const newDecimalPart = decimalPart.slice(exponent);
                        outputString = newIntegerPart + '.' + newDecimalPart;
                    }
                    else {
                        // If the decimal part is shorter or equal to the exponent
                        // Add necessary zeros to the end of the integer part
                        const zeroPadding = '0'.repeat(exponent - totalDecimalLength);
                        outputString = integerPart + decimalPart + zeroPadding;
                    }
                    // When the exponent is negative
                }
                else {
                    // Calculate the necessary zeros to pad before the integer part
                    const zeroPadding = '0'.repeat(Math.abs(exponent) - 1);
                    // Construct the result string with leading zeros
                    outputString = '0.' + zeroPadding + integerPart + decimalPart;
                }
                return result();
            }
        }
        const isNegative = input.startsWith("-");
        // Remove non-digit signs excluding dot and comma
        input = input.replace(/[^\d.,]/g, "");
        // Replace all commas with dots
        input = input.replaceAll(",", ".");
        // Remove leading dots
        input = input.replace(/^\.*/, "");
        // Remove multiple dots
        const dotParts = input.split(".");
        // Means we have more than one dot
        if (dotParts.length > 2) {
            const [firstPart, ...restParts] = dotParts;
            const firstPartNumber = parseFloat(firstPart);
            const isFirstPartNumber = !isNaN(firstPartNumber);
            if (isFirstPartNumber) {
                const noDotsRestParts = restParts.join("");
                input = [firstPart, noDotsRestParts].join(".");
            }
        }
        // Remove leading zeros
        if (input.startsWith("0")) {
            input = input.replace(/^0*(?=\d)/, "");
        }
        // Return negative sign back after removing
        if (isNegative) {
            input = "-" + input;
        }
        /*
        * Final check and precision
        * */
        outputNumber = new decimal_js_1.default(input);
        // Set precision
        if (precision) {
            outputNumber = outputNumber.toDecimalPlaces(precision);
            outputString = outputNumber.toPrecision(precision);
        }
        else {
            outputString = replaceDotByComma(input, dot);
        }
        // Apply min/max
        if (outputNumber.lt(min)) {
            outputNumber = new decimal_js_1.default(min);
            outputString = replaceDotByComma(outputNumber.toString(), dot);
        }
        if (outputNumber.gt(max)) {
            outputNumber = new decimal_js_1.default(max);
            outputString = replaceDotByComma(outputNumber.toString(), dot);
        }
        return result();
    }
    catch (e) {
        throw new Error(`jsFreeFloatParse: Failed to parse ${input}`);
    }
}
exports.default = jsFreeFloatParse;
//# sourceMappingURL=index.js.map