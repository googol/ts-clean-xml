import { XmlElement, Attribute, XmlNameSource, ChildNode, isXmlElement, isTextNode, fromXmlNameSource } from './model';
import { chain, reduce } from './array-functions';

export const hasName = (name: XmlNameSource) => (element: XmlElement | Attribute): boolean => {
    const namespacedName = fromXmlNameSource(name);
    return element.name.uri === namespacedName.uri && element.name.local === namespacedName.local;
};

export const getChildElements = (element: XmlElement): XmlElement[] => element.children.filter(isXmlElement);
export const getChildElementsMatching = (predicate: (element: XmlElement) => boolean) => (element: XmlElement): XmlElement[] => element.children.filter(isXmlElement).filter(predicate);
export const getChildElementsNamed = (name: XmlNameSource) => getChildElementsMatching(hasName(name));

export const getFirstChildElement = (element: XmlElement): XmlElement | undefined => {
    const childElements = getChildElements(element);
    if (childElements.length > 0) {
        return childElements[0];
    }
    return undefined;
};
export const getFirstChildElementMatching = (predicate: (element: XmlElement) => boolean) => (element: XmlElement): XmlElement | undefined => {
    const childElements = getChildElementsMatching(predicate)(element);
    if (childElements.length > 0) {
        return childElements[0];
    }
    return undefined;
};
export const getFirstChildElementNamed = (name: XmlNameSource) => (element: XmlElement): XmlElement | undefined => {
    const childElements = getChildElementsNamed(name)(element);
    if (childElements.length > 0) {
        return childElements[0];
    }
    return undefined;
};

export const getSingleChildElement = (element: XmlElement): XmlElement | undefined => {
    const childElements = getChildElements(element);
    if (childElements.length === 1) {
        return childElements[0];
    }
    return undefined;
};
export const getSingleChildElementMatching = (predicate: (element: XmlElement) => boolean) => (element: XmlElement): XmlElement | undefined => {
    const childElements = getChildElementsMatching(predicate)(element);
    if (childElements.length === 1) {
        return childElements[0];
    }
    return undefined;
};
export const getSingleChildElementNamed = (name: XmlNameSource) => (element: XmlElement): XmlElement | undefined => {
    const childElements = getChildElementsNamed(name)(element);
    if (childElements.length === 1) {
        return childElements[0];
    }
    return undefined;
};

export const getChildElementsByPath = (names: ReadonlyArray<XmlNameSource>) => (element: XmlElement): XmlElement[] => {
    const selectedElements = [element];
    const step = (acc: XmlElement[], name: XmlNameSource) => chain(getChildElementsNamed(name))(acc);

    return reduce(step)(selectedElements)(names);
};

export const getSingleChildElementByPath = (names: ReadonlyArray<XmlNameSource>) => (element: XmlElement): XmlElement | undefined => {
    const step = (acc: XmlElement | undefined, name: XmlNameSource) => acc !== undefined ? getSingleChildElementNamed(name)(acc) : undefined;

    return reduce(step)(element)(names);
};

export const getDescendantNodes = (element: XmlElement): ChildNode[] => {
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

export const getDescendantElements = (element: XmlElement): XmlElement[] => getDescendantNodes(element).filter(isXmlElement);
export const getDescendantElementsNamed = (name: XmlNameSource) => (element: XmlElement): XmlElement[] => getDescendantNodes(element).filter(isXmlElement).filter(hasName(name));

/**
 * Gets contained text depth first
 */
export const getContainedText = (element: XmlElement): string => getDescendantNodes(element).filter(isTextNode).map((node) => node.content).join('');

export const getAttribute = (attributeName: XmlNameSource) => (element: XmlElement): Attribute | undefined => element.attributes.find(hasName(attributeName));
export const getAttributeValue = (attributeName: XmlNameSource) => (element: XmlElement): string | undefined => {
    const attr = element.attributes.find(hasName(attributeName));
    return attr === undefined ? undefined : attr.value;
};

export const hasSingleChildMatching = (predicate: (element: XmlElement) => boolean) => (element: XmlElement): boolean => getSingleChildElementMatching(predicate)(element) !== undefined;
export const hasAnyChildMatching = (predicate: (element: XmlElement) => boolean) => (element: XmlElement): boolean => getFirstChildElementMatching(predicate)(element) !== undefined;

export const hasAttribute = (attributeName: XmlNameSource) => (element: XmlElement): boolean => getAttribute(attributeName)(element) !== undefined;
export const hasAttributeValue = (attributeValue: string) => (attributeName: XmlNameSource) => (element: XmlElement): boolean => getAttributeValue(attributeName)(element) === attributeValue;

export const hasTextValue = (value: string) => (element: XmlElement): boolean => {
    if (element.children.length !== 1) {
        return false;
    }
    const single = element.children[0];
    return isTextNode(single) && single.content === value;
};
