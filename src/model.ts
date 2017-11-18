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

export const element = (name: XmlNameSource, attributes: Attribute[], children: ChildNode[]): XmlElement => ({
    type: 'element',
    name: fromXmlNameSource(name),
    attributes,
    children,
});

export const text = (content: string): TextNode => ({
    type: 'text',
    content,
});

export const attribute = (name: XmlNameSource, value: string): Attribute => ({
    type: 'attribute',
    name: fromXmlNameSource(name),
    value,
});

export const isXmlElement = (node: ChildNode): node is XmlElement => node.type === 'element';
export const isTextNode = (node: ChildNode): node is TextNode => node.type === 'text';

export const namespaced = (namespaceUri: string) => (local: string): XmlName => ({ local, uri: namespaceUri });
export const globalName = namespaced('');
export const fromXmlNameSource = (name: XmlNameSource): XmlName => typeof name === 'string' ? globalName(name) : name;
