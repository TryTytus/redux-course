import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, RefreshCcw } from 'lucide-react';

const CORRECT_ORDER = ['Action', 'Dispatcher', 'Reducer', 'Store', 'UI'];
const ALL_NODES = ['Store', 'UI', 'Dispatcher', 'Reducer', 'Action'];

const DataFlow = () => {
  const [pipeline, setPipeline] = useState<string[]>([]);
  const [errorNode, setErrorNode] = useState<string | null>(null);
  
  const isComplete = pipeline.length === CORRECT_ORDER.length;

  const handleNodeClick = (node: string) => {
    if (pipeline.includes(node)) return; // already added
    
    const expectedNode = CORRECT_ORDER[pipeline.length];
    
    if (node === expectedNode) {
      setPipeline([...pipeline, node]);
      setErrorNode(null);
    } else {
      setErrorNode(node);
      setTimeout(() => setErrorNode(null), 800);
    }
  };

  const handleReset = () => {
    setPipeline([]);
    setErrorNode(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        1. One-Way Data Flow
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Redux architecture revolves around a strict unidirectional data flow. 
        Can you assemble the pipeline in the correct order? Click the nodes below to build it.
      </p>

      {/* The Pipeline */}
      <div className="glass-card" style={{ marginBottom: '3rem', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {pipeline.length === 0 && (
          <p style={{ color: 'var(--text-3)' }}>Pipeline is empty. Select a starting point.</p>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <AnimatePresence>
            {pipeline.map((node, i) => (
              <React.Fragment key={node}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'var(--primary-glow)',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 'bold',
                    position: 'relative'
                  }}
                >
                  {node}
                  
                  {/* Flow animation particle */}
                  {isComplete && (
                    <motion.div
                      animate={{ 
                        left: ['-50%', '150%'],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "linear"
                      }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '8px',
                        height: '8px',
                        background: 'var(--secondary)',
                        borderRadius: '50%',
                        boxShadow: '0 0 10px var(--secondary)'
                      }}
                    />
                  )}
                </motion.div>
                
                {i < CORRECT_ORDER.length - 1 && pipeline.length > i && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                  >
                    <ArrowRight size={24} color="var(--text-3)" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* The Bank */}
      {!isComplete ? (
        <div>
          <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Available Nodes:</h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {ALL_NODES.map(node => {
              const isUsed = pipeline.includes(node);
              const isError = errorNode === node;
              
              return (
                <motion.button
                  key={node}
                  onClick={() => handleNodeClick(node)}
                  disabled={isUsed}
                  animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: isUsed ? 'rgba(255,255,255,0.05)' : 'var(--surface-2)',
                    border: `1px solid ${isError ? 'var(--error)' : 'var(--glass-border)'}`,
                    color: isUsed ? 'var(--text-3)' : 'var(--text-1)',
                    cursor: isUsed ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                  }}
                  whileHover={!isUsed ? { scale: 1.05, borderColor: 'var(--primary)' } : {}}
                  whileTap={!isUsed ? { scale: 0.95 } : {}}
                >
                  {node}
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '1.5rem' }}>
            <CheckCircle size={32} />
            <h2 style={{ fontSize: '1.8rem', color: 'white' }}>Excellent!</h2>
          </div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            You've nailed the data flow! An <strong>Action</strong> describes what happened, which is sent to the <strong>Dispatcher</strong>. 
            The <strong>Reducer</strong> calculates the new state based on that action, saving it in the <strong>Store</strong>, 
            which then notifies the <strong>UI</strong> to re-render.
          </p>
          <button onClick={handleReset} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCcw size={18} /> Reset Exercise
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DataFlow;
