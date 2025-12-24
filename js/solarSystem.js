class SolarSystem {
    constructor(container) {
        this.container = container;
        
        // Animation state
        this.animationFrame = null;
        this.isPaused = false;
        this.speed = 1;
        this.zoom = 1;
        this.showOrbits = true;
        
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.sun = null;
        this.planetMeshes = [];
        this.orbitLines = [];
        
        // Texture Loader
        this.textureLoader = new THREE.TextureLoader();
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredPlanet = null;
        
        // Camera controls (FIXED: Uses Elevation/Azimuth for stability)
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.cameraAngle = { azimuth: Math.PI / 4, elevation: Math.PI / 6 };
        this.cameraDistance = 1500;
        this.isTopView = false;
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            10000
        );
        this.updateCameraPosition();
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        this.addLights();
        
        // Add stars
        this.addStars();
        
        // Create sun (Textured version)
        this.createSun();
    }
    
    addLights() {
        const sunLight = new THREE.PointLight(0xffffff, 2, 5000);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
    }
    
    addStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            opacity: 0.8
        });
        
        const starsVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 4000;
            const y = (Math.random() - 0.5) * 4000;
            const z = (Math.random() - 0.5) * 4000;
            starsVertices.push(x, y, z);
        }
        
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(starField);
    }
    
    createSun() {
        const sunGeometry = new THREE.SphereGeometry(50, 32, 32);
        
        // Load Sun Texture (This usually works fine)
        const texture = this.textureLoader.load(
            'https://upload.wikimedia.org/wikipedia/commons/9/99/Map_of_the_full_sun.jpg',
            undefined, undefined, (err) => console.log('Sun texture error')
        );

        const sunMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            color: 0xFFFFFF,
        });
        
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);
        
        // Glows
        const glowGeometry = new THREE.SphereGeometry(55, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.3 });
        this.sun.add(new THREE.Mesh(glowGeometry, glowMaterial));
        
        const outerGlowGeometry = new THREE.SphereGeometry(70, 32, 32);
        const outerGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.1 });
        this.sun.add(new THREE.Mesh(outerGlowGeometry, outerGlowMaterial));
    }
    
    createOrbit(distance) {
        const curve = new THREE.EllipseCurve(0, 0, distance, distance, 0, 2 * Math.PI, false, 0);
        const points = curve.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x6464aa, transparent: true, opacity: 0.3 });
        const orbitLine = new THREE.Line(geometry, material);
        orbitLine.rotation.x = Math.PI / 2;
        return orbitLine;
    }
    
    createPlanet(planetData) {
        const geometry = new THREE.SphereGeometry(planetData.size, 32, 32);
        let material;

        // CHECK: If textureUrl exists, use it. If not (like in your code), use Color.
        if (planetData.textureUrl) {
            const texture = this.textureLoader.load(planetData.textureUrl);
            material = new THREE.MeshStandardMaterial({
                map: texture,
                color: 0xffffff,
                roughness: 0.7,
                metalness: 0.1
            });
        } else {
            // ROBUST FALLBACK: This works with the code you pasted!
            // It reads the {r,g,b} object correctly.
            material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(`rgb(${planetData.color.r}, ${planetData.color.g}, ${planetData.color.b})`),
                emissive: new THREE.Color(`rgb(${planetData.color.r}, ${planetData.color.g}, ${planetData.color.b})`),
                emissiveIntensity: 0.2,
                shininess: 30
            });
        }
        
        const planet = new THREE.Mesh(geometry, material);
        planet.userData = planetData;
        planet.castShadow = true;
        planet.receiveShadow = true;

        // Rings Logic (Only adds rings if 'hasRings' is true)
        if (planetData.hasRings) {
            const ringGeo = new THREE.RingGeometry(planetData.size * 1.4, planetData.size * 2.2, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5,
                map: this.textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Solarsystemscope_texture_2k_saturn.jpg/1024px-Solarsystemscope_texture_2k_saturn.jpg')
            });
            ringMat.map.rotation = Math.PI / 2;
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            planet.add(ring);
        }
        
        return planet;
    }
    
    updatePlanets(planets) {
        this.planetMeshes.forEach(mesh => this.scene.remove(mesh));
        this.orbitLines.forEach(line => this.scene.remove(line));
        this.planetMeshes = [];
        this.orbitLines = [];
        
        planets.forEach(planetData => {
            const planet = this.createPlanet(planetData);
            this.planetMeshes.push(planet);
            this.scene.add(planet);
            
            const orbit = this.createOrbit(planetData.distance);
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
            // FIXED CAMERA MATH
            const distance = this.cameraDistance / this.zoom;
            const y = distance * Math.sin(this.cameraAngle.elevation);
            const r = distance * Math.cos(this.cameraAngle.elevation); 
            
            const x = r * Math.sin(this.cameraAngle.azimuth);
            const z = r * Math.cos(this.cameraAngle.azimuth);
            
            this.camera.position.set(x, y, z);
            this.camera.lookAt(0, 0, 0);
        }
    }
    
    setupEventListeners() {
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            if (this.isDragging && !this.isTopView) {
                const deltaX = e.clientX - this.previousMousePosition.x;
                const deltaY = e.clientY - this.previousMousePosition.y;
                
                this.cameraAngle.azimuth -= deltaX * 0.005; 
                this.cameraAngle.elevation += deltaY * 0.005; 
                
                // Prevent camera flipping
                const limit = Math.PI / 2 - 0.1; 
                this.cameraAngle.elevation = Math.max(-limit, Math.min(limit, this.cameraAngle.elevation));
                
                this.updateCameraPosition();
                this.previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });
        
        canvas.addEventListener('mouseup', () => { this.isDragging = false; });
        canvas.addEventListener('mouseleave', () => { this.isDragging = false; });
        
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 1.1 : 0.9;
            this.zoom = Math.max(0.5, Math.min(3, this.zoom * delta));
            this.updateCameraPosition();
        });
        
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
    }
    
    checkHoveredPlanet() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planetMeshes);
        
        if (this.hoveredPlanet) {
             // Reset glow
             if (this.hoveredPlanet.material.map) {
                this.hoveredPlanet.material.emissiveIntensity = 0; 
             } else {
                this.hoveredPlanet.material.emissiveIntensity = 0.2;
             }
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
        this.planetMeshes.forEach((mesh, index) => {
            const planet = planets[index];
            mesh.position.x = Math.cos(planet.angle) * planet.distance;
            mesh.position.z = Math.sin(planet.angle) * planet.distance;
            mesh.position.y = 0;
            mesh.rotation.y += 0.01;
        });
        
        const pulseScale = 1 + Math.sin(Date.now() * 0.001) * 0.02;
        if(this.sun) this.sun.scale.set(pulseScale, pulseScale, pulseScale);
        
        const hoveredPlanetData = this.checkHoveredPlanet();
        this.renderer.render(this.scene, this.camera);
        
        return { hoveredPlanet: hoveredPlanetData };
    }
    
    start(renderCallback) {
        const animate = () => {
            if (!this.isPaused) {
                renderCallback();
            }
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }
    
    pause() { this.isPaused = true; }
    resume() { this.isPaused = false; }
    stop() { if (this.animationFrame) cancelAnimationFrame(this.animationFrame); }
    reset() {
        this.zoom = 1;
        this.cameraAngle = { azimuth: Math.PI / 4, elevation: Math.PI / 6 };
        this.isTopView = false;
        this.updateCameraPosition();
    }
    setSpeed(speed) { this.speed = speed; }
    setZoom(zoom) { this.zoom = zoom; this.updateCameraPosition(); }
    toggleOrbits() {
        this.showOrbits = !this.showOrbits;
        this.orbitLines.forEach(line => { line.visible = this.showOrbits; });
    }
    toggleTopView() {
        this.isTopView = !this.isTopView;
        this.updateCameraPosition();
    }
    getClickedPlanet(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planetMeshes);
        if (intersects.length > 0) return intersects[0].object.userData;
        return null;
    }
}