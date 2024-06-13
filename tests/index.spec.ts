import { describe, it, expect } from "vitest"

import jsFreeFloatParse from "../src/index"

describe("jsFreeFloatParse", () => {
  it("parses empty string", () => {
    expect(jsFreeFloatParse("")).toEqual(["", 0])
  })

  it("parses short exceptions", () => {
    expect(jsFreeFloatParse(",")).toEqual(["0,0", 0])
    expect(jsFreeFloatParse(".")).toEqual(["0,0", 0])
    expect(jsFreeFloatParse("0,")).toEqual(["0,", 0])
    expect(jsFreeFloatParse("0.")).toEqual(["0,", 0])
    expect(jsFreeFloatParse("-")).toEqual(["-", 0])
    expect(jsFreeFloatParse("-0")).toEqual(["-0", 0])
    expect(jsFreeFloatParse("-0,")).toEqual(["-0,", 0])
    expect(jsFreeFloatParse("-0.")).toEqual(["-0,", 0])
    expect(jsFreeFloatParse("0.0")).toEqual(["0,0", 0])
    expect(jsFreeFloatParse("0,0")).toEqual(["0,0", 0])
  })

  it("ignores invalid characters", () => {
    expect(jsFreeFloatParse("  23  ")).toEqual(["23", 23])
    expect(jsFreeFloatParse("12a3")).toEqual(["123", 123])
    expect(jsFreeFloatParse("==12a3")).toEqual(["123", 123])
    expect(jsFreeFloatParse("-12a3==")).toEqual(["-123", -123])
    expect(jsFreeFloatParse("123=123")).toEqual(["123123", 123123])
    expect(jsFreeFloatParse("..2,2,,")).toEqual(["2,2", 2.2])
    expect(jsFreeFloatParse("...2,2,,.")).toEqual(["2,2", 2.2])
    expect(jsFreeFloatParse("0.2.,...")).toEqual(["0,2", 0.2])
    expect(jsFreeFloatParse("0,2,.")).toEqual(["0,2", 0.2])
    expect(jsFreeFloatParse("0,2,..")).toEqual(["0,2", 0.2])
  })

  it("join many dots between numbers", () => {
    expect(jsFreeFloatParse("0..2")).toEqual(["0,2", 0.2])
    expect(jsFreeFloatParse("0...2")).toEqual(["0,2", 0.2])
    expect(jsFreeFloatParse("0.....2")).toEqual(["0,2", 0.2])
    expect(jsFreeFloatParse("2..2")).toEqual(["2,2", 2.2])
    expect(jsFreeFloatParse("2...2")).toEqual(["2,2", 2.2])
    expect(jsFreeFloatParse("2.....2")).toEqual(["2,2", 2.2])
  })

  it("parses basic integers correctly", () => {
    expect(jsFreeFloatParse("123")).toEqual(["123", 123])
  })

  it("parses decimal numbers correctly", () => {
    expect(jsFreeFloatParse("123.45")).toEqual(["123,45", 123.45])
    expect(jsFreeFloatParse("123,45")).toEqual(["123,45", 123.45])
  })

  it("handles zeros", () => {
    expect(jsFreeFloatParse("00123")).toEqual(["123", 123])
    expect(jsFreeFloatParse("01023")).toEqual(["1023", 1023])
    expect(jsFreeFloatParse("-00123")).toEqual(["-123", -123])
    expect(jsFreeFloatParse("-01023")).toEqual(["-1023", -1023])
    expect(jsFreeFloatParse("0012300")).toEqual(["12300", 12300])
    expect(jsFreeFloatParse("020202")).toEqual(["20202", 20202])
    expect(jsFreeFloatParse("02")).toEqual(["2", 2])
    expect(jsFreeFloatParse("02.001")).toEqual(["2,001", 2.001])
  })

  it("handles single dot or comma", () => {
    expect(jsFreeFloatParse(".")).toEqual(["0,0", 0])
    expect(jsFreeFloatParse(",")).toEqual(["0,0", 0])
  })

  it("handles multiple decimal points by ignoring subsequent ones", () => {
    expect(jsFreeFloatParse("123.45.67")).toEqual(["123,4567", 123.4567])
    expect(jsFreeFloatParse("0,0123,123,12")).toEqual(["0,012312312", 0.012312312])
    expect(jsFreeFloatParse("0,0123.123.12")).toEqual(["0,012312312", 0.012312312])
  })

  it("handles input with just a negative sign", () => {
    expect(jsFreeFloatParse("-0.1")).toEqual(["-0,1", -0.1])
  })

  it("handles negative numbers", () => {
    expect(jsFreeFloatParse("-123")).toEqual(["-123", -123])
  })

  it("handles leading negative signs", () => {
    expect(jsFreeFloatParse("--123")).toEqual(["-123", -123])
    expect(jsFreeFloatParse("--123--")).toEqual(["-123", -123])
  })

  it("handles middle negative signs", () => {
    expect(jsFreeFloatParse("-123---")).toEqual(["-123", -123])
  })

  it("handles letters", () => {
    expect(jsFreeFloatParse("-123ad12")).toEqual(["-12312", -12312])
  })

  it("handles zero followed by dot or comma", () => {
    expect(jsFreeFloatParse("0.")).toEqual(["0,", 0])
    expect(jsFreeFloatParse("0,")).toEqual(["0,", 0])
  })

  it("handles value with comma", () => {
    expect(jsFreeFloatParse("0,123")).toEqual(["0,123", 0.123])
  })

  describe("handles options", () => {
    it("precision correctly", () => {
      const input = "0.12345678901234567890"
      const expectedOutput = ["0,12345678901235", 0.12345678901235]
      expect(jsFreeFloatParse(input, { precision: 14 })).toEqual(expectedOutput)
    })

    it("min correctly", () => {
      expect(jsFreeFloatParse("100", { min: 110 })).toEqual(["110", 110])
      expect(jsFreeFloatParse("100.15", { min: 100.23 })).toEqual(["100,23", 100.23])
      expect(jsFreeFloatParse("-0.35", { min: -0.25 })).toEqual(["-0,25", -0.25])
    })

    it("max correctly", () => {
      expect(jsFreeFloatParse("100", { max: 90 })).toEqual(["90", 90])
      expect(jsFreeFloatParse("100.15", { max: 100.14 })).toEqual(["100,14", 100.14])
      expect(jsFreeFloatParse("-0.15", { max: -0.25 })).toEqual(["-0,25", -0.25])
    })

    it("min with 0.0 string correctly", () => {
      expect(jsFreeFloatParse("0.0", { min: 0 })).toEqual(["0,0", 0])
    })

    it("dot correctly", () => {
      const options = { dot: true }
      /* Common cases */
      expect(jsFreeFloatParse("0,0123,123,12", options)).toEqual(["0.012312312", 0.012312312])
      expect(jsFreeFloatParse("0.....2", options)).toEqual(["0.2", 0.2])
      expect(jsFreeFloatParse("...2,2,,.", options)).toEqual(["2.2", 2.2])
      expect(jsFreeFloatParse("100.15", options)).toEqual(["100.15", 100.15])
      expect(jsFreeFloatParse("-0.35", options)).toEqual(["-0.35", -0.35])
      /* Short exceptions */
      expect(jsFreeFloatParse(",", options)).toEqual(["0.0", 0])
      expect(jsFreeFloatParse(".", options)).toEqual(["0.0", 0])
      expect(jsFreeFloatParse("0,", options)).toEqual(["0.", 0])
      expect(jsFreeFloatParse("0.", options)).toEqual(["0.", 0])
      expect(jsFreeFloatParse("-", options)).toEqual(["-", 0])
      expect(jsFreeFloatParse("-0", options)).toEqual(["-0", 0])
      expect(jsFreeFloatParse("-0,", options)).toEqual(["-0.", 0])
      expect(jsFreeFloatParse("-0.", options)).toEqual(["-0.", 0])
      expect(jsFreeFloatParse("0.0", options)).toEqual(["0.0", 0])
      expect(jsFreeFloatParse("0,0", options)).toEqual(["0.0", 0])
    })
  })
})
