export const elementTypeTag = 'ts-clean-xml-element';
export const attributeTypeTag = 'ts-clean-xml-attribute';
export const textNodeTypeTag = 'ts-clean-xml-text';

export interface XmlName {
    readonly uri: string;
    readonly local: string;
}

export type XmlNameSource = XmlName | string;

export interface XmlElement {
    readonly type: typeof elementTypeTag;
    readonly children: ReadonlyArray<ChildNode>;
    readonly attributes: ReadonlyArray<Attribute>;
    readonly name: XmlName;
}

export interface TextNode {
    readonly type: typeof textNodeTypeTag;
    readonly content: string;
}

export type ChildNode = XmlElement | TextNode;
export type ChildNodeSource = ChildNode | string;

export interface Attribute {
    readonly type: typeof attributeTypeTag;
    readonly name: XmlName;
    readonly value: string;
}

export const isXmlElement = (node: ChildNode): node is XmlElement => node.type === elementTypeTag;
export const isTextNode = (node: ChildNode): node is TextNode => node.type === textNodeTypeTag;

export const namespaced = (namespaceUri: string) => (local: string): XmlName => ({ local, uri: namespaceUri });
export const globalName = namespaced('');
export const fromXmlNameSource = (name: XmlNameSource): XmlName => typeof name === 'string' ? globalName(name) : name;

export const text = (content: string): TextNode => ({
    type: textNodeTypeTag,
    content,
});

const fromChildNodeSource = (children: ChildNodeSource[]): ChildNode[] => children.map((child): ChildNode =>
    typeof child === 'string'
        ? text(child)
        : child);

export const element = (name: XmlNameSource, attributes: Attribute[], children: ChildNodeSource[]): XmlElement => ({
    type: elementTypeTag,
    name: fromXmlNameSource(name),
    attributes,
    children: fromChildNodeSource(children),
});

export const attribute = (name: XmlNameSource, value: string): Attribute => ({
    type: attributeTypeTag,
    name: fromXmlNameSource(name),
    value,
});
