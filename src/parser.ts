import { parseString as parseString_, OptionsV2 } from 'xml2js';
import { XmlElement } from './model';

const xmlOptions: OptionsV2 = {
    xmlns: true,
    explicitArray: true,
    explicitChildren: true,
    preserveChildrenOrder: true,
    charsAsChildren: true,
    explicitCharkey: false,
    explicitRoot: false,
};

export function parseString(xmlString: string): Promise<XmlElement> {
    return new Promise((resolve, reject) => {
        parseString_(xmlString, xmlOptions, (err, resultObj) => {
            if (err) {
                reject(err);
            } else {
                resolve(resultObj);
            }
        });
    });
}
