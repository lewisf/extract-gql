# extract-gql

A utility for extracting graphql documents from multiple files into a single string.

## Setup

This isn't published yet ... clone and use `npm link` or install it from a file path.

## Usage

```js
import { ExtractGQL } from 'extract-gql';

const extractor = new ExtractGQL();
const queryDocuments = extractor.fromFiles([
  'path/to/oneQuery.graphl',
  'path/to/sourceFileWithEmbeddedGraphQL.js',
]);
```

If you have graphql documents embedded within your source files and use a template tag other than `gql`, then make sure to initialize your extractor accordingly.

```js
const extractor = new ExtractGQL({ templateTag: 'MyTag' });
```

## More to come!