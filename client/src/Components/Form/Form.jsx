import React, { useState } from "react";
import "./form.css";
import axios from "axios";

const Form = () => {
    const [bookName, setBookName] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [imagePath, setImagePath] = useState(null);

    const token = localStorage.getItem("token");


    const pictureUpload = async (e) => {
        console.log(5656);
        const file = e.target.files[0];
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axios.post(
                "http://localhost:5555/book/book/upload/image",
                formData,
                {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(response);

            setImagePath(response.data.token);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const addBook = async (e) => {
        e.preventDefault();

        try {

            const formData = {
                bookName,
                author,
                description,
                imagePath
            };
            const response = await axios.post(
                "http://localhost:5555/book/addBook",
                formData,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            console.log(response.data);
            setBookName("");
            setAuthor("");
            setDescription("");
            setImagePath(null);
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };



    return (
        <div className="container">
            <h2 className="mt-5 mb-5 text-center">New Book</h2>
            <form onSubmit={addBook}>
                <div className="form-group">
                    <label className="text-muted">Book Name</label>
                    <input type="text" value={bookName} onChange={(e) => setBookName(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label className="text-muted">Author</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label className="text-muted">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label className="text-muted">Image</label>
                    <input type="file" onChange={(e) => pictureUpload(e)} required />
                </div>

                <button type="submit" className="btn btn-raised btn-success mt-2">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Form;
