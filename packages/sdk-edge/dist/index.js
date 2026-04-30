export class SentinelEdge {
    opts;
    constructor(opts) {
        this.opts = {
            mode: 'block',
            autoRemediate: true,
            timeoutMs: 2000,
            ...opts,
        };
    }
    async inspect(context) {
        const res = await fetch(`${this.opts.endpoint}/v1/inspect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Sentinel-Api-Key': this.opts.apiKey,
            },
            body: JSON.stringify({
                context,
                options: { mode: this.opts.mode, autoRemediate: this.opts.autoRemediate },
            }),
        });
        if (!res.ok) {
            return {
                verdict: 'BLOCK',
                riskScore: 100,
                confidence: 1,
                reasons: ['Edge fail-closed: upstream error'],
                latencyMs: this.opts.timeoutMs,
            };
        }
        const data = await res.json();
        return data.decision;
    }
}
export { SentinelEdge as default };
//# sourceMappingURL=index.js.map