import {
  DataFactory,
  LowLevelStore,
  QuadPosition,
  Quadruple,
} from '@ontologies/core';

import { hextupleStringParser } from './hextupleStringParser';

export class HextuplesRDFLibParser {
  public store: LowLevelStore;
  public rdfFactory: DataFactory;
  public errorHandler: (error: Error, quad: string) => void;

  constructor(store: LowLevelStore, errorHandler: (error: Error, quad: string) => void = console.error) {
    this.store = store;
    this.rdfFactory = store.rdfFactory;
    this.errorHandler = errorHandler;
  }

  loadBuf(str: string) {
    this.addArr(this.parseString(str));
  }

  parseString(str: string): Array<Quadruple|void> {
    return hextupleStringParser(str, this.rdfFactory).map((q) => [
      q.subject,
      q.predicate,
      q.object,
      q.graph,
    ])
  }

  addArr(quads: Array<Quadruple|void>): void {
    let q;
    for (let i = 0, len = quads.length; i < len; i++) {
      q = quads[i];
      if (q) {
        this.store.add(
          q[QuadPosition.subject],
          q[QuadPosition.predicate],
          q[QuadPosition.object],
          q[QuadPosition.graph],
        );
      }
    }
  }
}
