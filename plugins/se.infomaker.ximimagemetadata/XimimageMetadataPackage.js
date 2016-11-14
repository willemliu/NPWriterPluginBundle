import XimimageMetadataComponent from './XimimageMetadataComponent'

export default {
    name: 'ximimagemetadata',
    id: 'se.infomaker.ximimagemetadata',
    configure: function (config) {
        config.addComponent('ximimagemetadata', XimimageMetadataComponent)
    }
}