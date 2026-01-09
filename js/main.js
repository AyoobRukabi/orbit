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
                this.planetManager.selectPlanet(null); // Clear selection
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
                    this.displayPlanetInfo(p);
                    this.showNotification(`📝 ${p.name} updated!`);
                }
            }
        );
        
        this.refreshUI();
        
        // Handle 3D Click
        this.container.addEventListener('click', (e) => {
            const clickedPlanet = this.solarSystem.getClickedPlanet(e);
            if (clickedPlanet) {
                this.planetManager.selectPlanet(clickedPlanet);
                this.displayPlanetInfo(clickedPlanet);
            } else {
                this.planetManager.selectPlanet(null);
                this.uiManager.hidePlanetInfo();
            }
        });

        this.startAnimation();
        console.log('🚀 Orbit Solar System Simulator initialized!');
    }
    
    // Helper to Show Info with Callbacks
    displayPlanetInfo(planet) {
        this.uiManager.showPlanetInfo(
            planet, 
            (name, data) => { }, // Edit handled elsewhere
            (p) => this.openMoonManager(p),
            () => this.planetManager.selectPlanet(null) // onClose: Clear selection
        );
    }

    refreshPlanetButtons() {
        this.uiManager.createPlanetButtons(
            this.planetManager.getPlanets(),
            (planet) => {
                this.planetManager.selectPlanet(planet);
                this.displayPlanetInfo(planet);
            },
            (planet) => { 
                if(this.planetManager.removePlanet(planet)) { 
                    this.planetManager.selectPlanet(null);
                    this.uiManager.hidePlanetInfo();
                    this.refreshUI(); 
                    this.showNotification(`🗑️ ${planet.name} deleted`); 
                } 
            }
        );
    }

    openMoonManager(planet) {
        this.uiManager.openMoonManager(
            planet,
            (pName, mData) => { this.planetManager.addMoon(pName, mData); this.refreshUI(); },
            (pName, mIndex) => { this.planetManager.removeMoon(pName, mIndex); this.refreshUI(); },
            (pName, mIndex, mData) => { this.planetManager.updateMoon(pName, mIndex, mData); this.refreshUI(); }
        );
    }

    refreshUI() {
        this.solarSystem.updatePlanets(this.planetManager.getPlanets());
        this.refreshPlanetButtons();
        if(this.planetManager.selectedPlanet) {
             const p = this.planetManager.getPlanetByName(this.planetManager.selectedPlanet.name);
             if(p) this.displayPlanetInfo(p);
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
            if (!this.solarSystem.isPaused) {
                this.planetManager.updatePositions(this.solarSystem.speed);
            }
            const renderData = this.solarSystem.render(this.planetManager.getPlanets());
            
            // FIX: Don't change info panel if we are editing OR if a planet is explicitly selected
            if (!this.uiManager.isEditing && !this.planetManager.getSelectedPlanet()) {
                const h = renderData.hoveredPlanet;
                if (h) {
                    if (this.currentHoveredPlanetName !== h.name) {
                        this.currentHoveredPlanetName = h.name;
                        // Hover calls displayPlanetInfo but does NOT select it permanently
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