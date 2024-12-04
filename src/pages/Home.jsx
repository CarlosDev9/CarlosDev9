import BlogList from '../components/BlogList';
import { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import '../styles/Home.css';

function Home() {
  const [blogs, setBlogs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State für die Suchleiste

  useEffect(() => {
    fetch('http://localhost:8000/blogs?_sort=date&_order=asc')
      .then(res => {
        if (!res.ok) {
          throw Error('Fehler beim Laden');
        }
        return res.json();
      })
      .then(data => {
        setBlogs(data);
        setIsLoading(false);
        setError(null);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err.message);
      });
  }, []);

  // Verwaltung ausgewählter Kategorien
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, value]); // Ausgewählte Kategorie hinzufügen
    } else {
      setSelectedCategories(selectedCategories.filter(cat => cat !== value)); // Löschen, wenn deaktiviert
    }
    setCurrentPage(1); // Wenn sich die Kategorie ändert, starten Sie die Seite mit der ersten Seite neu
  };

  // Filtern Sie Blogs nach Kategorien und suchen Sie
  const filteredBlogs = blogs
    ? blogs.filter(blog =>
        // Filtern nach Kategorien und Titel in der Suchleiste
        (selectedCategories.length === 0 || blog.categories.some(category => selectedCategories.includes(category))) &&
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) // Nach Suchbegriff filtern
      )
    : [];

  // Aktuelle Blogs auf der Seite
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Seite wechseln
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="home">
      
      {/* Suchleiste */}
      <div className="search-bar-container">
        <input
          className='search-bar'
          type="text"
          placeholder="Artikeln nach Titeln suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}  // Suchbegriff aktualisieren
        />
      </div>

      {/* Filter Kategorien */}
      <div className="filter">
      
        <div className='category'>
            <input 
              id="technik"
              type="checkbox" 
              name="cb"
              value="Technik" 
              onChange={handleCategoryChange}
              checked={selectedCategories.includes('Technik')}
            />
           <label htmlFor="technik">Technik</label>
        </div>

        <div className='category'>
            <input 
              id="lifestyle"
              type="checkbox" 
              name="cb"
              value="Lifestyle" 
              onChange={handleCategoryChange}
              checked={selectedCategories.includes('Lifestyle')}
            />
           <label htmlFor="lifestyle">Lifestyle</label>
        </div>

        <div className='category'>
            <input 
              id="wirtschaft"
              type="checkbox" 
              name="cb"
              value="Wirtschaft" 
              onChange={handleCategoryChange}
              checked={selectedCategories.includes('Wirtschaft')}
            />
           <label htmlFor="wirtschaft">Wirtschaft</label>
        </div>

        <div className='category'>
            <input 
              id="natur"
              type="checkbox" 
              name="cb"
              value="Natur" 
              onChange={handleCategoryChange}
              checked={selectedCategories.includes('Natur')}
            />
           <label htmlFor="natur">Natur</label>
        </div>

        <div className='category'>
            <input 
              id="internet"
              type="checkbox" 
              name="cb"
              value="Internet" 
              onChange={handleCategoryChange}
              checked={selectedCategories.includes('Internet')}
            />
           <label htmlFor="internet">Internet</label>
        </div>
 
      </div>

      {/* Gefilterte Blogs anzeigen */}
      {isLoading && <div>Cargando blogs...</div>}
      {error && <div>{error}</div>}
      {blogs && (
        <>
          <BlogList blogs={currentBlogs} />
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
