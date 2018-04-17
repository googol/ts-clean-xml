import { XmlElement, Attribute, XmlNameSource, ChildNode, isXmlElement, isTextNode, fromXmlNameSource } from './model';
import { chain, reduce, ReduceStep } from './array-functions';
import { pipe, F1, F2, F3, Predicate } from './function-helpers';
import * as O from 'ts-optionals';

export type Result<T> = O.Optional<T>;
export type ResultSet<T> = T[];

export const hasName: F2<XmlNameSource, XmlElement | Attribute, boolean> =
    (name) => (element) => {
        const namespacedName = fromXmlNameSource(name);
        return element.name.uri === namespacedName.uri && element.name.local === namespacedName.local;
    };

export const getChildElements: F1<XmlElement, ResultSet<XmlElement>> =
    (element) => element.children.filter(isXmlElement);

export const getChildElementsMatching: F2<Predicate<XmlElement>, XmlElement, ResultSet<XmlElement>> =
    (predicate) => (element) => element.children.filter(isXmlElement).filter(predicate);

export const getChildElementsNamed: F2<XmlNameSource, XmlElement, ResultSet<XmlElement>> =
    (name: XmlNameSource) => getChildElementsMatching(hasName(name));

export const getFirstChildElement: F1<XmlElement, Result<XmlElement>> =
    pipe(
        getChildElements,
        O.firstFromArray,
    );

export const getFirstChildElementMatching: F2<Predicate<XmlElement>, XmlElement, Result<XmlElement>> =
    (predicate) => pipe(
        getChildElementsMatching(predicate),
        O.firstFromArray,
    );

export const getFirstChildElementNamed: F2<XmlNameSource, XmlElement, Result<XmlElement>> =
    (name) => pipe(
        getChildElementsNamed(name),
        O.firstFromArray,
    );

export const getSingleChildElement: F1<XmlElement, Result<XmlElement>> =
    pipe(
        getChildElements,
        O.singleFromArray,
    );

export const getSingleChildElementMatching: F2<Predicate<XmlElement>, XmlElement, Result<XmlElement>> =
    (predicate) => pipe(
        getChildElementsMatching(predicate),
        O.singleFromArray,
    );

export const getSingleChildElementNamed: F2<XmlNameSource, XmlElement, Result<XmlElement>> =
    (name) => pipe(
        getChildElementsNamed(name),
        O.singleFromArray,
    );

export const getChildElementsByPath: F2<ReadonlyArray<XmlNameSource>, XmlElement, ResultSet<XmlElement>> =
    (names) => (element) => {
        const selectedElements = [element];
        const step: ReduceStep<XmlElement[], XmlNameSource> = (acc, name) => chain(getChildElementsNamed(name))(acc);

        return reduce(step)(selectedElements)(names);
    };

export const getSingleChildElementByPath: F2<ReadonlyArray<XmlNameSource>, XmlElement, Result<XmlElement>> =
    (names) => (element) => {
        const step: ReduceStep<Result<XmlElement>, XmlNameSource> = (acc, name) => O.chain(getSingleChildElementNamed(name))(acc);

        return reduce(step)(O.of(element))(names);
    };

export const getDescendantNodes: F1<XmlElement, ResultSet<ChildNode>> =
    (element) => {
        const stack: ChildNode[] = [element];
        const result: ChildNode[] = [];

        for (let current = stack.shift(); current !== undefined; current = stack.shift()) {
            if (isXmlElement(current)) {
                for (const child of Array.from(current.children).reverse()) {
                    stack.unshift(child);
                }
            }

            result.push(current);
        }

        return result;
    };

export const getDescendantElements: F1<XmlElement, ResultSet<XmlElement>> =
    (element) => getDescendantNodes(element).filter(isXmlElement);

export const getDescendantElementsNamed: F2<XmlNameSource, XmlElement, ResultSet<XmlElement>> =
    (name) => (element) => getDescendantNodes(element).filter(isXmlElement).filter(hasName(name));

/**
 * Gets contained text depth first
 */
export const getContainedText: F1<XmlElement, string> =
    (element) => getDescendantNodes(element).filter(isTextNode).map((node) => node.content).join('');

export const getAttribute: F2<XmlNameSource, XmlElement, Result<Attribute>> =
    (attributeName) => (element) => {
        const result = element.attributes.find(hasName(attributeName));
        return result !== undefined ? O.of(result) : O.None();
    };

export const getAttributeValue: F2<XmlNameSource, XmlElement, Result<string>> =
    (attributeName) => pipe(
        getAttribute(attributeName),
        O.map((attr) => attr.value),
    );

export const hasSingleChildMatching: F2<Predicate<XmlElement>, XmlElement, boolean> =
    (predicate) => pipe(
        getSingleChildElementMatching(predicate),
        O.isSome,
    );

export const hasAnyChildMatching: F2<Predicate<XmlElement>, XmlElement, boolean> =
    (predicate) => pipe(
        getFirstChildElementMatching(predicate),
        O.isSome,
    );

export const hasAttribute: F2<XmlNameSource, XmlElement, boolean> =
    (attributeName) => pipe(
        getAttribute(attributeName),
        O.isSome,
    );

export const hasAttributeValue: F3<string, XmlNameSource, XmlElement, boolean> =
    (attributeValue) => (attributeName) => pipe(
        getAttributeValue(attributeName),
        O.caseOf({
            some: (value) => value === attributeValue,
            none: () => false,
        }),
    );

export const hasTextValue: F2<string, XmlElement, boolean> =
    (value) => pipe(
        (e: XmlElement) => e.children,
        O.singleFromArray,
        O.caseOf({
            some: (single) => isTextNode(single) && single.content === value,
            none: () => false,
        }),
    );
