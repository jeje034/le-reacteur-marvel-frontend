import "./NavigationBar.scss";

const NavigationBar = ({ changePageFunction }) => {
    return (
        <div className="navigation-bar-main">
            <button
                className="navigation-bar-button navigation-bar-button-previous"
                onClick={() => changePageFunction(-1)}
            >
                Précédent
            </button>
            <button
                className="navigation-bar-button navigation-bar-button-next"
                onClick={() => changePageFunction(+1)}
            >
                Suivant
            </button>
        </div>
    );
};

export default NavigationBar;
