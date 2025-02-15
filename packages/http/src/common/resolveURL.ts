export function resolveURL(
    routeTemplate: string,
    pathVariables: Record<string, string | number | boolean>,
    queryParameters: Record<
        string,
        string | number | boolean | Array<string | number | boolean>
    >
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

    for (const [paramKey, paramValue] of Object.entries(queryParameters)) {
        if (Array.isArray(paramValue)) {
            paramValue.forEach(arrayItem => {
                urlObject.searchParams.append(paramKey, arrayItem.toString());
            });
        } else {
            urlObject.searchParams.append(paramKey, paramValue.toString());
        }
    }

    return urlObject.toString();
}
