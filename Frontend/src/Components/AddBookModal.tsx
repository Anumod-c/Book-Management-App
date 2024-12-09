import React, {  useState } from "react";
import { IBook } from "../interface/IBook";

interface AddBookModalProps {
  isOpen: boolean;
  initialData?: IBook; //  Only required for update mode
  onClose: () => void;
  onSubmit: (
  formData:FormData) => void;
  title: string;
}

const AddBookModal: React.FC<AddBookModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title,
  }) => {
    const [titleField, setTitleField] = useState(initialData?.title || "");
    const [author, setAuthor] = useState(initialData?.author || "");
    const [publicationYear, setPublicationYear] = useState(
      initialData?.publicationYear?.toString() || ""
    );
    const [isbn, setIsbn] = useState(initialData?.isbn || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [image, setImage] = useState<File | null>(null);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("title", titleField);
      formData.append("author", author);
      formData.append("publicationYear", publicationYear);
      formData.append("isbn", isbn);
      formData.append("description", description);
      if (image) formData.append("image", image);
  
      onSubmit(formData);
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={titleField}
              onChange={(e) => setTitleField(e.target.value)}
              placeholder="Title"
              className="w-full mb-3 p-2 border rounded-md"
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
              className="w-full mb-3 p-2 border rounded-md"
            />
            <input
              type="text"
              value={publicationYear}
              onChange={(e) => setPublicationYear(e.target.value)}
              placeholder="Published Year"
              className="w-full mb-3 p-2 border rounded-md"
            />
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="ISBN"
              className="w-full mb-3 p-2 border rounded-md"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full mb-3 p-2 border rounded-md"
            ></textarea>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full mb-3 p-2 border rounded-md"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  

export default AddBookModal;
