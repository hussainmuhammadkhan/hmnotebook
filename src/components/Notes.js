import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../Context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

export default function Notes(props) {
  const context = useContext(noteContext);
  const { notes, getAllNotes, editNote } = context;
  const history = useNavigate();
  useEffect(() => {
    if(localStorage.getItem('token')){
    getAllNotes();}else{
     history("/login")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [note, setNote] = useState({id:"", etitle: "", edescription: "", etag: "" });

 const handleClick = () => {
  if (note.etitle.trim().length < 3 || note.edescription.trim().length < 5) {
    alert("Title must be at least 3 characters and description at least 5.");
    return;
  }

  editNote(note.id, note.etitle, note.edescription, note.etag);
  refClose.current.click(); 
  props.showAlert('Updated successfully', 'success')
};


  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  
  const updateNote = (currentNote) => {
   ref.current.click(); 
   setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag});
  
  }
  const ref= useRef(null)
  const refClose= useRef(null)

  return (
    <div>
      <AddNote showAlert={props.showAlert}/>

      <button
        type="button" ref={ref}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"

      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Your Note
              </h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
          <div className="mb-3">
            <label htmlFor="etitle" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="etitle"
              name="etitle"
              value={note.etitle}
              aria-describedby="emailHelp"
              onChange={onChange}
            />
            <div id="emailHelp" className="form-text">
              We'll never share your notes with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="edescription" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              name="edescription"
              value={note.edescription}
              id="edescription"
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="etag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              className="form-control"
              value={note.etag}
              name="etag"
              id="etag"
              onChange={onChange}
            />
          </div>
         
        </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                ref={refClose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button"  disabled={note.etitle.length<5 || note.edescription.length<5 || note.etag.length<2} onClick={handleClick} className="btn btn-primary">
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container row my-3">
        <h3>Your Note</h3>
        <div className="container">
        {notes.length===0 && 'No notes to display'}
        </div>
        {notes.map((note) => {
          return (
            <NoteItem key={note._id} note={note} updateNote={updateNote} showAlert={props.showAlert} />
          );
        })}
      </div>
    </div>
  );
}
