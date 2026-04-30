'use client';

import { motion } from 'framer-motion';
import { Copy, Check, Terminal } from 'lucide-react';
import { useState } from 'react';

const curlCode = `curl -X POST https://api-proxy-production-28ff.up.railway.app/v1/inspect \\
  -H "X-Sentinel-Api-Key: your_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "context": {
      "method": "GET",
      "path": "/api/users",
      "sourceIp": "192.168.1.1"
    }
  }'`;

const responseCode = `{
  "decision": {
    "verdict": "ALLOW",
    "riskScore": 0
  },
  "forensics": {
    "headers": "secure",
    "ssl": "valid",
    "vulnerabilities": []
  },
  "latencyMs": 21
}`;

export function CodeSnippet() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(curlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="relative py-24 bg-[#0d0d12]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-sentinel-purple uppercase tracking-widest mb-4">
            Integration
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            One line of <span className="gradient-text">code</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-slate-400">
            Send your request context and receive a security decision in 21ms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/5 bg-[#0a0a0f] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-sentinel-purple" />
                <span className="text-sm font-medium text-slate-300">Request</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm text-slate-300 font-mono leading-relaxed">
                {curlCode.split('\n').map((line, i) => (
                  <div key={i} className="table-row">
                    <span className="table-cell text-slate-600 select-none pr-4 text-right w-8">
                      {i + 1}
                    </span>
                    <span className="table-cell">
                      {line.includes('curl') && (
                        <span className="text-sentinel-purple">{line}</span>
                      )}
                      {line.includes('-H') && (
                        <>
                          <span className="text-sentinel-cyan">-H </span>
                          <span className="text-sentinel-green">{line.split('-H ')[1]}</span>
                        </>
                      )}
                      {line.includes('-d') && (
                        <>
                          <span className="text-sentinel-cyan">-d </span>
                          <span className="text-orange-400">{line.split('-d ')[1]}</span>
                        </>
                      )}
                      {!line.includes('curl') && !line.includes('-H') && !line.includes('-d') && (
                        <span className="text-orange-400">{line}</span>
                      )}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </motion.div>

          {/* Response */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/5 bg-[#0a0a0f] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-sentinel-green" />
                <span className="text-sm font-medium text-slate-300">Response</span>
                <span className="text-xs text-slate-600">200 OK · 21ms</span>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm text-slate-300 font-mono leading-relaxed">
                {responseCode.split('\n').map((line, i) => (
                  <div key={i} className="table-row">
                    <span className="table-cell text-slate-600 select-none pr-4 text-right w-8">
                      {i + 1}
                    </span>
                    <span className="table-cell">
                      {line.includes('"') ? (
                        <>
                          {line.includes('verdict') && (
                            <span className="text-sentinel-cyan">{line.split('"ALLOW"')[0]}</span>
                          )}
                          {line.includes('ALLOW') && (
                            <span className="text-sentinel-green">
                              {line.includes('verdict') ? (
                                <>
                                  {line.split('"ALLOW"')[0]}
                                  <span className="text-sentinel-green">"ALLOW"</span>
                                  {line.split('"ALLOW"')[1]}
                                </>
                              ) : (
                                line
                              )}
                            </span>
                          )}
                          {!line.includes('ALLOW') && !line.includes('verdict') && (
                            <>
                              {line.split('"').map((part, j) => (
                                <span key={j} className={j % 2 === 1 ? 'text-sentinel-green' : ''}>
                                  {part}
                                  {j < line.split('"').length - 1 && '"'}
                                </span>
                              ))}
                            </>
                          )}
                          {line.includes('verdict') && line.includes('ALLOW') && (
                            <>
                              {line.substring(0, line.indexOf('"verdict"'))}
                              <span className="text-sentinel-cyan">"verdict"</span>
                              {line.substring(line.indexOf('"verdict"') + '"verdict"'.length, line.indexOf('"ALLOW"'))}
                              <span className="text-sentinel-green">"ALLOW"</span>
                              {line.substring(line.indexOf('"ALLOW"') + '"ALLOW"'.length)}
                            </>
                          )}
                          {line.includes('riskScore') && (
                            <>
                              {line.split('riskScore')[0]}
                              <span className="text-sentinel-cyan">riskScore</span>
                              {line.split('riskScore')[1]}
                            </>
                          )}
                        </>
                      ) : (
                        line
                      )}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
