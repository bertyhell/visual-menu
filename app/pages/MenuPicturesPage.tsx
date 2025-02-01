import React, {type ChangeEvent, type FC, useState} from "react";
import {analyseText} from "~/helpers/recognize-text";
import {analyseMenuItemsFromText} from "~/helpers/analyse-menu-items-from-text";
import {findImagesForMenuItems, type MenuItemImageInfo} from "~/helpers/find-images-for-menu-items";

enum ImageStatus {
    ANALYSING_OCR = "ANALYSING_OCR",
    FINDING_IMAGES = "FINDING_IMAGES",
    FINISHED = "FINISHED",
    ERROR = "ERROR",
}

interface ImageInfo {
    id: string;
    index: number;
    file: File;
    status: ImageStatus;
    progress: number;
    total: number;
    menuText: string | undefined;
    menuItems: string[] | undefined;
    menuItemPictureInfos: MenuItemImageInfo[] | undefined;
}

export const MenuPicturesPage: FC = () => {
    const [images, setImages] = useState<ImageInfo[]>([]);

    const handleCapture = (event: ChangeEvent) => {
        const files = Array.from((event.target as HTMLInputElement).files || []);
        if (files.length > 0) {
            const newImages = files.map((file) => ({
                id: URL.createObjectURL(file),
                index: images.length + 1,
                file: file,
                status: ImageStatus.ANALYSING_OCR,
                progress: 0,
                total: 0,
                menuText: undefined,
                menuItems: undefined,
                menuItemPictureInfos: undefined,
            }));
            setImages((prev) => [...newImages, ...prev ]);
            newImages.forEach(async (img) => {
                const menuText = await analyseText(img.file, (progressLogger) => {
                    setImages((prev) => prev.map((prevImg) => {
                        if (prevImg.id === img.id) {

                            return { ...prevImg, progress: progressLogger.progress, total: 100 };
                        }
                        return prevImg;
                    }));
                });
                setImages((prev) => prev.map((prevImg) => {
                    if (prevImg.id === img.id) {
                        return { ...prevImg, menuText };
                    }
                    return prevImg;
                }));
                const menuItems = analyseMenuItemsFromText(menuText);
                setImages((prev) => prev.map((prevImg) => {
                    if (prevImg.id === img.id) {
                        return { ...prevImg, menuItems, status: ImageStatus.FINDING_IMAGES };
                    }
                    return prevImg;
                }));
                const menuItemPictures = await findImagesForMenuItems(menuItems);
                setImages((prev) => prev.map((prevImg) => {
                    if (prevImg.id === img.id) {
                        return { ...prevImg, menuItemPictureInfos: menuItemPictures, status: ImageStatus.FINISHED };
                    }
                    return prevImg;
                }));
            });
        }
    };

    const renderStatus = (img: ImageInfo): string => {
        switch (img.status){
            case ImageStatus.ANALYSING_OCR:
                return "Analysing text... " + img.progress + "%";
            case ImageStatus.FINDING_IMAGES:
                return "Finding images... " + img.progress + "/" + img.total;
            case ImageStatus.FINISHED:
                return "Finished: " + img.progress + "/" + img.total;
            case ImageStatus.ERROR:
                return "Error";
            default:
                return "Unknown";
        }
    };

    return (
        <div className={`flex flex-col items-center ${images.length === 0 ? "justify-center h-screen" : "pt-6"}`}>
            {/* Upload Button */}
            <input type="file" accept="image/*" capture="environment" onChange={handleCapture} id="cameraInput" className="hidden" multiple />
            <label htmlFor="cameraInput" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md cursor-pointer transition duration-300 hover:bg-blue-700">
                Take a Photo of the Menu
            </label>

            {/* Image List */}
            <div className="w-full max-w-md mt-6 space-y-4">
                {images.map((img, index) => (
                    <div key={img.id} className="relative bg-white p-2 rounded-lg shadow-md flex items-center">
                        <img src={img.id} alt="Captured" className="w-24 h-24 rounded-lg object-cover" />
                        <div>
                            <span className="ml-4 text-sm text-gray-600">Image {img.index}</span>
                            <span>{renderStatus(img)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

