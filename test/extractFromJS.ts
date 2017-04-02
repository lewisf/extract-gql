import * as chai from 'chai';
const { assert } = chai;

import ExtractFromJS from '../src/extractFromJS';

describe('extractFromJS', () => {
  it('should be able to find tagged strings inside JS', () => {
    const jsFile = `
      // Single line
      const query = gql\`xxx\`;

      // Multi line
      const query2 = gql\`y
y
y\`;

      // Has a space before tag
      const query3 = gql \`zzz\`;
    `;

    assert.deepEqual(ExtractFromJS.findTaggedTemplateLiteralsInJS(jsFile, 'gql'), [
      'xxx',
      'y\ny\ny',
      'zzz',
    ]);
  });

  it('should eliminate interpolations', () => {
    const contents = `
      {
        a { b ...c }
      }
\${c}
    `;

    assert.deepEqual(ExtractFromJS.eliminateInterpolations(contents), `
      {
        a { b ...c }
      }

    `);
  });
});
