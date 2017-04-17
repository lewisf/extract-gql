export function findTaggedTemplateLiteralsInJS(jsCode: string, tag: string): string[] {
  // m for multiline
  // g for matching multiple results
  // capture the text inside the template literal with parentheses
  const regex = new RegExp(tag + '\\s*\`([\\s\\S]+?)\`', 'mg');
  const results = [];

  let result;
  // run in a loop to get all results
  while ((result = regex.exec(jsCode)) !== null) {
    results.push(result[1]);
  }

  return results;
}

export function eliminateInterpolations(templateLiteralContents: string): string {
  const regex = /\$\{[\s\S]+?\}\n?/gm;

  return templateLiteralContents.replace(regex, '').trim();
}

export function getInterpolations(templateLiteralContents: string): string[] {
  const regex = /\$\{[\s\S]+?\}/gm;

  let match;
  const matches = [];
  while ((match = regex.exec(templateLiteralContents)) != null) {
    matches.push(match[0]);
  }

  return matches;
}
