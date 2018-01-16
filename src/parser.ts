import { parseString as parseString_, OptionsV2 } from 'xml2js';
import { namespaced, element, attribute, text, XmlElement, TextNode, Attribute } from './model';

const xmlOptions: OptionsV2 = {
    xmlns: true,
    explicitArray: true,
    explicitChildren: true,
    preserveChildrenOrder: true,
    charsAsChildren: true,
    explicitCharkey: false,
    explicitRoot: false,
};

// tslint:disable-next-line:no-namespace
namespace Xml2JsShim {
    export const textNodeSpecifier: '__text__' = '__text__';
    export type TextNodeSpecifier = typeof textNodeSpecifier;

    export interface XmlName {
        uri: string;
        local: string;
    }

    // tslint:disable-next-line:no-shadowed-variable
    export interface XmlElement {
        $: Record<string, Attribute | undefined> | undefined;
        $$: ChildNode[] | undefined;
        '#name': string;
        $ns: XmlName;
    }

    // tslint:disable-next-line:no-shadowed-variable
    export interface TextNode {
        '#name': TextNodeSpecifier;
        _: string;
    }

    export type ChildNode = XmlElement | TextNode;

    // tslint:disable-next-line:no-shadowed-variable
    export interface Attribute {
        name: string;
        value: string;
        prefix: string;
        local: string;
        uri: string;
    }

    export const isTextNode = (child: ChildNode): child is TextNode => child['#name'] === textNodeSpecifier;
}

export function parseString(xmlString: string): Promise<XmlElement> {
    return new Promise((resolve, reject) => {
        parseString_(xmlString, xmlOptions, (err, resultObj: Xml2JsShim.XmlElement) => {
            if (err) {
                reject(err);
            } else {
                resolve(convertXmlElement(resultObj));
            }
        });
    });
}

function convertXmlElement({ $, $$, $ns }: Xml2JsShim.XmlElement): XmlElement {
    return element(
        namespaced($ns.uri)($ns.local),
        $ === undefined ? [] : convertAttributes($),
        $$ === undefined ? [] : $$.map((child) => Xml2JsShim.isTextNode(child) ? convertTextNode(child) : convertXmlElement(child)),
    );
}

function convertTextNode({ _ }: Xml2JsShim.TextNode): TextNode {
    return text(_);
}

function convertAttributes(attributes: Record<string, Xml2JsShim.Attribute | undefined>): Attribute[] {
    return Object.keys(attributes).map((key): Attribute => {
        const attr = attributes[key]!;

        return attribute(namespaced(attr.uri)(attr.local), attr.value);
    });
}
