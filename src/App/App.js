import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import dummyStore from '../dummy-store';
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import './App.css';

import notefulContext from '../notefulContext';

class App extends Component {
    state = {
        notes: [],
        folders: [],
        error: null
    };

    fetchNotes() {
        return(
            fetch('http://localhost:9090/notes')
            .then(resp => {
                if(resp.ok) {
                    return resp.json();
                }
                return Promise.reject('Error fetching notes from server!');
            })
            .catch(err => {
                this.setState({error: err})
            })
        )
    }

    fetchFolders() {
        return(
            fetch('http://localhost:9090/folders')
            .then(res => {
                if(res.ok) {
                    return res.json();
                }
                return Promise.reject('Error fetching folders from server!');
            })
            .catch(err => {
                this.setState({error: err})
            })
        )
    }

    componentDidMount() {
        this.fetchNotes().then(notes => this.setState({notes}));
        this.fetchFolders().then(folders => this.setState({folders}));
    }

    renderNavRoutes() {
        const contextValue = {
            folders: this.state.folders,
            notes: this.state.notes,
        }
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => (
                            <notefulContext.Provider
                                value={contextValue}>
                                <NoteListNav
                                    {...routeProps}
                                />
                            </notefulContext.Provider>
                        )}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(contextValue.notes, noteId) || {};
                        const folder = findFolder(contextValue.notes, note.folderId);
                        return <NotePageNav {...routeProps} folder={folder} />;
                    }}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => {
                            const {folderId} = routeProps.match.params;
                            const notesForFolder = getNotesForFolder(
                                this.state.notes,
                                folderId
                            );
                            return (
                                <notefulContext.Provider
                                    value={{notes: notesForFolder, deleteNote: (noteId) => this.deleteNote(noteId)}}>
                                    <NoteListMain
                                        {...routeProps}
                                    />
                                </notefulContext.Provider>
                            );
                        }}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(this.state.notes, noteId);
                        return <NotePageMain {...routeProps} note={note} deleteNote={(noteId) => this.deleteNote(noteId)} />;
                    }}
                />
            </>
        );
    }

    renderError() {
        return (
            <div className='Error'>
                <h2>Error!</h2>
                <p>{this.state.error.message}</p>
            </div>
        );
    }

    deleteNote(noteId) {
        fetch(`http://localhost:9090/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            if(resp.ok) {
                return Promise.resolve('Success!');
            }
            return Promise.reject('Error removing note from server!');
        }).catch(err => {
            this.setState({error: err});
        });
        this.setState({notes: this.state.notes.filter(note => note.id !== noteId)});
    }

    render() {
        return (
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
        <main className="App__main">{this.state.err ? this.renderError() : this.renderMainRoutes()}</main>
            </div>
        );
    }
}

export default App;
