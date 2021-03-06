/*
    Anlyzes an arbitrary url and detects if the url represents a social embed
*/
import {lodash} from 'writer'

export default function embedInfoFromURL(url) {

    if(!lodash.isString(url)) {
        return { isEmbed: false }
    }

    let result = { isEmbed: true }
    if (url.indexOf('twitter') > 0) {
        result.socialChannel = 'twitter'
    } else if (url.indexOf('instagram') > 0) {
        result.socialChannel = 'instagram'
    } else if (url.indexOf('facebook') > 0) {
        result.socialChannel = 'facebook'
    } else if (url.indexOf('vimeo') > 0) {
        result.socialChannel = 'vimeo'
    } else if (url.indexOf('soundcloud') > 0) {
        result.socialChannel = 'soundcloud'
    } else {
        result.isEmbed = false
    }
    return result
}
