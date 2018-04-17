import { XmlElement, Attribute, XmlNameSource, ChildNode, isXmlElement, isTextNode, fromXmlNameSource } from './model';
import { chain, reduce, ReduceStep } from './array-functions';
import { F1, F2, F3, Predicate } from './function-helpers';

export type Result<T> = T | undefined;
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
    (element) => {
        const childElements = getChildElements(element);
        if (childElements.length > 0) {
            return childElements[0];
        }
        return undefined;
    };

export const getFirstChildElementMatching: F2<Predicate<XmlElement>, XmlElement, Result<XmlElement>> =
    (predicate) => (element) => {
        const childElements = getChildElementsMatching(predicate)(element);
        if (childElements.length > 0) {
            return childElements[0];
        }
        return undefined;
    };

export const getFirstChildElementNamed: F2<XmlNameSource, XmlElement, Result<XmlElement>> =
    (name) => (element) => {
        const childElements = getChildElementsNamed(name)(element);
        if (childElements.length > 0) {
            return childElements[0];
        }
        return undefined;
    };

export const getSingleChildElement: F1<XmlElement, Result<XmlElement>> =
    (element) => {
        const childElements = getChildElements(element);
        if (childElements.length === 1) {
            return childElements[0];
        }
        return undefined;
    };

export const getSingleChildElementMatching: F2<Predicate<XmlElement>, XmlElement, Result<XmlElement>> =
    (predicate) => (element) => {
        const childElements = getChildElementsMatching(predicate)(element);
        if (childElements.length === 1) {
            return childElements[0];
        }
        return undefined;
    };

export const getSingleChildElementNamed: F2<XmlNameSource, XmlElement, Result<XmlElement>> =
    (name) => (element) => {
        const childElements = getChildElementsNamed(name)(element);
        if (childElements.length === 1) {
            return childElements[0];
        }
        return undefined;
    };

export const getChildElementsByPath: F2<ReadonlyArray<XmlNameSource>, XmlElement, ResultSet<XmlElement>> =
    (names) => (element) => {
        const selectedElements = [element];
        const step: ReduceStep<XmlElement[], XmlNameSource> = (acc, name) => chain(getChildElementsNamed(name))(acc);

        return reduce(step)(selectedElements)(names);
    };

export const getSingleChildElementByPath: F2<ReadonlyArray<XmlNameSource>, XmlElement, Result<XmlElement>> =
    (names) => (element) => {
        const step: ReduceStep<XmlElement | undefined, XmlNameSource> = (acc, name) => acc !== undefined ? getSingleChildElementNamed(name)(acc) : undefined;

        return reduce(step)(element)(names);
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
    (attributeName) => (element) => element.attributes.find(hasName(attributeName));

export const getAttributeValue: F2<XmlNameSource, XmlElement, Result<string>> =
    (attributeName) => (element) => {
        const attr = element.attributes.find(hasName(attributeName));
        return attr === undefined ? undefined : attr.value;
    };

export const hasSingleChildMatching: F2<Predicate<XmlElement>, XmlElement, boolean> =
    (predicate) => (element) => getSingleChildElementMatching(predicate)(element) !== undefined;

export const hasAnyChildMatching: F2<Predicate<XmlElement>, XmlElement, boolean> =
    (predicate) => (element) => getFirstChildElementMatching(predicate)(element) !== undefined;

export const hasAttribute: F2<XmlNameSource, XmlElement, boolean> =
    (attributeName) => (element) => getAttribute(attributeName)(element) !== undefined;

export const hasAttributeValue: F3<string, XmlNameSource, XmlElement, boolean> =
    (attributeValue) => (attributeName) => (element) => getAttributeValue(attributeName)(element) === attributeValue;

export const hasTextValue: F2<string, XmlElement, boolean> =
    (value) => (element): boolean => {
        if (element.children.length !== 1) {
            return false;
        }
        const single = element.children[0];
        return isTextNode(single) && single.content === value;
    };
