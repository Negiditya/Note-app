import { Trash2 } from 'lucide-react';

export default function Note({ value, onUpdate, onDelete }) {
    const handleUpdate = (e) => {
        e.stopPropagation();
        onUpdate(value._id, value.title, value.content);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this note?')) {
            onDelete(value._id);
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h3>
                    {value.content && (
                        <p className="text-gray-600 text-sm line-clamp-3">{value.content}</p>
                    )}
                </div>
                <div className="flex gap-2 ml-4">
                    <button
                        onClick={handleUpdate}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                    >
                        Update
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm flex items-center gap-1"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

