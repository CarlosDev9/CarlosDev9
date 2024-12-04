import '../styles/Navbar.css'
import logo from '../logo.svg';
import { Link } from 'react-router-dom';


function Navbar() {
    return(
        <header className="header">
          <nav className='navbar'>
              <Link class='logo-container' to="/">
                <img className='logo' src={logo} alt="" />  
                <h1 className='logo-title'>React Blogs</h1>
              </Link>    
          </nav>
        </header>
    )
}

export default Navbar


