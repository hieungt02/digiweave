import React from 'react';

// A helper function to extract a YouTube video ID from a URL
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

function ContentRenderer({ item }) {
  // We use a switch statement to check the item's type and render the correct element.
  switch (item.type) {
    case 'image_url':
      return <img src={item.content} alt="User content" style={{ maxWidth: '100%', display: 'block' }} />;

    case 'youtube_url':
      const videoId = getYouTubeId(item.content);
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <iframe
            width="250"
            height="150"
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      }
      // Fallback for invalid YouTube links
      return <p style={{ color: 'red' }}>Invalid YouTube URL</p>;

    case 'text':
    default:
      return <p>{item.content}</p>;
  }
}

export default ContentRenderer;