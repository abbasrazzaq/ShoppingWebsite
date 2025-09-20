// import all pngs under src/assets/items as URLS (hashed by Vite)
const modules = import.meta.glob('../assets/items/*.png',
{
    eager: true,
    as: 'url'
});

// Build a map from filename -> URL
export const imageUrlMap = Object.fromEntries(
    Object.entries(modules).map(([path, url]) => {
        const filename = path.split('/').pop();
        return [filename, url];
    })
);