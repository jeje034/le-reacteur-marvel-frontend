import "./Characters.scss";

import { useState, useEffect } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

import NavigationBar from "../components/NavigationBar";
import { Link } from "react-router-dom";

let numberOfCharactersToSkip = 0;
let totalNumberOfCharacters = 0;

const Characters = ({ baseUrl }) => {
    let oneColumnDisplay = useMediaQuery({ maxWidth: 1200 });
    let mobileDisplay;
    if (useMediaQuery({ maxWidth: 560 })) {
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

    const maxNumberOfCharactersPerPage = 100;

    const getUrl = () => {
        return `${baseUrl}/characters?skip=${numberOfCharactersToSkip}&limit=${maxNumberOfCharactersPerPage}`;
        //return `${baseUrl}/characters?skip=${numberOfCharactersToSkip}&limit=3`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(getUrl());
                totalNumberOfCharacters = response.data.count;
                setCharacters(response.data.results);
                setIsDownloadingFirstTime(false);
            } catch (error) {
                console.log("An error occured :", error.message);
                setCharacters([]);
            }
        };
        fetchData();
    }, [baseUrl]);

    const changePage = async (numberOfPagesToAdd) => {
        setIsDownloadingOtherTimes(true);
        try {
            console.log(
                "numberOfCharactersToSkip before",
                numberOfCharactersToSkip
            );

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
                "Chargement en cours..."
            ) : (
                <div className="characters-downloaded">
                    <h1>Personnages</h1>

                    {isDownloadingOtherTimes && (
                        <div className="characters-is-downloading-other-times">
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

                                    {mobileDisplay && (
                                        <Link
                                            to={`/comics`}
                                            style={{
                                                textDecoration: "none",
                                                color: "black",
                                            }}
                                        >
                                            <div className="characters-name">
                                                {character.name}
                                            </div>
                                        </Link>
                                    )}

                                    <div
                                        className={
                                            mobileDisplay
                                                ? "characters-around-image-mobile"
                                                : "characters-around-image"
                                        }
                                    >
                                        <Link
                                            to={`/comics`}
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
                                                src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                                                alt={character.name}
                                            />
                                        </Link>
                                    </div>
                                    <Link
                                        to={`/comics`}
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
            <NavigationBar changePageFunction={changePage} />
        </div>
    );
};

export default Characters;
