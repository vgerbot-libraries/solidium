export function mergeAbortSignal(
    ...signals: (AbortSignal | undefined)[]
): AbortSignal {
    const controller = new AbortController();
    const mergedSignal = controller.signal;
    signals
        .filter(it => !!it)
        .forEach(signal => {
            signal.addEventListener('abort', () => {
                controller.abort();
            });
        });
    return mergedSignal;
}
