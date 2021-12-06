# Hextuples parser

This is a basic, but fast pure-js hextuples parser. It has no dependencies to node and can be
run in the browser.

# Installation

`yarn add hextuples @ontologies/core`

`npm i hextuples @ontologies/core`

## Usage
This was written as a faster n-quads parser for [link-lib](https://github.com/rescribet/link-lib)
and designed to work with [rdflib.js](http://github.com/linkeddata/rdflib.js).

The parser is already integrated into link-lib which can also consume
[linked-delta](https://purl.org/linked-delta) payloads in addition to plain n-quads.

If you're looking for a quick and easy way to build linked-data based RDF applications, check out
[link-redux](https://github.com/rescribet/link-redux).

Plain javascript:
```javascript
// Plain strings
const quads = await fetch(url)
  .then((req) => req.text())
  .then((body) => hextupleStringParser(body))

// Request stream if browser supports it
const quads = await fetch(url)
  .then((req) => hextuplesTransformer(body))

// RDFLib parser
const parser = new HextuplesRDFLibParser(rdflib)
parser.loadBuf(hexJsonString)
```
