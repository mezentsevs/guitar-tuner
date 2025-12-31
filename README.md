# Guitar tuner

## About 'Guitar tuner'

This is a guitar tuner, written in and for educational and demonstrational purposes.

An online professional guitar tuner with real-time audio analysis - works directly in the browser without additional software installation. Provides precise tuning through microphone with advanced autocorrelation algorithm, intuitive interface, and support for various tunings including custom configurations. Features professional-grade accuracy with harmonic filtering and edge case protection.

Based on tech stack:
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML),
- [TypeScript](https://www.typescriptlang.org),
- [Nuxt](https://nuxt.com),
- [Vue](https://vuejs.org),
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS),
- [TailwindCss](https://tailwindcss.com).

## Features & Capabilities

### Core Tuning Modes
- Standard Guitar Tuning: EADGBE (6-string)
- Alternative Guitar Tunings: Drop D, DADGAD, Open G, Open D, Drop C, ½ Step Down, Open C
- Bass Guitar Support: 4-string and 5-string bass tunings
- Ukulele Tunings: Soprano, Concert, Tenor, and Baritone variations
- World Instruments: Balalaika, Domra, Shamisen, Oud, Sitar tunings
- Custom Tunings: Create, edit and save custom tunings for any string instrument

### Professional Features
- Real-Time Audio Analysis: Web Audio API with autocorrelation algorithm for precise frequency detection
- Visual Tuning Indicators: Color-coded feedback (blue - low, green - in tune, red - high)
- Cent-Based Precision: Deviation display in cents with moving indicator
- Reference Audio: Listen to correct pitch for each string
- Multi-Band Support: Configurable custom tunings
- Theme System: Light/dark modes
- Local Storage: All settings and custom tunings saved locally

### Advanced Algorithms
- Enhanced Autocorrelation Algorithm: Advanced pitch detection with adaptive windowing and median filtering
- Harmonic Filtering: Intelligent rejection of octave harmonics and noise
- Stagnation Prevention: Dynamic buffer reset to prevent frequency "sticking"
- Robust Signal Validation: Multiple validation stages with confidence scoring
- Edge Case Protection: Safe handling of extreme frequencies and NaN values
- Adaptive Smoothing: Weighted moving average with exponential decay for stable readings
- Octave Correction: Smart frequency doubling/halving for out-of-range detection

## Getting Started (Nuxt Minimal Starter)

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Usage Scenarios

### Primary Use Cases
- Standard Guitar Tuning: Quick tuning of 6-string guitar in EADGBE
- Alternative Tunings: Switch between popular alternative guitar tunings
- Other Instruments: Tune bass guitars, ukuleles, and world instruments
- Custom Tunings: Create and use custom tunings for non-standard instruments
- Performance Use: Quick tuning checks during rehearsal or performance

### Technical Specifications
- Frequency Detection Range: 1-2000 Hz with safe edge case handling
- Precision: ±1 cent resolution with professional-grade accuracy
- Audio Processing: 8192-point FFT with optimized autocorrelation algorithm
- Signal Processing: RMS-based noise rejection with dynamic thresholding
- Real-Time Analysis: 60fps continuous audio processing
- Responsive Design: Mobile-first adaptive interface with grid-based layouts
- Browser Support: Modern browsers with Web Audio API support
- Zero Installation: Works entirely in browser with local storage persistence

## Technical Implementation

### Audio Processing
- Web Audio API: Microphone input and frequency analysis
- Autocorrelation Algorithm: Precise fundamental frequency detection
- Reference Tone Generation: Clean sine wave reference tones
- Noise Reduction: RMS-based silence detection

### State Management
- Reactive Composables: Modular state management with useTuner()
- Local Persistence: Automatic saving of custom tunings and preferences
- Real-Time Updates: Continuous audio analysis with requestAnimationFrame

### UI/UX Design
- Responsive Grid: Adaptive string layout for 1-10+ strings
- Visual Feedback: Color-coded status indicators
- Smooth Animations: CSS transitions for all interactive elements
- Accessibility: Semantic HTML and ARIA labels

## Browser Compatibility

Requires a modern browser with:
- [Web Audio API support](https://caniuse.com/audio-api)
- MediaDevices.getUserMedia()
- ES2022+ JavaScript features
- CSS Grid and Flexbox

Recommended browsers:
- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

## Screenshots

<img width="1920" height="1200" alt="2025-12-06_15-37-42" src="https://github.com/user-attachments/assets/05965676-81a2-46e6-b093-fb94ea6c6650" />
<img width="1920" height="1200" alt="2025-12-06_15-39-17" src="https://github.com/user-attachments/assets/d2b4e886-248f-4f5e-83de-6c1378798250" />
<img width="1920" height="1200" alt="2025-12-06_15-41-09" src="https://github.com/user-attachments/assets/974bb203-77cd-4dc1-a600-abe90d06c807" />
<img width="1920" height="1200" alt="2025-12-06_15-41-59" src="https://github.com/user-attachments/assets/41b49827-ff87-4c0e-971f-d38490a439a0" />
<img width="1920" height="1200" alt="2025-12-06_16-06-04" src="https://github.com/user-attachments/assets/ac8a83e8-2347-4cf6-88b6-029b6fc7fe38" />
<img width="1920" height="1200" alt="2025-12-06_16-10-41" src="https://github.com/user-attachments/assets/218672df-e5f1-4186-ad0d-101ee5ff89ec" />
<img width="1920" height="1200" alt="2025-12-06_15-46-21" src="https://github.com/user-attachments/assets/50247423-cc0e-42fe-9442-61e71e34f190" />
<img width="1920" height="1200" alt="2025-12-06_15-48-56" src="https://github.com/user-attachments/assets/7c4020f0-93da-453f-b71e-f97ae0dcbea3" />
<img width="1920" height="1200" alt="2025-12-06_15-50-05" src="https://github.com/user-attachments/assets/7de7500d-62f4-4a96-8d31-44d164b8181e" />
<img width="1920" height="1200" alt="2025-12-06_15-51-35" src="https://github.com/user-attachments/assets/6bfca9ac-1190-4ee9-95d6-340a6b48ebed" />
<img width="1920" height="1200" alt="2025-12-06_15-53-25" src="https://github.com/user-attachments/assets/7176b3c2-7313-4597-8ea1-ad21ba208ab1" />
<img width="1920" height="1200" alt="2025-12-06_15-54-51" src="https://github.com/user-attachments/assets/f358cc6e-33ec-4c4f-835f-ab0d96e31552" />
<img width="1920" height="1200" alt="2025-12-06_15-56-41" src="https://github.com/user-attachments/assets/ecddf549-530a-4c1a-b823-75b48bf1cd6a" />
<img width="1920" height="1200" alt="2025-12-06_15-57-35" src="https://github.com/user-attachments/assets/28f7da17-7b25-43de-b4fb-bba047e1f5c2" />
<img width="1920" height="1200" alt="2025-12-06_15-59-35" src="https://github.com/user-attachments/assets/f153c5a9-b8d6-4aba-94bf-e33b4bb36a5f" />
<img width="1920" height="1200" alt="2025-12-06_16-00-52" src="https://github.com/user-attachments/assets/f061e0b4-ccaf-40cf-9f8f-a5ed6129ccbc" />

## License

The 'Guitar tuner' is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
