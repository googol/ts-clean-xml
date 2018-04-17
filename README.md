# Clean xml parser

An xml parser with a clean predictable object model, created for use with typescript (but can be used with plain javascript too).

## Installation

Just install from npm. You will also need the `ts-optional-type` package for the return type of some of the selectors, and `ts-optionals` for functions that manipulate those types:

```sh
npm install ts-clean-xml ts-optionals ts-optional-type
```

## Usage

### Parsing

Use the `parseString` function to parse some xml content:

```ts
import { parseString } from 'ts-clean-xml';

const xmlString = '<element attribute="value">Text</element>';

parseString(xmlString)
.then(xmlObject => console.log(xmlObject));
```

`parseString` returns a Promise that will resolve with an `XmlElement`.

### Using the model

#### XmlElement

Represents an xml element.
You can access an elements `name`, `children` and `attributes`.
Note that the children can be a mix of other elements, and TextNodes.
The name is a fully qualified xml name, in the form of an `XmlName` object.

You can create `XmlElement` objects conveniently with the `element` function.

#### Attribute

An attribute on an xml element.
An attribute has a name and a value.
The name is a fully qualified xml name, in the form of an `XmlName` object.

You can create `Attribute` objects conveniently with the `attribute` function.

#### TextNode

A TextNode is a span of text inside an element.
They can be mixed with elements in some xml markups.

You can create `TextNode` objects conveniently with the `text` function.

#### XmlName

An XmlName represents a fully qualified xml name.
It has a namespace, which is most commonly a URI, and a local name.
The namespace can be an empty string, if the XML markup doesn't have a namespace.

You can create 'global' names, that is names without a namespace, with the `globalName` function.
You can create namespaced name creation functions with the `namespaced` function, like so:

```ts
const xhtml = namespaced('http://www.w3.org/1999/xhtml');
const h1Name = xhtml('h1');
const pName = xhtml('p');
```

The `element` and `attribute` functions also accept a string in the place of an `XmlName`, in which case a non-namespaced global name is created.

### Query helpers

To make common actions simpler, the library includes some helper functions.

#### Predicates¨

`isXmlElement`: returns true if the given `XmlElement` or `TextNode` is an `XmlElement`.
For typescript this works as a type guard.

`isTextNode`: returns true if the given `XmlElement` or `TextNode` is a `TextNode`.
For typescript this works as a type guard.

`hasName`: takes a name (`XmlName` or string) and an `XmlElement` or an `Attribute` and returns true if the name matches the element or attribute.

`hasAttribute`: takes an attribute name (`XmlName` or string) and an `XmlElement` and returns true if the element has an attribute with the given name.

`hasAttributeValue`: takes a string value, an attribute name (`XmlName` or string) and an `XmlElement` and returns true if the element has an attribute with the given name and value.

`hasTextValue`: takes a string value and an `XmlElement`, and returns true if the given value is the only content of the element.

`hasSingleChildMatching`: takes a predicate and an `XmlElement` and returns true if the element has exactly one child element matching the predicate

`hasAnyChildMatching`: takes a predicate and an `XmlElement` and returns true if the element has at least one element matching the predicate

#### Selectors

`getChildElements`: returns all children that are elements for a given `XmlElement`.

`getChildElementsMatching`: returns all children that are elements for a given `XmlElement` that match the given predicate.

`getChildElementsNamed`: returns all children that are elements for a given `XmlElement` that have the given name.

`getFirstChildElement`: returns the first child element of the given `XmlElement` or `None` if there are no children

`getFirstChildElementMatching`: returns the first child element of the given `XmlElement` that matches the given predicate, or `None` if there are no matching child elements

`getFirstChildElementNamed`: returns the first child element of the given `XmlElement` that has the given name, or `None` if there are no child elements with that name

`getSingleChildElement`: returns the only child element of the given `XmlElement` or `None` if there are no or multiple children

`getSingleChildElementMatching`: returns the only child element of the given `XmlElement` that matches the given predicate, or `None` if there are none or multiple child matching elements

`getSingleChildElementNamed`: returns the only child element of the given `XmlElement` that has the given name, or `None` if there are none or multiple child elements with that name

`getChildElementsByPath`: given a list of names and a starting element, returns the elements that are at the end of the path formed by selecting the children named by the next name in the name list

`getDescendantNodes`: returns all descendant nodes for a given element, that is, all child nodes of the element, and their chidren etc. Walks through the nodes in depth first order.

`getDescendantElements`: returns all descendant elements for a given element, that is, all child elements of the element, and their chidren etc. Walks through the nodes in depth first order.

`getDescendantElementsNamed`: returns all descendant elements matching the given name for a given element. Walks through the nodes in depth first order.

`getContainedText`: returns all text content inside a given element, in depth first order. Like `Node.textContent` in the DOM.

`getAttribute`: returns the attribute with the given name on the given element. Returns `None` if the element doesn't have an attribute matching the name.

`getAttributeValue`: returns the value of an attribute with the given name on the given element. Returns `None` if the element doesn't have an attribute matching the name.
