// app/playlist/[id]/components/SelectedPlaylistCard.tsx
"use client";
import Image from 'next/image';
import { usePlaylistStore } from '@/app/store/usePlaylistStore';
import { useEffect, useState } from 'react';
import { Playlist } from '@/app/types';

const SelectedPlaylistCard = ({ playlist }: { playlist: Playlist }) => {
    const [isLoading, setIsLoading] = useState(true);

    if (!playlist) {
        return <div>جاري التحميل...</div>; // Or some other loading state
    }

    const videoId = playlist.الفيديوهات?.[0]?.['معرف الفيديو'];
    const imageUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : playlist.الفيديوهات?.[0]?.['صورة مصغرة'] || "";

    return (
        <div dir="rtl" className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row">
                <div className="p-6 lg:w-1/2 flex flex-col justify-center space-y-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-text-light dark:text-text-dark mb-2 tracking-tight">{playlist.الاسم}</h1>
                        <div className="flex items-center space-x-4 text-sm text-muted-light dark:text-muted-dark font-medium">
                            <span className="flex items-center"><span className="material-icons-round text-base ml-1">schedule</span> {playlist['المدة الإجمالية (بالساعات)']}</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className="flex items-center"><span className="material-icons-round text-base ml-1">ondemand_video</span> {playlist['عدد الحلقات']} فيديو</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>المقدم: {playlist.المقدمين}</span>
                        </div>
                    </div>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        {playlist['وصف مختصر']}
                    </p>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-muted-light dark:text-muted-dark">
                            <span>التقدم</span>
                            <span>0%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-105 cursor-pointer">
                            <span className="material-icons-round mr-2">play_arrow</span>
                            متابعة المشاهدة
                        </button>
                    </div>
                </div>
                <div className="lg:w-1/2 relative bg-gray-100 dark:bg-gray-800 h-[350px]">
                    {isLoading && <div className="shimmer-wrapper"></div>}
                    <Image
                        alt={playlist.الاسم}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        src={imageUrl}
                        fill={true}
                        priority
                        onLoad={() => setIsLoading(false)}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-l from-transparent to-black/10 dark:to-black/30 pointer-events-none transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}></div>
                </div>
            </div>
        </div>
    );
};

export default SelectedPlaylistCard;
