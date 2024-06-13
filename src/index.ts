type Options = {
  precision?: number
  min?: number
  max?: number
  /**
   * Returns dot as float divider
   * */
  dot?: boolean
}

function replaceDotByComma(input: string, dot = false) {
  return dot ? input : input.replace(".", ",")
}

export default function jsFreeFloatParse(input: string, options?: Options) {
  const { precision = 16, min = -Infinity, max = Infinity, dot = false } = options || {}

  let outputString: string = ""
  let outputNumber: number = 0

  if (!input) {
    return [outputString, outputNumber] as const
  }

  // Some short exceptions
  switch (true) {
    case input === ",":
    case input === ".": {
      outputString = dot ? "0.0" : "0,0"
      return [outputString, outputNumber] as const
    }
    case input === "0,":
    case input === "0.": {
      outputString = dot ? "0." : "0,"
      return [outputString, outputNumber] as const
    }
    case input === "-": {
      outputString = "-"
      return [outputString, outputNumber] as const
    }
    case input === "-0": {
      outputString = "-0"
      return [outputString, outputNumber] as const
    }
    case input === "-0,":
    case input === "-0.": {
      outputString = dot ? "-0." : "-0,"
      return [outputString, outputNumber] as const
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

  // Round numbers with precision
  const currentNumber = parseFloat(input)
  if (!isNaN(currentNumber)) {
    const [, decimalPlaces] = input.split(".")
    if (decimalPlaces && decimalPlaces.length > precision) {
      const numberWithPrecision = parseFloat(currentNumber.toFixed(precision))
      input = numberWithPrecision.toString()
    }
  } else {
    // Final check
    throw new Error(`jsFreeFloatParse: Failed to parse ${input}`)
  }

  outputNumber = parseFloat(input)
  // Assume we have 0 or 1 dot here
  outputString = replaceDotByComma(input, dot)

  // Apply min/max
  if (min > outputNumber) {
    outputNumber = min
    outputString = replaceDotByComma(min.toString(), dot)
  }

  // Apply min/max
  if (max < outputNumber) {
    outputNumber = max
    outputString = replaceDotByComma(max.toString(), dot)
  }

  return [outputString, outputNumber] as const
}
