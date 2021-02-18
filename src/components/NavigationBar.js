import "./NavigationBar.scss";

const NavigationBar = ({ changePageFunction }) => {
    return (
        <div className="navigation-bar-main">
            <button onClick={() => changePageFunction(-1)}>Précédent</button>
            <button onClick={() => changePageFunction(+1)}>Suivant</button>
        </div>
    );
};

export default NavigationBar;
