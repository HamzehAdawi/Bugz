function Grass() {
    return (
        <div
            className="grass"
            // use inline backgroundImage so webpack/CRA resolves the asset
            style={{
                backgroundImage: `url(${require('../assets/grass.png')})`,
                backgroundRepeat: 'repeat-x',
                backgroundPosition: 'bottom left',
                backgroundSize: 'auto 100%'
            }}
        />
    );
}

export default Grass;