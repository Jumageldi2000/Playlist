import React, { useState } from 'react';
import { Button } from 'antd';
import { DeleteOutlined, DragOutlined } from '@ant-design/icons';

const PlaylistCard = ({ item, index, onRemove, onDragStart, onDragEnter, onDragEnd, onDrop, isDraggingOver, dragOverPosition, onPlay, isPlaying }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      style={{
        ...styles.item,
        backgroundColor: isPlaying ? "#87CEFA" : isHovered ? "#f5f5f5" : "white",
        borderTop: isDraggingOver && dragOverPosition === 'above' ? '3px solid #3498db' : '1px solid #ddd',
        borderBottom: isDraggingOver && dragOverPosition === 'below' ? '3px solid #3498db' : '1px solid #ddd',
      }}
      draggable={!!item}
      onDragStart={() => item && onDragStart(index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, index)}
      onClick={() => item && onPlay(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={styles.index}>{(index + 1).toString().padStart(2, '0')}</span>
      {item ? (
        <div style={styles.row}>
          <div style={styles.textContainer}>
            <span style={styles.title} title={item.title}>{item.title || "Untitled Audio"}</span>
          </div>
          <div style={styles.rightContainer}>
            {item.audio_duration && (
              <span style={styles.duration}>{formatTime(item.audio_duration)}</span>
            )}
            <div style={styles.buttonContainer}>
              <Button type="text" icon={<DragOutlined />} />
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                onClick={(e) => {
                  e.stopPropagation(); 
                  if (isPlaying) onPlay(null); 
                  onRemove(index);
                }} 
              />
            </div>
          </div>
        </div>
      ) : (
        <span style={styles.emptySlotText}>拖动音频到这里</span>
      )}
    </div>
  );
};

const styles = {
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px',
    borderBottom: '1px solid #ddd',
    height: '40px',
    borderRadius: '7px',
    transition: 'all 0.2s ease-in-out',
  },
  index: {
    marginRight: '10px',
    fontWeight: 'bold',
    color: '#666',
  },
  row: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  textContainer: {
    flex: 1,
    overflow: "hidden",
  },
  title: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    cursor: "pointer",
    textAlign: "left",
    display: 'block',
    width: '222px',
  },
  rightContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0px",
    flexShrink: 0,
  },
  duration: {
    fontSize: "10px",
    color: "#666",
    width: "20px",
    textAlign: "right",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    flexShrink: 0,
  },
};

export default PlaylistCard;
