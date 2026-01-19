'use client'

import type { Playlist, Video } from '@/app/types'
import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-youtube'
import { by, noVideos } from '@/app/static'

interface VideoPlayerProps {
  video: Video;
  playlist: Playlist;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, playlist }) => {
  const videoNode = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!video || !videoNode.current) {
      return;
    }

    const videoSrc = `https://www.youtube.com/watch?v=${video.id}`;

    if (!playerRef.current) {
      const player = (playerRef.current = videojs(
        videoNode.current,
        {
          autoplay: false,
          controls: true,
          responsive: true,
          fluid: true,
          techOrder: ['youtube'],
          sources: [
            {
              src: videoSrc,
              type: 'video/youtube',
            },
          ],
        },
        () => {
          console.log('player is ready');
        }
      ));
    } else {
      const player = playerRef.current;
      player.src({ src: videoSrc, type: 'video/youtube' });
    }

  }, [video]);

  // Dispose the player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  if (!video) {
    return (
      <div className="lg:col-span-2 flex flex-col gap-6 items-center justify-center bg-black rounded-xl aspect-video">
        <p className="text-white">{noVideos}</p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 flex flex-col gap-0">
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
        <div data-vjs-player>
          <video ref={videoNode} className="video-js vjs-big-play-centered" />
        </div>
      </div>
      <div dir="rtl" className="flex flex-col gap-2 p-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{video.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {by} <span className="font-medium text-primary">{playlist.participants.join(', ')}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <span className="material-icons-round">share</span>
            </button>
            <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <span className="material-icons-round">bookmark_border</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;