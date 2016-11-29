import {Component, FontAwesomeIcon} from 'substance'
import {api} from 'writer'


class SocialembedComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this.rerender, this, {path: [this.props.node.id]})
        this.context.api.document.triggerFetchResourceNode(this.props.node)

        /**
         *   // api.browser.addExternalScript('//platform.twitter.com/widgets.js').then(() => {
            //     twttr.widgets.load(this.refs.embedContent.el.el).then((e) => {
            //         setTimeout(() => {
            //             api.editorSession.transaction((tx) => {
            //                 tx.set([node.id, 'html'], this.refs.embedContent.el.el.innerHTML)
            //             })
            //         }, 500)
            //
            //     })
            // })
         */
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    render($$) {
        const node = this.props.node


        const el = $$('div')
            .addClass('socialembed__container')
            .addClass(node.socialChannel)
            .attr('contenteditable', false);


        // Only when HTML has been resolved
        if (node.hasPayload()) {

            const innerEl = $$('div').ref('embed-container')
            const headerEl = this.renderHeader($$, node)
            const contentEl = this.renderContent($$, node)

            innerEl.append([headerEl, contentEl])

            el.append(innerEl)

        } else if (node.errorMessage) {
            el.append(
                $$('div').addClass('se-error').append(
                    node.errorMessage
                )
            )
        } else {
            el.append($$(FontAwesomeIcon, {icon: 'fa-spin fa-refresh'}))
        }
        return el
    }

    renderContent($$, node) {
        return $$('div').ref('embedContent')
            .addClass('socialembed__content')
            .html(node.html)
    }

    renderHeader($$, node) {
        return $$('div')
            .append(
                $$('strong').append(
                    node.socialChannel
                )
                    .attr('contenteditable', false)
            )
            .addClass('header')
            .addClass(node.socialChannelIcon)
            .attr('contenteditable', false)
    }

    removeEmbed() {
        this.context.api.document.deleteNode('socialembed', this.props.node)
    }
}

SocialembedComponent.noStyle = true

export default SocialembedComponent
