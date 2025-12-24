// Main application
class OrbitApp {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.solarSystem = new SolarSystem(this.container);
        this.planetManager = new PlanetManager();
        this.uiManager = new UIManager();
        
        this.init();
    }
    
    init() {
        // Setup UI controls
        this.uiManager.setupControls({
            onSpeedChange: (speed) => {
                this.solarSystem.setSpeed(speed);
            },
            onZoomChange: (zoom) => {
                this.solarSystem.setZoom(zoom);
            },
            onPauseToggle: (isPaused) => {
                if (isPaused) {
                    this.solarSystem.pause();
                } else {
                    this.solarSystem.resume();
                }
            },
            onReset: () => {
                this.solarSystem.reset();
                this.planetManager.resetPositions();
                this.uiManager.hidePlanetInfo();
                this.solarSystem.updatePlanets(this.planetManager.getPlanets());
            },
            onToggleOrbits: () => {
                this.solarSystem.toggleOrbits();
            },
            onToggleTopView: () => {
                this.solarSystem.toggleTopView();
            }
        });
        
        // Setup create planet handler
        this.uiManager.setupCreatePlanetHandler((planetData) => {
            const newPlanet = this.planetManager.addCustomPlanet(planetData);
            this.refreshPlanetButtons();
            this.solarSystem.updatePlanets(this.planetManager.getPlanets());
            
            // Show notification
            this.showNotification(`✨ ${newPlanet.name} has been created!`);
        });
        
        // Create planet buttons
        this.refreshPlanetButtons();
        
        // Initialize planets in 3D scene
        this.solarSystem.updatePlanets(this.planetManager.getPlanets());
        
        // Setup canvas click handler for planet selection
        this.container.addEventListener('click', (e) => {
            const clickedPlanet = this.solarSystem.getClickedPlanet(e);
            
            if (clickedPlanet) {
                this.planetManager.selectPlanet(clickedPlanet);
                this.uiManager.showPlanetInfo(clickedPlanet);
            } else {
                this.planetManager.selectPlanet(null);
                this.uiManager.hidePlanetInfo();
            }
        });
        
        // Start animation
        this.startAnimation();
        
        console.log('🚀 Orbit Solar System Simulator initialized in 3D!');
    }
    
    refreshPlanetButtons() {
        this.uiManager.createPlanetButtons(
            this.planetManager.getPlanets(),
            (planet) => {
                this.planetManager.selectPlanet(planet);
                this.uiManager.showPlanetInfo(planet);
            },
            (planet) => {
                const success = this.planetManager.removePlanet(planet);
                if (success) {
                    this.refreshPlanetButtons();
                    this.uiManager.hidePlanetInfo();
                    this.solarSystem.updatePlanets(this.planetManager.getPlanets());
                    this.showNotification(`🗑️ ${planet.name} has been deleted`);
                }
            }
        );
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #4a90e2, #7b68ee);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
            z-index: 2000;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        // Add animations
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    startAnimation() {
        this.solarSystem.start(() => {
            // Update planet positions
            this.planetManager.updatePositions(this.solarSystem.speed);
            
            // Render the solar system
            this.solarSystem.render(this.planetManager.getPlanets());
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.orbitApp = new OrbitApp();
});