import Decimal from "decimal.js"

type JsFreeFloatParseOptions = {
  /**
   * The minimum allowable value. Defaults to -Infinity.
   * */
  min?: number
  /**
   * The maximum allowable value. Defaults to Infinity.
   * */
  max?: number
  /**
   * If set to true, the function will use a dot as the decimal separator.
   * If false, it will use a comma. Defaults to comma.
   * */
  dot?: boolean
  /**
   * The number of decimal places to include in the output. If not specified, the original precision is preserved.
   * */
  precision?: number
}

function replaceDotByComma(input: string, dot = false) {
  return dot ? input : input.replace(".", ",")
}

export default function jsFreeFloatParse(input: string, options?: JsFreeFloatParseOptions) {
  try {
    const { min, max, dot = false, precision } = options || {}

    const isMin = typeof min === "number"
    const isMax = typeof max === "number"

    let outputNumber = new Decimal(isMin ? min : 0)
    let outputString: string = outputNumber.toString()

    // eslint-disable-next-line no-inner-declarations
    function result() {
      outputString = replaceDotByComma(outputString, dot)
      return [outputString, outputNumber.toNumber()] as const
    }

    if (!input) {
      return result()
    }

    // Some short exceptions
    switch (true) {
      case input === ",":
      case input === ".": {
        outputString = dot ? "0.0" : "0,0"
        return result()
      }
      case input === "0,":
      case input === "0.": {
        outputString = dot ? "0." : "0,"
        return result()
      }
      case input === "-": {
        outputString = "-"
        return result()
      }
      case input === "-0": {
        outputString = "-0"
        return result()
      }
      case input === "-0,":
      case input === "-0.": {
        outputString = dot ? "-0." : "-0,"
        return result()
      }
    }

    // E cases
    switch (true) {
      case input.includes("e+"):
      case input.includes("e-"): {
        // Number stays the same
        outputNumber = new Decimal(input)

        // Split the number into coefficient and exponent parts
        const [coefficientStr, exponentStr] = input.split("e")
        // Parse the exponent part into an integer
        const exponent = parseInt(exponentStr, 10)

        // Split the coefficient part into integer and decimal parts
        const [integerPart, decimalPart = ""] = coefficientStr.replaceAll(".", ",").split(",")

        // When the exponent is positive
        if (exponent > 0) {
          // Calculate the length of the decimal part
          const totalDecimalLength = decimalPart.length

          if (totalDecimalLength > exponent) {
            // If the decimal part is longer than the exponent
            // Move the decimal point to the right within the decimal part
            const newIntegerPart = integerPart + decimalPart.slice(0, exponent)
            const newDecimalPart = decimalPart.slice(exponent)
            outputString = newIntegerPart + "." + newDecimalPart
          } else {
            // If the decimal part is shorter or equal to the exponent
            // Add necessary zeros to the end of the integer part
            const zeroPadding = "0".repeat(exponent - totalDecimalLength)
            outputString = integerPart + decimalPart + zeroPadding
          }
          // When the exponent is negative
        } else {
          // Calculate the necessary zeros to pad before the integer part
          const zeroPadding = "0".repeat(Math.abs(exponent) - 1)
          // Construct the result string with leading zeros
          outputString = "0." + zeroPadding + integerPart + decimalPart
        }

        return result()
      }
    }

    const isNegative = input.startsWith("-")

    // Remove non-digit signs excluding dot and comma
    input = input.replace(/[^\d.,]/g, "")

    // Replace all commas with dots
    input = input.replaceAll(",", ".")

    // Remove leading dots
    input = input.replace(/^\.*/, "")

    // Remove multiple dots
    const dotParts = input.split(".")
    // Means we have more than one dot
    if (dotParts.length > 2) {
      const [firstPart, ...restParts] = dotParts
      const firstPartNumber = parseFloat(firstPart)
      const isFirstPartNumber = !isNaN(firstPartNumber)
      if (isFirstPartNumber) {
        const noDotsRestParts = restParts.join("")
        input = [firstPart, noDotsRestParts].join(".")
      }
    }

    // Remove leading zeros
    if (input.startsWith("0")) {
      input = input.replace(/^0*(?=\d)/, "")
    }

    // Return negative sign back after removing
    if (isNegative) {
      input = "-" + input
    }

    /*
     * Final check and precision
     * */
    outputNumber = new Decimal(input)

    // Set precision
    if (typeof precision === "number") {
      outputNumber = outputNumber.toDecimalPlaces(precision)
      outputString = outputNumber.toFixed(precision)
    } else {
      outputString = input
    }

    // Apply min/max
    if (isMin && outputNumber.lt(min)) {
      outputNumber = new Decimal(min)
      outputString = outputNumber.toString()
    }

    if (isMax && outputNumber.gt(max)) {
      outputNumber = new Decimal(max)
      outputString = outputNumber.toString()
    }

    return result()
  } catch (e) {
    throw new Error(`jsFreeFloatParse: Failed to parse ${input}`)
  }
}
