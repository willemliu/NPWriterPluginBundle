import {Tool} from 'substance'
import {api} from 'writer'

class XimteaserTool extends Tool {

    render($$) {

        const el = $$('div')
        el.attr('title', this.getLabel('Insert Teaser'))

        el.append(
            $$('button').addClass('se-tool').append(
                $$('i').addClass('fa fa-newspaper-o')
            )
                .on('click', this.insertTeaser)
        );
        return el;

    }

    insertTeaser() {

        const commandName = this.getCommandName()
        api.editorSession.executeCommand(commandName, {
            test: "hello"
        })
    }
}
export default XimteaserTool