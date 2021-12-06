import rdf, { DataFactory, Quad } from '@ontologies/core';
import { createLineParser } from './createLineParser';

export const hextupleStringParser = (bodyString: string, rdfFactory: DataFactory = rdf): Quad[] => {
  const lineToQuad = createLineParser(rdfFactory)
  const delta: Quad[] = [];

  for (const line of bodyString.split("\n")) {
    if (line.length > 0) {
      delta.push(lineToQuad(JSON.parse(line)));
    }
  }

  return delta
}
