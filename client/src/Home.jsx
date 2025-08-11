import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts, initPosts } from './redux/slices/postsSlice';
import { hideNotice } from "./redux/slices/noticeSlice";
import './Home.css';

function Home() {
    const dispatch = useDispatch();
    const { posts, loading, hasMore } = useSelector(state => state.posts);

    const showNotice = useSelector(state => state.notice.showNotice);

    // Реф под текущий IntersectionObserver
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
        dispatch(initPosts())
    }, []);

    useEffect(() => {
  if (showNotice) {
    const timer = setTimeout(() => {
      dispatch(hideNotice());
    }, 50000); // 50 секунд

    return () => clearTimeout(timer);
  }
}, [showNotice]);

    return (
        <div className="posts_container">
            {showNotice && (
                <div className="notice-banner">
                    <span className="notice-icon">⚠️</span>
                    <div className="notice-content">
                        <strong>Внимание:</strong> загрузка постов может занять до <strong>50 секунд</strong> —
                        это связано с особенностями хостинга и повышенной активностью особо «одарённых» пользователей 🙂
                    </div>
                    <button className="notice-close" onClick={() => dispatch(hideNotice())}>×</button>
                </div>
            )}
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