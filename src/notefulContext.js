import React from 'react';

const notefulContext = React.createContext ({
    folders: [],
    notes: [],
    deleteNote: () => {

    }
})

export default notefulContext;