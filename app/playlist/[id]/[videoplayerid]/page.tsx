import { notFound } from 'next/navigation';
import { Playlist, Video } from '@/app/types';
import VideoPlayer from '../components/VideoPlayer';
import VideoDetailsTabs from '../components/VideoDetailsTabs';
import PlaylistSidebar from '../components/PlaylistSidebar';
import { getSalaselData } from '@/app/lib/datatransform';

// This is a server-side data fetching function
async function getPlaylistAndVideo(playlistId: string, videoId: string): Promise<{ playlist: Playlist; video: Video } | null> {
    try {
        const { courses } = getSalaselData();
        const playlist = courses.find(p => p.id === playlistId);

        if (!playlist) {
            return null;
        }

        const video = playlist.videos.find(v => v.id === videoId);

        if (!video) {
            return null;
        }

        return { playlist, video };
    } catch (error) {
        console.error("Failed to fetch playlist and video data:", error);
        return null;
    }
}


const VideoPlayerPage = async ({ params: paramsPromise }: { params: Promise<{ id: string; videoplayerid: string }> }) => {
    const params = await paramsPromise;
    const data = await getPlaylistAndVideo(params.id, params.videoplayerid);

    if (!data) {
        notFound();
    }

    const { playlist, video } = data;

    return (
        <main dir='rtl' className="w-full max-w-full mx-auto px-4 md:px-6 lg:px-8 pt-4 pb-16">
            <div className="grid grid-cols-1 gap-6 lg:gap-8">
                {/* Top Section: Video Player and Playlist Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Content: Video Player */}
                    <div className="lg:col-span-2">
                        <VideoPlayer video={video} playlist={playlist} />
                    </div>

                    {/* Sidebar: Playlist Content */}
                    <div className="lg:col-span-1">
                        <PlaylistSidebar />
                    </div>
                </div>

                {/* Bottom Section: Video Details */}
                <VideoDetailsTabs />
            </div>
        </main>
    );

};

export default VideoPlayerPage;
