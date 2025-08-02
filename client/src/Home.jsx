import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();

    useEffect(() => {
        axios.get(`${apiUrl}/`)
            .then(res => setPosts(res.data))
            .catch(err => console.error("Ошибка при загрузке постов:", err));
    }, []);

    console.log(posts)

    const lastPostRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchPosts();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <div className="posts_container">
            {/* {showNotice && (
        <div className="notice">
          ⚠️ <b>Внимание!</b> Загрузка постов может занять до <b>50 секунд</b> из-за особенностей хостинга и активности особо «одарённых» пользователей 🙂
        </div>
      )} */}

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

            {/* {loading && (
        <div style={{ textAlign: "center", margin: "20px", fontWeight: "bold" }}>
          Загрузка...
        </div>
      )} */}
        </div>
    );
}

export default Home;