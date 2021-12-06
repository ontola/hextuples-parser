import rdf, {
  BlankNode,
  DataFactory,
  Quad,
  SomeTerm,
} from '@ontologies/core';

import { HexPosition } from './HexPosition';

export type LineParser = (line: string[]) => Quad;

export const createLineParser = (rdfFactory: DataFactory = rdf): LineParser => {
  const bnMap: { [s: string]: BlankNode } = {};
  // Skip the (expensive) proxy object when parsing
  const quad = rdfFactory.quad.bind(rdfFactory);
  const literal = rdfFactory.literal.bind(rdfFactory);
  const namedNode = rdfFactory.namedNode.bind(rdfFactory);
  const blankNodeF = rdfFactory.blankNode.bind(rdfFactory);
  const defaultGraph = rdfFactory.defaultGraph.bind(rdfFactory);

  const blankNode = (v: string): BlankNode => {
    if (!bnMap[v]) {
      bnMap[v] = blankNodeF();
    }

    return bnMap[v];
  };

  const object = (v: string, dt: string, l: string): SomeTerm => {
    if (l) {
      return literal(v, l);
    } else if (dt === "globalId") {
      return namedNode(v);
    } else if (dt === "localId") {
      return blankNode(v);
    }

    return literal(v, namedNode(dt));
  };

  return (h: string[]): Quad => quad(
    h[HexPosition.Subject].startsWith("_:") ? blankNode(h[HexPosition.Subject]) : namedNode(h[HexPosition.Subject]),
    namedNode(h[HexPosition.Predicate]),
    object(h[HexPosition.Value], h[HexPosition.Datatype], h[HexPosition.Language]),
    h[HexPosition.Graph] ? namedNode(h[HexPosition.Graph]) : defaultGraph(),
  );
}
