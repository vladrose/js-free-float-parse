# js-free-float-parse

`js-free-float-parse` is a JavaScript library built on top of `decimal.js`
that designed to parse and convert user/html input strings into numeric values,
handling various edge cases such as leading zeros typing and formatting options.

For test-cases see `tests/index.spec.ts`

### Installation

```bash
npm install js-free-float-parse
```

### Usage

```typescript
import jsFreeFloatParse from 'js-free-float-parse';

const options = {
  min: 0,
  max: 100,
  dot: true,
  decimals: 2
};

const [string, number] = jsFreeFloatParse('12,34', options);

console.log(string); // "12.34"
console.log(number); // 12.34
```

### Options

```typescript
type Options = {
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
   * The number of decimal places to include in the float output. Does not round the number, just cut
   * */
  decimals?: number
}
```

### Testing

Library uses `vitest` for testing

```bash
npm run test
```

### Edge Cases

The function handles various edge cases, such as:

- Empty input
- Single decimal separators (dot or comma)
- Negative values
- Leading zeros
- Multiple decimal separators
- e-/e+ values like *(5.5e-10)*
