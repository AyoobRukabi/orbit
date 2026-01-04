class SolarSystem {
    constructor(container) {
        this.container = container;
        this.animationFrame = null;
        this.isPaused = false;
        this.speed = 1;
        this.zoom = 1;
        this.showOrbits = true;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.sun = null;
        this.planetMeshes = [];
        this.orbitLines = [];
        
        this.textureLoader = new THREE.TextureLoader();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredPlanet = null;
        
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.cameraAngle = { azimuth: Math.PI / 4, elevation: Math.PI / 6 };
        this.cameraDistance = 1500;
        this.isTopView = false;
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 10000);
        this.updateCameraPosition();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        this.addLights();
        this.addStars();
        this.createSun();
    }
    
    addLights() {
        this.scene.add(new THREE.PointLight(0xffffff, 2, 5000));
        this.scene.add(new THREE.AmbientLight(0x404040, 0.5));
    }
    
    addStars() {
        const geo = new THREE.BufferGeometry();
        const verts = [];
        for(let i=0; i<1000; i++) verts.push((Math.random()-0.5)*4000, (Math.random()-0.5)*4000, (Math.random()-0.5)*4000);
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        this.scene.add(new THREE.Points(geo, new THREE.PointsMaterial({color: 0xffffff, size: 2, transparent: true, opacity: 0.8})));
    }
    
    createSun() {
        const tex = this.textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/9/99/Map_of_the_full_sun.jpg');
        const sun = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 32), new THREE.MeshBasicMaterial({map: tex, color: 0xFFFFFF}));
        this.scene.add(sun);
        this.sun = sun;
        this.sun.add(new THREE.Mesh(new THREE.SphereGeometry(55, 32, 32), new THREE.MeshBasicMaterial({color: 0xffaa00, transparent: true, opacity: 0.3})));
        this.sun.add(new THREE.Mesh(new THREE.SphereGeometry(70, 32, 32), new THREE.MeshBasicMaterial({color: 0xff8800, transparent: true, opacity: 0.1})));
    }
    
    createOrbit(distance) {
        const curve = new THREE.EllipseCurve(0, 0, distance, distance, 0, 2 * Math.PI, false, 0);
        const pts = curve.getPoints(100);
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({color: 0x6464aa, transparent: true, opacity: 0.3}));
        line.rotation.x = Math.PI / 2;
        return line;
    }
    
    createPlanet(data) {
        const planetGroup = new THREE.Group();
        
        const geo = new THREE.SphereGeometry(data.size, 32, 32);
        let mat;
        if (data.textureUrl) {
            mat = new THREE.MeshStandardMaterial({ map: this.textureLoader.load(data.textureUrl), color: 0xffffff });
        } else {
            mat = new THREE.MeshPhongMaterial({
                color: new THREE.Color(`rgb(${data.color.r}, ${data.color.g}, ${data.color.b})`),
                emissive: new THREE.Color(`rgb(${data.color.r}, ${data.color.g}, ${data.color.b})`),
                emissiveIntensity: 0.2
            });
        }
        const planetMesh = new THREE.Mesh(geo, mat);
        planetMesh.userData = data; 
        planetMesh.castShadow = true;
        planetMesh.receiveShadow = true;
        
        if (data.hasRings) {
            const ringGeo = new THREE.RingGeometry(data.size * 1.4, data.size * 2.2, 64);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            planetMesh.add(ring);
        }

        planetGroup.add(planetMesh);
        planetGroup.userData = { mesh: planetMesh, data: data, moons: [] };

        if (data.moons) {
            data.moons.forEach(moonData => {
                const moonPivot = new THREE.Group();
                const moonGeo = new THREE.SphereGeometry(moonData.size, 16, 16);
                const moonMat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(`rgb(${moonData.color.r}, ${moonData.color.g}, ${moonData.color.b})`)
                });
                const moonMesh = new THREE.Mesh(moonGeo, moonMat);
                moonMesh.position.set(moonData.distance, 0, 0); 
                
                moonPivot.add(moonMesh);
                planetGroup.add(moonPivot);
                planetGroup.userData.moons.push({ pivot: moonPivot, data: moonData });
            });
        }

        return planetGroup;
    }
    
    updatePlanets(planets) {
        this.planetMeshes.forEach(m => this.scene.remove(m));
        this.orbitLines.forEach(l => this.scene.remove(l));
        this.planetMeshes = [];
        this.orbitLines = [];
        
        planets.forEach(data => {
            const pGroup = this.createPlanet(data);
            this.planetMeshes.push(pGroup);
            this.scene.add(pGroup);
            const orbit = this.createOrbit(data.distance);
            orbit.visible = this.showOrbits;
            this.orbitLines.push(orbit);
            this.scene.add(orbit);
        });
    }
    
    updateCameraPosition() {
        if (this.isTopView) {
            this.camera.position.set(0, this.cameraDistance * this.zoom, 1);
            this.camera.lookAt(0, 0, 0);
        } else {
            const d = this.cameraDistance / this.zoom;
            const y = d * Math.sin(this.cameraAngle.elevation);
            const r = d * Math.cos(this.cameraAngle.elevation);
            this.camera.position.set(r * Math.sin(this.cameraAngle.azimuth), y, r * Math.cos(this.cameraAngle.azimuth));
            this.camera.lookAt(0, 0, 0);
        }
    }
    
    setupEventListeners() {
        const c = this.renderer.domElement;
        c.addEventListener('mousedown', e => { this.isDragging = true; this.previousMousePosition = { x: e.clientX, y: e.clientY }; });
        c.addEventListener('mousemove', e => {
            if (this.isDragging && !this.isTopView) {
                this.cameraAngle.azimuth -= (e.clientX - this.previousMousePosition.x) * 0.005;
                this.cameraAngle.elevation += (e.clientY - this.previousMousePosition.y) * 0.005;
                this.cameraAngle.elevation = Math.max(-1.4, Math.min(1.4, this.cameraAngle.elevation));
                this.updateCameraPosition();
                this.previousMousePosition = { x: e.clientX, y: e.clientY };
            }
            const r = c.getBoundingClientRect();
            this.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
            this.mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
        });
        c.addEventListener('mouseup', () => this.isDragging = false);
        c.addEventListener('wheel', e => { e.preventDefault(); this.zoom = Math.max(0.5, Math.min(3, this.zoom * (e.deltaY > 0 ? 1.1 : 0.9))); this.updateCameraPosition(); });
        window.addEventListener('resize', () => { this.camera.aspect = this.container.clientWidth / this.container.clientHeight; this.camera.updateProjectionMatrix(); this.renderer.setSize(this.container.clientWidth, this.container.clientHeight); });
    }
    
    checkHoveredPlanet() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const meshesToCheck = this.planetMeshes.map(g => g.userData.mesh);
        const intersects = this.raycaster.intersectObjects(meshesToCheck);
        
        if (this.hoveredPlanet) {
             const mat = this.hoveredPlanet.material;
             if (mat.map) mat.emissiveIntensity = 0; else mat.emissiveIntensity = 0.2;
        }
        
        if (intersects.length > 0) {
            this.hoveredPlanet = intersects[0].object;
            this.hoveredPlanet.material.emissiveIntensity = 0.5;
            return this.hoveredPlanet.userData;
        } else {
            this.hoveredPlanet = null;
            return null;
        }
    }
    
    render(planets) {
        this.planetMeshes.forEach((group, index) => {
            const data = planets[index];
            group.position.x = Math.cos(data.angle) * data.distance;
            group.position.z = Math.sin(data.angle) * data.distance;
            group.userData.mesh.rotation.y += 0.01;

            if(group.userData.moons && data.moons) {
                group.userData.moons.forEach((moonObj, mIndex) => {
                    const mData = data.moons[mIndex];
                    if(mData) moonObj.pivot.rotation.y = mData.angle || 0;
                });
            }
        });
        
        const ps = 1 + Math.sin(Date.now()*0.001)*0.02;
        if(this.sun) this.sun.scale.set(ps, ps, ps);
        
        const h = this.checkHoveredPlanet();
        this.renderer.render(this.scene, this.camera);
        return { hoveredPlanet: h };
    }
    
    start(cb) { const loop = () => { if (!this.isPaused) cb(); this.animationFrame = requestAnimationFrame(loop); }; loop(); }
    pause() { this.isPaused = true; }
    resume() { this.isPaused = false; }
    stop() { cancelAnimationFrame(this.animationFrame); }
    reset() { this.zoom = 1; this.cameraAngle = { azimuth: Math.PI/4, elevation: Math.PI/6 }; this.isTopView = false; this.updateCameraPosition(); }
    setSpeed(s) { this.speed = s; }
    setZoom(z) { this.zoom = z; this.updateCameraPosition(); }
    toggleOrbits() { this.showOrbits = !this.showOrbits; this.orbitLines.forEach(l => l.visible = this.showOrbits); }
    toggleTopView() { this.isTopView = !this.isTopView; this.updateCameraPosition(); }
    getClickedPlanet(e) {
        const r = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX-r.left)/r.width)*2-1; this.mouse.y = -((e.clientY-r.top)/r.height)*2+1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const meshes = this.planetMeshes.map(g => g.userData.mesh);
        const i = this.raycaster.intersectObjects(meshes);
        return i.length > 0 ? i[0].object.userData : null;
    }
}