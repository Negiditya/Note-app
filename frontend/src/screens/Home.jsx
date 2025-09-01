import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import Navbar from '../components/Navbar'
import Note from '../components/Note';
import NoteModal from '../components/NoteModal';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const { user, token } = useAuth();

    // Set up axios interceptor to include token in requests
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    // Fetch notes on component mount
    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/notes');
            setNotes(response.data);
        } catch (err) {
            console.error('Error fetching notes:', err);
            alert('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const deleteNote = async (id) => {
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(note => note._id !== id));
            alert('Note deleted successfully');
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Failed to delete note');
        }
    };

    const createNote = () => {
        setEditingNote(null);
        setIsModalOpen(true);
    };

    const handleNoteSubmit = async (title, content) => {
        setModalLoading(true);
        try {
            if (editingNote) {
                // Update existing note
                await api.put(`/notes/${editingNote._id}`, { title, content });
                alert('Note updated successfully');
            } else {
                // Create new note
                await api.post('/notes', { title, content });
                alert('Note created successfully');
            }
            fetchNotes(); // Refresh notes list
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error:', err);
            alert(err.response?.data?.message || 'Failed to save note');
        } finally {
            setModalLoading(false);
        }
    };

    const updateNote = (id, currentTitle, currentContent) => {
        const noteToEdit = notes.find(note => note._id === id);
        setEditingNote(noteToEdit);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className='p-5'>
                <Navbar />
                <div className="text-center mt-10">Loading notes...</div>
            </div>
        );
    }

    return (
        <div className='p-5'>
            <Navbar />
            <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl overflow-hidden mt-10">

                {/* Welcome Section */}
                <div className="p-8 bg-white shadow-md rounded-2xl mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Welcome, {user?.name || 'User'}!
                    </h1>
                    <p className="text-base text-gray-500">Email: {user?.email || 'user@example.com'}</p>
                </div>

                {/* Create Note Button */}
                <div className="px-8 pb-8">
                    <button
                        onClick={createNote}
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-medium text-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                    >
                        <Plus size={22} />
                        Create Note
                    </button>
                </div>

                {/* Notes Section */}
                <div className="px-8 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-5">Notes</h2>

                    <div className="space-y-4">
                        {notes.map((note) => (
                            <Note
                                key={note._id}
                                value={note}
                                onUpdate={updateNote}
                                onDelete={deleteNote}
                            />
                        ))}

                        {notes.length === 0 && (
                            <div className="text-center py-10 text-gray-500 text-base">
                                <p>No notes yet. Create your first note!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom indicator (only mobile) */}
                <div className="flex justify-center pb-5 md:hidden">
                    <div className="w-24 h-1 bg-gray-300 rounded-full"></div>
                </div>
            </div>

            {/* Note Modal */}
            <NoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleNoteSubmit}
                note={editingNote}
                loading={modalLoading}
            />
        </div>
    );
}