import { Component } from 'substance'

/*
  Used in ImageDisplay
*/
class ImageMetadata extends Component {
    render($$) {
        let el = $$('div').addClass('sc-image-metadata')

        const ImageComponent = this.context.componentRegistry.get('ximimagemetadata')

        var component = $$(ImageComponent, {
            url: this.props.url,
            newsItem: this.props.newsItem,
            disablebylinesearch: this.props.bylinesearch ? false : true
        }).ref('imageMetadataComponent')

        el.append(component)
        return el
    }
}

export default ImageMetadata

