import React, { useEffect, useState } from "react";
import { getNotes, addNote, deleteNote } from "./api";
import "./App.css";

function App() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch notes when the component mounts
    useEffect(() => {
        fetchNotes();
    }, []);

    // Fetch Notes from API
    const fetchNotes = async () => {
        try {
            setLoading(true);
            const data = await getNotes();
            setNotes(data);
            setError("");
        } catch (err) {
            console.error("Error fetching notes:", err);
            setError("Failed to load notes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Adding a Note
    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        try {
            await addNote({ title, content });
            setTitle("");
            setContent("");
            fetchNotes();
        } catch (err) {
            console.error("Error adding note:", err);
            setError("Failed to add note. Please try again.");
        }
    };

    // Handle Deleting a Note
    const handleDeleteNote = async (id) => {
        try {
            await deleteNote(id);
            fetchNotes();
        } catch (err) {
            console.error("Error deleting note:", err);
            setError("Failed to delete note. Please try again.");
        }
    };

    return (
        <div className="container">
            <h1>Cloud Notes</h1>
            
            {/* Error Message */}
            {error && <p className="error">{error}</p>}

            {/* Note Form */}
            <form onSubmit={handleAddNote} className="note-form">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">Add Note</button>
            </form>

            {/* Notes List */}
            {loading ? (
                <p>Loading notes...</p>
            ) : notes.length === 0 ? (
                <p>No notes found. Add your first note!</p>
            ) : (
                <ul className="notes-list">
                    {notes.map((note) => (
                        <li key={note.id} className="note-item">
                            <h3>{note.title}</h3>
                            <p>{note.content}</p>
                            <button onClick={() => handleDeleteNote(note.id)} className="delete-btn">
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
