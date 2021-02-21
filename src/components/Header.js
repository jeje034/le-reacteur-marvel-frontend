import "./Header.scss";

import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import logo from "../assets/langfr-1920px-MarvelLogo.svg_uw9pi8.png";

const Header = () => {
    let abreviationsRequired = false;
    if (useMediaQuery({ maxWidth: 500 })) {
        abreviationsRequired = true;
    }

    return (
        <div className="header-main">
            <img className="header-logo" alt="Logo" src={logo} />
            <div className="header-menu">
                <Link
                    to={{
                        pathname: "/",
                        state: {
                            onlyBookmarked: false,
                        },
                    }}
                    style={{
                        textDecoration: "none",
                        color: "black",
                    }}
                >
                    <div className="header-menu-item">
                        {abreviationsRequired ? "Pers." : "Personnages"}
                    </div>
                </Link>
                <Link
                    to="/comics"
                    style={{
                        textDecoration: "none",
                        color: "black",
                    }}
                >
                    <div className="header-menu-item">Comics</div>
                </Link>
                <Link
                    to="/bookmarks"
                    style={{
                        textDecoration: "none",
                        color: "black",
                    }}
                >
                    <div className="header-menu-item">
                        {abreviationsRequired ? "Fav." : "Favoris"}
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Header;
