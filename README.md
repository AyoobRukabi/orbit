# 🌌 Orbit - Solar System Simulator

An interactive 3D solar system visualization built with Go, HTML, CSS, and JavaScript.

## Features

- **Interactive Controls**: Speed, zoom, and pause/play controls
- **Planet Information**: Click on any planet to see detailed information
- **Draggable Canvas**: Drag to move the view around
- **Mouse Wheel Zoom**: Scroll to zoom in and out
- **Realistic Orbits**: Planets orbit at different speeds based on their distance from the sun
- **Beautiful Design**: Modern UI with gradient backgrounds and smooth animations

## Project Structure

```
/orbit
  ├── index.html          # Main HTML file
  ├── style.css           # Styling and UI design
  ├── server.go           # Go web server
  └── js/
      ├── main.js         # Application initialization
      ├── solarSystem.js  # Solar system rendering and physics
      ├── planetManager.js # Planet data and orbital mechanics
      └── uiManager.js    # UI controls and interactions
```

## Prerequisites

- Go 1.16 or higher

## Installation & Running

1. Navigate to the orbit directory:
   ```bash
   cd orbit
   ```

2. Run the Go server:
   ```bash
   go run server.go
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Usage

### Controls

- **Speed Slider**: Adjust the orbital speed of planets (0-5x)
- **Zoom Slider**: Zoom in/out of the solar system (0.5-3x)
- **Pause/Play Button**: Pause or resume the animation
- **Reset Button**: Reset camera position, zoom, and speed to defaults
- **Toggle Orbits Button**: Show/hide orbital paths

### Interactions

- **Click on a Planet**: View detailed information about the planet
- **Drag Canvas**: Click and drag to pan the view
- **Mouse Wheel**: Scroll to zoom in/out
- **Planet Buttons**: Click on the planet list to focus on a specific planet

## Planets Included

1. **Mercury** - The smallest and fastest planet
2. **Venus** - The hottest planet
3. **Earth** - Our home planet
4. **Mars** - The Red Planet
5. **Jupiter** - The largest planet
6. **Saturn** - Famous for its rings
7. **Uranus** - The tilted ice giant
8. **Neptune** - The windiest planet

## Technical Details

### Frontend
- Pure JavaScript (no frameworks)
- HTML5 Canvas for rendering
- CSS3 for modern UI design
- Responsive design for different screen sizes

### Backend
- Go HTTP server
- Serves static files
- Lightweight and fast

## Customization

You can easily customize the solar system by editing `js/planetManager.js`:

- Add new planets or celestial bodies
- Adjust orbital speeds and distances
- Change planet sizes and colors
- Modify planet information

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Performance

The application uses `requestAnimationFrame` for smooth 60 FPS animations and is optimized for performance with efficient canvas rendering.

## License

Free to use and modify!

## Credits

Created with ❤️ by Claude

Enjoy exploring the solar system! 🚀✨