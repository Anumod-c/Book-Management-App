import mongoose,{Schema} from "mongoose";
import { IBook } from "../../interface/IBook";
import { File } from "buffer";
export interface IBookSchema extends Document{title:string,author:string,publicationYear:number,isbn:string,description:string}
const BookSchema :Schema<IBook>= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publicationYear: {
        type: Number,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String }
})

const Book = mongoose.model("Book", BookSchema);
export default Book;