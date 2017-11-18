import { XmlElement, Attribute, XmlNameSource, ChildNode, isXmlElement, isTextNode, fromXmlNameSource } from './model';
import { chain, reduce } from './array-functions';

export const hasName = (name: XmlNameSource) => (element: XmlElement | Attribute): boolean => {
    const namespacedName = fromXmlNameSource(name);
    return element.name.uri === namespacedName.uri && element.name.local === namespacedName.local;
};

export const getChildElements = (element: XmlElement): XmlElement[] => element.children.filter(isXmlElement) as XmlElement[];
export const getChildElementsNamed = (name: XmlNameSource) => (element: XmlElement): XmlElement[] => element.children.filter(isXmlElement).filter(hasName(name));

export const getChildElementsByPath = (names: XmlNameSource[]) => (element: XmlElement): XmlElement[] => {
    const selectedElements = [element];
    const step = (acc: XmlElement[], name: XmlNameSource) => chain(getChildElementsNamed(name))(acc);

    return reduce(step)(selectedElements)(names);
};

export const getDescendantNodes = (element: XmlElement): ChildNode[] => {
    const stack: ChildNode[] = [element];
    const result: ChildNode[] = [];

    for (let current = stack.shift(); current !== undefined; current = stack.shift()) {
        if (isXmlElement(current)) {
            for (const child of current.children.reverse()) {
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

export const hasAttribute = (attributeName: XmlNameSource) => (element: XmlElement): boolean => getAttribute(attributeName)(element) !== undefined;
export const hasAttributeValue = (attributeValue: string) => (attributeName: XmlNameSource) => (element: XmlElement): boolean => getAttributeValue(attributeName)(element) === attributeValue;

export const hasTextValue = (value: string) => (element: XmlElement): boolean => {
    if (element.children.length !== 1) {
        return false;
    }
    const single = element.children[0];
    return single.type === 'text' && single.content === value;
};
