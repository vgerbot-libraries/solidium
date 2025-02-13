function joinPath(...paths: string[]): string {
    return paths.reduce((baseUrl, path) => {
        const cleanedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanedPath = path.startsWith('/') ? path.slice(1) : path;
        return `${cleanedBaseUrl}/${cleanedPath}`;
    })
}
