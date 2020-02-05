import React from 'react'
import Note from '../Note/Note'
import './NotePageMain.css'

import notefulContext from '../notefulContext'

export default function NotePageMain(props) {

  return (
    <notefulContext.Consumer>
      {value => {
        const note = value.notes.find(note => note.id === props.match.params.noteId)
        return (
    <section className='NotePageMain'>
      <Note
        id={note.id}
        name={note.name}
        modified={note.modified}
        delete={(noteId) => {
          props.history.goBack()
          value.deleteNote(noteId)
        }}
      />
      <div className='NotePageMain__content'>
        {note.content.split(/\n \r|\n/).map((para, i) =>
          <p key={i}>{para}</p>
        )}
      </div>
    </section>
  )
}
}
    </notefulContext.Consumer>
  )
}

NotePageMain.defaultProps = {
  history: {
    goBack: () => {}
  },
  match: {
    params: {}
  }
}
