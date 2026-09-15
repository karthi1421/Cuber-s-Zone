export function getMoveCount(alg: string): number {
    if (!alg) return 0;
    return alg.trim().split(/\s+/).filter(Boolean).length;
}
