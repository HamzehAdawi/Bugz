function Grass() {
    return (
        <div
            className="grass"
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