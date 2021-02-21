import "./BookmarkChoice.scss";
import imageComics1 from "../assets/MarvelsComics1.jpg";
import imageComics2 from "../assets/MarvelsComics2.jpg";
import { useMediaQuery } from "react-responsive";

import { Link } from "react-router-dom";

const BookmarkChoice = ({ baseUrl }) => {
    let oneColumnDisplay = useMediaQuery({ maxWidth: 820 });

    return (
        <div className="bookmark-choice-main">
            <Link
                to={{
                    pathname: "/",
                    state: {
                        onlyBookmarked: true,
                    },
                }}
                style={{
                    textDecoration: "none",
                    color: "black",
                }}
            >
                <div
                    className={
                        oneColumnDisplay
                            ? "bookmark-choice-one-link bookmark-choice-one-link-one-column"
                            : "bookmark-choice-one-link"
                    }
                >
                    <div className="bookmark-choice-title">Personnages</div>
                    <div className="bookmark-aurond-images">
                        <img
                            className="bookmak-choice-image"
                            src="http://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087.jpg"
                            alt="Captain America"
                        />
                        {!oneColumnDisplay && (
                            <img
                                className="bookmak-choice-image"
                                src="http://i.annihil.us/u/prod/marvel/i/mg/c/e0/535fecbbb9784.jpg"
                                alt="3-D Man"
                            />
                        )}
                    </div>
                </div>
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
                <div
                    className={
                        oneColumnDisplay
                            ? "bookmark-choice-one-link bookmark-choice-one-link-one-column"
                            : "bookmark-choice-one-link"
                    }
                >
                    <div className="bookmark-choice-title">Comics</div>
                    <div className="bookmark-aurond-images">
                        <img
                            className="bookmak-choice-image"
                            src={imageComics1}
                            alt="Comics 2"
                        />
                        {!oneColumnDisplay && (
                            <img
                                className="bookmak-choice-image"
                                src={imageComics2}
                                alt="Comics 2"
                            />
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default BookmarkChoice;
