import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './redux/slices/postsSlice';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const dispatch = useDispatch();
  const { posts, loading, hasMore } = useSelector(state => state.posts);

  const observer = useRef();
  const lastPostRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        dispatch(fetchPosts());
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, []);

  return (
    <div className="posts_container">
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;
        return (
          <Link key={post._id} to={`/post/${post._id}`} className="post">
            <div className="post-item" ref={isLast ? lastPostRef : null}>
              <img src={post.file} alt="" />
              <div className="post_text">
                <h2>{post.title}</h2>
                <p className="post-item-email">Автор: <b>{post.username}</b></p>
                <p className="post-text">{post.description}</p>
              </div>
            </div>
          </Link>
        );
      })}
      {loading && <div style={{ textAlign: "center", margin: "20px" }}>Загрузка...</div>}
    </div>
  );
}

export default Home;