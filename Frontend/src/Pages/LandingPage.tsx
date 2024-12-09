import axios from "axios";
import { useEffect, useState } from "react";
import { IBook } from "../interface/IBook";
import Navbar from "../Components/Navbar";
import AddBookModal from "../Components/AddBookModal";
import { Link } from "react-router-dom";
const LandingPage: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpenOpen] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        console.log("useEffect");
        const result = await axios.get("http://localhost:3000/books");
        console.log("result", result.data);
        setBooks(result.data);
      } catch (error) {
        console.log("Error in fetching books", error);
      }
    };
    fetchBook();
  }, []);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    try {
      const result = await axios.get(
        `http://localhost:3000/search?query=${encodeURIComponent(query)}`
      );
      console.log("search result =", result.data);

      setBooks(result.data);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };
  const handleAddBook = async (formData: FormData) => {
    try {
      const result = await axios.post(
        "http://localhost:3000/addBook",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setBooks((prevBooks) => [result.data, ...prevBooks]); // Prepend the new book to the list
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };


  return (
    <>
      <Navbar />
      <div className="flex flex-col  bg-gray-100 gap-4  min-h-screen p-4">
        <div className="flex  justify-center mt-4">
          <h1 className="text-4xl font-bold text-gray-800">Book Management</h1>
        </div>
        {/*Action Bar*/}
        <div className="flex justify-between">
          <button className="bg-blue-600 font-medium px-4 py-2 rounded-md p-2 text-white hover:bg-blue-700">
            Filter
          </button>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-12 pr-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button
            onClick={() => setIsModalOpenOpen(true)}
            className="rounded-md bg-green-500 text-white p-2 "
          >
            Add Book
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
          {books.map((book: IBook) => (
            
            <div
              className="bg-white shadow-lg flex flex-col items-center rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
              key={book._id}
            >
              <Link to={`/books/${book._id}`}>
              <div className="p-4">
              <img
                  src={`http://localhost:3000/${book.image}`}
                  onError={(e) => {
                    console.error("Image load error", {
                      src: (e.target as HTMLImageElement).src,
                      book: book,
                    });
                  }}
                  alt={book.title}
                  className="w-64 h-72 object-fit rounded-t-lg"
                />
                <h2 className="text-xl mt-4 font-semibold text-gray-800">
                  {book.title}
                </h2>
                <p className="text-gray-600 mt-2">
                  <span className="font-bold">Author:</span> {book.author}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-bold">Published Year:</span>{" "}
                  {book.publicationYear}
                </p>
                
              </div>
              </Link>
            </div>
           
          ))}
        </div>
      </div>
      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpenOpen(false)}
        onSubmit={handleAddBook}
        title="Add Book"
      />
    </>
  );
};

export default LandingPage;
