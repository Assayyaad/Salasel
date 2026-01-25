'use client'
import { addWatchedVideo } from '@/app/lib/localStorage';
import type { Playlist, Video } from '@/app/types'
import React, { useEffect, useRef } from 'react'
import 'video.js/dist/video-js.css'
import { by, noVideos } from '@/app/static'

interface VideoPlayerProps {
  video: Video;
  playlist: Playlist;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, playlist }) => {
  const videoNode = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const initVideoJs = async () => {
      const videojs = (await import('video.js')).default;
      await import('videojs-youtube');

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
        player.on('ended', () => {
            addWatchedVideo(playlist.id, video.id);
        });
      } else {
        const player = playerRef.current;
        player.src({ src: videoSrc, type: 'video/youtube' });
      }
    };

    initVideoJs();

  }, [video, playlist.id]);

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{video.title}</h1>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span>من سلسلة: </span>
                <span className="font-semibold text-primary">{playlist.name}</span>
                <span className="mx-2">|</span>
                <span>قناة: </span>
                <span className="font-semibold text-primary">{playlist.channel}</span>
            </div>
          </div>
          {/* Icons have been removed from here */}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
