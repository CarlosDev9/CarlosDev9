import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import UserAuth from "../components/UserAuth";
import "../styles/BlogDetails.css";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Detail Seite über die ID laden
  useEffect(() => {
    fetch(`https://json-server-i8eu.onrender.com/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data);
        setIsLoading(false);
        setError(null);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });

    // Fetch API Kommentare vom Server laden
    fetch(`https://json-server-i8eu.onrender.com/comments`)
      .then((res) => res.json())
      .then((data) => {
        const filteredComments = data.filter(
          (comment) => comment.blogId === id
        );
        setComments(filteredComments);
      })
      .catch((err) => console.error("Fehler beim Laden der Kommentare", err));
  }, [id]);

  // Kommentare hinzufügen
  const handleAddComment = () => {
    const comment = {
      text: newComment,
      author: username || "Usuario",
      blogId: id,
    };

    fetch(`https://json-server-i8eu.onrender.com/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments((prevComments) => [...prevComments, data]);
        setNewComment("");
      })
      .catch((err) => console.error("Fehler beim hinzufügen", err));
  };

  // Löschen und Bearbeiten von Kommentaren über die API
  const handleDeleteComment = (commentId) => {
    fetch(`https://json-server-i8eu.onrender.com/comments/${commentId}`, {
      method: "DELETE",
    })
      .then(() => {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      })
      .catch((err) => console.error("Error al eliminar el comentario:", err));
  };

  const handleEditComment = (commentId) => {
    const updatedComment = { text: editingCommentText };

    fetch(`https://json-server-i8eu.onrender.com/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedComment),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? { ...comment, text: data.text } : comment
          )
        );
        setEditingCommentId(null);
        setEditingCommentText("");
      })
      .catch((err) => console.error("Fehler beim Bearbeiten", err));
  };

  // Anmeldung
  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  // Abmeldung
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <div className="blog-details">
      <div className="blog-container">
        {isLoading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {blog && (
          //Blog Details
          <article className="blog">
            <div className="blog-category">
              {blog.categories.map((category, index) => (
                <span key={index} className="blog-category-item">
                  {category}
                </span>
              ))}
            </div>
            <div className="blog-body">
              <h1 className="blog-title">{blog.title}</h1>
              <h4 className="blog-author">Author: {blog.author}</h4>
              <div className="blog-date">{blog.date}</div>
              <div className="img-container">
                <img className="blog-img" src={blog.img}></img>
              </div>
              <div className="blog-text">{blog.text}</div>
            </div>
          </article>
        )}
        <section className="comments">
          <h2 className="comments-titel">Kommentare</h2>
          {comments.map((comment) => (
            <div className="comment-container" key={comment.id}>
              <p className="comment-author">{comment.author}</p>
              <p className="comment-text">{comment.text}</p>
              {/* wenn der Benuzter angemeldet ist werden diese Button angezeigt */}
              {isLoggedIn && (
                <div className="comment-btns">
                  <button
                    className="comment-btn"
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditingCommentText(comment.text);
                    }}
                  >
                    Bearbeiten
                  </button>
                  <button
                    className="comment-btn"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Löschen
                  </button>
                </div>
              )}
            </div>
          ))}

          {isLoggedIn ? (
            <div className="add-comment">
              <h3 className="comment-h3">
                Hallo <span className="user">{username}</span>
              </h3>
              <h4 className="comment-h4">Schreibe einen Kommentar</h4>
              <textarea
                class="text-area"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="btn-comment" onClick={handleAddComment}>
                Kommentar hinzufügen
              </button>
              <button className="btn-comment logout" onClick={handleLogout}>
                Abmelden
              </button>
            </div>
          ) : (
            <UserAuth
              onLogin={handleLogin}
              onLogout={handleLogout}
              isLoggedIn={isLoggedIn}
              username={username}
            />
          )}

          {editingCommentId && (
            <div className="add-comment edit-comment">
              <h3>Kommentar bearbeiten</h3>
              <textarea
                class="text-area"
                value={editingCommentText}
                onChange={(e) => setEditingCommentText(e.target.value)}
              />
              <button
                className="btn-comment"
                onClick={() => handleEditComment(editingCommentId)}
              >
                Aktualisieren
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default BlogDetails;
