export function mergeAbortSignal(
    ...signals: (AbortSignal | undefined)[]
): AbortSignal {
    const filtedSignals = signals.filter(it => !!it);
    if (filtedSignals.length === 1) {
        return filtedSignals[0];
    }
    const controller = new AbortController();
    const mergedSignal = controller.signal;
    filtedSignals.forEach(signal => {
        signal.addEventListener('abort', () => {
            controller.abort();
        });
    });
    return mergedSignal;
}
