import {
  DocumentNode,
  DefinitionNode,
  OperationDefinitionNode,
  SelectionSetNode,
  SelectionNode,
  FragmentSpreadNode,
  FieldNode,
  InlineFragmentNode,
  FragmentDefinitionNode,
} from 'graphql';

import _ = require('lodash');

export default class ExtractFromAST {
  // Checks if a given GraphQL definition is an operation definition (i.e. either query or mutation).
  public static isOperationDefinition(defn: DefinitionNode): defn is OperationDefinitionNode {
    return (defn.kind === 'OperationDefinition');
  }

  // Checks if a given GraphQL selection is a FragmentSpread.
  public static isFragmentSpread(selection: SelectionNode): selection is FragmentSpreadNode {
    return (selection.kind === 'FragmentSpread');
  }

  // Checks if a given GraphQL definition is a FragmentDefinition.
  public static isFragmentDefinition(selection: DefinitionNode): selection is FragmentDefinitionNode {
    return (selection.kind === 'FragmentDefinition');
  }

  // Checks if a given GraphQL selection is a Field.
  public static isField(selection: SelectionNode): selection is FieldNode {
    return (selection.kind === 'Field');
  }

  // Checks if a given GraphQL selection is an InlineFragment.
  public static isInlineFragment(selection: SelectionNode): selection is InlineFragmentNode {
    return (selection.kind === 'InlineFragment');
  }

  public static isQueryDefinition(defn: DefinitionNode): defn is OperationDefinitionNode {
    return (ExtractFromAST.isOperationDefinition(defn) && defn.operation === 'query');
  }

  // Creates a query document out of a single query operation definition.
  public static createDocumentFromQuery(definition: OperationDefinitionNode): DocumentNode {
    return {
      kind: 'Document',
      definitions: [ definition ],
    };
  }

  // Get query definitions from query document.
  public static getQueryDefinitions(doc: DocumentNode): OperationDefinitionNode[] {
    const queryDefinitions: OperationDefinitionNode[] = [];
    doc.definitions.forEach((definition) => {
      if (ExtractFromAST.isQueryDefinition(definition)) {
        queryDefinitions.push(definition);
      }
    });
    return queryDefinitions;
  }

  public static getOperationDefinitions(doc: DocumentNode): OperationDefinitionNode[] {
    return doc.definitions.filter(ExtractFromAST.isOperationDefinition) as OperationDefinitionNode[];
  }

  // Extracts the names of fragments from a SelectionSet recursively, given a document in which
  // each of the fragments defined are given. Returns a map going from
  // the name of fragment to the integer "1" to support O(1) lookups.
  public static getFragmentNames(selectionSet: SelectionSetNode, document: DocumentNode): {
    [name: string]: number,
  } {
    if (!selectionSet) {
      return {};
    }

    // Construct a map going from the name of a fragment to the definition of the fragment.
    const fragmentDefinitions: { [name: string]: FragmentDefinitionNode } = {};
    document.definitions.forEach((definition) => {
      if (ExtractFromAST.isFragmentDefinition(definition)) {
        fragmentDefinitions[definition.name.value] = definition;
      }
    });

    let fragmentNames: { [name: string]: number } = {};
    selectionSet.selections.forEach((selection) => {
      // If we encounter a fragment spread, we look inside it to unravel more fragment names.
      if (ExtractFromAST.isFragmentSpread(selection)) {
        fragmentNames[selection.name.value] = 1;
        const innerFragmentNames = ExtractFromAST.getFragmentNames(
          fragmentDefinitions[selection.name.value].selectionSet,
          document,
        );
        fragmentNames = _.merge(fragmentNames, innerFragmentNames);
      } else if (ExtractFromAST.isInlineFragment(selection) || ExtractFromAST.isField(selection)) {
        const innerFragmentNames = ExtractFromAST.getFragmentNames(selection.selectionSet, document);
        fragmentNames = _.merge(fragmentNames, innerFragmentNames);
      }
    });
    return fragmentNames;
  }
}

