import axios from "axios";

// Set your backend API URL (change if deployed on a remote server)
const API_URL = "http://54.198.68.120:8000/notes/";  // Use your backend public IP


// Fetch all notes
export const getNotes = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log("Fetched Notes:", response.data); // Debugging
        return response.data;
    } catch (error) {
        console.error("Error fetching notes:", error.response ? error.response.data : error);
        return []; // Return empty array to prevent crashes
    }
};

// Add a new note
export const addNote = async (note) => {
    try {
        console.log("Adding Note:", note); // Debugging
        const response = await axios.post(API_URL, note, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Note Added Successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding note:", error.response ? error.response.data : error);
        throw error;
    }
};

// Delete a note
export const deleteNote = async (id) => {
    try {
        console.log("Deleting Note ID:", id); // Debugging
        await axios.delete(`${API_URL}${id}`, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Note Deleted Successfully");
    } catch (error) {
        console.error("Error deleting note:", error.response ? error.response.data : error);
        throw error;
    }
};
