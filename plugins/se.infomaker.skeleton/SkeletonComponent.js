import {Component} from 'substance'
import {api} from 'writer'

class Test extends Component {

    didMount() {

    }

    render($$) {
        return $$('div').css('padding', '1rem 2rem').css('height', '200px').append("HELLO WORLD").on('click', () => {
            this.send('close')
        })
    }

    onClose(action) { // eslint-disable-line no-unused-vars
        return true
    }
}

class SkeletonComponent extends Component {

    /**
     * Method called when component is disposed and removed from DOM
     */
    dispose() {
        // Perfect place to remove eventlisteners etc
    }

    /**
     * Constructor
     * @param args
     */
    constructor(...args) {
        super(...args)
    }


    /**
     *
     * @returns {{clickCount: number}}
     */
    getInitialState() {
        return {
            clickCount: 0
        }
    }

    didMount() {

    }


    /**
     * Render method is called whenever there's a change in state or props
     * @param $$
     * @returns {*}
     */
    render($$) {
        let el = $$('div').addClass('col-xs-1')

        el.append($$('h2').append(this.getLabel('skeleton-title')))
        el.append($$('p').append(String(this.state.clickCount)))

        let clickCount = this.state.clickCount

        let button = $$('button').on('click', () => {
            this.setState({
                clickCount: clickCount+1
            })
        }).append('Click me')

        const third = [{
            caption: "Third",
            callback: () => {
                return true;
            }
        }]

        let openDialog = $$('button').on('click', () => {

            api.ui.showDialog(Test, {}, {primary:"Go", secondary: "Cancel", tertiary: third})
        }).append('Open dialog')

        el.append(button)
        el.append(openDialog)

        return el
    }
}
export default SkeletonComponent