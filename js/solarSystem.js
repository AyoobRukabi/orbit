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
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredPlanet = null;
        
        // Camera controls
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.cameraAngle = { theta: Math.PI / 6, phi: Math.PI / 4 };
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
        
        // Create sun
        this.createSun();
    }
    
    addLights() {
        // Sunlight (point light at center)
        const sunLight = new THREE.PointLight(0xffffff, 2, 5000);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);
        
        // Ambient light for better visibility
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
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xFDB813,
            emissive: 0xFDB813,
            emissiveIntensity: 1
        });
        
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);
        
        // Add sun glow
        const glowGeometry = new THREE.SphereGeometry(55, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.sun.add(glow);
        
        // Add outer glow
        const outerGlowGeometry = new THREE.SphereGeometry(70, 32, 32);
        const outerGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff8800,
            transparent: true,
            opacity: 0.1
        });
        const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
        this.sun.add(outerGlow);
    }
    
    createOrbit(distance) {
        const curve = new THREE.EllipseCurve(
            0, 0,
            distance, distance,
            0, 2 * Math.PI,
            false,
            0
        );
        
        const points = curve.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x6464aa,
            transparent: true,
            opacity: 0.3
        });
        
        const orbitLine = new THREE.Line(geometry, material);
        orbitLine.rotation.x = Math.PI / 2;
        return orbitLine;
    }
    
    createPlanet(planetData) {
        const geometry = new THREE.SphereGeometry(planetData.size, 32, 32);
        
        // Create material with planet color
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(`rgb(${planetData.color.r}, ${planetData.color.g}, ${planetData.color.b})`),
            emissive: new THREE.Color(`rgb(${planetData.color.r}, ${planetData.color.g}, ${planetData.color.b})`),
            emissiveIntensity: 0.2,
            shininess: 30
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.userData = planetData;
        planet.castShadow = true;
        planet.receiveShadow = true;
        
        return planet;
    }
    
    updatePlanets(planets) {
        // Remove old planet meshes and orbits
        this.planetMeshes.forEach(mesh => this.scene.remove(mesh));
        this.orbitLines.forEach(line => this.scene.remove(line));
        this.planetMeshes = [];
        this.orbitLines = [];
        
        // Create new planet meshes and orbits
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
            this.camera.position.x = 0;
            this.camera.position.y = this.cameraDistance * this.zoom;
            this.camera.position.z = 1;
            this.camera.lookAt(0, 0, 0);
        } else {
            const distance = this.cameraDistance / this.zoom;
            this.camera.position.x = distance * Math.sin(this.cameraAngle.theta) * Math.cos(this.cameraAngle.phi);
            this.camera.position.y = distance * Math.sin(this.cameraAngle.phi);
            this.camera.position.z = distance * Math.cos(this.cameraAngle.theta) * Math.cos(this.cameraAngle.phi);
            this.camera.lookAt(0, 0, 0);
        }
    }
    
    setupEventListeners() {
        const canvas = this.renderer.domElement;
        
        // Mouse down
        canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        // Mouse move
        canvas.addEventListener('mousemove', (e) => {
            // Update mouse position for raycasting
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            if (this.isDragging && !this.isTopView) {
                const deltaX = e.clientX - this.previousMousePosition.x;
                const deltaY = e.clientY - this.previousMousePosition.y;
                
                this.cameraAngle.theta += deltaX * 0.01;
                this.cameraAngle.phi += deltaY * 0.01;
                
                // Limit phi to prevent flipping
                this.cameraAngle.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.cameraAngle.phi));
                
                this.updateCameraPosition();
                
                this.previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });
        
        // Mouse up
        canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });
        
        // Mouse wheel zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 1.1 : 0.9;
            this.zoom = Math.max(0.5, Math.min(3, this.zoom * delta));
            this.updateCameraPosition();
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
    }
    
    checkHoveredPlanet() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planetMeshes);
        
        // Reset previous hovered planet
        if (this.hoveredPlanet) {
            this.hoveredPlanet.material.emissiveIntensity = 0.2;
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
        // Update planet positions
        this.planetMeshes.forEach((mesh, index) => {
            const planet = planets[index];
            mesh.position.x = Math.cos(planet.angle) * planet.distance;
            mesh.position.z = Math.sin(planet.angle) * planet.distance;
            mesh.position.y = 0;
            
            // Rotate planet on its axis
            mesh.rotation.y += 0.01;
        });
        
        // Subtle sun pulsing
        const pulseScale = 1 + Math.sin(Date.now() * 0.001) * 0.02;
        this.sun.scale.set(pulseScale, pulseScale, pulseScale);
        
        // Check for hovered planet
        const hoveredPlanetData = this.checkHoveredPlanet();
        
        // Render scene
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
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    reset() {
        this.zoom = 1;
        this.cameraAngle = { theta: Math.PI / 6, phi: Math.PI / 4 };
        this.isTopView = false;
        this.updateCameraPosition();
    }
    
    setSpeed(speed) {
        this.speed = speed;
    }
    
    setZoom(zoom) {
        this.zoom = zoom;
        this.updateCameraPosition();
    }
    
    toggleOrbits() {
        this.showOrbits = !this.showOrbits;
        this.orbitLines.forEach(line => {
            line.visible = this.showOrbits;
        });
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
        
        if (intersects.length > 0) {
            return intersects[0].object.userData;
        }
        return null;
    }
}