import "./Comics.scss";

import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

import NavigationBar from "../components/NavigationBar";

import imageNotAvailableVertical from "../assets/marvel-logo-vertical-etire.jpg";
import imageNotAvailableSquare from "../assets/Marvel-Logo-Square.jpeg";

let numberOfComicsToSkip = 0;
let totalNumberOfComics = 0;

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
            setIsDownloadingOtherTimes(false);
        } catch (error) {
            console.log("An error occured :", error.message);
            setComics([]);
        }
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
                "Chargement en cours..."
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
                                        {mobileDisplay && (
                                            <div className="comics-title">
                                                {comic.title}
                                            </div>
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
