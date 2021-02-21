import { Link } from "react-router-dom";

const BookmarkChoice = ({ baseUrl }) => {
    return (
        <div>
            <Link
                to={{
                    pathname: "/charactersBookmarked",
                    state: {
                        onlyBookmarked: true,
                    },
                }}
                style={{
                    textDecoration: "none",
                    color: "black",
                }}
            >
                <button>Personnages</button>
            </Link>

            <Link
                to={{
                    pathname: "/comics",
                    state: {
                        onlyBookmarked: true,
                    },
                }}
                style={{
                    textDecoration: "none",
                    color: "black",
                }}
            >
                <button>Comics</button>
            </Link>
        </div>
    );
};

export default BookmarkChoice;
