export const textNodeSpecifier: '__text__' = '__text__';
export type TextNodeSpecifier = typeof textNodeSpecifier;

export interface XmlName {
    uri: string;
    local: string;
}

export type XmlNameSource = XmlName | string;

export interface XmlElement {
    $: Record<string, Attribute | undefined> | undefined;
    $$: ChildNode[];
    '#name': string;
    $ns: XmlName;
}

export interface TextNode {
    '#name': TextNodeSpecifier;
    _: string;
}

export type ChildNode = XmlElement | TextNode;

export interface Attribute {
    name: string;
    value: string;
    prefix: string;
    local: string;
    uri: string;
}

export const isXmlElement = (node: ChildNode): node is XmlElement => node['#name'] !== textNodeSpecifier;
export const isTextNode = (node: ChildNode): node is TextNode => node['#name'] === textNodeSpecifier;

export const namespaced = (namespaceUri: string) => (local: string): XmlName => ({ local, uri: namespaceUri });
export const globalName = namespaced('');
export const fromXmlNameSource = (name: XmlNameSource): XmlName => typeof name === 'string' ? globalName(name) : name;
