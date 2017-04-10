import { assert } from 'chai';
import * as path from 'path';

import ExtractGQL from '../src/ExtractGQL';

const FIXTURES_DIR = path.join(__dirname, '..', '..', 'test', 'fixtures');

describe('ExtractGQL', () => {
  it('loads from *.js', () => {
    const extractor = new ExtractGQL();
    const extracted = extractor.fromJS(path.join(FIXTURES_DIR, 'single_fragment_js', 'code.js'))

    assert.deepEqual(
      extracted, 
      'fragment details on Author {\n    firstName\n    lastName\n  }\nquery {\n    author {\n      ...details\n    }\n  }'
    );
  });

  it('loads from *.graphql', () => {
    const extractor = new ExtractGQL();
    const extracted = extractor.fromGraphQL(path.join(FIXTURES_DIR, 'single_fragment', 'fragment.graphql'))

    assert.deepEqual(
      extracted,
      `fragment details on Author {\n  firstName\n  lastName\n}`
    );
  });

  it('loads from file', () => {
    const extractor = new ExtractGQL();

    assert.deepEqual(
      extractor.fromGraphQL(path.join(FIXTURES_DIR, 'single_fragment', 'fragment.graphql')),
      `fragment details on Author {\n  firstName\n  lastName\n}`
    );

    assert.deepEqual(
      extractor.fromJS(path.join(FIXTURES_DIR, 'single_fragment_js', 'code.js')),
      'fragment details on Author {\n    firstName\n    lastName\n  }\nquery {\n    author {\n      ...details\n    }\n  }'
    );
  });

  it('loads from multiple files', () => {
    const extractor = new ExtractGQL();

    const extracted = extractor.fromFiles([
      path.join(FIXTURES_DIR, 'single_fragment', 'fragment.graphql'),
      path.join(FIXTURES_DIR, 'single_fragment_js', 'code.js')
    ]);

    assert.deepEqual(
      extracted,
      `fragment details on Author {\n  firstName\n  lastName\n}\nfragment details on Author {\n    firstName\n    lastName\n  }\nquery {\n    author {\n      ...details\n    }\n  }`
    );
  });
});