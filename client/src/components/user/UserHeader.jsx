import React, { useState } from 'react';
import './UserHeader.css';
import { useSelector, useDispatch } from 'react-redux';
import { MdTravelExplore } from 'react-icons/md';
import { AiFillCloseCircle } from 'react-icons/ai';
import { TbGridDots } from 'react-icons/tb';
import { setLogout } from '../../redux/features/userrSlice';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const UserHeader = () => {
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();

  const toggleNav = () => {
    setActive(!active);
  };

  const handleLogout = () => {
    dispatch(setLogout());
  };

  const user = useSelector(state => state.userr.user);
  const userName = user?.UserDoc?.firstname;

  return (
    <section
      className="navBarSection"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 }}
    >
      <header className="header flex">
        <div className="logoDiv">
          <Link to="/" className="logo flex"> {/* Use Link component for navigation */}
            <h1>
              <MdTravelExplore className="icon" />Yathra
            </h1>
          </Link>
        </div>
        <div className={`navBar ${active ? 'activeNavbar' : ''}`}>
          <ul className="navLists flex">
            {user?.UserDoc?._id ? (
              <>
                <li className="navItem">
                  <Link to="/" className="navLink"> {/* Use Link for navigation */}
                    HOME
                  </Link>
                </li>

                <li className="navItem">
                  <Link to="/packages" className="navLink"> {/* Use Link for navigation */}
                    Packages
                  </Link>
                </li>

                <li className="navItem">
                  <Link to="/chat" className="navLink"> {/* Use Link for navigation */}
                    Chat
                  </Link>
                </li>
                <li className="navItem">
                  <Link to="/profile" > {/* Use Link for navigation */}
                    Profile
                  </Link>
                </li>

                <li className="navItem">
                  <Link to="/contact" className="navLink"> {/* Use Link for navigation */}
                    Contact
                  </Link>
                </li>

                <li className="navItem">
                  <button className="btn" onClick={handleLogout}>
                    LogOut
                  </button>
                </li>
              </>
            ) : (
              <li className="navItem">
                <button className="btn">
                  <Link to="/login">Login</Link> {/* Use Link for navigation */}
                </button>
              </li>
            )}
          </ul>

          <div onClick={toggleNav} className="closeNavbar">
            <AiFillCloseCircle className="icon" />
          </div>
        </div>
        <div onClick={toggleNav} className="toggleNavbar">
          <TbGridDots className="icon" />
        </div>
      </header>
    </section>
  );
};

export default UserHeader;
