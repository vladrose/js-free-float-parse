"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jsFreeFloatParse;
const decimal_js_1 = __importDefault(require("decimal.js"));
function replaceDotByComma(input, dot = false) {
    return dot ? input : input.replace(".", ",");
}
function jsFreeFloatParse(input, options) {
    try {
        const { min, max, dot = false, precision } = options || {};
        const isMin = typeof min === "number";
        const isMax = typeof max === "number";
        let outputNumber = new decimal_js_1.default(isMin ? min : 0);
        let outputString = outputNumber.toString();
        // eslint-disable-next-line no-inner-declarations
        function result() {
            outputString = replaceDotByComma(outputString, dot);
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
                const [coefficientStr, exponentStr] = input.split("e");
                // Parse the exponent part into an integer
                const exponent = parseInt(exponentStr, 10);
                // Split the coefficient part into integer and decimal parts
                const [integerPart, decimalPart = ""] = coefficientStr.replaceAll(".", ",").split(",");
                // When the exponent is positive
                if (exponent > 0) {
                    // Calculate the length of the decimal part
                    const totalDecimalLength = decimalPart.length;
                    if (totalDecimalLength > exponent) {
                        // If the decimal part is longer than the exponent
                        // Move the decimal point to the right within the decimal part
                        const newIntegerPart = integerPart + decimalPart.slice(0, exponent);
                        const newDecimalPart = decimalPart.slice(exponent);
                        outputString = newIntegerPart + "." + newDecimalPart;
                    }
                    else {
                        // If the decimal part is shorter or equal to the exponent
                        // Add necessary zeros to the end of the integer part
                        const zeroPadding = "0".repeat(exponent - totalDecimalLength);
                        outputString = integerPart + decimalPart + zeroPadding;
                    }
                    // When the exponent is negative
                }
                else {
                    // Calculate the necessary zeros to pad before the integer part
                    const zeroPadding = "0".repeat(Math.abs(exponent) - 1);
                    // Construct the result string with leading zeros
                    outputString = "0." + zeroPadding + integerPart + decimalPart;
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
        outputString = input;
        // Apply min/max
        if (isMin && outputNumber.lt(min)) {
            outputNumber = new decimal_js_1.default(min);
            outputString = outputNumber.toFixed();
        }
        if (isMax && outputNumber.gt(max)) {
            outputNumber = new decimal_js_1.default(max);
            outputString = outputNumber.toFixed();
        }
        // Set precision
        if (typeof precision === "number") {
            const boundedPrecision = Math.min(Math.max(precision, 0), 16);
            outputNumber = outputNumber.toDecimalPlaces(boundedPrecision);
        }
        return result();
    }
    catch (e) {
        throw new Error(`jsFreeFloatParse: Failed to parse ${input}`);
    }
}
//# sourceMappingURL=index.js.map