import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { useState } from "react";
import {dkeeper} from "../../../declarations/dkeeper"; //get hold of the func in canister to use it


/*
function createNotes(noteItem) {
  //when called below doesnt pass in param because notes.map notes is existing data already
  return (
    <Note
      key={noteItem.key}
      title={noteItem.title}
      content={noteItem.content}
    />
  );
}
*/
function App() {
  const [noteArr, setNoteArr] = useState([]);
  /** 
 * noteArr.filter(...) alone doesn’t update state

noteArr.filter(...) just returns a new array.

Unless you pass that array into setNoteArr(...), React won’t know to re-render.

So this by itself changes nothing in the UI:
 */
  function addNote(newNote) {
    setNoteArr((prevNotes) => {

      dkeeper.createNote(newNote.title, newNote.content)
      return [...prevNotes, newNote];
    });
  }
  //is also a React hook like useState, trigger the function whenever the App component is render(page load/reload)
  //takes 2 param

  //this along with fetchData in charge of updating the setNoteArr everytime 
  useEffect(()  =>  {

    fetchData();

  }, [])

  async function fetchData() {
    const notesArray = await dkeeper.readNotes(); //wait because this is async //return it back to an array, func readNote() returns an array in main.mo file
    /* w/o stopping condition, infinite loop happens 
    because calling setNoteArr would result in calling useState,
     then App gets render => useEffect gets called auto if App is render
    => fetchData is called => setNoteArr is called
    */

    setNoteArr(notesArray);   
  }

  function deleteNote(id) {
    dkeeper.removeNote(id);


    setNoteArr((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {noteArr.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;

/*this function inside App while createNotes outsie is because this rely on the state
  because useState has to be inside the function called 
  They can only be called:

   inside a React function component, OR

   inside a custom hook (a function whose name starts with use).useNameState()

❌ They cannot be called in a random utility function.
  
  
  */

/*
WHY NOTES STATE LIVES IN <App> (not in <CreateArea>):

- If we keep the notes array inside CreateArea:
  - Only CreateArea would know about the notes.
  - App and other sibling components (like Header, Footer, ListNote) 
    would not be able to access or display them.
  - This makes it impossible to:
      • Show the notes in another component (e.g., <ListNote />).
      • Display a note counter in <Header />.
      • Save or manage notes from a higher level (e.g., to localStorage or server).

- By keeping notes in App:
  - App acts as the "single source of truth" for all notes.
  - App can pass notes down to any child via props.
  - CreateArea stays focused only on collecting a new note 
    and "sending it up" to App using a callback (onAdd).
  - Other components can easily read or use the notes array too.

Rule of Thumb:
- If state is only used in ONE component, keep it local.
- If state is shared by MULTIPLE components, lift it up to their nearest parent.
*/

/*
HTML elements (<input>, <button>, <div>) → only understand the real DOM attributes.
(if you pass random props, React will ignore or warn:
<input foo="bar" /> → foo won’t show up in the DOM)

Your components (<CreateArea>, <Note>) → can accept any prop names you invent.
They’re just JS function parameters.
*/
