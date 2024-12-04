import "../styles/BlogList.css";
import { Link } from "react-router-dom";

function BlogList({ blogs, btnRead }) {
  return (
    <div className="blogs-container">
      {blogs.map((blog, index) => (
        <div className="blog-preview" key={index}>
          <Link className="preview-link" to={`/blog-detail/${blog.id}`}>
            <div className="preview-img-container">
              <img className="preview-img" src={blog.img}></img>
            </div>
            <div className="preview-body">
              <div className="preview-category">
                {blog.categories.map((category, index) => (
                  <span key={index} className="category-item">
                    {category}
                  </span>
                ))}
              </div>
              <div className="title-container">
                <h2 className="preview-title"> {blog.title}</h2>
              </div>
              <p className="preview-author">Author: {blog.author}</p>
              <p>{blog.date}</p>
              <button className="btn-read" onClick={btnRead}>
                <span>Artikel lesen</span>
              </button>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default BlogList;
