import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import './NotePageNav.css'
import { findNote, findFolder } from '../notes-helpers'
import notefulContext from '../notefulContext'

export default class NotePageNav extends React.Component {
  static defaultProps = {
    history: {
      goBack: () => { }
    },
    match: {
      params: {}
    }
  }
  static contextType = notefulContext;

  render() {
    const { notes, folders, } = this.context
    const { noteId } = this.props.match.params
    const note = findNote(notes, noteId) || {}
    const folder = findFolder(folders, note.folderId)
    return (
      <div className='NotePageNav'>
        <CircleButton
          tag='button'
          role='link'
          onClick={() => this.props.history.goBack()}
          className='NotePageNav__back-button'
        >
          <FontAwesomeIcon icon='chevron-left' />
          <br />
          Back
        </CircleButton>
        {folder && (
          <h3 className='NotePageNav__folder-name'>
            {folder.name}
          </h3>
        )}
      </div>
    )
  }
}

// export default function NotePageNav(props) {
//   return (
//     <notefulContext.Provider>
//       {value => {
//         const note = value.notes.find(note => note.id === props.match.params.noteId)
//         const folder = value.folders.find(folder => note.folderId === folder.id)
//         return (
//           <div className='NotePageNav'>
//             <CircleButton
//               tag='button'
//               role='link'
//               onClick={() => props.history.goBack()}
//               className='NotePageNav__back-button'
//             >
//               <FontAwesomeIcon icon='chevron-left' />
//               <br />
//               Back
//             </CircleButton>
//             {folder && (
//               <h3 className='NotePageNav__folder-name'>
//                 {folder.name}
//               </h3>
//             )}
//           </div>
//         )
//       }}
//     </notefulContext.Provider>
//   );
// }

// NotePageNav.defaultProps = {
//   history: {
//     goBack: () => {}
//   },
//   match: {
//     params: {}
//   }
// }
