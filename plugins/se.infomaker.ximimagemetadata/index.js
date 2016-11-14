import './scss/ximimagemetadata.scss'

import XimimageMetadataPackage from './XimimageMetadataPackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(XimimageMetadataPackage)
    } else {
        console.info("Register method not yet available");
    }
}
