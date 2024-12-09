import Book from "../models/Book";
import { Request, Response } from 'express'
import client from "./elasticSearch";
import { IBook } from "../../interface/IBook";

const indexBookInElasticsearch = async (book: IBook) => {
    return await client.index({
        index: 'books',
        id: book._id.toString(),
        body: {
            title: book.title,
            author: book.author,
            description: book.description,
            publicationYear: book.publicationYear,
        },
    });
};
export const bookController = {




    addBook: async (req: Request, res: Response) => {
        const { title, description, author, publicationYear, isbn } = req.body;
        const imagePath = `uploads/${req.file?.filename}`;

        try {
            const newBook = new Book({ title, author, publicationYear, isbn, description, image: imagePath, });
            await newBook.save();
            const result = await indexBookInElasticsearch(newBook);
            res.json(newBook)
        } catch (error) {
            console.log('Error in adding course', error);
            res.status(400).json({ error: error.message });
        }
    },
    updateBook: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { title, author, publicationYear, isbn, description } = req.body;
        const imagePath = `uploads/${req.file?.filename}`;

        try {
            const updatedBook = await Book.findByIdAndUpdate(id, { title, author, description, isbn, publicationYear, image: imagePath }, { new: true });
            if (!updatedBook) {
                res.status(404).json({ error: 'Book not found' })
            }
            await client.update({
                index: 'books',
                id: updatedBook._id.toString(),
                doc: {
                    title: updatedBook.title,
                    author: updatedBook.author,
                    description: updatedBook.description,
                    publicationYear: updatedBook.publicationYear,
                },
            });
            res.json(updatedBook)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },


    deleteBook: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const deletedBook = await Book.findByIdAndDelete(id);
            if (!deletedBook) { res.status(404).json({ error: "Book not found" }) }
            await client.delete({
                index: 'books',
                id: deletedBook._id.toString(),
            });
            res.status(200).json({
                message: 'Book deleted successfully',
                book: deletedBook,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    fetchBooks: async (req: Request, res: Response) => {
        try {
            const books = await Book.find();
            res.json(books);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    singleBook: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const book = await Book.findById(id);
            if (!book) {
                res.status(404).json({ error: "Book not found" })
            }
            res.json(book)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    search: async (req: Request, res: Response) => {
        const { query } = req.query

        try {
            const result = await client.search({
                index: 'books',
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    wildcard: {
                                        title: `*${query}*`,
                                    },
                                },
                                {
                                    wildcard: {
                                        author: `*${query}*`,
                                    },
                                },
                                {
                                    wildcard: {
                                        description: `*${query}*`,
                                    },
                                },
                            ],
                        },
                    },
                },
            });

            // Normalize the search result data
            const books = result.hits.hits.map((hit: any) => ({
                _id: hit._id,
                title: hit._source.title,
                author: hit._source.author,
                publicationYear: hit._source.publicationYear,
                description: hit._source.description,
            }));
            if (books && books.length > 0) {
                res.status(200).json(books);
            } else {
                res.status(404).json({ message: 'No search results found.' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};