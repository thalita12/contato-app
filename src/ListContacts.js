import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import {Glyphicon, Panel, Navbar, Button, FormControl, FormGroup, ControlLabel, Modal} from 'react-bootstrap'
import ImageInput from './utils/ImageInput'
import serializeForm from 'form-serialize'

class ListContacts extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            show: false
        };
    }

    static propTypes = {
        contacts: PropTypes.array.isRequired,
        onDeleteContact: PropTypes.func.isRequired
    }

    state = {
        query: ''
    }

    updateQuery = (query) => {
        this.setState({query: query.trim()})
    }

    clearQuery = () => {
        this.setState({query: ''})
    }

    handleHide() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const values = serializeForm(e.target, { hash: true })
        if (this.props.onCreateContact)
            this.props.onCreateContact(values)
    }

    render() {
        const {contacts, onDeleteContact} = this.props
        const {query} = this.state

        let showingContacts
        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i')
            showingContacts = contacts.filter((contact) => match.test(contact.name))
        } else {
            showingContacts = contacts
        }

        showingContacts.sort(sortBy('name'))

        return (
            <div className=''>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#home">Contatos</a>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Navbar.Form pullLeft>
                            <FormGroup>
                                <FormControl type="text" placeholder="Buscar" value={query}
                                             onChange={(event) => this.updateQuery(event.target.value)}/>
                            </FormGroup>
                        </Navbar.Form>
                        <Navbar.Form pullRight>
                            <Button bsStyle="primary" onClick={() => this.setState({ show: true })}>
                                <Glyphicon glyph="plus"/> Novo contato
                            </Button>
                            <Link
                                to='/create'
                            ><Glyphicon glyph="plus"/> Novo contato</Link>
                        </Navbar.Form>
                    </Navbar.Collapse>
                </Navbar>

                {showingContacts.length !== contacts.length && (
                    <div className='text-center'>
                        <span>Exibindo {showingContacts.length} de {contacts.length} no total</span><br/>
                        <Button bsStyle="info" onClick={this.clearQuery}>Exibir tudo</Button>
                    </div>
                )}

                <div className='container'>
                    {showingContacts.map((contact) => (
                        <Panel key={contact.id}>
                            <Panel.Body className='d-flex'>
                                <div className='contact-avatar' style={{
                                    backgroundImage: `url(${contact.avatarURL})`
                                }}/>
                                <div className='contact-details'>
                                    <p><strong>{contact.name}</strong></p>
                                    <p>{contact.email}</p>
                                </div>
                                <Button bsStyle="danger" onClick={() => onDeleteContact(contact)} bsSize="small">
                                    <Glyphicon glyph="trash"/>
                                </Button>
                            </Panel.Body>
                        </Panel>
                    ))}
                </div>

                <Modal
                    show={this.state.show}
                    onHide={this.handleHide}
                    container={this}
                    aria-labelledby="contained-modal-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">
                            Novo contato
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.handleSubmit}>
                            <ImageInput
                                className='create-contact-avatar-input'
                                name='avatarURL'
                                maxHeight={64}
                            />
                            <FormGroup
                                controlId="formBasicText">
                                <ControlLabel>Nome</ControlLabel>
                                <FormControl
                                    type="text"/>
                            </FormGroup>
                            <FormGroup
                                controlId="formBasicText">
                                <ControlLabel>E-mail</ControlLabel>
                                <FormControl
                                    type="email"/>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success">Salvar</Button>
                        <Button onClick={this.handleHide}>Fechar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ListContacts