//Playlist.js
import React, { useState, useEffect } from 'react';
import PlaylistCard from './PlaylistCard';

const MAX_PLAYLIST_SIZE = 10; // Maximum of 10 audio items allowed

const Playlist = ({ playlist, setPlaylist, onPlay, currentAudio, leftDuration, onTotalRemainingTime }) => {
  const [draggingItem, setDraggingItem] = useState(null); // Item being dragged
  const [dragOverIndex, setDragOverIndex] = useState(null); // Index of the drag target
  const [dragOverPosition, setDragOverPosition] = useState(null); // Whether the mouse is above or below the target

  // Calculate remaining time for the playlist
  const calculateRemainingTime = () => {
    if (!currentAudio) return 0;

    // Find the index of the current audio in the playlist
    const currentIndex = playlist.findIndex(item => item === currentAudio);
    if (currentIndex === -1) return 0;

    let remainingTime = 0;
    for (let i = currentIndex + 1; i < playlist.length; i++) {
      if (playlist[i] && playlist[i].audio_duration) {
        remainingTime += parseFloat(playlist[i].audio_duration);
      }
    }

    return remainingTime;
  };

  // Total remaining time (current audio's remaining time + remaining playlist time)
  const totalRemainingTime = leftDuration + calculateRemainingTime();

  // Log total remaining time to the console
  useEffect(() => {
    console.log(`Total Remaining Time: ${totalRemainingTime} seconds`);
  }, [currentAudio, playlist, leftDuration]);

  // Pass total remaining time back to the parent component
  useEffect(() => {
    if (typeof onTotalRemainingTime === "function") {
      onTotalRemainingTime(totalRemainingTime);
    }
    console.log(`Total Remaining Time: ${totalRemainingTime} seconds`);
  }, [totalRemainingTime]);

  // Handle drag start
  const handleDragStart = (index) => {
    setDraggingItem(playlist[index]);
  };

  // Handle drag enter to determine the position (above or below)
  const handleDragEnter = (e, index) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const middleY = boundingRect.top + boundingRect.height / 2;
    const dragPosition = e.clientY < middleY ? 'above' : 'below';

    setDragOverIndex(index);
    setDragOverPosition(dragPosition);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggingItem(null);
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

  // Handle drop event to update the playlist
  const handleDrop = (event, dropIndex) => {
    event.preventDefault();

    let audioData;
    try {
      const data = event.dataTransfer.getData('audio');
      console.log("📥 Dragged data received:", data);
      audioData = JSON.parse(data);
    } catch (error) {
      console.error("🚨 JSON Parsing Failed:", error);
      return;
    }

    if (!audioData?.id) {
      console.error("🚨 Invalid Dragged Data!", audioData);
      return;
    }

    setPlaylist((prev) => {
      console.log("🔍 Previous Playlist:", JSON.stringify(prev, null, 2));

      let newList = Array.isArray(prev) ? [...prev] : Array(MAX_PLAYLIST_SIZE).fill(null);

      while (newList.length < MAX_PLAYLIST_SIZE) {
        newList.push(null);
      }

      newList[dropIndex] = audioData;
      console.log("🎯 Updated Playlist:", JSON.stringify(newList, null, 2));

      return [...newList]; // Return a fresh array to trigger re-render
    });

    setDragOverIndex(null);
  };

  // Handle removing an audio item
  const handleRemove = (index) => {
    setPlaylist((prev) => {
      const newList = [...prev];
      newList[index] = null; // Remove the audio at the current index

      // If the removed audio is currently playing, stop playback
      if (currentAudio && currentAudio.id === prev[index]?.id) {
        onPlay(null);
      }

      return newList;
    });
  };

  return (
    <div style={styles.playlist}>
      {[...Array(MAX_PLAYLIST_SIZE)].map((_, index) => (
        <PlaylistCard
          key={index}
          item={playlist[index]}
          index={index}
          onRemove={handleRemove}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          dragOverPosition={dragOverPosition} // Pass drag position state
          onDrop={handleDrop}
          isDraggingOver={index === dragOverIndex}
          onPlay={onPlay}
          isPlaying={currentAudio && playlist[index] === currentAudio} // Highlight the currently playing audio
        />
      ))}
    </div>
  );
};

const styles = {
  playlist: {
    width: '100%',
    minHeight: '250px',
    padding: '10px',
    borderRadius: '10px 10px 0 0',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
};

export default Playlist;
