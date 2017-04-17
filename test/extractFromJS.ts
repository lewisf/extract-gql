import * as chai from 'chai';
const { assert } = chai;

import {
  findTaggedTemplateLiteralsInJS,
  eliminateInterpolations,
  getInterpolations,
} from '../src/extractFromJS';

describe('extractFromJS', () => {
  it('findTaggedTemplateLiteralsInJS should be able to find tagged strings inside JS', () => {
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

    assert.deepEqual(findTaggedTemplateLiteralsInJS(jsFile, 'gql'), [
      'xxx',
      'y\ny\ny',
      'zzz',
    ]);
  });

  describe('eliminateInterpolations', () => {
    it('eliminates a single interpolation', () => {
      const contents = `
        {
          a { b ...c }
        }
        \${c}
      `.trim();

      assert.deepEqual(eliminateInterpolations(contents), `
        {
          a { b ...c }
        }
      `.trim());
    });

    it('eliminates multiple interpolations', () => {
      const contents = `
        {
          a { b ...c }
        }
        \${c}
        \${d}
      `.trim();

      assert.deepEqual(eliminateInterpolations(contents), `
        {
          a { b ...c }
        }
      `.trim());
    });
  });

  describe('getInterpolations', () => {
    it('should return interpolations for a single interpolation', () => {
      const contents = `
        {
          a { b ...c }
        }
        \${c}
      `;

      const interpolations = getInterpolations(contents);
      const expected = ['${c}'];

      assert.sameDeepMembers(interpolations, expected);
    });

    it('should return interpolations for multiple interpolations', () => {
      const contents = `
        {
          a { b ...c }
        }
        \${c}
        \${d}
        \${e}
      `;

      const interpolations = getInterpolations(contents);
      const expected = ['${c}', '${d}', '${e}'];

      assert.sameDeepMembers(interpolations, expected);
    });
  });
});
