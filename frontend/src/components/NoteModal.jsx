import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function NoteModal({ isOpen, onClose, onSubmit, note = null, loading = false }) {
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [errors, setErrors] = useState({});

    // Reset form when modal opens/closes or note changes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: note?.title || '',
                content: note?.content || ''
            });
            setErrors({});
        }
    }, [isOpen, note]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            setErrors({ title: "Title is required" });
            return;
        }

        onSubmit(formData.title.trim(), formData.content);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-[90vw] max-w-6xl h-[80vh] p-8 overflow-y-auto shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {note ? 'Edit Note' : 'Create New Note'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter note title"
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.title}
                            onChange={handleChange}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <textarea
                            name="content"
                            placeholder="Enter note content (optional)"
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                            value={formData.content}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Saving...' : (note ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}