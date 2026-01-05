class PlanetManager {
    constructor() {
        this.planets = this.initializePlanets();
        this.selectedPlanet = null;
    }
    
    initializePlanets() {
        return [
            {
                name: 'Mercury',
                distance: 80,
                size: 4,
                speed: 0.04,
                angle: 0,
                color: { r: 169, g: 169, b: 169 },
                // Fixed Link
                textureUrl: '/images/2k_mercury.jpg',
                info: { diameter: '4,879 km', distanceFromSun: '57.9 million km', orbitalPeriod: '88 days', surfaceTemp: '-173°C to 427°C', moons: '0', description: 'The smallest planet and closest to the Sun.' }
            },
            {
                name: 'Venus',
                distance: 120,
                size: 9,
                speed: 0.015,
                angle: Math.PI / 4,
                color: { r: 255, g: 198, b: 73 },
                // Fixed Link
                textureUrl: '/images/2k_venus.jpg',
                info: { diameter: '12,104 km', distanceFromSun: '108.2 million km', orbitalPeriod: '225 days', surfaceTemp: '462°C', moons: '0', description: 'The hottest planet with a thick toxic atmosphere.' }
            },
            {
                name: 'Earth',
                distance: 160,
                size: 10,
                speed: 0.01,
                angle: Math.PI / 2,
                color: { r: 100, g: 149, b: 237 },
                // Working Link
                textureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Solarsystemscope_texture_2k_earth_daymap.jpg/1024px-Solarsystemscope_texture_2k_earth_daymap.jpg',
                moons: [{ name: 'Moon', size: 2.5, distance: 18, speed: 0.05, color: {r: 200, g: 200, b: 200}, textureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1024px-FullMoon2010.jpg' }],
                info: { diameter: '12,742 km', distanceFromSun: '149.6 million km', orbitalPeriod: '365.25 days', surfaceTemp: '-88°C to 58°C', moons: '1 (Moon)', description: 'Our home planet.' }
            },
            {
                name: 'Mars',
                distance: 200,
                size: 6,
                speed: 0.008,
                angle: Math.PI,
                color: { r: 193, g: 68, b: 14 },
                // Working Link
                textureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1024px-OSIRIS_Mars_true_color.jpg',
                moons: [
                    { name: 'Phobos', size: 1.2, distance: 12, speed: 0.08, color: {r: 150, g: 100, b: 100} },
                    { name: 'Deimos', size: 1.0, distance: 18, speed: 0.04, color: {r: 150, g: 100, b: 100} }
                ],
                info: { diameter: '6,779 km', distanceFromSun: '227.9 million km', orbitalPeriod: '687 days', surfaceTemp: '-87°C to -5°C', moons: '2 (Phobos & Deimos)', description: 'The Red Planet.' }
            },
            {
                name: 'Jupiter',
                distance: 280,
                size: 20,
                speed: 0.002,
                angle: 3 * Math.PI / 2,
                color: { r: 216, g: 202, b: 157 },
                // Fixed Link
                textureUrl: '/images/2k_jupiter.jpg',
                moons: [
                    { name: 'Io', size: 2.5, distance: 28, speed: 0.06, color: {r: 200, g: 200, b: 100} },
                    { name: 'Europa', size: 2.2, distance: 35, speed: 0.04, color: {r: 200, g: 200, b: 255} },
                    { name: 'Ganymede', size: 3.5, distance: 45, speed: 0.02, color: {r: 150, g: 150, b: 150} }
                ],
                info: { diameter: '139,820 km', distanceFromSun: '778.5 million km', orbitalPeriod: '12 years', surfaceTemp: '-108°C', moons: '95 known', description: 'The largest planet.' }
            },
            {
                name: 'Saturn',
                distance: 360,
                size: 18,
                speed: 0.0009,
                angle: Math.PI / 6,
                color: { r: 250, g: 227, b: 171 },
                // Fixed Link
                textureUrl: '/images/2k_saturn.jpg',
                hasRings: true,
                moons: [{ name: 'Titan', size: 3.8, distance: 40, speed: 0.03, color: {r: 200, g: 180, b: 100} }],
                info: { diameter: '116,460 km', distanceFromSun: '1.43 billion km', orbitalPeriod: '29 years', surfaceTemp: '-139°C', moons: '146 known', description: 'Famous for its spectacular ring system.' }
            },
            {
                name: 'Uranus',
                distance: 420,
                size: 14,
                speed: 0.0004,
                angle: 2 * Math.PI / 3,
                color: { r: 79, g: 208, b: 231 },
                // Fixed Link
                textureUrl: '/images/2k_uranus.jpg',
                moons: [{ name: 'Titania', size: 2.0, distance: 25, speed: 0.04, color: {r: 200, g: 200, b: 200} }],
                info: { diameter: '50,724 km', distanceFromSun: '2.87 billion km', orbitalPeriod: '84 years', surfaceTemp: '-197°C', moons: '28 known', description: 'An ice giant that rotates on its side.' }
            },
            {
                name: 'Neptune',
                distance: 480,
                size: 14,
                speed: 0.0001,
                angle: 5 * Math.PI / 4,
                color: { r: 62, g: 84, b: 232 },
                // Fixed Link
                textureUrl: '/images/2k_neptune.jpg',
                moons: [{ name: 'Triton', size: 2.1, distance: 25, speed: 0.03, color: {r: 200, g: 220, b: 255} }],
                info: { diameter: '49,244 km', distanceFromSun: '4.50 billion km', orbitalPeriod: '165 years', surfaceTemp: '-201°C', moons: '16 known', description: 'The windiest planet in the solar system.' }
            }
        ];
    }
    
    // ... [KEEP ALL OTHER METHODS BELOW THE SAME] ...
    
    updatePositions(speed) {
        this.planets.forEach(planet => {
            planet.angle += planet.speed * speed;
            if (planet.angle > Math.PI * 2) {
                planet.angle -= Math.PI * 2;
            }
            // Update Moon Angles
            if (planet.moons) {
                planet.moons.forEach(moon => {
                    moon.angle = (moon.angle || 0) + moon.speed * speed * 2;
                });
            }
        });
    }
    
    resetPositions() {
        const initialAngles = [0, Math.PI / 4, Math.PI / 2, Math.PI, 3 * Math.PI / 2, Math.PI / 6, 2 * Math.PI / 3, 5 * Math.PI / 4];
        this.planets.forEach((planet, index) => {
            planet.angle = initialAngles[index];
            if (planet.moons) planet.moons.forEach(m => m.angle = Math.random() * 6);
        });
    }
    
    getPlanets() { return this.planets; }
    getPlanetByName(name) { return this.planets.find(p => p.name === name); }
    selectPlanet(planet) { this.selectedPlanet = planet; }
    getSelectedPlanet() { return this.selectedPlanet; }
    
    addCustomPlanet(config) {
        const hex = config.color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const newPlanet = {
            name: config.name,
            distance: config.distance,
            size: config.size,
            speed: config.speed,
            angle: Math.random() * Math.PI * 2,
            color: { r, g, b },
            info: {
                diameter: `${config.size * 1000} km`,
                distanceFromSun: `${(config.distance * 1.5).toFixed(1)} million km`,
                orbitalPeriod: `${Math.floor(365 / (config.speed * 100))} days`,
                surfaceTemp: 'Unknown',
                moons: config.moons || '0',
                description: config.description || 'A custom planet created by you!'
            },
            isCustom: true
        };
        
        let insertIndex = this.planets.length;
        for (let i = 0; i < this.planets.length; i++) {
            if (this.planets[i].distance > config.distance) {
                insertIndex = i;
                break;
            }
        }
        
        this.planets.splice(insertIndex, 0, newPlanet);
        return newPlanet;
    }

    addMoon(planetName, moonConfig) {
        const planet = this.getPlanetByName(planetName);
        if (!planet) return false;
        if (!planet.moons) planet.moons = [];

        const hex = moonConfig.color.replace('#', '');
        planet.moons.push({
            name: moonConfig.name,
            size: parseFloat(moonConfig.size),
            distance: parseFloat(moonConfig.distance),
            speed: parseFloat(moonConfig.speed),
            color: { r: parseInt(hex.substr(0, 2), 16), g: parseInt(hex.substr(2, 2), 16), b: parseInt(hex.substr(4, 2), 16) },
            angle: Math.random() * 6
        });
        planet.info.moons = `${planet.moons.length} (Updated)`;
        return true;
    }

    removeMoon(planetName, moonIndex) {
        const planet = this.getPlanetByName(planetName);
        if (planet && planet.moons) {
            planet.moons.splice(moonIndex, 1);
            planet.info.moons = `${planet.moons.length} (Updated)`;
            return true;
        }
        return false;
    }
    
    editPlanet(originalName, config) {
        const planet = this.getPlanetByName(originalName);
        if (!planet) return null;

        const hex = config.color.replace('#', '');
        planet.name = config.name;
        planet.distance = config.distance;
        planet.size = config.size;
        planet.speed = config.speed;
        planet.color = { r: parseInt(hex.substr(0, 2), 16), g: parseInt(hex.substr(2, 2), 16), b: parseInt(hex.substr(4, 2), 16) };
        planet.info.description = config.description;
        this.planets.sort((a, b) => a.distance - b.distance);
        return planet;
    }
    
    removePlanet(planet) {
        const index = this.planets.indexOf(planet);
        if (index > -1 && planet.isCustom) {
            this.planets.splice(index, 1);
            return true;
        }
        return false;
    }
}