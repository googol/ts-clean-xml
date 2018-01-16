export interface XmlName {
    readonly uri: string;
    readonly local: string;
}

export type XmlNameSource = XmlName | string;

export interface XmlElement {
    readonly type: 'element';
    readonly children: ReadonlyArray<ChildNode>;
    readonly attributes: ReadonlyArray<Attribute>;
    readonly name: XmlName;
}

export interface TextNode {
    readonly type: 'text';
    readonly content: string;
}

export type ChildNode = XmlElement | TextNode;
export type ChildNodeSource = ChildNode | string;

export interface Attribute {
    readonly type: 'attribute';
    readonly name: XmlName;
    readonly value: string;
}

export const isXmlElement = (node: ChildNode): node is XmlElement => node.type === 'element';
export const isTextNode = (node: ChildNode): node is TextNode => node.type === 'text';

export const namespaced = (namespaceUri: string) => (local: string): XmlName => ({ local, uri: namespaceUri });
export const globalName = namespaced('');
export const fromXmlNameSource = (name: XmlNameSource): XmlName => typeof name === 'string' ? globalName(name) : name;

export const text = (content: string): TextNode => ({
    type: 'text',
    content,
});

const fromChildNodeSource = (children: ChildNodeSource[]): ChildNode[] => children.map((child): ChildNode =>
    typeof child === 'string'
        ? text(child)
        : child);

export const element = (name: XmlNameSource, attributes: Attribute[], children: ChildNodeSource[]): XmlElement => ({
    type: 'element',
    name: fromXmlNameSource(name),
    attributes,
    children: fromChildNodeSource(children),
});

export const attribute = (name: XmlNameSource, value: string): Attribute => ({
    type: 'attribute',
    name: fromXmlNameSource(name),
    value,
});
