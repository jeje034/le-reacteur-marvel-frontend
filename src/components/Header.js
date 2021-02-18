import "./Header.scss";
import logo from "../assets/langfr-1920px-MarvelLogo.svg_uw9pi8.png";

const Header = () => {
    return (
        <div className="header-main">
            <img className="header-logo" alt="Logo" src={logo} />
        </div>
    );
};

export default Header;
