import {FileNode} from 'substance'

class XimimageFileNode extends FileNode {
    constructor(...args) {
        super(...args)
    }

    handleDocument(xmlString) {
        console.log('handling document', xmlString);
        const parser = new DOMParser()
        let newsItemDOM = parser.parseFromString(xmlString, 'text/xml')
        let documentElement = newsItemDOM.documentElement
        let uuid = documentElement.getAttribute('guid')

        this.uuid = uuid
        this.uri = documentElement.querySelector('itemMeta > itemMetaExtProperty[type="imext:uri"]').getAttribute('value')

        // TODO Width, heigth, caption etc
    }

    getImType() {
        return 'x-im/image'
    }
}


XimimageFileNode.define({
    type: 'ximimagefile',
    uuid: {type: 'string', optional: true},
    url: {type: 'string', optional: true},
    uri: {type: 'string', optional: true},
    data: {type: 'object', optional: true},
    width: {type: 'number', optional: true},
    height: {type: 'number', optional: true},
    crops: {type: 'object', default: []}
})

export default XimimageFileNode