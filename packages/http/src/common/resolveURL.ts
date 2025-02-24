export function resolveURL(
    routeTemplate: string,
    pathVariables: Record<string, string | number | boolean>,
    queryParameters: URLSearchParams
) {
    const pathParamReplacedURL = routeTemplate.replace(
        /(:([a-z]+))/gi,
        (fullMatch, placeholder, variableName) => {
            if (variableName in pathVariables) {
                return pathVariables[variableName]?.toString() ?? fullMatch;
            }
            return fullMatch;
        }
    );

    const urlObject = new URL(pathParamReplacedURL);
    queryParameters.forEach((value, key) => {
        if (Array.isArray(value)) {
            value.forEach(arrayItem => {
                urlObject.searchParams.append(key, arrayItem.toString());
            });
        } else {
            urlObject.searchParams.append(key, value.toString());
        }
    });

    return urlObject.toString();
}
