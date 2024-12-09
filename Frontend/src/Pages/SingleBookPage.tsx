import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { IBook } from "../interface/IBook";
import Navbar from "../Components/Navbar";
import AddBookModal from "../Components/AddBookModal";

const SingleBookPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<IBook>();

  const handleDeleteBook = () => {
    axios.delete(`http://localhost:3000/book/${id}`);
    navigate("/");
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const result = await axios.get(`http://localhost:3000/book/${id}`);
        setBook(result.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBookDetails();
  }, [id]);

  const handleUpdateBook = async (formData: FormData) => {
    try {
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
          }
        console.log('updating data',formData)
      await axios.put(`http://localhost:3000/book/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data"},});
      setIsModalOpen(false);
      // Refresh book details
      const result = await axios.get(`http://localhost:3000/book/${id}`);
      setBook(result.data);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading book details...</p>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <div className="max-w-3xl  mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
        <div className="flex gap-6 p-2 m-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white p-2 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteBook}
            className="bg-red-600 text-white p-2 rounded-md"
          >
            Delete
          </button>
        </div>
        <div className="flex gap-6">
          <img
            src={`http://localhost:3000/${book.image}`}
            alt={book.title}
            className="w-96 h-full object-cover rounded-md"
          />
          <div className="flex flex-col">
            <h1 className="text-3xl mb-4 font-bold text-gray-800 mt-4">
              {book.title}
            </h1>
            <p className="text-gray-600 mt-4">
              <span className="font-bold">Author:</span> {book.author}
            </p>
            <p className="text-gray-600 mt-4">
              <span className="font-bold">Published Year:</span>{" "}
              {book.publicationYear}
            </p>
            <p className="text-gray-600 mt-4">
              <span className="font-bold">ISBN:</span> {book.isbn}
            </p>
            <p className="text-gray-600 mt-4">
              <span className="font-bold">Description:</span> {book.description}
            </p>
          </div>
        </div>
      </div>
      <AddBookModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleUpdateBook}
  initialData={book}
  title="Edit Book"
/>
    </>
  );
};

export default SingleBookPage;
