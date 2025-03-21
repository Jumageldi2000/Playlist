💡 What this code does

✅ Prerequisites to run

📦 File structure and components

🔧 How to use

🛠️ Key features

📁 Translated code comments from Chinese to English

🎧 Playlist System - React Component (Legacy)

  This component represents an interactive drag-and-drop playlist manager designed for managing audio files within a React application. Although you're phasing it out in favor of a new UI, it's still a valuable reference for others.

✅ Prerequisites
React (v16+)
Ant Design (antd)
Audio items in the format:
{
  id: number,
  title: string,
  audio_duration: number, // in seconds
}
CSS-in-JS (inline styles, used in the provided example)
📁 Structure
1. Playlist.js
The container component managing the list of audio items.
Handles:
Internal state for drag-and-drop
Item deletion
Playback logic
2. PlaylistCard.js
The individual audio card.
Supports:
Visual highlighting when dragging
Delete and drag icons
Play on click
🧩 Key Features
Feature	Description
🎛️ Drag-and-drop	Allows reordering items within the playlist
🎯 Insert highlight	Shows visual insert markers (above/below) during drag
🚮 Deletion	Remove an audio item from the list
▶️ Click-to-play	Clicking an item triggers playback
🕒 Remaining time tracking	Tracks total time left from the current audio
🔧 How to Use
jsx
Copy
Edit
import Playlist from './Playlist';

// Example:
<Playlist
  playlist={yourAudioList}
  setPlaylist={setYourAudioList}
  currentAudio={currentlyPlayingAudio}
  onPlay={handlePlayFunction}
  leftDuration={secondsLeftInCurrentTrack}
  onTotalRemainingTime={(totalSeconds) => console.log('⏳ Total time:', totalSeconds)}
/>
🔤 Code Comment Translation
All original comments (in Chinese) have been translated to English.

Example:
js
Copy
Edit
const [draggingItem, setDraggingItem] = useState(null);   // 🎯 Currently dragged item
const [dragOverIndex, setDragOverIndex] = useState(null); // 🎯 Target index during drag
const [dragOverPosition, setDragOverPosition] = useState(null); // ⬆️⬇️ 'above' or 'below'
📌 Sample Usage
jsx
Copy
Edit
const yourAudioList = [
  { id: 1, title: "Track One", audio_duration: 120 },
  { id: 2, title: "Track Two", audio_duration: 95 },
  ...
];
