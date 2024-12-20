import BlogList from "../components/BlogList";
import { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import "../styles/Home.css";
import Kategorie from "../components/Kategorie";

function Home() {
  const [blogs, setBlogs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State für die Suchleiste

  useEffect(() => {
    fetch("http://localhost:8000/blogs?_sort=date&_order=asc")
      .then((res) => {
        if (!res.ok) {
          throw Error("Fehler beim Laden");
        }
        return res.json();
      })
      .then((data) => {
        setBlogs(data);
        setIsLoading(false);
        setError(null);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Blogs nach ausgewählten Kategorien filtern
  const filteredBlogs = blogs
    ? blogs.filter(
        (blog) =>
          // Filtern nach Kategorien und Titel in der Suchleiste
          (selectedCategories.length === 0 ||
            blog.categories.some((category) =>
              selectedCategories.includes(category)
            )) &&
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) // Nach Suchbegriff filtern
      )
    : [];

  // Aktuelle Blogs auf der Seite
  const indexOfLastBlog = currentPage * blogsPerPage; //Berechnet den Index des letzten Blogs, der auf der aktuellen Seite erscheinen soll
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage; //Berechnet den Index des ersten Blogs, der auf der aktuellen Seite erscheinen
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Verwaltung ausgewählter Kategorien
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, value]); // Ausgewählte Kategorie hinzufügen
    } else {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== value)); // Löschen, wenn deaktiviert
    }
    setCurrentPage(1); // Wenn sich die Kategorie ändert, die Seite mit der ersten Seite neu
  };

  // Seite wechseln
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="home">
      {/* Suchleiste */}
      <div className="search-bar-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Artikeln nach Titeln suchen..."
          value={searchTerm}
          onChange={handleSearch} // Suchbegriff aktualisieren
        />
      </div>

      {/* Filter Kategorien */}

      <div className="filter">
        <Kategorie
          id="technik"
          categorieName="Technik"
          handleCategoryChange={handleCategoryChange}
          arrayCategorie={selectedCategories.includes("Technik")}
        />
        <Kategorie
          id="lifestyle"
          categorieName="Lifestyle"
          handleCategoryChange={handleCategoryChange}
          arrayCategorie={selectedCategories.includes("Lifestyle")}
        />
        <Kategorie
          id="wirtschaft"
          categorieName="Wirtschaft"
          handleCategoryChange={handleCategoryChange}
          arrayCategorie={selectedCategories.includes("Wirtschaft")}
        />
        <Kategorie
          id="natur"
          categorieName="Natur"
          handleCategoryChange={handleCategoryChange}
          arrayCategorie={selectedCategories.includes("Natur")}
        />
        <Kategorie
          id="internet"
          categorieName="Internet"
          handleCategoryChange={handleCategoryChange}
          arrayCategorie={selectedCategories.includes("Internet")}
        />
      </div>

      {/* Gefilterte Blogs anzeigen */}
      {isLoading && <div>Cargando blogs...</div>}
      {error && <div>{error}</div>}
      {blogs && (
        <>
          {filteredBlogs.length > 0 ? (
            <BlogList blogs={currentBlogs} />
          ) : (
            <div className="error-message-container">
              <h2 className="blog-not-found">
                Es wurden keine Blogs mit diesem Begriff gefunden.
              </h2>
            </div>
          )}
          {/* <BlogList blogs={currentBlogs} /> */}
          <Pagination
            blogsPerPage={blogsPerPage}
            totalBlogs={filteredBlogs.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
}

export default Home;
