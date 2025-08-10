// import axios from "axios";
// import { useContext, useState } from "react"
// import { userContext } from "./App"

// const apiUrl = import.meta.env.VITE_API_URL;

// function CreatePost() {
//     const [title, setTitle] = useState();
//     const [description, setDescription] = useState();
//     const [file, setFile] = useState();
//     const user = useContext(userContext);

//     const handleSubmit = (e) => {
//         e.preventDefault(e);
//         const formData = new FormData()
//         formData.append("title", title)
//         formData.append("description", description)
//         formData.append("email", user.email)
//         formData.append("file", file)
//         formData.append("username", user.username)

//         axios.post(`${apiUrl}/create`, formData)
//         .then(res => {
//             if (res.data === "Success") {
//                 window.location.href = "/"
//             }
//         })
//         .catch(err => console.log(err))
//     }


// return (
//     <div className="post_container">
//         <div className="post_form">
//             <form className="post-form" onSubmit={handleSubmit}>
//                 <h2>Новый пост</h2>
//                 <input type="text" placeholder="Введите заголовок..." onChange={e => setTitle(e.target.value)} />

//                 <textarea name="desc"
//                 id="desc" 
//                 cols="30" 
//                 rows="10" 
//                 placeholder="Введите текст..." onChange={e => setDescription(e.target.value)}></textarea>
//                 <input type="file" className="file" placeholder="Выберите файл..."
//                 onChange={e => setFile(e.target.files[0])} />
//                 <button>Опубликовать</button>
//             </form>
//         </div>
//     </div>
// )
// }
// export default CreatePost;

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createPost } from "./redux/slices/postsSlice";
// import { useNavigate } from "react-router-dom";

// function CreatePost() {
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [file, setFile] = useState(null);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const user = useSelector((state) => state.user);

//     const handleSubmit = async (e) => {
//   e.preventDefault();

//   const toBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//     });

//   try {
//     const base64File = await toBase64(file);

//     dispatch(
//       createPost({
//         title,
//         description,
//         file: base64File, // <-- base64 string
//         email: user.email,
//         username: user.username,
//       })
//     )
//       .unwrap()
//       .then(() => navigate("/"))
//       .catch((err) => {
//         alert("Ошибка при создании поста");
//         console.log(err);
//       });
//   } catch (error) {
//     console.error("Ошибка при конвертации файла:", error);
//   }
// };

//     return (
//         <div className="post_container">
//             <div className="post_form">
//                 <form className="post-form" onSubmit={handleSubmit}>
//                     <h2>Новый пост</h2>
//                     <input
//                         type="text"
//                         placeholder="Введите заголовок..."
//                         onChange={(e) => setTitle(e.target.value)}
//                         required
//                     />
//                     <textarea
//                         placeholder="Введите текст..."
//                         onChange={(e) => setDescription(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="file"
//                         className="file"
//                         onChange={(e) => setFile(e.target.files[0])}
//                         required
//                     />
//                     <button type="submit">Опубликовать</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default CreatePost;

import { useDispatch, useSelector } from "react-redux";
import { createPost, setNewPostTitle, setNewPostDescription, setNewPostFile, resetNewPostForm } from "./redux/slices/postsSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { newPostTitle, newPostDescription, newPostFile } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (newPostFile) {
      const url = URL.createObjectURL(newPostFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [newPostFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

    try {
      const base64File = await toBase64(newPostFile);

      await dispatch(
        createPost({
          title: newPostTitle,
          description: newPostDescription,
          file: base64File,
          email: user.email,
          username: user.username,
        })
      ).unwrap();

      dispatch(resetNewPostForm());
      navigate("/");
    } catch (error) {
      console.error("Ошибка при создании поста:", error);
      alert("Ошибка при создании поста");
    }
  };

  return (
    <div className="post_container">
      <div className="post_form">
        <form className="post-form" onSubmit={handleSubmit}>
          <h2>Новый пост</h2>
          <input
            type="text"
            placeholder="Введите заголовок..."
            value={newPostTitle}
            onChange={(e) => dispatch(setNewPostTitle(e.target.value))}
            required
          />
          <textarea
            placeholder="Введите текст..."
            value={newPostDescription}
            onChange={(e) => dispatch(setNewPostDescription(e.target.value))}
            required
          />
          {previewUrl && (
            <div style={{ margin: "12px 0" }}>
              <img
                src={previewUrl}
                alt="Превью"
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            </div>
          )}
          <input
            type="file"
            className="file"
            onChange={(e) => dispatch(setNewPostFile(e.target.files[0]))}
            required
            accept="image/*"
          />
          <button type="submit">Опубликовать</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;