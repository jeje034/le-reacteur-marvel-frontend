import "./Characters.scss";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import NavigationBar from "../components/NavigationBar";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import imageNotAvailable from "../assets/Marvel-Logo-Square.jpeg";
import imageNotBookmarked from "../assets/kucb8mj1mses3sugblohufgn8u.png";
import imageBookmarked from "../assets/star-red.png";

let numberOfCharactersToSkip = 0;
let totalNumberOfCharacters = 0;
const cookieSeparator = "_";

const Characters = ({ baseUrl }) => {
    //console.log("deb char");

    let oneColumnDisplay = useMediaQuery({ maxWidth: 1220 });
    let mobileDisplay;
    if (useMediaQuery({ maxWidth: 600 })) {
        mobileDisplay = true;
        oneColumnDisplay = false;
    } else {
        mobileDisplay = false;
    }

    const [isDownloadingFirstTime, setIsDownloadingFirstTime] = useState(true);
    const [isDownloadingOtherTimes, setIsDownloadingOtherTimes] = useState(
        false
    );
    const [characters, setCharacters] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [detailedBookmarks, setDetailedBookmarks] = useState([]);

    const maxNumberOfCharactersPerPage = 100;
    //const maxNumberOfCharactersPerPage = 20;

    let location = useLocation();
    let onlyBookmarked;
    if (location && location.state && location.state.onlyBookmarked) {
        onlyBookmarked = true;
    } else {
        onlyBookmarked = false;
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            // behavior: "smooth",
        });
    };
    const getUrl = () => {
        return `${baseUrl}/characters?skip=${numberOfCharactersToSkip}&limit=${maxNumberOfCharactersPerPage}`;
    };
    const updateBookMarks = (characters) => {
        let initialBookmarks = [];
        initialBookmarks[maxNumberOfCharactersPerPage - 1] = false;
        initialBookmarks.fill(false);

        let bookmarksInString = Cookies.get(
            "marvel-jerome-characters-bookmarked"
        );
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
                let recordedDetailedBookmarksInString = localStorage.getItem(
                    "marvel-jerome-detailed-characters-bookmarks"
                );
                let recordedDetailedBookmarks;

                if (recordedDetailedBookmarksInString) {
                    recordedDetailedBookmarks = JSON.parse(
                        recordedDetailedBookmarksInString
                    );
                } else {
                    recordedDetailedBookmarks = [];
                }
                setDetailedBookmarks(recordedDetailedBookmarks);

                let charactersToDisplay;

                if (
                    location &&
                    location.state &&
                    location.state.onlyBookmarked
                ) {
                    charactersToDisplay = recordedDetailedBookmarks;
                } else {
                    const response = await axios.get(getUrl());
                    totalNumberOfCharacters = response.data.count;
                    charactersToDisplay = response.data.results;
                }

                setCharacters(charactersToDisplay);
                updateBookMarks(charactersToDisplay);

                setIsDownloadingFirstTime(false);
            } catch (error) {
                console.log("An error occured :", error.message);
                setCharacters([]);
            }
        };
        fetchData();
    }, [baseUrl, onlyBookmarked]);

    const changePage = async (numberOfPagesToAdd) => {
        setIsDownloadingOtherTimes(true);
        scrollToTop();
        try {
            if (
                numberOfCharactersToSkip +
                    numberOfPagesToAdd * maxNumberOfCharactersPerPage <=
                totalNumberOfCharacters
            ) {
                numberOfCharactersToSkip +=
                    numberOfPagesToAdd * maxNumberOfCharactersPerPage;
            }

            if (numberOfCharactersToSkip <= 0) {
                numberOfCharactersToSkip = 0;
                //msgjs21 griser bouton précédent et voir aussi pour suivant
            }

            // console.log(
            //     "numberOfCharactersToSkip after",
            //     numberOfCharactersToSkip
            // );
            const response = await axios.get(getUrl());

            setCharacters(response.data.results);
            updateBookMarks(response.data.results);
            setIsDownloadingOtherTimes(false);
        } catch (error) {
            console.log("An error occured :", error.message);
            setCharacters([]);
        }
    };

    const getCardsClassName = (index) => {
        if (mobileDisplay) {
            //console.log("characters-card characters-card-mobile");
            return "characters-card characters-card-mobile";
        }
        if (oneColumnDisplay) {
            //console.log("characters-card");
            return "characters-card";
        }
        if (index % 2 === 0) {
            //console.log("characters-card characters-card-margin-right");
            return "characters-card characters-card-margin-right";
        }
        //console.log("characters-card");
        return "characters-card";
    };

    const getLinkWithParameter = (character) => {
        return {
            pathname: `/comics/${character._id}`,
            state: {
                characterName: character.name,
            },
        };
    };

    const handleBookmarkClick = (index, character) => {
        const newBookmarks = [...bookmarks];
        const newDetailedBookmarks = [...detailedBookmarks];
        newBookmarks[index] = !bookmarks[index];
        let cookie = Cookies.get("marvel-jerome-characters-bookmarked");

        if (newBookmarks[index]) {
            if (!cookie) {
                cookie = character._id;
            } else {
                cookie = `${cookie}${cookieSeparator}${character._id}`;
            }

            newDetailedBookmarks.push({
                name: character.name,
                _id: character._id,
                description: character.description,
                thumbnail: character.thumbnail,
            });
        } else {
            if (cookie.indexOf(character._id + cookieSeparator) >= 0) {
                cookie = cookie.replace(character._id + cookieSeparator, "");
            } else {
                cookie = "";
            }

            for (let i = 0; i < newDetailedBookmarks.length; i++) {
                if (newDetailedBookmarks[i]._id === character._id) {
                    newDetailedBookmarks.splice(i, 1);
                    break;
                }
            }
        }
        Cookies.set("marvel-jerome-characters-bookmarked", cookie, {
            expires: 12000,
        });
        setDetailedBookmarks(newDetailedBookmarks);
        localStorage.setItem(
            "marvel-jerome-detailed-characters-bookmarks",
            JSON.stringify(newDetailedBookmarks)
        );

        setBookmarks(newBookmarks);
    };

    const getCharacterNameAndBookmarkMobile = (character, index) => {
        return (
            <>
                <Link
                    to={getLinkWithParameter(character)}
                    style={{
                        textDecoration: "none",
                        color: "black",
                    }}
                >
                    <div className="characters-name characters-name-mobile">
                        {character.name}
                    </div>
                </Link>
                <div className="characters-around-star-mobile">
                    <img
                        onClick={() => handleBookmarkClick(index, character)}
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

    const getH1 = (location) => {
        if (location && location.state && location.state.onlyBookmarked) {
            return <h1>Personnages favoris</h1>;
        } else {
            return <h1>Personnages</h1>;
        }
    };

    return (
        <div
            className={
                oneColumnDisplay
                    ? "characters-main characters-main-one-column"
                    : mobileDisplay
                    ? "characters-main characters-main-mobile"
                    : "characters-main"
            }
        >
            {isDownloadingFirstTime ? (
                <div className="characters-is-downloading">
                    Chargement en cours...
                </div>
            ) : (
                <div className="characters-downloaded">
                    {getH1(location)}

                    {isDownloadingOtherTimes && (
                        <div className="characters-is-downloading">
                            Chargement en cours...
                        </div>
                    )}

                    <div
                        className={
                            mobileDisplay
                                ? "characters-around-cards characters-around-cards-mobile"
                                : "characters-around-cards"
                        }
                    >
                        {characters.map((character, index) => {
                            return (
                                <div
                                    key={character._id}
                                    className={getCardsClassName(index)}
                                >
                                    {/* Link en 3 fois pour ne pas avoir de link dans les marges */}

                                    {mobileDisplay &&
                                        getCharacterNameAndBookmarkMobile(
                                            character,
                                            index
                                        )}

                                    <div
                                        className={
                                            mobileDisplay
                                                ? "characters-around-image-mobile"
                                                : "characters-around-image"
                                        }
                                    >
                                        <Link
                                            to={getLinkWithParameter(character)}
                                            style={{
                                                textDecoration: "none",
                                                color: "black",
                                            }}
                                        >
                                            <img
                                                className={
                                                    mobileDisplay
                                                        ? "characters-image characters-image-mobile"
                                                        : "characters-image"
                                                }
                                                src={
                                                    character.thumbnail.path ===
                                                        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                                                    character.thumbnail.path ===
                                                        "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708"
                                                        ? imageNotAvailable
                                                        : `${character.thumbnail.path}.${character.thumbnail.extension}`
                                                }
                                                alt={character.name}
                                            />
                                        </Link>
                                        {!mobileDisplay && (
                                            <img
                                                className="characters-bookmark-image"
                                                onClick={() =>
                                                    handleBookmarkClick(
                                                        index,
                                                        character
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
                                    <Link
                                        to={getLinkWithParameter(character)}
                                        style={{
                                            textDecoration: "none",
                                            color: "black",
                                        }}
                                    >
                                        <div
                                            className={
                                                mobileDisplay
                                                    ? "characters-name-and-description characters-name-and-description-mobile"
                                                    : "characters-name-and-description"
                                            }
                                        >
                                            {/* msgjs21 pour mobile, entre autre mettre nom en haut de l'image. Voir si on réduit l'image de façon à faire une carte comme sur PC */}

                                            {!mobileDisplay && (
                                                <div className="characters-name">
                                                    {character.name}
                                                </div>
                                            )}

                                            <div className="characters-description">
                                                {character.description}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {!isDownloadingFirstTime && !isDownloadingOtherTimes && (
                <NavigationBar changePageFunction={changePage} />
            )}
        </div>
    );
};

export default Characters;
