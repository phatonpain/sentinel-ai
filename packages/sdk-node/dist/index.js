"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.Sentinel = void 0;
class Sentinel {
    options;
    constructor(options) {
        this.options = {
            mode: 'block',
            autoRemediate: true,
            timeoutMs: 5000,
            strictFailClosed: true,
            ...options,
        };
    }
    async inspect(context) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.options.timeoutMs);
        try {
            const res = await fetch(`${this.options.endpoint}/v1/inspect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Sentinel-Api-Key': this.options.apiKey,
                },
                body: JSON.stringify({
                    context,
                    options: {
                        mode: this.options.mode,
                        autoRemediate: this.options.autoRemediate,
                    },
                }),
                signal: controller.signal,
            });
            if (!res.ok) {
                // Proxy returned 4xx/5xx — still a valid upstream, but fail-closed if configured
                if (this.options.strictFailClosed) {
                    return this.buildFailClosedDecision('Sentinel proxy returned error status');
                }
                const data = await res.json().catch(() => ({}));
                return data.decision || this.buildFailClosedDecision('Invalid proxy response');
            }
            const data = await res.json();
            return data.decision;
        }
        catch (err) {
            // Network failure, timeout, DNS failure — this is the critical fail-closed path
            const reason = err instanceof Error ? err.name : 'Unknown network error';
            return this.buildFailClosedDecision(`Sentinel proxy unreachable: ${reason}`);
        }
        finally {
            clearTimeout(timeout);
        }
    }
    middleware() {
        return async (req, res, next) => {
            const context = {
                requestId: req.headers['x-request-id'] || crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                method: req.method,
                path: req.path,
                query: req.query,
                headers: req.headers,
                body: req.body,
                sourceIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
                userAgent: req.headers['user-agent'] || 'unknown',
                apiKey: this.extractApiKey(req),
            };
            const decision = await this.inspect(context);
            res.setHeader('X-Sentinel-Verdict', decision.verdict);
            res.setHeader('X-Sentinel-Risk-Score', String(decision.riskScore));
            if (decision.incidentId) {
                res.setHeader('X-Sentinel-Incident-Id', decision.incidentId);
            }
            if (decision.verdict === 'BLOCK') {
                // CRITICAL: Never call next() here. Always terminate the request.
                res.status(403).json({
                    error: 'Request blocked by Sentinel AI',
                    incidentId: decision.incidentId,
                    message: 'If you believe this is an error, contact support with the incidentId.',
                });
                return;
            }
            if (decision.verdict === 'CHALLENGE') {
                res.status(429).json({
                    error: 'Challenge required',
                    incidentId: decision.incidentId,
                });
                return;
            }
            next();
        };
    }
    buildFailClosedDecision(reason) {
        return {
            verdict: 'BLOCK',
            riskScore: 100,
            incidentId: crypto.randomUUID(),
            confidence: 1,
            reasons: [reason, 'Fail-closed policy enforced: connection to Sentinel proxy lost'],
            latencyMs: this.options.timeoutMs,
        };
    }
    extractApiKey(req) {
        const auth = req.headers.authorization;
        if (auth?.startsWith('Bearer '))
            return auth.slice(7);
        return req.headers['x-api-key'] || undefined;
    }
}
exports.Sentinel = Sentinel;
exports.default = Sentinel;
//# sourceMappingURL=index.js.map