import {Component} from 'substance'
import lodash from 'lodash'

var find = lodash.find
var clone = lodash.clone

class AvatarComponent {

    constructor(...args) {
        super(...args)

        this.isLoaded = false;
        this.loadedAvatar = {};
    }

    dispose() {
        if(this.ajaxRequest) {
            this.ajaxRequest.abort();
        }
        Component.prototype.dispose.call(this);
    };


    getInitialState() {
        return {
            url: this.context.api.router.getEndpoint()+'/asset/dummy.svg',
            avatarIsWaitingToLoad: true
        }

    }

    notFound() {
        this.extendState({
            useDummyAvatar: true,
            avatarIsWaitingToLoad: false
        })
        this.send('avatarLoaded', clone(this.state))
    }

    loadAvatar() {
        if (!this.props.links) {
            return this.notFound()
        }
        
        var twitterLink = find(this.props.links.link, function(link) {
            return link['@type'] === 'x-im/social+twitter'
        })
        if(!twitterLink) {
            return this.notFound()
        }

        var endPointUrl = this.context.api.router.getEndpoint()
        var twitter = twitterLink['@url'].match(/twitter\.com\/(\w+)/)
        if(twitter === null) {
            return this.notFound()
        }
        var path = '/api/concepts/author/'+twitter[1]+'/thumbnail'

        this.ajaxRequest = $.ajax(endPointUrl+path, {
            contentType: 'text/html',
            dataType: 'html'
        }).done(function(data) {
            this.extendState({
                url: data,
                avatarIsWaitingToLoad: false,
                useDummyAvatar: false
            });
            this.send('avatarLoaded', clone(this.state));
        }.bind(this)).error(function(e, xhr, text) {
            this.notFound();
            console.log("E", e, xhr, text);
        }.bind(this));
    }



    render($$) {
        if(this.state.avatarIsWaitingToLoad) {
            this.loadAvatar();
        }
        return $$('img').addClass('avatar').attr('src', this.state.url);
    }

}

export default AvatarComponent
