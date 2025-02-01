export interface MenuItemImageInfo {
    menuItem: string;
    imageUrls: string[];
}

export async function findImageForMenuItem(menuItem: string): Promise<MenuItemImageInfo> {
    const response = await (await fetch('http://localhost:3000/images-by-text?query=' + encodeURIComponent(menuItem))).json();
    return {
        menuItem,
        imageUrls: response.images,
    }
}

export async function findImagesForMenuItems(menuItems: string[]): Promise<MenuItemImageInfo[]> {
    const imagesInfos: MenuItemImageInfo[] = [];
    for (const menuItem of menuItems) {
        const imagesInfo = await findImageForMenuItem(menuItem);
        imagesInfos.push(imagesInfo);
    }
    return imagesInfos;
}
