export default defineEventHandler(async (event) => {
    const name = getRouterParam(event, 'name');

    // Security: Prevent directory traversal
    if (!name || name.includes('..') || name.includes('/')) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid filename' });
    }

    const storage = useStorage('avatars');
    if (!await storage.hasItem(name)) {
        throw createError({ statusCode: 404, statusMessage: 'Avatar not found' });
    }

    const file = await storage.getItemRaw(name);

    // Set the correct content type based on extension
    const ext = name.split('.').pop();
    const mime = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
    
    setHeader(event, 'Content-Type', mime);
    setHeader(event, 'Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    
    return file;
});