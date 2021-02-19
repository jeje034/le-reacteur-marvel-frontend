import "./Characters.scss";

import { useState, useEffect } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

import NavigationBar from "../components/NavigationBar";

let numberOfCharactersToSkip = 0;
let totalNumberOfCharcters = 0;

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
    const [characters, setcharacters] = useState([]);

    const maxNumberOfCharactersPerPage = 100;

    const getUrl = () => {
        return `${baseUrl}/characters?skip=${numberOfCharactersToSkip}&limit=${maxNumberOfCharactersPerPage}`;
        //return `${baseUrl}/characters?skip=${numberOfCharactersToSkip}&limit=3`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(getUrl());
                totalNumberOfCharcters = response.data.count;
                setcharacters(response.data.results);
                setIsDownloadingFirstTime(false);
            } catch (error) {
                console.log("An error occured :", error.message);
                setcharacters([]);
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
                totalNumberOfCharcters
            ) {
                numberOfCharactersToSkip +=
                    numberOfPagesToAdd * maxNumberOfCharactersPerPage;
            }

            if (numberOfCharactersToSkip <= 0) {
                numberOfCharactersToSkip = 0;
                //msgjs21 griser bouton précédent et voir aussi pour suivant
            }

            console.log(
                "numberOfCharactersToSkip after",
                numberOfCharactersToSkip
            );
            const response = await axios.get(getUrl());

            setcharacters(response.data.results);
            setIsDownloadingOtherTimes(false);
        } catch (error) {
            console.log("An error occured :", error.message);
            setcharacters([]);
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
                        <div class-name="characters-is-downloading-other-times">
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
                                    <div
                                        className={
                                            mobileDisplay
                                                ? "characters-around-image-mobile"
                                                : "characters-around-image"
                                        }
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
                                    </div>

                                    <div className="characters-name-and-description">
                                        <div>{character.name}</div>
                                        <div>{character.description}</div>
                                    </div>
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
