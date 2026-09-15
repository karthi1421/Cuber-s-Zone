export interface Solve {
    id: string;
    timeMs: number;
    scramble: string;
    timestamp: number;
    penalty?: '+2' | 'DNF';
}

const WCA_FACES = ['U', 'D', 'L', 'R', 'F', 'B'] as const;
const WCA_MODIFIERS = ['', "'", '2'] as const;

export function generate3x3Scramble(length: number = 21): string {
    const scramble: string[] = [];
    let lastAxis = -1;
    let secondLastAxis = -1;
    const faceAxisMap: Record<string, number> = {
        U: 0, D: 0,
        L: 1, R: 1,
        F: 2, B: 2,
    };

    while (scramble.length < length) {
        const face = WCA_FACES[Math.floor(Math.random() * WCA_FACES.length)];
        const axis = faceAxisMap[face];
        if (axis === lastAxis) continue;
        if (axis === secondLastAxis && axis === lastAxis) continue;
        const modifier = WCA_MODIFIERS[Math.floor(Math.random() * WCA_MODIFIERS.length)];
        scramble.push(`${face}${modifier}`);
        secondLastAxis = lastAxis;
        lastAxis = axis;
    }

    return scramble.join(' ');
}

export function formatTime(ms: number, penalty?: '+2' | 'DNF'): string {
    if (penalty === 'DNF') return 'DNF';
    const effectiveMs = penalty === '+2' ? ms + 2000 : ms;
    const totalSeconds = effectiveMs / 1000;

    if (totalSeconds >= 60) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = (totalSeconds % 60).toFixed(2);
        const paddedSecs = parseFloat(secs) < 10 ? `0${secs}` : secs;
        return `${mins}:${paddedSecs}${penalty === '+2' ? '+' : ''}`;
    }

    return `${totalSeconds.toFixed(2)}${penalty === '+2' ? '+' : ''}`;
}

export function calculateAverage(solves: Solve[], count: number): number | null {
    if (solves.length < count) return null;
    const recent = solves.slice(-count);
    const dnfs = recent.filter(s => s.penalty === 'DNF').length;
    if (dnfs > 1) return -1;

    const times = recent.map(s => {
        if (s.penalty === 'DNF') return Infinity;
        return s.penalty === '+2' ? s.timeMs + 2000 : s.timeMs;
    });

    times.sort((a, b) => a - b);
    const trimmed = times.slice(1, -1);
    return Math.round(trimmed.reduce((acc, time) => acc + time, 0) / trimmed.length);
}
