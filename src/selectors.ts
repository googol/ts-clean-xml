import { XmlElement, XmlNameSource, ChildNode, isXmlElement, isTextNode, fromXmlNameSource } from './model';

export const hasName = (name: XmlNameSource) => (element: XmlElement): boolean => {
    const namespacedName = fromXmlNameSource(name);
    return element.$ns.uri === namespacedName.uri && element.$ns.local === namespacedName.local;
};

export const getChildElements = (element: XmlElement): XmlElement[] => element.$$.filter(isXmlElement) as XmlElement[];
export const getChildElementsNamed = (name: XmlNameSource) => (element: XmlElement): XmlElement[] => element.$$.filter(isXmlElement).filter(hasName(name));

export const getDescendantNodes = (element: XmlElement): ChildNode[] => {
    const stack: ChildNode[] = [element];
    const result: ChildNode[] = [];

    for (let current = stack.shift(); current !== undefined; current = stack.shift()) {
        if (isXmlElement(current)) {
            for (const child of getChildElements(current).reverse()) {
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
export const getContainedText = (element: XmlElement): string => getDescendantNodes(element).filter(isTextNode).map((node) => node._).join('');
