import { Component } from 'substance'
import ImageCropper from './ImageCropper'
import ImageMetadata from './ImageMetadata'

/*
  Intended to be used in Ximimage and Ximteaser and other content types
  that include an imageFile property.
*/
class ImageDisplay extends Component {
    didMount() {
        this.handleActions({
            closeModal: this._closeDialog
        })
    }

    render($$) {
        let node = this.props.node
        let el = $$('div').addClass('sc-image-display')
        el.addClass('sm-'+this.props.isolatedNodeState)
        let imgSrc = node.getUrl()
        let Button = this.getComponent('button')
        let Modal = this.getComponent('modal')
        let DialogClass = this.state.DialogClass

        let imgContainer = $$('div').addClass('se-image-container')

        if (imgSrc) {
            imgContainer.append(
                $$('img', { src: imgSrc }).ref('img')
            )
        }

        // Actions
        imgContainer.append(
            $$('div').addClass('se-actions').append(
                $$(Button, {
                    icon: 'upload'
                }).on('click', this._replaceImage),
                $$(Button, {
                    icon: 'image'
                }).on('click', this._openMetaData),
                $$(Button, {
                    icon: 'crop'
                }).on('click', this._openCropper)
            )
        )

        el.append(imgContainer)

        /* Invisible file input element */
        el.append(
            $$('input')
                .attr('type', 'file')
                .ref('fileInput')
                .on('change', this._onFileSelected)
        )

        // Render dialog if open
        if (DialogClass) {
            el.append(
                $$(Modal, {
                    width: 'medium',
                    textAlign: 'center'
                }).append(
                    $$(DialogClass, {
                        node: node
                    })
                )
            )
        }
        return el
    }

    _replaceImage() {
        this.refs.fileInput.click()
    }

    _onFileSelected(e) {
        let file = e.currentTarget.files[0]
        let nodeId = this.props.node.id
        let oldFileId = this.props.node.imageFile
        this.context.editorSession.transaction((tx) => {
            // create a new file node and replace the old one
            var newFile = tx.create({
                type: 'npfile',
                fileType: 'image',
                data: file
            })
            tx.set([nodeId, 'imageFile'], newFile.id)
            tx.delete(oldFileId)
        })
    }

    _closeDialog() {
        this.setState({
            DialogClass: null
        })
    }

    _openMetaData() {
        this.setState({
            DialogClass: ImageMetadata
        })
    }

    _openCropper() {
        this.setState({
            DialogClass: ImageCropper
        })
    }
}

export default ImageDisplay

