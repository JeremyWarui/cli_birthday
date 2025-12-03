# Birthday Hack Terminal 🎂

An interactive birthday greeting web app styled as a retro command-line interface with terminal aesthetics.

## Features

- 🖥️ Retro terminal interface with CRT scanline effects
- ⌨️ Realistic typing animation with natural pauses
- 🎮 Interactive prompts for personalized birthday messages
- 🎵 Celebratory sound effects using Tone.js
- 📱 Mobile-responsive design
- 🎉 Fun age verification "hack" sequence

## Demo

Try it live: [Your GitHub Pages URL]

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/JeremyWarui/cli_birthday.git
cd cli_birthday
```

2. Open `index.html` in your browser or serve it locally:
```bash
# Using Python
python3 -m http.server 8000

# Or using Node.js
npx serve
```

3. Navigate to `http://localhost:8000`

## File Structure

```
cli_birthday/
├── index.html      # Main HTML structure
├── styles.css      # Terminal styling and animations
├── script.js       # Application logic
└── README.md       # This file
```

## GitHub Pages Deployment

1. Push your code to GitHub
2. Go to repository Settings
3. Navigate to Pages section
4. Select source branch (usually `main`)
5. Save and wait for deployment
6. Your site will be live at `https://jeremywarui.github.io/cli_birthday/`

## Customization

### Change Target Age
Edit `TARGET_AGE` in `script.js`:
```javascript
const TARGET_AGE = 27; // Change to desired age
```

### Modify Birthday Messages
Edit the `showFinalMessage()` function in `script.js` to customize the celebratory text.

### Adjust Typing Speed
Modify timing in the `typeWrite()` function in `script.js`:
```javascript
const minDelay = 15; // Faster
const maxDelay = 90; // Slower
```

## Technologies Used

- HTML5
- CSS3 (with scanline animations)
- Vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- [Tone.js](https://tonejs.github.io/) (for sound effects)

## License

MIT License - Feel free to use this for your own birthday surprises!

## Credits

Created by [Jeremy Warui](https://github.com/JeremyWarui)
