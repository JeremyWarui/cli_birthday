# CLI Birthday — Retro "Hack Terminal" Birthday Greeting

A small browser-based interactive birthday experience that looks and feels like a retro command-line "hack" terminal. The app guides the user through typed prompts (name, age, favorite food, hidden talent), runs a playful "hack" sequence with a progress bar, and finishes with a celebratory message and short Tone.js sound effect.

**This project is intended to be opened in a web browser (desktop or mobile).**

**Highlights:**
- Retro terminal UI and typed output animation
- Interactive prompts and simple client-side state
- Small progress-bar "hack" sequence and celebratory sound (Tone.js)
- Mobile-friendly input handling (includes a numeric-submit button for age)

## Demo

No public demo is deployed for this repository. Run locally (instructions below) to try it in your browser.

## Quick Start (local)

1. Clone the repository:
```powershell
git clone https://github.com/JeremyWarui/cli_birthday.git ; cd cli_birthday
```

2. Open `index.html` directly in a browser (double-click), or run a simple local server:
```powershell
# Using Python (if installed)
python -m http.server 8000

# Or with Node (serve package)
npx serve .
```

3. Open `http://localhost:8000` (when using a server) or view `index.html` locally.

## What it does

- Starts a typed terminal-like sequence and asks for the user's name.
- Asks for age and compares it to a hard-coded `TARGET_AGE` (this is part of the joke).
- Collects favorite food and a hidden talent.
- Presents a playful hack/progress sequence and a final celebratory message; plays a short synth sequence via Tone.js if the browser allows audio.

## File Structure

```
cli_birthday/
├── index.html      # Main HTML structure (loads Tailwind CDN, Tone.js, styles.css, script.js)
├── styles.css      # Visual styles and terminal effects
├── script.js       # Application logic: typing, prompts, hack sequence, Tone.js sound
└── README.md       # This file
```

## Configuration & Customization

- Change the joke/forced age by editing `TARGET_AGE` in `script.js`:
```javascript
const TARGET_AGE = 27; // update as desired
```

- Customize typed output speed by tweaking `minDelay` / `maxDelay` in `typeWrite()` in `script.js`.

- Update the final message text inside `showFinalMessage()` in `script.js` to personalize the message.

## Dependencies

- No build step required. The project uses CDN-hosted libraries in `index.html`:
	- Tailwind CSS (via CDN)
	- Tone.js (via CDN)

## Notes & Known Behaviors

- Audio will only play after a user gesture in some browsers; the code attempts to start the Tone.js context when running the celebration sound.
- The app uses a hard-coded `TARGET_AGE` to create the playful "age correction" behavior — adjust or remove if you prefer.

## License

This project is licensed under the MIT License — see the `LICENSE` file in the repository root for the full text.

## Author

Created by Jeremy Warui — repository: `JeremyWarui/cli_birthday`.

---
If you'd like, I can also:
- Add a small `LICENSE` file (MIT) to the repo.
- Add a screenshot or demo GIF to the README.
- Add a GitHub Pages deployment guide and default URL placeholder.
Tell me which you'd prefer and I'll implement it.
