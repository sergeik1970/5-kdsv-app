import { useDispatch, useSelector } from "react-redux";
import { createPost, setNewPostTitle, setNewPostDescription, setNewPostFile, resetNewPostForm } from "./redux/slices/postsSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function CreatePost() {
  // Инициализация
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Достаем их redux state
  const { newPostTitle, newPostDescription, newPostFile } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);

  // Локальный state для превью картинки
  const [previewUrl, setPreviewUrl] = useState(null);


  useEffect(() => {
    if (newPostFile) {
      // Генерация временной ссылки
      const url = URL.createObjectURL(newPostFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [newPostFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Преобразование файла в base64 строку
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

    try {
      const base64File = await toBase64(newPostFile);

      // Отправка запроса на создание поста
      await dispatch(
        createPost({
          title: newPostTitle,
          description: newPostDescription,
          file: base64File,
          email: user.email,
          username: user.username,
        })
      ).unwrap();

      // Очистка формы
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