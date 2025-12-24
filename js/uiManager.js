class UIManager {
    constructor() {
        this.elements = {
            speedControl: document.getElementById('speedControl'),
            speedValue: document.getElementById('speedValue'),
            zoomControl: document.getElementById('zoomControl'),
            zoomValue: document.getElementById('zoomValue'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            toggleOrbitsBtn: document.getElementById('toggleOrbitsBtn'),
            topViewBtn: document.getElementById('topViewBtn'),
            infoPanel: document.getElementById('infoPanel'),
            planetName: document.getElementById('planetName'),
            planetDetails: document.getElementById('planetDetails'),
            planetButtons: document.getElementById('planetButtons'),
            createPlanetBtn: document.getElementById('createPlanetBtn'),
            modal: document.getElementById('createPlanetModal'),
            closeModal: document.getElementById('closeModal'),
            planetNameInput: document.getElementById('planetNameInput'),
            planetSizeInput: document.getElementById('planetSizeInput'),
            sizeValue: document.getElementById('sizeValue'),
            planetDistanceInput: document.getElementById('planetDistanceInput'),
            distanceValue: document.getElementById('distanceValue'),
            planetSpeedInput: document.getElementById('planetSpeedInput'),
            speedValuePlanet: document.getElementById('speedValuePlanet'),
            planetColorInput: document.getElementById('planetColorInput'),
            colorPreview: document.getElementById('colorPreview'),
            planetDescInput: document.getElementById('planetDescInput'),
            addPlanetBtn: document.getElementById('addPlanetBtn'),
            cancelPlanetBtn: document.getElementById('cancelPlanetBtn')
        };
        
        this.isPaused = false;
        this.setupModalHandlers();
    }
    
    setupModalHandlers() {
        // Update live values for sliders
        this.elements.planetSizeInput.addEventListener('input', (e) => {
            this.elements.sizeValue.textContent = e.target.value;
        });
        
        this.elements.planetDistanceInput.addEventListener('input', (e) => {
            this.elements.distanceValue.textContent = e.target.value;
        });
        
        this.elements.planetSpeedInput.addEventListener('input', (e) => {
            this.elements.speedValuePlanet.textContent = parseFloat(e.target.value).toFixed(4);
        });
        
        // Color preview
        this.elements.planetColorInput.addEventListener('input', (e) => {
            this.elements.colorPreview.style.background = e.target.value;
        });
        
        // Initialize color preview
        this.elements.colorPreview.style.background = this.elements.planetColorInput.value;
        
        // Open modal
        this.elements.createPlanetBtn.addEventListener('click', () => {
            this.showModal();
        });
        
        // Close modal
        this.elements.closeModal.addEventListener('click', () => {
            this.hideModal();
        });
        
        this.elements.cancelPlanetBtn.addEventListener('click', () => {
            this.hideModal();
        });
        
        // Close on outside click
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.hideModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.modal.classList.contains('show')) {
                this.hideModal();
            }
        });
    }
    
    showModal() {
        this.elements.modal.classList.add('show');
        this.resetModalForm();
    }
    
    hideModal() {
        this.elements.modal.classList.remove('show');
    }
    
    resetModalForm() {
        this.elements.planetNameInput.value = '';
        this.elements.planetSizeInput.value = 10;
        this.elements.sizeValue.textContent = '10';
        this.elements.planetDistanceInput.value = 250;
        this.elements.distanceValue.textContent = '250';
        this.elements.planetSpeedInput.value = 0.01;
        this.elements.speedValuePlanet.textContent = '0.0100';
        this.elements.planetColorInput.value = '#4a90e2';
        this.elements.colorPreview.style.background = '#4a90e2';
        this.elements.planetDescInput.value = '';
    }
    
    getNewPlanetData() {
        return {
            name: this.elements.planetNameInput.value.trim() || 'Custom Planet',
            size: parseFloat(this.elements.planetSizeInput.value),
            distance: parseFloat(this.elements.planetDistanceInput.value),
            speed: parseFloat(this.elements.planetSpeedInput.value),
            color: this.elements.planetColorInput.value,
            description: this.elements.planetDescInput.value.trim()
        };
    }
    
    setupCreatePlanetHandler(callback) {
        this.elements.addPlanetBtn.addEventListener('click', () => {
            const planetData = this.getNewPlanetData();
            if (callback) {
                callback(planetData);
            }
            this.hideModal();
        });
    }
    
    setupControls(callbacks) {
        // Speed control
        this.elements.speedControl.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            this.elements.speedValue.textContent = `${speed}x`;
            if (callbacks.onSpeedChange) {
                callbacks.onSpeedChange(speed);
            }
        });
        
        // Zoom control
        this.elements.zoomControl.addEventListener('input', (e) => {
            const zoom = parseFloat(e.target.value);
            this.elements.zoomValue.textContent = `${zoom}x`;
            if (callbacks.onZoomChange) {
                callbacks.onZoomChange(zoom);
            }
        });
        
        // Pause button
        this.elements.pauseBtn.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            this.elements.pauseBtn.textContent = this.isPaused ? '▶ Play' : '⏸ Pause';
            if (callbacks.onPauseToggle) {
                callbacks.onPauseToggle(this.isPaused);
            }
        });
        
        // Reset button
        this.elements.resetBtn.addEventListener('click', () => {
            this.elements.speedControl.value = 1;
            this.elements.speedValue.textContent = '1x';
            this.elements.zoomControl.value = 1;
            this.elements.zoomValue.textContent = '1x';
            
            if (callbacks.onReset) {
                callbacks.onReset();
            }
        });
        
        // Toggle orbits button
        this.elements.toggleOrbitsBtn.addEventListener('click', () => {
            if (callbacks.onToggleOrbits) {
                callbacks.onToggleOrbits();
            }
        });
        
        // Top view button
        this.elements.topViewBtn.addEventListener('click', () => {
            if (callbacks.onToggleTopView) {
                callbacks.onToggleTopView();
            }
        });
    }
    
    createPlanetButtons(planets, onPlanetClick, onPlanetDelete) {
        this.elements.planetButtons.innerHTML = '';
        
        planets.forEach(planet => {
            const buttonWrapper = document.createElement('div');
            buttonWrapper.style.display = 'flex';
            buttonWrapper.style.gap = '5px';
            buttonWrapper.style.alignItems = 'center';
            
            const button = document.createElement('button');
            button.className = 'planet-btn';
            button.textContent = planet.name;
            button.style.borderLeft = `4px solid rgb(${planet.color.r}, ${planet.color.g}, ${planet.color.b})`;
            button.style.flex = '1';
            
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                document.querySelectorAll('.planet-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                
                if (onPlanetClick) {
                    onPlanetClick(planet);
                }
            });
            
            buttonWrapper.appendChild(button);
            
            // Add delete button for custom planets
            if (planet.isCustom) {
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '🗑️';
                deleteBtn.style.cssText = `
                    background: rgba(255, 59, 48, 0.2);
                    border: 1px solid rgba(255, 59, 48, 0.4);
                    border-radius: 6px;
                    color: #ff3b30;
                    cursor: pointer;
                    padding: 8px 12px;
                    transition: all 0.3s;
                    font-size: 0.9em;
                `;
                
                deleteBtn.addEventListener('mouseenter', () => {
                    deleteBtn.style.background = 'rgba(255, 59, 48, 0.4)';
                });
                
                deleteBtn.addEventListener('mouseleave', () => {
                    deleteBtn.style.background = 'rgba(255, 59, 48, 0.2)';
                });
                
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`Delete ${planet.name}?`)) {
                        if (onPlanetDelete) {
                            onPlanetDelete(planet);
                        }
                    }
                });
                
                buttonWrapper.appendChild(deleteBtn);
            }
            
            this.elements.planetButtons.appendChild(buttonWrapper);
        });
    }
    
    showPlanetInfo(planet) {
        if (!planet) {
            this.hidePlanetInfo();
            return;
        }
        
        this.elements.planetName.textContent = planet.name;
        this.elements.planetName.style.color = `rgb(${planet.color.r}, ${planet.color.g}, ${planet.color.b})`;
        
        const info = planet.info;
        this.elements.planetDetails.innerHTML = `
            <p><strong>Diameter:</strong> ${info.diameter}</p>
            <p><strong>Distance from Sun:</strong> ${info.distanceFromSun}</p>
            <p><strong>Orbital Period:</strong> ${info.orbitalPeriod}</p>
            <p><strong>Surface Temperature:</strong> ${info.surfaceTemp}</p>
            <p><strong>Moons:</strong> ${info.moons}</p>
            <p style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                ${info.description}
            </p>
        `;
        
        this.elements.infoPanel.classList.add('visible');
    }
    
    hidePlanetInfo() {
        this.elements.infoPanel.classList.remove('visible');
        this.elements.planetName.textContent = 'Click a planet to see details';
        this.elements.planetDetails.innerHTML = '';
        
        // Remove active class from all planet buttons
        document.querySelectorAll('.planet-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    updateSpeed(speed) {
        this.elements.speedControl.value = speed;
        this.elements.speedValue.textContent = `${speed}x`;
    }
    
    updateZoom(zoom) {
        this.elements.zoomControl.value = zoom;
        this.elements.zoomValue.textContent = `${zoom}x`;
    }
    
    setPauseState(isPaused) {
        this.isPaused = isPaused;
        this.elements.pauseBtn.textContent = isPaused ? '▶ Play' : '⏸ Pause';
    }
}