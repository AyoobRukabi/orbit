// class UIManager {
//     constructor() {
//         this.elements = {
//             speedControl: document.getElementById('speedControl'),
//             speedValue: document.getElementById('speedValue'),
//             zoomControl: document.getElementById('zoomControl'),
//             zoomValue: document.getElementById('zoomValue'),
//             pauseBtn: document.getElementById('pauseBtn'),
//             resetBtn: document.getElementById('resetBtn'),
//             toggleOrbitsBtn: document.getElementById('toggleOrbitsBtn'),
//             topViewBtn: document.getElementById('topViewBtn'),
//             infoPanel: document.getElementById('infoPanel'),
//             planetName: document.getElementById('planetName'),
//             planetDetails: document.getElementById('planetDetails'),
//             planetButtons: document.getElementById('planetButtons'),
//             createPlanetBtn: document.getElementById('createPlanetBtn'),
//             modal: document.getElementById('createPlanetModal'),
//             closeModal: document.getElementById('closeModal'),
//             planetNameInput: document.getElementById('planetNameInput'),
//             planetSizeInput: document.getElementById('planetSizeInput'),
//             sizeValue: document.getElementById('sizeValue'),
//             planetDistanceInput: document.getElementById('planetDistanceInput'),
//             distanceValue: document.getElementById('distanceValue'),
//             planetSpeedInput: document.getElementById('planetSpeedInput'),
//             speedValuePlanet: document.getElementById('speedValuePlanet'),
//             planetColorInput: document.getElementById('planetColorInput'),
//             colorPreview: document.getElementById('colorPreview'),
//             planetDescInput: document.getElementById('planetDescInput'),
//             addPlanetBtn: document.getElementById('addPlanetBtn'),
//             cancelPlanetBtn: document.getElementById('cancelPlanetBtn'),
            
//             // MOON Elements
//             moonModal: document.getElementById('moonModal'),
//             closeMoonModal: document.getElementById('closeMoonModal'),
//             moonParentName: document.getElementById('moonParentName'),
//             moonList: document.getElementById('moonList'),
//             moonNameInput: document.getElementById('moonNameInput'),
//             moonSizeInput: document.getElementById('moonSizeInput'),
//             moonSizeValue: document.getElementById('moonSizeValue'),
//             moonDistInput: document.getElementById('moonDistInput'),
//             moonDistValue: document.getElementById('moonDistValue'),
//             moonSpeedInput: document.getElementById('moonSpeedInput'),
//             moonSpeedValue: document.getElementById('moonSpeedValue'),
//             moonColorInput: document.getElementById('moonColorInput'),
//             saveMoonBtn: document.getElementById('saveMoonBtn')
//         };
        
//         this.isPaused = false;
//         this.isEditing = false;
//         this.editingPlanetName = null;
//         this.setupModalHandlers();
//         this.setupMoonHandlers();
//     }
    
//     setupModalHandlers() {
//         this.elements.planetSizeInput.addEventListener('input', (e) => this.elements.sizeValue.textContent = e.target.value);
//         this.elements.planetDistanceInput.addEventListener('input', (e) => this.elements.distanceValue.textContent = e.target.value);
//         this.elements.planetSpeedInput.addEventListener('input', (e) => this.elements.speedValuePlanet.textContent = parseFloat(e.target.value).toFixed(4));
//         this.elements.planetColorInput.addEventListener('input', (e) => this.elements.colorPreview.style.background = e.target.value);
//         this.elements.colorPreview.style.background = this.elements.planetColorInput.value;
//         this.elements.createPlanetBtn.addEventListener('click', () => { this.isEditing = false; this.showModal("Create New Planet", "Save Planet"); });
//         this.elements.closeModal.addEventListener('click', () => this.hideModal());
//         this.elements.cancelPlanetBtn.addEventListener('click', () => this.hideModal());
//         this.elements.modal.addEventListener('click', (e) => { if(e.target===this.elements.modal) this.hideModal(); });
//     }

//     showModal(title, btnText) {
//         this.elements.modal.classList.add('show');
//         document.querySelector('.modal-header h2').textContent = title;
//         this.elements.addPlanetBtn.textContent = btnText;
//         if (!this.isEditing) this.resetModalForm();
//     }

//     hideModal() {
//         this.elements.modal.classList.remove('show');
//         this.elements.moonModal.classList.remove('show');
//     }

//     resetModalForm() {
//         this.elements.planetNameInput.value = '';
//         this.elements.planetSizeInput.value = 10;
//         this.elements.planetDescInput.value = '';
//     }

//     setupMoonHandlers() {
//         this.elements.moonSizeInput.addEventListener('input', (e) => this.elements.moonSizeValue.textContent = e.target.value);
//         this.elements.moonDistInput.addEventListener('input', (e) => this.elements.moonDistValue.textContent = e.target.value);
//         this.elements.moonSpeedInput.addEventListener('input', (e) => this.elements.moonSpeedValue.textContent = e.target.value);
//         this.elements.closeMoonModal.addEventListener('click', () => this.elements.moonModal.classList.remove('show'));
//     }

//     openMoonManager(planet, onAddMoon, onDeleteMoon) {
//         this.elements.moonModal.classList.add('show');
//         this.elements.moonParentName.textContent = planet.name;
//         this.elements.moonList.innerHTML = '';
        
//         if (planet.moons && planet.moons.length > 0) {
//             planet.moons.forEach((moon, index) => {
//                 const div = document.createElement('div');
//                 div.style.cssText = "display:flex; justify-content:space-between; background:rgba(255,255,255,0.1); padding:8px; margin-bottom:5px; border-radius:4px;";
//                 div.innerHTML = `<span>${moon.name} (Size: ${moon.size})</span>`;
//                 const delBtn = document.createElement('button');
//                 delBtn.innerText = "×";
//                 delBtn.style.cssText = "background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer;";
//                 delBtn.onclick = () => {
//                     onDeleteMoon(planet.name, index);
//                     this.openMoonManager(planet, onAddMoon, onDeleteMoon);
//                 };
//                 div.appendChild(delBtn);
//                 this.elements.moonList.appendChild(div);
//             });
//         } else {
//             this.elements.moonList.innerHTML = '<p style="color:#aaa;">No moons yet.</p>';
//         }

//         const newBtn = this.elements.saveMoonBtn.cloneNode(true);
//         this.elements.saveMoonBtn.parentNode.replaceChild(newBtn, this.elements.saveMoonBtn);
//         this.elements.saveMoonBtn = newBtn;

//         this.elements.saveMoonBtn.addEventListener('click', () => {
//             const moonData = {
//                 name: this.elements.moonNameInput.value || `Moon ${planet.moons ? planet.moons.length + 1 : 1}`,
//                 size: this.elements.moonSizeInput.value,
//                 distance: this.elements.moonDistInput.value,
//                 speed: this.elements.moonSpeedInput.value,
//                 color: this.elements.moonColorInput.value
//             };
//             onAddMoon(planet.name, moonData);
//             this.openMoonManager(planet, onAddMoon, onDeleteMoon);
//         });
//     }
    
//     showPlanetInfo(planet, onEdit, onManageMoons) {
//         if (!planet) return this.hidePlanetInfo();
//         this.elements.planetName.textContent = planet.name;
//         this.elements.planetName.style.color = `rgb(${planet.color.r}, ${planet.color.g}, ${planet.color.b})`;
//         const i = planet.info;
//         this.elements.planetDetails.innerHTML = `<p><strong>Diameter:</strong> ${i.diameter}</p><p><strong>Distance:</strong> ${i.distanceFromSun}</p><p><strong>Moons:</strong> ${planet.moons ? planet.moons.length : 0}</p><p style="margin-top:10px; border-top:1px solid #333; padding-top:10px">${i.description}</p>`;
        
//         const btnContainer = document.createElement('div');
//         btnContainer.style.display = "flex"; btnContainer.style.gap = "10px"; btnContainer.style.marginTop = "15px";

//         const editBtn = document.createElement('button');
//         editBtn.innerText = "✎ Edit";
//         editBtn.style.cssText = "flex:1; padding:8px; background:#4a90e2; border:none; border-radius:6px; color:white; cursor:pointer;";
//         editBtn.onclick = () => {
//             this.isEditing = true;
//             this.editingPlanetName = planet.name;
//             this.fillModalWithPlanet(planet);
//             this.showModal(`Edit ${planet.name}`, "Save Changes");
//         };

//         const moonBtn = document.createElement('button');
//         moonBtn.innerText = "🌑 Moons";
//         moonBtn.style.cssText = "flex:1; padding:8px; background:#7b68ee; border:none; border-radius:6px; color:white; cursor:pointer;";
//         moonBtn.onclick = () => { if (onManageMoons) onManageMoons(planet); };

//         btnContainer.appendChild(editBtn);
//         btnContainer.appendChild(moonBtn);
        
//         const old = this.elements.planetDetails.querySelector('div'); if(old) old.remove();
//         this.elements.planetDetails.appendChild(btnContainer);
//         this.elements.infoPanel.classList.add('visible');
//     }
    
//     hidePlanetInfo() { this.elements.infoPanel.classList.remove('visible'); }
//     fillModalWithPlanet(planet) { /* Keep logic */ this.elements.planetNameInput.value = planet.name; this.elements.planetSizeInput.value = planet.size; this.elements.planetDistanceInput.value = planet.distance; this.elements.planetSpeedInput.value = planet.speed; const hex = `#${planet.color.r.toString(16).padStart(2,'0')}${planet.color.g.toString(16).padStart(2,'0')}${planet.color.b.toString(16).padStart(2,'0')}`; this.elements.planetColorInput.value = hex; this.elements.colorPreview.style.background = hex; this.elements.planetDescInput.value = planet.info.description; }
//     getNewPlanetData() { return { name: this.elements.planetNameInput.value, size: this.elements.planetSizeInput.value, distance: this.elements.planetDistanceInput.value, speed: this.elements.planetSpeedInput.value, color: this.elements.planetColorInput.value, description: this.elements.planetDescInput.value }; }
//     setupCreatePlanetHandler(cb, editCb) { this.elements.addPlanetBtn.addEventListener('click', () => { const d = this.getNewPlanetData(); if(this.isEditing && editCb) editCb(this.editingPlanetName, d); else if(cb) cb(d); this.hideModal(); }); }
//     setupControls(cb) { this.elements.speedControl.addEventListener('input', e=>cb.onSpeedChange(e.target.value)); this.elements.zoomControl.addEventListener('input', e=>cb.onZoomChange(e.target.value)); this.elements.pauseBtn.addEventListener('click', ()=>cb.onPauseToggle(this.isPaused=!this.isPaused)); this.elements.resetBtn.addEventListener('click', ()=>cb.onReset()); this.elements.toggleOrbitsBtn.addEventListener('click', ()=>cb.onToggleOrbits()); this.elements.topViewBtn.addEventListener('click', ()=>cb.onToggleTopView()); }
//     createPlanetButtons(planets, clickCb, delCb) { this.elements.planetButtons.innerHTML=''; planets.forEach(p=>{ const d=document.createElement('div'); d.style.cssText='display:flex;gap:5px;margin-bottom:5px'; const b=document.createElement('button'); b.className='planet-btn'; b.textContent=p.name; b.style.borderLeft=`4px solid rgb(${p.color.r},${p.color.g},${p.color.b})`; b.style.flex='1'; b.onclick=()=>clickCb(p); d.appendChild(b); if(p.isCustom){const x=document.createElement('button');x.innerText='🗑️';x.onclick=(e)=>{e.stopPropagation();delCb(p)};d.appendChild(x)} this.elements.planetButtons.appendChild(d); }); }
// }



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
            cancelPlanetBtn: document.getElementById('cancelPlanetBtn'),
            
            // MOON Elements
            moonModal: document.getElementById('moonModal'),
            closeMoonModal: document.getElementById('closeMoonModal'),
            moonParentName: document.getElementById('moonParentName'),
            moonList: document.getElementById('moonList'),
            moonNameInput: document.getElementById('moonNameInput'),
            moonSizeInput: document.getElementById('moonSizeInput'),
            moonSizeValue: document.getElementById('moonSizeValue'),
            moonDistInput: document.getElementById('moonDistInput'),
            moonDistValue: document.getElementById('moonDistValue'),
            moonSpeedInput: document.getElementById('moonSpeedInput'),
            moonSpeedValue: document.getElementById('moonSpeedValue'),
            moonColorInput: document.getElementById('moonColorInput'),
            saveMoonBtn: document.getElementById('saveMoonBtn')
        };
        
        this.isPaused = false;
        this.isEditing = false;
        this.isEditingMoon = false;
        this.editingPlanetName = null;
        this.editingMoonIndex = -1;
        this.setupModalHandlers();
        this.setupMoonHandlers();
    }
    
    setupModalHandlers() {
        this.elements.planetSizeInput.addEventListener('input', (e) => this.elements.sizeValue.textContent = e.target.value);
        this.elements.planetDistanceInput.addEventListener('input', (e) => this.elements.distanceValue.textContent = e.target.value);
        this.elements.planetSpeedInput.addEventListener('input', (e) => this.elements.speedValuePlanet.textContent = parseFloat(e.target.value).toFixed(4));
        this.elements.planetColorInput.addEventListener('input', (e) => this.elements.colorPreview.style.background = e.target.value);
        this.elements.createPlanetBtn.addEventListener('click', () => { this.isEditing = false; this.showModal("Create New Planet", "Save Planet"); });
        this.elements.closeModal.addEventListener('click', () => this.hideModal());
        this.elements.cancelPlanetBtn.addEventListener('click', () => this.hideModal());
        this.elements.modal.addEventListener('click', (e) => { if(e.target===this.elements.modal) this.hideModal(); });
    }

    showModal(title, btnText) {
        this.elements.modal.classList.add('show');
        document.querySelector('.modal-header h2').textContent = title;
        this.elements.addPlanetBtn.textContent = btnText;
        if (!this.isEditing) this.resetModalForm();
    }

    hideModal() {
        this.elements.modal.classList.remove('show');
        this.elements.moonModal.classList.remove('show');
    }

    resetModalForm() {
        this.elements.planetNameInput.value = '';
        this.elements.planetSizeInput.value = 10;
        this.elements.planetDescInput.value = '';
    }

    setupMoonHandlers() {
        this.elements.moonSizeInput.addEventListener('input', (e) => this.elements.moonSizeValue.textContent = e.target.value);
        this.elements.moonDistInput.addEventListener('input', (e) => this.elements.moonDistValue.textContent = e.target.value);
        this.elements.moonSpeedInput.addEventListener('input', (e) => this.elements.moonSpeedValue.textContent = e.target.value);
        this.elements.closeMoonModal.addEventListener('click', () => {
            this.elements.moonModal.classList.remove('show');
            this.isEditingMoon = false;
        });
    }

    openMoonManager(planet, onAddMoon, onDeleteMoon, onEditMoon) {
        this.elements.moonModal.classList.add('show');
        this.elements.moonParentName.textContent = planet.name;
        this.elements.moonList.innerHTML = '';
        this.resetMoonForm();
        
        if (planet.moons && planet.moons.length > 0) {
            planet.moons.forEach((moon, index) => {
                const div = document.createElement('div');
                div.style.cssText = "display:flex; justify-content:space-between; background:rgba(255,255,255,0.1); padding:8px; margin-bottom:5px; border-radius:4px; align-items:center;";
                const infoSpan = document.createElement('span');
                infoSpan.textContent = `${moon.name} (Size: ${moon.size})`;
                const btnDiv = document.createElement('div');
                btnDiv.style.display = 'flex'; btnDiv.style.gap = '5px';

                const editBtn = document.createElement('button');
                editBtn.innerText = "✎";
                editBtn.style.cssText = "background:#4a90e2; color:white; border:none; border-radius:4px; width:24px; height:24px; cursor:pointer;";
                editBtn.onclick = () => {
                    this.isEditingMoon = true;
                    this.editingMoonIndex = index;
                    this.fillMoonForm(moon);
                    this.elements.saveMoonBtn.textContent = "Update Moon";
                };

                const delBtn = document.createElement('button');
                delBtn.innerText = "×";
                delBtn.style.cssText = "background:#ff3b30; color:white; border:none; border-radius:4px; width:24px; height:24px; cursor:pointer;";
                delBtn.onclick = () => {
                    onDeleteMoon(planet.name, index);
                    this.openMoonManager(planet, onAddMoon, onDeleteMoon, onEditMoon);
                };
                
                btnDiv.appendChild(editBtn);
                btnDiv.appendChild(delBtn);
                div.appendChild(infoSpan);
                div.appendChild(btnDiv);
                this.elements.moonList.appendChild(div);
            });
        } else {
            this.elements.moonList.innerHTML = '<p style="color:#aaa;">No moons yet.</p>';
        }

        const newBtn = this.elements.saveMoonBtn.cloneNode(true);
        this.elements.saveMoonBtn.parentNode.replaceChild(newBtn, this.elements.saveMoonBtn);
        this.elements.saveMoonBtn = newBtn;

        this.elements.saveMoonBtn.addEventListener('click', () => {
            const moonData = {
                name: this.elements.moonNameInput.value || `Moon`,
                size: this.elements.moonSizeInput.value,
                distance: this.elements.moonDistInput.value,
                speed: this.elements.moonSpeedInput.value,
                color: this.elements.moonColorInput.value
            };

            if (this.isEditingMoon && onEditMoon) {
                onEditMoon(planet.name, this.editingMoonIndex, moonData);
            } else {
                onAddMoon(planet.name, moonData);
            }
            this.openMoonManager(planet, onAddMoon, onDeleteMoon, onEditMoon);
        });
    }

    resetMoonForm() {
        this.isEditingMoon = false;
        this.elements.saveMoonBtn.textContent = "Add Moon";
        this.elements.moonNameInput.value = '';
        this.elements.moonSizeInput.value = 2;
        this.elements.moonDistInput.value = 20;
        this.elements.moonSpeedInput.value = 0.05;
        this.elements.moonColorInput.value = '#cccccc';
    }

    fillMoonForm(moon) {
        this.elements.moonNameInput.value = moon.name;
        this.elements.moonSizeInput.value = moon.size;
        this.elements.moonDistInput.value = moon.distance;
        this.elements.moonSpeedInput.value = moon.speed;
        if(moon.color) {
            const hex = `#${moon.color.r.toString(16).padStart(2,'0')}${moon.color.g.toString(16).padStart(2,'0')}${moon.color.b.toString(16).padStart(2,'0')}`;
            this.elements.moonColorInput.value = hex;
        }
    }
    
    // UPDATED: Accepts onClose callback
    showPlanetInfo(data, onEdit, onManageMoons, onClose) {
        if (!data) return this.hidePlanetInfo();
        
        let title = data.name;
        let details = "";
        
        if (data.isOrbit) {
            title = `Orbit of ${data.name}`;
            details = `<p style="font-style:italic; color:#aaa;">This is the orbital path of ${data.name}.</p>`;
        } else if (data.isMoon) {
            title = `Moon: ${data.name}`;
            details = `<p><strong>Parent Planet:</strong> ${data.parentPlanet}</p><p><strong>Size:</strong> ${data.size}</p><p><strong>Distance:</strong> ${data.distance}</p>`;
        } else {
            const i = data.info;
            details = `<p><strong>Diameter:</strong> ${i.diameter}</p><p><strong>Distance:</strong> ${i.distanceFromSun}</p><p><strong>Moons:</strong> ${data.moons ? data.moons.length : 0}</p><p style="margin-top:10px; border-top:1px solid #333; padding-top:10px">${i.description}</p>`;
        }

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = "&times;";
        closeBtn.style.cssText = "position:absolute; top:10px; right:10px; background:none; border:none; color:white; font-size:1.5em; cursor:pointer;";
        closeBtn.onclick = () => {
            this.hidePlanetInfo();
            if (onClose) onClose(); // Notify main app to clear selection
        };

        this.elements.planetName.textContent = title;
        this.elements.planetName.style.color = data.color ? `rgb(${data.color.r}, ${data.color.g}, ${data.color.b})` : '#fff';
        
        this.elements.planetDetails.innerHTML = '';
        this.elements.planetDetails.innerHTML = details;
        this.elements.infoPanel.appendChild(closeBtn);

        if (!data.isOrbit && !data.isMoon) {
            const btnContainer = document.createElement('div');
            btnContainer.style.display = "flex"; btnContainer.style.gap = "10px"; btnContainer.style.marginTop = "15px";

            const editBtn = document.createElement('button');
            editBtn.innerText = "✎ Edit";
            editBtn.style.cssText = "flex:1; padding:8px; background:#4a90e2; border:none; border-radius:6px; color:white; cursor:pointer;";
            editBtn.onclick = () => {
                this.isEditing = true;
                this.editingPlanetName = data.name;
                this.fillModalWithPlanet(data);
                this.showModal(`Edit ${data.name}`, "Save Changes");
            };

            const moonBtn = document.createElement('button');
            moonBtn.innerText = "🌑 Moons";
            moonBtn.style.cssText = "flex:1; padding:8px; background:#7b68ee; border:none; border-radius:6px; color:white; cursor:pointer;";
            moonBtn.onclick = () => { if (onManageMoons) onManageMoons(data); };

            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(moonBtn);
            this.elements.planetDetails.appendChild(btnContainer);
        }
        
        this.elements.infoPanel.classList.add('visible');
    }
    
    hidePlanetInfo() { 
        this.elements.infoPanel.classList.remove('visible'); 
        const btn = this.elements.infoPanel.querySelector('button[style*="position:absolute"]');
        if(btn) btn.remove();
    }

    fillModalWithPlanet(planet) { this.elements.planetNameInput.value = planet.name; this.elements.planetSizeInput.value = planet.size; this.elements.planetDistanceInput.value = planet.distance; this.elements.planetSpeedInput.value = planet.speed; const hex = `#${planet.color.r.toString(16).padStart(2,'0')}${planet.color.g.toString(16).padStart(2,'0')}${planet.color.b.toString(16).padStart(2,'0')}`; this.elements.planetColorInput.value = hex; this.elements.colorPreview.style.background = hex; this.elements.planetDescInput.value = planet.info.description; }
    getNewPlanetData() { return { name: this.elements.planetNameInput.value, size: this.elements.planetSizeInput.value, distance: this.elements.planetDistanceInput.value, speed: this.elements.planetSpeedInput.value, color: this.elements.planetColorInput.value, description: this.elements.planetDescInput.value }; }
    setupCreatePlanetHandler(cb, editCb) { this.elements.addPlanetBtn.addEventListener('click', () => { const d = this.getNewPlanetData(); if(this.isEditing && editCb) editCb(this.editingPlanetName, d); else if(cb) cb(d); this.hideModal(); }); }
    setupControls(cb) { this.elements.speedControl.addEventListener('input', e=>cb.onSpeedChange(e.target.value)); this.elements.zoomControl.addEventListener('input', e=>cb.onZoomChange(e.target.value)); this.elements.pauseBtn.addEventListener('click', ()=>cb.onPauseToggle(this.isPaused=!this.isPaused)); this.elements.resetBtn.addEventListener('click', ()=>cb.onReset()); this.elements.toggleOrbitsBtn.addEventListener('click', ()=>cb.onToggleOrbits()); this.elements.topViewBtn.addEventListener('click', ()=>cb.onToggleTopView()); }
    
    createPlanetButtons(planets, clickCb, delCb) { 
        this.elements.planetButtons.innerHTML=''; 
        planets.forEach(p=>{ 
            const d=document.createElement('div'); d.style.cssText='display:flex;gap:5px;margin-bottom:5px'; 
            const b=document.createElement('button'); b.className='planet-btn'; b.textContent=p.name; b.style.borderLeft=`4px solid rgb(${p.color.r},${p.color.g},${p.color.b})`; b.style.flex='1'; b.onclick=()=>clickCb(p); 
            d.appendChild(b); 
            const x=document.createElement('button');
            x.innerText='🗑️';
            x.style.cssText = "background:rgba(255,59,48,0.2); border:1px solid rgba(255,59,48,0.4); border-radius:6px; color:#ff3b30; cursor:pointer; padding:8px 12px;";
            x.onclick=(e)=>{e.stopPropagation();delCb(p)};
            d.appendChild(x); 
            this.elements.planetButtons.appendChild(d); 
        }); 
    }
}