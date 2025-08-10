import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchPostById, deletePostById } from "./redux/slices/postsSlice";
import "./Post.css"

function Post() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { post } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Вы действительно хотите удалить пост?")) {
      dispatch(deletePostById(id))
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          alert(err);
          console.error("Ошибка при удалении поста:", err);
        });
    }
  };

  console.log('user:', user);
  console.log('post:', post);
  console.log('user.email:', user?.email, 'post.email:', post?.email);

  if (!post) return <div>Загрузка...</div>;

  return (
    <div>
      <h1 className="post_title_h1">{post.title}</h1>
      <div className="post_container">
        <img src={post.file} alt="post" />
        <p className="post-description">{post.description}</p>
        <p className="post-email">
          By <b>{post.username}</b>
          {/* By <b>{post.email}</b> */}
        </p>
        {user.email === post.email && (
          <div className="buttons">
            <button onClick={handleDelete}>Удалить</button>
            <button>
              <Link to={`/editpostbyid/${post._id}`} className="link">
                Редактировать
              </Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;