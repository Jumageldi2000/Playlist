//Playlist.js
import React, { useState, useEffect } from 'react';
import PlaylistCard from './PlaylistCard';

const MAX_PLAYLIST_SIZE = 10; // 限制最多 10 个音频

const Playlist = ({ playlist, setPlaylist, onPlay, currentAudio, leftDuration, onTotalRemainingTime  }) => {

  const [draggingItem, setDraggingItem] = useState(null);   // 🎯 拖拽中的项目
  const [dragOverIndex, setDragOverIndex] = useState(null); // 🎯 当前拖拽目标索引
  const [dragOverPosition, setDragOverPosition] = useState(null); // ⬆️⬇️ 记录鼠标是在上方还是下方



  // 🎯 计算剩余时间
  const calculateRemainingTime = () => {
    if (!currentAudio) return 0;

    // ✅ 直接基于对象匹配，而不是 id
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


  // 🎯 计算总剩余时间（当前音频剩余时间 + 后续音频总时间）
  const totalRemainingTime = leftDuration + calculateRemainingTime();

  // 🎯 在控制台中显示总剩余时间
  useEffect(() => {
    console.log(`总剩余时间: ${totalRemainingTime} 秒`);
  }, [currentAudio, playlist, leftDuration]);
   // 🎯 实时将总剩余时间传回父组件
   useEffect(() => {
    if (typeof onTotalRemainingTime === "function") {
      onTotalRemainingTime(totalRemainingTime);
    }
    console.log(`总剩余时间: ${totalRemainingTime} 秒`);
  }, [totalRemainingTime]);
  

  // 🎯 允许 Playlist 内部拖动排序
  const handleDragStart = (index) => {
    setDraggingItem(playlist[index]);
  };

  const handleDragEnter = (e, index) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const middleY = boundingRect.top + boundingRect.height / 2;
    const dragPosition = e.clientY < middleY ? 'above' : 'below';

    setDragOverIndex(index);
    setDragOverPosition(dragPosition);
  };

  // 🎯 处理拖放结束，更新播放列表
  const handleDragEnd = () => {
    setDraggingItem(null);
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

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
  
      return [...newList]; // ✅ Returning a fresh array to trigger re-render
    });
  
    setDragOverIndex(null);
  };

  // 🎯 删除音频，并确保不会自动播放
  // const handleRemove = (audioId) => {
  //   setPlaylist((prev) => {
  //     const newList = prev.map((item) => (item && item.id === audioId ? null : item));

  //     // 🛑 如果删除的音频是当前播放的音频，停止播放
  //     if (currentAudio && currentAudio.id === audioId) {
  //       onPlay(null); // 停止播放
  //     }

  //     return newList;
  //   });
  // };
  const handleRemove = (index) => {
    setPlaylist((prev) => {
      const newList = [...prev];
      newList[index] = null; // 只删除当前索引位置的音频
  
      // 🛑 如果删除的音频是当前播放的音频，停止播放
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
          dragOverPosition={dragOverPosition} // 传递位置状态
          onDrop={handleDrop}
          isDraggingOver={index === dragOverIndex}
          onPlay={onPlay} // 🔥 Pass play function
          //isPlaying={currentAudio && playlist[index]?.id === currentAudio.id} // ✅ Only highlight when playing  // ✅ Compare with current playing audio
          isPlaying={currentAudio && playlist[index] === currentAudio} // ✅ 只高亮当前播放的音频

        />
      ))}
    </div>
  );
};

const styles = {
  playlist: {
    width: '100%',
    minHeight: '250px',
    //border: '2px solid #bbb',
    padding: '10px',
    //borderRadius: '7px',
    borderRadius: '10px 10px 0 0',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
};

export default Playlist;