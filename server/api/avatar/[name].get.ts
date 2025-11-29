export default defineEventHandler (async (event) => {
    const fileName = getRouterParam(event, 'name');
    const file = await useStorage('avatars').getItemRaw(fileName);
    if (!file) {
        throw createError({ statusCode: 404, statusMessage: 'Avatar not found' });
    }

    setResponseHeader(event, 'Content-Type', 'image/png')
    return file;
});