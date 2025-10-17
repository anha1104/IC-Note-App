import React from "react";
import { useState } from "react";

function CreateArea(props) {
  const [note, setNote] = useState({
    //note is an object, setNote is a function
    title: "",
    content: "",
  });

  function handleChange(event) {
    //event is triger by writing changes
    const { name, value } = event.target; // const banana = ev.tar.name
    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value, //square[ ] turns out to be either title or content
      };
    });
  }

  function submitNote(event) {
    props.onAdd(note); //call addNote in App -> addNote(note)
    event.preventDefault();
  }

  return (
    <div>
      <form>
        <input
          name="title" //must match the one in useState
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />
        <textarea
          name="content" //must match in Usestate, also name and value is html attribute
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows="3"
        ></textarea>
        <button onClick={submitNote}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
