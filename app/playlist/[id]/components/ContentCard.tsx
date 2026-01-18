// app/playlist/[id]/components/ContentCard.tsx
import Image from 'next/image';
import { useState, useEffect } from 'react'; // Import useState and useEffect

interface ContentCardProps {
    lessonNumber: number;
    title: string;
    duration: string;
    completed?: boolean;
    highlight?: boolean;
    videoId: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ lessonNumber, title, duration, completed, highlight, videoId }) => {
    const [isCompleted, setIsCompleted] = useState(completed); // Use local state for completed status

    useEffect(() => {
        setIsCompleted(completed); // Update local state if prop changes
    }, [completed]);

    const handleCheckboxChange = () => {
        setIsCompleted(!isCompleted); // Toggle local completed state
    };

    const imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return (
        <div dir="rtl" className={`group relative transition-colors cursor-pointer p-4 sm:px-6 ${highlight ? 'bg-gray-50 dark:bg-gray-700/30' : ''} ${isCompleted ? 'bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-32 md:w-48 aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                            <Image
                                alt={title}
                                className="w-full ml-1 mr-1 h-full object-cover object-center opacity-80 group-hover:opacity-100 transition-opacity"
                                src={imageUrl}
                                fill={true}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                                {isCompleted ? (
                                    <span className="material-icons-round text-green-400 text-3xl drop-shadow-md">check_circle</span>
                                ) : (
                                    <span className="material-icons-round text-white text-2xl drop-shadow-md">play_circle</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mr-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs sm:text-sm font-medium text-primary mb-1">الحلقة {lessonNumber}</p>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-text-light dark:text-text-dark truncate group-hover:text-primary transition-colors">{title}</h3>
                        <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark font-medium mt-0.5">{duration}</p>
                    </div>
                </div>
                <input type="checkbox" className="form-checkbox h-6 w-6 sm:h-5 sm:w-5 text-primary rounded-full focus:ring-primary flex-shrink-0" checked={isCompleted} onChange={handleCheckboxChange} />
            </div>
        </div>
    );
};

export default ContentCard;
