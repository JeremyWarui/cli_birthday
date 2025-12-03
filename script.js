// --- Terminal Application Logic ---

// Hard-coded target age for the joke
const TARGET_AGE = 27;

const outputLog = document.getElementById("output-log");
const inputArea = document.getElementById("input-area");

const state = {
  step: "name",
  data: {
    name: "",
    age: "",
    fav_food: "",
    talent: "",
  },
};

const jokes = [
  "You're not old… you're just a classic edition! 😄",
  "You're aging like fine coffee… strong and addictive! ☕😂",
  "You don't get older — you level up! 🎮",
  "Another year older, but still loading wisdom… 99% 😎",
];

// --- Utility Functions ---

/**
 * Scroll helper to reliably scroll the output log to the bottom.
 * Use `smooth: true` for a smooth animated scroll when appropriate.
 */
function scrollToBottom(options = { smooth: false }) {
  requestAnimationFrame(() => {
    try {
      if (options.smooth && typeof outputLog.scrollTo === "function") {
        outputLog.scrollTo({ top: outputLog.scrollHeight, behavior: "smooth" });
      } else {
        outputLog.scrollTop = outputLog.scrollHeight;
      }
    } catch (e) {
      outputLog.scrollTop = outputLog.scrollHeight;
    }
  });
}

/**
 * Simulates typing a line of text into the terminal output with a realistic, randomized delay.
 * @param {string} line The text line to type.
 * @returns {Promise<void>} A promise that resolves when typing is complete.
 */
function typeWrite(line) {
  return new Promise((resolve) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "typed-line";
    outputLog.appendChild(lineDiv);

    // Add blinking cursor span
    const cursor = document.createElement("span");
    cursor.className = "blinking-cursor";
    lineDiv.appendChild(cursor);

    // Keep the log scrolled while we type
    scrollToBottom({ smooth: false });

    let i = 0;
    const minDelay = 15; // Minimum delay for fast typing
    const maxDelay = 90; // Maximum delay for slower typing

    function type() {
      if (i < line.length) {
        const char = line.charAt(i);

        // Append character before the cursor
        lineDiv.insertBefore(document.createTextNode(char), cursor);

        i++;

        // Randomize delay for realism
        let delay =
          Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

        // Add occasional longer pauses for realism
        // Pause after punctuation
        if (char === "." || char === "!" || char === "?") {
          delay += Math.random() * 200 + 100; // 100-300ms pause
        }
        // Pause after commas
        else if (char === "," || char === ";") {
          delay += Math.random() * 100 + 50; // 50-150ms pause
        }
        // Occasional random thinking pause
        else if (Math.random() < 0.08) {
          delay += Math.random() * 150 + 50; // 50-200ms random pause
        }
        // Slower typing on spaces (more natural)
        else if (char === " ") {
          delay += Math.random() * 30 + 20; // Slightly longer for spaces
        }

        // Scroll on every character to ensure we follow the typing
        scrollToBottom({ smooth: false });

        setTimeout(type, delay);
      } else {
        // Remove the cursor when typing is done
        lineDiv.removeChild(cursor);
        resolve();
      }
    }
    type();
  });
}

/**
 * Renders the question, then displays a short shell prompt and waits for user input.
 * This fixes the layout issue where long questions pushed the input field away.
 * @param {string} question The question/label for the prompt.
 * @param {string} stateKey The key in the 'state.data' object to store the result.
 */
async function promptUser(question, stateKey) {
  inputArea.innerHTML = "";

  // 1. Display the question as a typed output line
  await typeWrite(`-> ${question}`);

  // 2. Create the actual input prompt line
  const promptText = "user@birthday-sys:~$ ";

  const promptSpan = document.createElement("span");
  promptSpan.className = "text-cyan-400 font-bold"; // Highlight prompt text
  promptSpan.textContent = promptText;

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  if (stateKey === "age") {
    inputElement.inputMode = "numeric";
    inputElement.pattern = "[0-9]*";
  }
  inputElement.placeholder = "Type here...";
  inputElement.autofocus = true;

  // Create a submit button for mobile (especially iOS numeric keyboard) - only for age input
  let submitButton = null;
  if (stateKey === "age") {
    submitButton = document.createElement("button");
    submitButton.textContent = "→";
    submitButton.className = "submit-btn";
    submitButton.type = "button";
  }

  // Function to handle submission
  const handleSubmit = async function () {
    if (inputElement.value.trim() !== "") {
      const value = inputElement.value.trim();
      state.data[stateKey] = value;

      // Display the user's input in the log, prepended by the prompt
      const inputDisplay = document.createElement("div");
      inputDisplay.className = "typed-line text-yellow-400";
      inputDisplay.textContent = `${promptText}${value}`;
      outputLog.appendChild(inputDisplay);

          // Ensure the newly added input is visible
          scrollToBottom({ smooth: true });

      // Add a small space after user input for readability
      const spacer = document.createElement("div");
      spacer.className = "typed-line";
      spacer.innerHTML = "&nbsp;";
      outputLog.appendChild(spacer);

      inputArea.innerHTML = ""; // Clear input area
      await nextStep(); // Await nextStep call
    }
  };

  // Update onkeyup to be async and display the *full* line on enter
  inputElement.onkeyup = async function (event) {
    if (event.key === "Enter") {
      await handleSubmit();
    }
  };

  // Handle blur event (when keyboard is dismissed on mobile) - only for age input
  if (stateKey === "age") {
    inputElement.onblur = function () {
      // Small delay to allow the submit button to be clicked first
      setTimeout(() => {
        // Re-focus unless we're already processing
        if (inputArea.contains(inputElement)) {
          inputElement.focus();
        }
      }, 100);
    };

    // Button click handler
    submitButton.onclick = async function (event) {
      event.preventDefault();
      await handleSubmit();
    };
  }

  inputArea.appendChild(promptSpan);
  inputArea.appendChild(inputElement);
  if (submitButton) {
    inputArea.appendChild(submitButton);
  }
  inputElement.focus();
  scrollToBottom({ smooth: true });
}

/**
 * Plays a short, celebratory synthesizer sound effect using Tone.js.
 */
async function playCelebrationSound() {
  try {
    // Check if audio context is running (required for browser security)
    if (Tone.context.state !== "running") {
      await Tone.start();
    }

    const synth = new Tone.MembraneSynth().toDestination();

    // A quick, ascending celebratory arpeggio
    synth.triggerAttackRelease("C4", "8n", "+0");
    synth.triggerAttackRelease("E4", "8n", "+0.1");
    synth.triggerAttackRelease("G4", "8n", "+0.2");
    synth.triggerAttackRelease("C5", "4n", "+0.3");
  } catch (error) {
    console.warn("Audio context failed to start (Tone.js).", error);
  }
}

/**
 * Runs the main hacking sequence with progress bar.
 */
async function runBirthdayHack() {
  const hackLines = [
    "Connecting to Birthday Server...",
    "Bypassing Age Firewall...",
    "Decrypting Cake Protocol...",
    "Injecting Happiness Virus...",
    "Uploading Birthday Joy Package...",
    "Finalizing Celebration.exe...",
  ];

  inputArea.innerHTML = "";

  for (const line of hackLines) {
    await typeWrite(line);
  }

  // Create progress bar element
  const progressBarContainer = document.createElement("div");
  progressBarContainer.className = "progress-bar my-4";
  const progressBarFill = document.createElement("div");
  progressBarFill.className = "progress-fill";
  progressBarFill.style.width = "0%";
  progressBarContainer.appendChild(progressBarFill);
  outputLog.appendChild(progressBarContainer);
  scrollToBottom({ smooth: true });

  // Simulate progress
  for (let i = 0; i <= 100; i++) {
    progressBarFill.style.width = `${i}%`;
    await new Promise((r) => setTimeout(r, 20)); // Short delay for visual effect
    // Keep the progress visible as it updates (periodic immediate scroll)
    if (i % 10 === 0) scrollToBottom({ smooth: false });
  }

  await typeWrite(
    "✅ SYSTEM BREACH SUCCESSFUL! Executing Birthday Payload..."
  );

  // Play sound and display final message
  await playCelebrationSound();
  showFinalMessage();
}

/**
 * Displays the final celebratory message, jokes, and data summary.
 */
function showFinalMessage() {
  const { name, age, fav_food, talent } = state.data;
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

  // Summary text in CLI format
  const summaryLines = [
    "---",
    "Birthday Scan Results:",
    `Name: ${name}`,
    // Always display the hard-coded age here for the joke
    `Age: ${TARGET_AGE} (Confidential)`,
    `Favorite Food: ${fav_food}`,
    `Hidden Talent: ${talent}`,
    `Joke: ${randomJoke}`,
    "---",
    "SYSTEM: All systems go. Initiating maximum celebration protocols.",
  ];

  summaryLines.forEach((line) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "typed-line text-green-300";
    lineDiv.textContent = line;
    outputLog.appendChild(lineDiv);
  });

  // Add spacing before the celebratory message
  const spacer = document.createElement("div");
  spacer.className = "typed-line";
  spacer.innerHTML = "&nbsp;";
  outputLog.appendChild(spacer);

  // Render the celebratory message inside the terminal output
  const celebrationDiv = document.createElement("div");
  celebrationDiv.className = "typed-line text-center";
  celebrationDiv.style.cssText = "background-color: rgba(0, 100, 0, 0.3); padding: 20px; border: 2px solid #0f0; border-radius: 8px; margin: 20px 0;";
  celebrationDiv.innerHTML = `
    <div style="color: #ffff00; font-size: 1.5rem; font-weight: bold; margin-bottom: 12px;">🎂🎉 HAPPY BIRTHDAY, ${name.toUpperCase()}!!! 🎉🎂</div>
    <div style="color: #0ff; margin-bottom: 8px;">Today isn't just a normal day — it's the day the world got one of its greatest gifts 💖</div>
    <div style="color: #0ff; margin-bottom: 12px;">I'm incredibly grateful for your friendship, your laughter, your support, and your madness 😄</div>
    <div style="color: #0f0; font-weight: bold; margin-top: 16px; margin-bottom: 8px;">May this year bring you:</div>
    <div style="color: #0ff; text-align: left; display: inline-block;">
      • Big wins and small beautiful moments ✨<br>
      • Endless joy and unforgettable memories 💫<br>
      • Peace that guards your heart 💕<br>
      • And success that even surprises YOU 🚀
    </div>
    <div style="color: #ffff00; font-weight: bold; margin-top: 16px; font-size: 1.2rem;">Today we celebrate YOU — loudly, joyfully, unapologetically 🥳</div>
  `;
  outputLog.appendChild(celebrationDiv);
  
  // Scroll to bottom to show the full message
  setTimeout(() => {
    scrollToBottom({ smooth: true });
  }, 100);
}

/**
 * Moves the simulation to the next step, including age verification and joking.
 */
async function nextStep() {
  switch (state.step) {
    case "name":
      await typeWrite(`Welcome ${state.data.name}! Verifying age...`);
      state.step = "age";
      await promptUser("What is your age?", "age");
      break;
    case "age":
      const inputAge = parseInt(state.data.age);

      if (inputAge !== TARGET_AGE) {
        const ageDifference = Math.abs(inputAge - TARGET_AGE);
        await typeWrite(
          `WARNING: Age mismatch detected. Input: ${inputAge}. System Age: ${TARGET_AGE}.`
        );
        await typeWrite(
          `Hacker Command Line says: 'Stop trying to trick the mainframe, you're **${TARGET_AGE}**! Nice try being ${inputAge}. You owe us ${ageDifference} candles! 🤣'`
        );
        // Set the correct age in state for the final display, but keep the fun dialogue
        state.data.age = TARGET_AGE.toString();
        await typeWrite(
          `> Age forcibly corrected to ${TARGET_AGE}. Moving on...`
        );
      } else {
        await typeWrite(`Age confirmed: ${TARGET_AGE} years. Perfect match!`);
      }

      await typeWrite("Loading favorite food module...");
      state.step = "fav_food";
      await promptUser("What is your favorite food?", "fav_food");
      break;
    case "fav_food":
      await typeWrite(
        `Yum! ${state.data.fav_food} registered. Analyzing hidden talent...`
      );
      state.step = "talent";
      await promptUser(
        "What is your most embarrassing hidden talent?",
        "talent"
      );
      break;
    case "talent":
      await typeWrite(
        `Hidden talent confirmed: ${state.data.talent}. Ready to execute.`
      );
      state.step = "hack";
      showHackButton();
      break;
    default:
      // Should not happen
      break;
  }
}

/**
 * Displays the final hack execution button.
 */
function showHackButton() {
  inputArea.innerHTML = `
        <span class="text-cyan-400 font-bold">CONFIRM LAUNCH: </span>
        <button id="hack-btn" class="hack-button">🚀 EXECUTE BIRTHDAY HACK</button>
    `;
  // Note: The click listener must be set AFTER the button is added to the DOM
  document.getElementById("hack-btn").onclick = runBirthdayHack;
  scrollToBottom({ smooth: true });
}

/**
 * Starts the terminal simulation.
 */
async function startSimulation() {
  await typeWrite("==========================================");
  await typeWrite("      [ B I R T H D A Y   H A C K ]");
  await typeWrite("==========================================");
  await typeWrite("Initializing Birthday Terminal v1.0...");
  await typeWrite("Authorized access granted 😎");
  await typeWrite("------------------------------");

  // Start the first prompt
  await promptUser("What is your name?", "name");
}

// Wait for the window to load before starting the simulation
window.onload = startSimulation;
