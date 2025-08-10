import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, setEditTitle, setEditDescription, setEditFile, updatePostById } from "./redux/slices/postsSlice";

const apiUrl = import.meta.env.VITE_API_URL;

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { editPost, post } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);

  // загружаем пост
  useEffect(() => {
    dispatch(fetchPostById(id)).unwrap().then((data) => {
      dispatch(setEditTitle(data.title || ""));
      dispatch(setEditDescription(data.description || ""));
      dispatch(setEditFile(data.file || null));

      console.log(data);
      

      if (user.email !== data.email) {
        alert("У вас нет прав на редактирование этого поста");
        navigate(`/post/${id}`);
      }
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePostById({
      id,
      title: editPost.title,
      description: editPost.description,
      file: editPost.file
    }))
      .unwrap()
      .then(() => navigate(`/post/${id}`))
      .catch(console.error);
  };

  const handleFileChange = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(setEditFile(reader.result));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="post_container">
      <div className="post_form">
        <form className="post-form" onSubmit={handleSubmit}>
          <h2>Редактировать пост</h2>
          <input
            type="text"
            placeholder="Заголовок..."
            value={editPost.title}
            onChange={(e) => dispatch(setEditTitle(e.target.value))}
          />

          <textarea
            cols="30"
            rows="10"
            placeholder="Описание..."
            value={editPost.description}
            onChange={(e) => dispatch(setEditDescription(e.target.value))}
          ></textarea>

          {editPost.file && (
            <img src={editPost.file} alt="Текущее изображение" style={{ maxWidth: "300px" }} />
          )}

          <input
            type="file"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />

          <button>Применить изменения</button>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
