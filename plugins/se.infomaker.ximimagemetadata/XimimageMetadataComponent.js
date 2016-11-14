import {Component, FontAwesomeIcon} from 'substance'
import jxon from 'jxon'
import NilUUID from 'NilUUID'
import Avatar from './AvatarComponent'

class XimimageMetadataComponent {

    constructor(...args) {
        super(...args)

        this.authors = []
        this.dom = null
        this.data = null
        this.parsing = false
    }

    dispose() {
        Component.prototype.dispose.call(this)
    }

    render($$) {
        var el = $$('div')

        if (this.parsing === false) {
            this.parseData()
        }

        var p = $$('p')

        if (this.data.width) {
            p.append($$('span').addClass('dialog-image-width').append(
                this.data.width + ' px'
            ))
        }

        if (this.data.height) {
            p.append($$('span').addClass('dialog-image-height').append(
                this.data.height + ' px'
            ))
        }

        var dt = new Date(this.data.photoDateTime)
        p.append([
            $$('strong').append(this.getLabel("Photo date")),
            $$('span').addClass('dialog-image-photo-date').append(
                $$('input').attr('id', 'dialog-image-photo-date').attr('type', 'date').val(
                    !isNaN(dt.getTime()) ? dt.toLocaleDateString() : ''
                ).on('change', function () {
                    this.syncPhotoDate()
                }.bind(this))
            ),
            $$('span').addClass('dialog-image-photo-time').append(
                $$('input').attr('id', 'dialog-image-photo-time').attr('type', 'time').val(
                    !isNaN(dt.getTime()) ? dt.toLocaleTimeString() : ''
                ).on('change', function () {
                    this.syncPhotoDate()
                }.bind(this))
            )
        ])

        dt = new Date(this.data.firstCreated)
        if (!isNaN(dt.getTime())) {
            p.append([
                $$('strong').append(this.getLabel("Imported")),
                $$('span').addClass('dialog-image-create-date').append(
                    dt.toLocaleDateString()
                ),
                $$('span').addClass('dialog-image-create-time').append(
                    dt.toLocaleTimeString()
                )
            ])
        }

        p.append(
            this.renderStatus(this.data.pubStatus)
        )

        el.append(
            $$('div').append(
                $$('img').attr('src', this.data.url)
            ).append(p)
        )

        var form = $$('form').append(
            $$('fieldset').addClass('form-group').append([
                $$('div').addClass('form-group').append(
                    $$('textarea')
                        .on('change', function (evt) {
                            this.data.text = evt.target.value
                        })
                        .attr('id', 'dialog-image-info-caption')
                        .addClass('form-control')
                        .attr({
                            rows: 3,
                            placeholder: this.getLabel("Image description")
                        })
                        .append(
                            this.data.text
                        )
                    //     ,
                    // $$('label').append(
                    //     this.getLabel("Image description")
                    // )
                ),

                this.renderAuthorContainer(),

                $$('div').addClass('form-group flexible-label').append(
                    $$('input')
                        .on('change', function (evt) {
                            this.data.credit = evt.target.value
                        })
                        .addClass('form-control')
                        .attr({
                            required: 'required',
                            type: 'text',
                            id: 'dialog-image-info-credit',
                            placeholder: this.getLabel('Credit')
                        })
                        .val(this.data.credit),
                    $$('label')
                        .attr('for', 'dialog-image-info-credit')
                        .append(
                            this.getLabel('Credit')
                        )
                ),

                $$('div').addClass('form-group flexible-label').append(
                    $$('input')
                        .on('change', function (evt) {
                            this.data.instructions = evt.target.value
                        })
                        .addClass('form-control')
                        .attr({
                            required: 'required',
                            type: 'text',
                            id: 'dialog-image-info-instructions',
                            placeholder: this.getLabel('Instructions')
                        })
                        .val(this.data.instructions),
                    $$('label')
                        .attr('for', 'dialog-image-info-instructions')
                        .append(
                            this.getLabel('Instructions')
                        )
                ),

                $$('div').addClass('form-group flexible-label').append(
                    $$('input')
                        .on('change', function (evt) {
                            this.data.objectName = evt.target.value
                        })
                        .addClass('form-control')
                        .attr({
                            required: 'required',
                            type: 'text',
                            id: 'dialog-image-info-objectname',
                            placeholder: this.getLabel('Object name')
                        })
                        .val(this.data.objectName),
                    $$('label')
                        .attr('for', 'dialog-image-info-objectname')
                        .append(
                            this.getLabel('Object name')
                        )
                )
            ])
        )


        el.addClass('dialog-image-info')
        el.append(form)

        return el
    }

    renderAuthorContainer() {
        var el = $$('div')
            .ref('authorContainer')
            .addClass('authors dialog-image-info clearfix')

        var searchUrl = null
        if (this.props.disablebylinesearch !== true) {
            searchUrl = this.context.api.router.getEndpoint() + '/api/search/concepts/authors?q='
        }

        const AuthorSearchComponent = this.context.componentRegistry.get('form-search')

        var searchComponent = $$(AuthorSearchComponent, {
            existingItems: this.authors,
            searchUrl: searchUrl,
            onSelect: this.addAuthor.bind(this),
            onCreate: function (item) {
                this.createAuthor(item)
            }.bind(this),
            createAllowed: true,
            placeholderText: this.getLabel("Add creator")
        }).ref('authorSearchComponent')


        return el.append([
            searchComponent,
            this.renderAuthors()
        ])
    }


    renderAuthors() {
        var authorList = $$('ul')
            .addClass('dialog-image-authorlist')
            .attr('contenteditable', false)

        for (var n = 0; n < this.authors.length; n++) {
            var authorItem = this.renderAuthor(this.authors[n])
            if (authorItem) {
                authorList.append(authorItem)
            }
        }

        return $$('div')
            .addClass('dialog-image-authors')
            .append(
                authorList
            )
    }

    renderAuthor(author) {
        var avatar,
            ref

        if (author.uuid && !NilUUID.isNilUUID(author.uuid)) {
            avatar = $$('div')
                .addClass('avatar__container')
                .ref('avatarContainer')
                .append(
                    $$(Avatar, {
                        links: author.links
                    }).ref('avatar')
                )
            ref = 'item-' + author.uuid
        }
        else {
            avatar = $$('span')
            ref = 'item-' + author.name
        }

        return $$('li').append(
            $$('div').append([
                avatar,
                $$('div').append([
                    $$('strong').append(author.name),
                    $$('em').append(author.data && author.data.email ? author.data.email : '')
                ]),
                $$('span').append(
                    $$('a').append(
                        $$(Icon, {icon: 'fa-times'})
                    )
                        .attr('title', this.getLabel('Remove'))
                        .on('click', function () {
                            this.removeAuthor(author)
                        }.bind(this))
                )
            ])
        ).ref(ref)
    }

    renderStatus(pubStatus) {
        var txtStatus = ''

        switch (pubStatus) {
            case 'stat:withheld':
                txtStatus = 'Not published'
                break

            case 'imext:done':
                txtStatus = 'Pending approval'
                break

            case 'stat:usable':
                txtStatus = 'Published'
                break

            case 'stat:canceled':
                txtStatus = 'Unpublished'
                break

            default:
                txtStatus = 'Not published'
        }

        return $$('div').append(
            $$('strong')
                .addClass('dialog-image-status')
                .append(
                    this.getLabel(txtStatus)
                )
        )
    }

    addAuthor(authorItem) {
        this.fetchAuthor(authorItem.uuid, function (author) {
            this.authors.push(author)
            this.rerender()
        }.bind(this), true)
    }

    createAuthor(authorItem, rerender) {
        var name = authorItem.inputValue ? authorItem.inputValue : authorItem.name
        var author = {
            uuid: NilUUID.getNilUUID(),
            name: name,
            data: {
                email: ''
            }
        }

        this.authors.push(author)

        if (rerender !== false) {
            this.rerender()
        }
    }

    removeAuthor(author) {
        var ref,
            id
        if (author.uuid && !NilUUID.isNilUUID(author.uuid)) {
            ref = 'item-' + author.uuid
            id = author.uuid
        }
        else {
            ref = 'item-' + author.name
            id = author.name
        }

        var el = this.refs[ref]
        delete this.refs[ref]

        $(el.el).fadeOut(300, function () {
            for (var n = 0; n < this.authors.length; n++) {
                var cmpid
                if (author.uuid && !NilUUID.isNilUUID(author.uuid)) {
                    cmpid = author.uuid
                }
                else {
                    cmpid = author.name
                }
                if (cmpid == id) {
                    this.authors.splice(n, 1)
                    break
                }
            }
        }.bind(this))
    }

    /**
     * @todo: Use current time zone offset, not preset to Stockholm
     */
    syncPhotoDate() {
        var photoDate = $('#dialog-image-photo-date').val(),
            photoTime = $('#dialog-image-photo-time').val(),
            dt = new moment(photoDate + 'T' + photoTime)

        if (typeof dt == 'string') {
            return null
        }

        try {
            this.data.photoDateTime = dt.format()
        }
        catch (ex) {
            return null
        }

        return this.data.photoDateTime
    }

    onClose(status) {
        if (status != 'save') {
            return
        }

        var xmlSerializer = new XMLSerializer(), /* jshint ignore:line */
            text = this.dom.querySelector('contentMeta > metadata > object > data > text'),
            credit = this.dom.querySelector('contentMeta > metadata > object > data > credit'),
            objectName = this.dom.querySelector('contentMeta > metadata > object > data > objectName'),
            instructions = this.dom.querySelector('contentMeta > metadata > object > data > instructions'),
            photoDateTime = this.dom.querySelector('contentMeta > metadata > object > data > photoDateTime'),
            itemMeta = this.dom.querySelectorAll('itemMeta'),
            links = this.dom.querySelectorAll('itemMeta > links'),
            authors = this.dom.querySelectorAll('itemMeta > links > link[rel="author"]')

        if (!links || !links.length) {
            links = this.dom.createElement('links')
            itemMeta[0].appendChild(links)
        }
        else {
            links = links[0]
        }

        var data = this.dom.querySelector('contentMeta > metadata > object > data')
        this.addOrUpdateSimpleNode(data, text, 'text', $('#dialog-image-info-caption').val())
        this.addOrUpdateSimpleNode(data, credit, 'credit', $('#dialog-image-info-credit').val())
        this.addOrUpdateSimpleNode(data, instructions, 'instructions', $('#dialog-image-info-instructions').val())
        this.addOrUpdateSimpleNode(data, objectName, 'objectName', $('#dialog-image-info-objectname').val())

        var dtString = this.syncPhotoDate()
        if (null === dtString) {
            if (photoDateTime) {
                data.removeChild(photoDateTime)
            }
        }
        else {
            this.addOrUpdateSimpleNode(
                data,
                photoDateTime,
                'photoDateTime',
                dtString
            )
        }

        for (var x = 0; x < authors.length; x++) {
            links.removeChild(authors[x])
        }

        for (var n = 0; n < this.authors.length; n++) {
            var link = this.dom.createElement('link')
            link.setAttribute('rel', 'author')
            link.setAttribute('title', this.authors[n].name)

            if (this.authors[n].uuid && !NilUUID.isNilUUID(this.authors[n].uuid)) {
                link.setAttribute('type', 'x-im/author')
                link.setAttribute('uuid', this.authors[n].uuid)
            }
            else {
                link.setAttribute('uuid', NilUUID.getNilUUID())
            }

            links.appendChild(link)
        }

        var xml = xmlSerializer.serializeToString(this.dom)
        this.saveImageData(
            this.data.uuid,
            xml
        )
    }

    addOrUpdateSimpleNode(parent, node, name, value) {
        if (node) {
            node.textContent = value
        }
        else {
            node = this.dom.createElement(name)
            node.textContent = value
            parent.appendChild(node)
        }
    }

    /*globals DOMParser */
    parseData() {
        this.parsing = true

        var domParser = new DOMParser()
        this.dom = domParser.parseFromString(this.props.newsItem, "text/xml")

        var newsItem = this.dom.querySelector('newsItem'),
            authors = this.dom.querySelectorAll('itemMeta > links > link[rel="author"]'),
            text = this.dom.querySelector('contentMeta > metadata > object > data > text'),
            credit = this.dom.querySelector('contentMeta > metadata > object > data > credit'),
            objectName = this.dom.querySelector('contentMeta > metadata > object > data > objectName'),
            instructions = this.dom.querySelector('contentMeta > metadata > object > data > instructions'),
            photoDateTime = this.dom.querySelector('contentMeta > metadata > object > data > photoDateTime'),
            pubStatus = this.dom.querySelector('itemMeta > pubStatus'),
            width = this.dom.querySelector('contentMeta > metadata > object > data > width'),
            height = this.dom.querySelector('contentMeta > metadata > object > data > height'),
            firstCreated = this.dom.querySelector('itemMeta > firstCreated')

        if (authors && authors.length > 0) {
            for (var n = 0; n < authors.length; n++) {
                var author = {
                    uuid: authors[n].getAttribute('uuid'),
                    name: authors[n].getAttribute('title'),
                    data: {
                        email: ''
                    }
                }

                if (!author.name) {
                    author.name = this.getLabel('Unknown name')
                }

                if (author.uuid === null) {
                    author.uuid = NilUUID.getNilUUID()
                }

                if (NilUUID.isNilUUID(author.uuid)) {
                    this.createAuthor(author, false)
                }
                else {
                    this.addAuthor(author)
                }
            }
        }

        this.data = {
            uuid: newsItem.getAttribute('guid'),
            url: this.props.url,
            text: text ? text.textContent : '',
            credit: credit ? credit.textContent : '',
            objectName: objectName ? objectName.textContent : '',
            instructions: instructions ? instructions.textContent : '',
            pubStatus: pubStatus.getAttribute('qcode'),
            firstCreated: firstCreated ? firstCreated.textContent : '',
            photoDateTime: photoDateTime ? photoDateTime.textContent : '',
            width: width ? width.textContent : null,
            height: height ? height.textContent : null,
            authors: this.authors
        }
    }


    fetchAuthor(uuid, cbDone, fetchOnly) {
        this.ajaxRequest = this.context.api.router.ajax('GET', 'xml', '/api/newsitem/' + uuid, {imType: 'x-im/author'})
        this.ajaxRequest.done(function (data) {
            var conceptXML = data.querySelector('concept')
            var jsonFormat = jxon.build(conceptXML)
            var authorLinks = []
            try {
                authorLinks = jxon.build(data.querySelector('itemMeta links'))
            } catch (e) {
            }

            var author = {
                uuid: uuid,
                name: jsonFormat.name,
                data: jsonFormat.metadata.object.data,
                json: jsonFormat,
                links: authorLinks
            }

            if (fetchOnly === true) {
                cbDone(author)
            }
            else {
                // Check that we don't already have this
                for (var n = 0; n < this.authors.length; n++) {
                    if (this.authors[n].uuid === uuid) {
                        return
                    }
                }

                this.authors.push(author)
                if (cbDone) {
                    cbDone(this.authors)
                }
                this.rerender()
            }
        }.bind(this))
    }

    /**
     * Save image news item, called from image archive dialog
     */
    saveImageData(uuid, xml) {
        this.context.api.router.put('/api/newsitem/' + uuid, xml)
            .error(function (error, xhr, text) {
                console.error(error, xhr, text)
                alert(error)
            })
    }
}

export default XimimageMetadataComponent