import "./Comics.scss";

import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import Cookies from "js-cookie";

import NavigationBar from "../components/NavigationBar";

import imageNotAvailableVertical from "../assets/marvel-logo-vertical-etire.jpg";
import imageNotAvailableSquare from "../assets/Marvel-Logo-Square.jpeg";
import imageNotBookmarked from "../assets/kucb8mj1mses3sugblohufgn8u.png";
import imageBookmarked from "../assets/star-red.png";

let numberOfComicsToSkip = 0;
let totalNumberOfComics = 0;
const cookieSeparator = "_";

const Comics = ({ baseUrl }) => {
    let oneColumnDisplay = useMediaQuery({ maxWidth: 1600 });
    let mobileDisplay;
    if (useMediaQuery({ maxWidth: 780 })) {
        mobileDisplay = true;
        oneColumnDisplay = false;
    } else {
        mobileDisplay = false;
    }

    const [isDownloadingFirstTime, setIsDownloadingFirstTime] = useState(true);
    const [isDownloadingOtherTimes, setIsDownloadingOtherTimes] = useState(
        false
    );
    const [comics, setComics] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);

    const maxNumberOfComicsPerPage = 100;
    //const maxNumberOfComicsPerPage = 3;
    const { id } = useParams();
    let location = useLocation();

    const getUrl = (id) => {
        const url = `${baseUrl}/comics`;

        if (id) {
            return `${url}/${id}`;
        }

        return `${url}/?skip=${numberOfComicsToSkip}&limit=${maxNumberOfComicsPerPage}`;
    };

    const updateBookMarks = (characters) => {
        let initialBookmarks = [];
        initialBookmarks[maxNumberOfComicsPerPage - 1] = false;
        initialBookmarks.fill(false);

        let bookmarksInString = Cookies.get("marvel-jerome-comics-bookmarked");
        if (bookmarksInString) {
            let bookmarksInArray = bookmarksInString.split(cookieSeparator);
            for (let i = 0; i < characters.length; i++) {
                if (bookmarksInArray.indexOf(characters[i]._id) >= 0) {
                    initialBookmarks[i] = true;
                }
            }
        }
        setBookmarks(initialBookmarks);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(getUrl(id));
                totalNumberOfComics = response.data.count;
                setComics(
                    response.data.results
                        ? response.data.results
                        : response.data.comics
                );
                updateBookMarks(
                    response.data.results
                        ? response.data.results
                        : response.data.comics
                );
                setIsDownloadingFirstTime(false);
            } catch (error) {
                console.log("An error occured :", error.message);
                setComics([]);
            }
        };
        fetchData();
    }, [id, baseUrl]);

    const changePage = async (numberOfPagesToAdd) => {
        setIsDownloadingOtherTimes(true);
        try {
            if (
                numberOfComicsToSkip +
                    numberOfPagesToAdd * maxNumberOfComicsPerPage <=
                totalNumberOfComics
            ) {
                numberOfComicsToSkip +=
                    numberOfPagesToAdd * maxNumberOfComicsPerPage;
            }

            if (numberOfComicsToSkip <= 0) {
                numberOfComicsToSkip = 0;
                //msgjs21 griser bouton précédent et voir aussi pour suivant
            }

            //console.log("numberOfComicsToSkip after", numberOfComicsToSkip);
            const response = await axios.get(getUrl());

            setComics(
                response.data.results
                    ? response.data.results
                    : response.data.comics
            );
            updateBookMarks(
                response.data.results
                    ? response.data.results
                    : response.data.comics
            );
            setIsDownloadingOtherTimes(false);
        } catch (error) {
            console.log("An error occured :", error.message);
            setComics([]);
        }
    };

    const handleBookmarkClick = (index, comicsId) => {
        const newBookmarks = [...bookmarks];
        newBookmarks[index] = !bookmarks[index];
        let cookie = Cookies.get("marvel-jerome-comics-bookmarked");

        if (newBookmarks[index]) {
            if (!cookie) {
                cookie = comicsId;
            } else {
                cookie = `${cookie}${cookieSeparator}${comicsId}`;
            }
        } else {
            if (cookie.indexOf(comicsId + cookieSeparator) >= 0) {
                cookie = cookie.replace(comicsId + cookieSeparator, "");
            } else {
                cookie = "";
            }
        }
        Cookies.set("marvel-jerome-comics-bookmarked", cookie);

        setBookmarks(newBookmarks);
    };

    const getComicsNameAndBookmarkMobile = (comics, index) => {
        return (
            <>
                <div className="comics-title comics-title-mobile">
                    {comics.title}
                </div>
                <div className="comics-around-star-mobile">
                    <img
                        onClick={() => handleBookmarkClick(index, comics._id)}
                        src={
                            bookmarks[index]
                                ? imageBookmarked
                                : imageNotBookmarked
                        }
                        style={{
                            width: "40px",
                        }}
                    />
                </div>
            </>
        );
    };

    const getCardsClassName = (index) => {
        if (mobileDisplay) {
            //console.log("comics-card comics-card-mobile");
            return "comics-card comics-card-mobile";
        }
        if (oneColumnDisplay) {
            //console.log("comics-card");
            return "comics-card";
        }
        if (index % 2 === 0) {
            //console.log("comics-card comics-card-margin-right");
            return "comics-card comics-card-margin-right";
        }
        //console.log("comics-card");
        return "comics-card";
    };

    return (
        <div
            className={
                oneColumnDisplay
                    ? "comics-main comics-main-one-column"
                    : mobileDisplay
                    ? "comics-main comics-main-mobile"
                    : "comics-main"
            }
        >
            {isDownloadingFirstTime ? (
                <div className="comics-is-downloading">
                    Chargement en cours...
                </div>
            ) : (
                <div className="comics-downloaded">
                    {location &&
                    location.state &&
                    location.state.characterName ? (
                        <h1>{location.state.characterName} - Comics</h1>
                    ) : (
                        <h1>Comics</h1>
                    )}

                    {isDownloadingOtherTimes && (
                        <div className="comics-is-downloading-other-times">
                            Chargement en cours...
                        </div>
                    )}

                    <div
                        className={
                            mobileDisplay
                                ? "comics-around-cards comics-around-cards-mobile"
                                : "comics-around-cards"
                        }
                    >
                        {comics && comics.length > 0 ? (
                            comics.map((comic, index) => {
                                return (
                                    <div
                                        key={comic._id}
                                        className={getCardsClassName(index)}
                                    >
                                        {mobileDisplay &&
                                            getComicsNameAndBookmarkMobile(
                                                comic,
                                                index
                                            )}
                                        <div
                                            className={
                                                mobileDisplay
                                                    ? "comics-around-image-mobile"
                                                    : "comics-around-image"
                                            }
                                        >
                                            <img
                                                className={
                                                    mobileDisplay
                                                        ? "comics-image comics-image-mobile"
                                                        : "comics-image"
                                                }
                                                src={
                                                    comic.thumbnail.path ===
                                                        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                                                    comic.thumbnail.path ===
                                                        "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708"
                                                        ? mobileDisplay
                                                            ? imageNotAvailableSquare
                                                            : imageNotAvailableVertical
                                                        : `${comic.thumbnail.path}.${comic.thumbnail.extension}`
                                                }
                                                alt={comic.name}
                                            />
                                            {!mobileDisplay && (
                                                <img
                                                    className="comics-bookmark-image"
                                                    onClick={() =>
                                                        handleBookmarkClick(
                                                            index,
                                                            comic._id
                                                        )
                                                    }
                                                    src={
                                                        bookmarks[index]
                                                            ? imageBookmarked
                                                            : imageNotBookmarked
                                                    }
                                                />
                                            )}
                                        </div>

                                        <div
                                            className={
                                                mobileDisplay
                                                    ? "comics-title-and-description comics-title-and-description-mobile"
                                                    : "comics-title-and-description"
                                            }
                                        >
                                            {!mobileDisplay && (
                                                <div className="comics-title">
                                                    {comic.title}
                                                </div>
                                            )}

                                            <div className="comics-description">
                                                {/* msgjs21 Vraiment à la toute fin, voir pour remplacer les <br> par des saut de lignes plutôt que "" */}
                                                {comic.description
                                                    ? comic.description.replace(
                                                          /<br>/g,
                                                          ""
                                                      )
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="comics-no-comics-found">
                                Aucun comics trouvé
                            </div>
                        )}
                    </div>
                </div>
            )}
            {comics &&
                comics.length > 0 &&
                !(
                    location &&
                    location.state &&
                    location.state.characterName
                ) && <NavigationBar changePageFunction={changePage} />}
        </div>
    );
};

export default Comics;
