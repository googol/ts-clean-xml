export interface XmlName {
    uri: string;
    local: string;
}

export type XmlNameSource = XmlName | string;

export interface XmlElement {
    type: 'element';
    children: ChildNode[];
    attributes: Attribute[];
    name: XmlName;
}

export interface TextNode {
    type: 'text';
    content: string;
}

export type ChildNode = XmlElement | TextNode;

export interface Attribute {
    type: 'attribute';
    name: XmlName;
    value: string;
}

export const isXmlElement = (node: ChildNode): node is XmlElement => node.type === 'element';
export const isTextNode = (node: ChildNode): node is TextNode => node.type === 'text';

export const namespaced = (namespaceUri: string) => (local: string): XmlName => ({ local, uri: namespaceUri });
export const globalName = namespaced('');
export const fromXmlNameSource = (name: XmlNameSource): XmlName => typeof name === 'string' ? globalName(name) : name;
