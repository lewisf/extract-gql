import * as fs from 'fs';
import ExtractFromJS from './extractFromJS';

export type ExtractGQLOptions = {
  templateTag: string
}

/**
 * Given any file, extract anything that is a query
 */
export default class ExtractGQL {
  private templateTag: string = 'gql';

  constructor(options?: ExtractGQLOptions) {
    if (options) {
      this.templateTag = options.templateTag;
    }
  }

  public fromJS(filePath: string) {
    const body = fs.readFileSync(filePath).toString('utf-8');

    return ExtractFromJS.findTaggedTemplateLiteralsInJS(body, this.templateTag)
      .map(ExtractFromJS.eliminateInterpolations)
      .join('\n');
  }

  public fromGraphQL(filePath: string) {
    const body = fs.readFileSync(filePath).toString('utf-8');
    return body;
  }

  public fromFile(filePath: string) {
    const ext = filePath.split('.').slice(-1)[0];

    if (ext === 'graphql') {
      return this.fromGraphQL(filePath);
    } else if (ext === 'js' || ext === 'jsx' || ext === 'ts' || ext === 'tsx') {
      return this.fromJS(filePath);
    } else {
      throw new Error(`Error loading ${filePath}. Only .graphql, .js(x)?, and .ts(x)? files are supported by ExtractGQL.`);
    }
  }

  public fromFiles(filePaths: string[]) {
    return filePaths.map(this.fromFile.bind(this)).join('\n');
  }

  // Is it possible to evaluate fragments into queries? We'd have to execute the
  // interpolated fragment and then stick it into the query but it'd make
  // for a nice type.
}