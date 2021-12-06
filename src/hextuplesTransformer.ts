import rdf, { Quad } from '@ontologies/core';
// @ts-ignore
import NdjsonStream from 'can-ndjson-stream';

import { createLineParser } from './createLineParser';
import { hextupleStringParser } from './hextupleStringParser';

let hasReadableStreamConstructor = false;

try {
  // tslint:disable-next-line:typedef no-empty no-unused-expression
  new ReadableStream({ start() {} });
  hasReadableStreamConstructor = true;
} catch (e) {
  // ignore
}

export const hextuplesTransformer = async (
  res: Response | XMLHttpRequestResponseType | { body: string } | { responseText: string },
  rdfFactory = rdf,
): Promise<Quad[]> => {
  const delta: Quad[] = [];
  let parse;

  if (res instanceof Response && hasReadableStreamConstructor) {
    const stream = new NdjsonStream(res.body);
    const reader = stream.getReader();
    const lineToQuad = createLineParser(rdfFactory);

    let read: any;
    parse = reader
      .read()
      .then(read = (result: { done: boolean, value: string[] }): undefined => {
        if (result.done) {
          return;
        }

        delta.push(lineToQuad(result.value));

        return reader.read().then(read);
      });
  } else {
    let body;

    if (res instanceof Response) {
      body = res.text();
    } else if (typeof XMLHttpRequest !== "undefined"
      && res instanceof XMLHttpRequest
      || typeof (res as any).responseText === "string") {
      body = Promise.resolve((res as XMLHttpRequest).responseText);
    } else {
      if (typeof (res as any).body !== "string") {
        throw Error("Unsupported input format")
      }
      body = Promise.resolve((res as any).body);
    }

    parse = body
      .then((text) => {
        delta.push(...hextupleStringParser(text))
      });
  }

  await parse;

  return delta;
};
