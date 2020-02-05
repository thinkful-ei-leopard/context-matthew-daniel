import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Note from "../Note/Note";
import CircleButton from "../CircleButton/CircleButton";
import "./NoteListMain.css";

import notefulContext from "../notefulContext";

import { getNotesForFolder } from '../notes-helpers'

export default function NoteListMain(props) {
  return (
    <notefulContext.Consumer>
      {value => {
        const notes = getNotesForFolder(value.notes, props.match.params.folderId)
        return (
          <section className="NoteListMain">
            <ul>
              {notes.map(note => (
                <li key={note.id}>
                  <Note
                    id={note.id}
                    name={note.name}
                    modified={note.modified}
                    delete={value.deleteNote}
                  />
                </li>
              ))}
            </ul>
            <div className="NoteListMain__button-container">
              <CircleButton
                tag={Link}
                to="/add-note"
                type="button"
                className="NoteListMain__add-note-button"
              >
                <FontAwesomeIcon icon="plus" />
                <br />
                Note
              </CircleButton>
            </div>
          </section>
        );
      }}
    </notefulContext.Consumer>
  );
}

NoteListMain.defaultProps = {
  match: {
    params: {}
  }
}
