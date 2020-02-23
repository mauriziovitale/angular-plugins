import * as ts from 'typescript';
import { readFileSync, readdirSync, statSync } from 'fs';

import {
  findNodes,
  Change,
  getSourceNodes,
  InsertChange,
  RemoveChange
} from '@nrwl/workspace/src/utils/ast-utils';
import {
  Tree,
  SchematicsException
} from '@angular-devkit/schematics';
import * as path from 'path';

function _angularImportsFromNode(
  node: ts.ImportDeclaration,
  _sourceFile: ts.SourceFile
): { [name: string]: string } {
  const ms = node.moduleSpecifier;
  let modulePath: string;
  switch (ms.kind) {
    case ts.SyntaxKind.StringLiteral:
      modulePath = (ms as ts.StringLiteral).text;
      break;
    default:
      return {};
  }

  if (!modulePath.startsWith('@angular/')) {
    return {};
  }

  if (node.importClause) {
    if (node.importClause.name) {
      // This is of the form `import Name from 'path'`. Ignore.
      return {};
    } else if (node.importClause.namedBindings) {
      const nb = node.importClause.namedBindings;
      if (nb.kind == ts.SyntaxKind.NamespaceImport) {
        // This is of the form `import * as name from 'path'`. Return `name.`.
        return {
          [(nb as ts.NamespaceImport).name.text + '.']: modulePath
        };
      } else {
        // This is of the form `import {a,b,c} from 'path'`
        const namedImports = nb as ts.NamedImports;

        return namedImports.elements
          .map((is: ts.ImportSpecifier) =>
            is.propertyName ? is.propertyName.text : is.name.text
          )
          .reduce((acc: { [name: string]: string }, curr: string) => {
            acc[curr] = modulePath;

            return acc;
          }, {});
      }
    }

    return {};
  } else {
    // This is of the form `import 'path';`. Nothing to do.
    return {};
  }
}

function _angularImportsSpecifierFromNode(
  node: ts.ImportDeclaration,
  _sourceFile: ts.SourceFile
): { [name: string]: string } {
  if (node.importClause) {
    if (node.importClause.name) {
      // This is of the form `import Name from 'path'`. Ignore.
      return {};
    } else if (node.importClause.namedBindings) {
      const nb = node.importClause.namedBindings;
      if (nb.kind == ts.SyntaxKind.NamespaceImport) {
        const text = (nb as ts.NamespaceImport).name.text;
        // This is of the form `import * as name from 'path'`. Return `name.`.

      }
    }

    return {};
  } else {
    // This is of the form `import 'path';`. Nothing to do.
    return {};
  }
}

export function getDecoratorMetadata(
  source: ts.SourceFile,
  identifier: string,
  module: string
): ts.Node[] {
  const angularImports: { [name: string]: string } = findNodes(
    source,
    ts.SyntaxKind.ImportDeclaration
  )
    .map((node: ts.ImportDeclaration) => _angularImportsFromNode(node, source))
    .reduce(
      (
        acc: { [name: string]: string },
        current: { [name: string]: string }
      ) => {
        for (const key of Object.keys(current)) {
          acc[key] = current[key];
        }

        return acc;
      },
      {}
    );

  return getSourceNodes(source)
    .filter(node => {
      return (
        node.kind == ts.SyntaxKind.Decorator &&
        (node as ts.Decorator).expression.kind == ts.SyntaxKind.CallExpression
      );
    })
    .map(node => (node as ts.Decorator).expression as ts.CallExpression)
    .filter(expr => {
      if (expr.expression.kind == ts.SyntaxKind.Identifier) {
        const id = expr.expression as ts.Identifier;

        return (
          id.getFullText(source) == identifier &&
          angularImports[id.getFullText(source)] === module
        );
      } else if (
        expr.expression.kind == ts.SyntaxKind.PropertyAccessExpression
      ) {
        // This covers foo.NgModule when importing * as foo.
        const paExpr = expr.expression as ts.PropertyAccessExpression;
        // If the left expression is not an identifier, just give up at that point.
        if (paExpr.expression.kind !== ts.SyntaxKind.Identifier) {
          return false;
        }

        const id = paExpr.name.text;
        const moduleId = (paExpr.expression as ts.Identifier).getText(source);

        return id === identifier && angularImports[moduleId + '.'] === module;
      }

      return false;
    })
    .filter(
      expr =>
        expr.arguments[0] &&
        expr.arguments[0].kind == ts.SyntaxKind.ObjectLiteralExpression
    )
    .map(expr => expr.arguments[0] as ts.ObjectLiteralExpression);
}

export function getDecoratorMetadata2(
  source: ts.SourceFile,
  identifier: string
):  Set<string> {
  const res = new Set<string>([]);
  getSourceNodes(source)
    .filter(node => {
      return (
        node.kind === ts.SyntaxKind.ImportSpecifier
      );
    })
    .filter( (node: any) => {
      if (node.name.text === identifier) {
        res.add(node.getSourceFile().fileName);
      }
    })
  return res;
}

export function getClassDeclarationName(
  source: ts.SourceFile
): Set<string> {
  const res = new Set<string>([]);
  getSourceNodes(source)
    .filter(node => {
      return (
        node.kind === ts.SyntaxKind.ClassDeclaration
      );
    })
    .filter( (classSpecifier: ts.ClassDeclaration) => {
        res.add(classSpecifier.name.escapedText.toString());
    })
  return res;
}

export function getInterfaceDeclarationName(
  source: ts.SourceFile
): Set<string> {
  const res = new Set<string>([]);
  getSourceNodes(source)
    .filter(node => {
      return (
        node.kind === ts.SyntaxKind.InterfaceDeclaration
      );
    })
    .filter( (interfaceDeclaration: ts.InterfaceDeclaration) => {
        res.add(interfaceDeclaration.name.escapedText.toString());
    })
  return res;
}

export function findClassName(fileList: Set<string>): Set<string> {
  let classNameList = new Set<string>([]);
  if (fileList.size > 0) {
    Array.from(fileList.values()).forEach( (file) => {
      const sourceFile = getTsSourceFile(file);
      if (sourceFile) {
        classNameList = getClassDeclarationName(sourceFile);
      }
    });
  }
  return classNameList;
}

export function findInterfaceName(fileList: Set<string>): Set<string> {
  let classNameList = new Set<string>([]);
  if (fileList.size > 0) {
    Array.from(fileList.values()).forEach( (file) => {
      const sourceFile = getTsSourceFile(file);
      if (sourceFile) {
        classNameList = getInterfaceDeclarationName(sourceFile);
      }
    });
  }
  return classNameList;
}

export function convertComponentToSelectorFile(fileList: Set<string>): Set<string> {
  const selectorList = new Set<string>([]);
  const componentClassName = findClassName(fileList);
  Array.from(componentClassName.values()).forEach( (componentName) => {
    selectorList.add(componentName.replace('Component','Selector'));
  });
  return selectorList;
}

export function findClassWithInvolvedImport(folderPath: string, type: string, classList: Set<string>): Set<string> {
  const classWithImports = new Set<string>([]);
  Array.from(classList.values()).forEach( (className) => {
    const e2eTests = allFilesInDir(folderPath, type);
    e2eTests.forEach( (test) => {
      const source = getTsSourceFile(test.name);
      if (source) {
        const tmpDecorator = getDecoratorMetadata2(source, className);
        Array.from(tmpDecorator.values()).forEach( (name) => {
          classWithImports.add(name);
        });
      }
    });
  });
  return classWithImports;
}

export function replaceRelativePath(folderPath: string, classList: Set<string>): Set<string> {
  const classWithImports = new Set<string>([]);
  Array.from(classList.values()).forEach( (className) => {
    classWithImports.add(className.replace(folderPath, '.'));
  });
  return classWithImports;
}

function _addSymbolToNgModuleMetadata(
  source: ts.SourceFile,
  ngModulePath: string,
  metadataField: string,
  expression: string
): Change[] {
  const nodes = getDecoratorMetadata(source, 'NgModule', '@angular/core');
  let node: any = nodes[0]; // tslint:disable-line:no-any

  // Find the decorator declaration.
  if (!node) {
    return [];
  }
  // Get all the children property assignment of object literals.
  const matchingProperties: ts.ObjectLiteralElement[] = (node as ts.ObjectLiteralExpression).properties
    .filter(prop => prop.kind == ts.SyntaxKind.PropertyAssignment)
    // Filter out every fields that's not "metadataField". Also handles string literals
    // (but not expressions).
    .filter((prop: ts.PropertyAssignment) => {
      const name = prop.name;
      switch (name.kind) {
        case ts.SyntaxKind.Identifier:
          return (name as ts.Identifier).getText(source) == metadataField;
        case ts.SyntaxKind.StringLiteral:
          return (name as ts.StringLiteral).text == metadataField;
      }

      return false;
    });

  // Get the last node of the array literal.
  if (!matchingProperties) {
    return [];
  }
  if (matchingProperties.length == 0) {
    // We haven't found the field in the metadata declaration. Insert a new field.
    const expr = node as ts.ObjectLiteralExpression;
    let position: number;
    let toInsert: string;
    if (expr.properties.length == 0) {
      position = expr.getEnd() - 1;
      toInsert = `  ${metadataField}: [${expression}]\n`;
    } else {
      node = expr.properties[expr.properties.length - 1];
      position = node.getEnd();
      // Get the indentation of the last element, if any.
      const text = node.getFullText(source);
      if (text.match('^\r?\r?\n')) {
        toInsert = `,${
          text.match(/^\r?\n\s+/)[0]
        }${metadataField}: [${expression}]`;
      } else {
        toInsert = `, ${metadataField}: [${expression}]`;
      }
    }
    const newMetadataProperty = new InsertChange(
      ngModulePath,
      position,
      toInsert
    );
    return [newMetadataProperty];
  }

  const assignment = matchingProperties[0] as ts.PropertyAssignment;

  // If it's not an array, nothing we can do really.
  if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    return [];
  }

  const arrLiteral = assignment.initializer as ts.ArrayLiteralExpression;
  if (arrLiteral.elements.length == 0) {
    // Forward the property.
    node = arrLiteral;
  } else {
    node = arrLiteral.elements;
  }

  if (!node) {
    console.log(
      'No app module found. Please add your new class to your component.'
    );

    return [];
  }

  const isArray = Array.isArray(node);
  if (isArray) {
    const nodeArray = (node as {}) as Array<ts.Node>;
    const symbolsArray = nodeArray.map(node => node.getText());
    if (symbolsArray.includes(expression)) {
      return [];
    }

    node = node[node.length - 1];
  }

  let toInsert: string;
  let position = node.getEnd();
  if (!isArray && node.kind == ts.SyntaxKind.ObjectLiteralExpression) {
    // We haven't found the field in the metadata declaration. Insert a new
    // field.
    const expr = node as ts.ObjectLiteralExpression;
    if (expr.properties.length == 0) {
      position = expr.getEnd() - 1;
      toInsert = `  ${metadataField}: [${expression}]\n`;
    } else {
      node = expr.properties[expr.properties.length - 1];
      position = node.getEnd();
      // Get the indentation of the last element, if any.
      const text = node.getFullText(source);
      if (text.match('^\r?\r?\n')) {
        toInsert = `,${
          text.match(/^\r?\n\s+/)[0]
        }${metadataField}: [${expression}]`;
      } else {
        toInsert = `, ${metadataField}: [${expression}]`;
      }
    }
  } else if (!isArray && node.kind == ts.SyntaxKind.ArrayLiteralExpression) {
    // We found the field but it's empty. Insert it just before the `]`.
    position--;
    toInsert = `${expression}`;
  } else {
    // Get the indentation of the last element, if any.
    const text = node.getFullText(source);
    if (text.match(/^\r?\n/)) {
      toInsert = `,${text.match(/^\r?\n(\r?)\s+/)[0]}${expression}`;
    } else {
      toInsert = `, ${expression}`;
    }
  }
  const insert = new InsertChange(ngModulePath, position, toInsert);
  return [insert];
}

export function removeFromNgModule(
  source: ts.SourceFile,
  modulePath: string,
  property: string
): Change[] {
  const nodes = getDecoratorMetadata(source, 'NgModule', '@angular/core');
  let node: any = nodes[0]; // tslint:disable-line:no-any

  // Find the decorator declaration.
  if (!node) {
    return [];
  }

  // Get all the children property assignment of object literals.
  const matchingProperty = getMatchingProperty(
    source,
    property,
    'NgModule',
    '@angular/core'
  );
  if (matchingProperty) {
    return [
      new RemoveChange(
        modulePath,
        matchingProperty.getStart(source),
        matchingProperty.getFullText(source)
      )
    ];
  } else {
    return [];
  }
}

function getMatchingProperty(
  source: ts.SourceFile,
  property: string,
  identifier: string,
  module: string
): ts.ObjectLiteralElement {
  const nodes = getDecoratorMetadata(source, identifier, module);
  let node: any = nodes[0]; // tslint:disable-line:no-any

  if (!node) return null;

  // Get all the children property assignment of object literals.
  return getMatchingObjectLiteralElement(node, source, property);
}

export function addProviderToModule(
  source: ts.SourceFile,
  modulePath: string,
  symbolName: string
): Change[] {
  return _addSymbolToNgModuleMetadata(
    source,
    modulePath,
    'providers',
    symbolName
  );
}

export function addDeclarationToModule(
  source: ts.SourceFile,
  modulePath: string,
  symbolName: string
): Change[] {
  return _addSymbolToNgModuleMetadata(
    source,
    modulePath,
    'declarations',
    symbolName
  );
}

export function addEntryComponents(
  source: ts.SourceFile,
  modulePath: string,
  symbolName: string
): Change[] {
  return _addSymbolToNgModuleMetadata(
    source,
    modulePath,
    'entryComponents',
    symbolName
  );
}

export function getDecoratorPropertyValueNode(
  host: Tree,
  modulePath: string,
  identifier: string,
  property: string,
  module: string
) {
  const moduleSourceText = host.read(modulePath)!.toString('utf-8');
  const moduleSource = ts.createSourceFile(
    modulePath,
    moduleSourceText,
    ts.ScriptTarget.Latest,
    true
  );
  const templateNode = getMatchingProperty(
    moduleSource,
    property,
    identifier,
    module
  );

  return templateNode.getChildAt(templateNode.getChildCount() - 1);
}

function getMatchingObjectLiteralElement(
  node: any,
  source: ts.SourceFile,
  property: string
) {
  return (
    (node as ts.ObjectLiteralExpression).properties
      .filter(prop => prop.kind == ts.SyntaxKind.PropertyAssignment)
      // Filter out every fields that's not "metadataField". Also handles string literals
      // (but not expressions).
      .filter((prop: ts.PropertyAssignment) => {
        const name = prop.name;
        switch (name.kind) {
          case ts.SyntaxKind.Identifier:
            return (name as ts.Identifier).getText(source) === property;
          case ts.SyntaxKind.StringLiteral:
            return (name as ts.StringLiteral).text === property;
        }
        return false;
      })[0]
  );
}

export function getTsSourceFile(pathFile: string): ts.SourceFile {
  let source;
  try {
    const buffer = readFileSync(pathFile);
    if (!buffer) {
      throw new SchematicsException(`Could not read TS file (${pathFile}).`);
    }
    const content = buffer.toString();
    source = ts.createSourceFile(
      pathFile,
      content,
      ts.ScriptTarget.Latest,
      true
    );
  } catch(error) {
  }

  return source;
}

export function allFilesInDir(dirName, fileType) {
  let res = [];
  try {
    readdirSync(dirName).forEach(c => {
      const child = path.join(dirName, c);
      try {
        const s = statSync(child);
        if (path.basename(child).endsWith(`.${fileType}.ts`) && path.extname(child) === '.ts') {
          res.push({
            name: child,
            content: readFileSync(child).toString()
          });
        } else if (s.isDirectory()) {
          res = [...res, ...allFilesInDir(child, fileType)];
        }
      } catch (e) {}
    });
  } catch (e) {}
  return res;
}

