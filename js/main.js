class OrbitApp {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.solarSystem = new SolarSystem(this.container);
        this.planetManager = new PlanetManager();
        this.uiManager = new UIManager();
        this.currentHoveredPlanetName = null;
        this.init();
    }
    
    init() {
        this.uiManager.setupControls({
            onSpeedChange: (s) => this.solarSystem.setSpeed(s),
            onZoomChange: (z) => this.solarSystem.setZoom(z),
            onPauseToggle: (p) => p ? this.solarSystem.pause() : this.solarSystem.resume(),
            onReset: () => {
                this.solarSystem.reset();
                this.planetManager.resetPositions();
                this.uiManager.hidePlanetInfo();
                this.solarSystem.updatePlanets(this.planetManager.getPlanets());
            },
            onToggleOrbits: () => this.solarSystem.toggleOrbits(),
            onToggleTopView: () => this.solarSystem.toggleTopView()
        });
        
        this.uiManager.setupCreatePlanetHandler(
            (data) => {
                const p = this.planetManager.addCustomPlanet(data);
                this.refreshUI();
                this.showNotification(`✨ ${p.name} created!`);
            },
            (origName, data) => {
                const p = this.planetManager.editPlanet(origName, data);
                if(p) {
                    this.refreshUI();
                    this.uiManager.showPlanetInfo(p, null, (pl) => this.openMoonManager(pl));
                    this.showNotification(`📝 ${p.name} updated!`);
                }
            }
        );
        
        this.refreshUI();
        this.startAnimation();
        console.log('🚀 Orbit Solar System Simulator initialized!');
    }
    
    refreshPlanetButtons() {
        this.uiManager.createPlanetButtons(
            this.planetManager.getPlanets(),
            (planet) => {
                this.planetManager.selectPlanet(planet);
                this.uiManager.showPlanetInfo(
                    planet, 
                    (name, data) => { }, // Edit handled by setupCreatePlanetHandler
                    (p) => this.openMoonManager(p) // Manage Moons
                );
            },
            (planet) => { 
                if(this.planetManager.removePlanet(planet)) { 
                    this.refreshUI(); 
                    this.uiManager.hidePlanetInfo(); 
                    this.showNotification(`🗑️ ${planet.name} deleted`); 
                } 
            }
        );
    }

    openMoonManager(planet) {
        this.uiManager.openMoonManager(
            planet,
            (pName, mData) => { this.planetManager.addMoon(pName, mData); this.refreshUI(); },
            (pName, mIndex) => { this.planetManager.removeMoon(pName, mIndex); this.refreshUI(); }
        );
    }

    refreshUI() {
        this.solarSystem.updatePlanets(this.planetManager.getPlanets());
        this.refreshPlanetButtons();
        if(this.planetManager.selectedPlanet) {
             const p = this.planetManager.getPlanetByName(this.planetManager.selectedPlanet.name);
             if(p) this.uiManager.showPlanetInfo(p, null, (pl) => this.openMoonManager(pl));
        }
    }
    
    showNotification(msg) {
        const n = document.createElement('div');
        n.textContent = msg;
        n.style.cssText = 'position:fixed; top:20px; right:20px; background:linear-gradient(45deg,#4a90e2,#7b68ee); color:white; padding:15px 25px; border-radius:10px; box-shadow:0 5px 20px rgba(0,0,0,0.5); z-index:2000; font-weight:600; animation:slideInRight 0.3s ease-out;';
        document.body.appendChild(n);
        setTimeout(() => { n.remove(); }, 3000);
    }
    
    startAnimation() {
        this.solarSystem.start(() => {
            // ONLY move planets if not paused
            if (!this.solarSystem.isPaused) {
                this.planetManager.updatePositions(this.solarSystem.speed);
            }
            // ALWAYS render the scene (fixes Zoom/Hover while paused)
            const renderData = this.solarSystem.render(this.planetManager.getPlanets());
            
            if (!this.uiManager.isEditing) {
                const h = renderData.hoveredPlanet;
                if (h) {
                    if (this.currentHoveredPlanetName !== h.name) {
                        this.currentHoveredPlanetName = h.name;
                        this.uiManager.showPlanetInfo(h, null, (pl) => this.openMoonManager(pl));
                    }
                } else {
                    if (this.currentHoveredPlanetName !== null) {
                        this.currentHoveredPlanetName = null;
                        this.uiManager.hidePlanetInfo();
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => { window.orbitApp = new OrbitApp(); });