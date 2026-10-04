import React, {useState} from "react";
import NoteContext from "./noteContext";

const NoteState =(props)=>{
    // const s1 ={
    //     "name": "Hussain",
    //     "class": "12th A"
    // }
    // const [state , setState] = useState(s1);
    // const update = ()=>{
    //     setTimeout(() => {
    //        setState( {
    //     "name": "Hussain Muhammad",
    //     "class": "12th A Super"
    // })
    //     }, 2000);
    // }
    const host= "http://localhost:5000";
    const notesInitials= []
const [notes, setNotes]=useState(notesInitials)
//GEt all notes from database using api
const getAllNotes =async ()=>{

const response = await fetch(`${host}/api/notes/fetchallnotes`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem('token')
  },
});
const json = await response.json();
console.log(json);
setNotes(json); // Use json.notes if exists, else set to empty array

}


//Add a note
const addNote = async (title, description, tag) => {
  const response = await fetch(`${host}/api/notes/addnote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem('token')
    },
    body: JSON.stringify({ title, description, tag }),
  });
  const note={
  "user": "687df8d00267f0fe9ac0c135",
  "title": title,
  "description": description,
  "tag": tag,
  "_id": "6881f97c09833a9a69c546fe",
  "date": "2025-07-24T09:14:36.803Z",
  "__v": 0
};

  const json = await response.json();
  console.log(json);
  setNotes(notes.concat(note)); // use returned note
};


//Delete a note
const deleteNote =async (id)=>{
   const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem('token')
  }
});
// return response.json();
const json = await response.json();
console.log(json);
 const newNote = notes.filter((note)=> note._id !== id)
 setNotes(newNote);
}

//Update a note
// 
const editNote = async (id, title, description, tag) => {
  try {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }),
    });

    const updatedNote = await response.json();
    console.log("Updated Note:", updatedNote);

    // Update the notes array
    const updatedNotes = notes.map((note) =>
      note._id === id ? { ...note, title, description, tag } : note
    );
    setNotes(updatedNotes);
  } catch (error) {
    console.error("Error updating note:", error);
  }
};


    return (
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    ) 

}
//install npm i cors to solve the issue og localhost 5000 to 3000 in express cors web site
export default NoteState;