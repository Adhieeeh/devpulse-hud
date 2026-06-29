import React, { useState, useEffect } from 'react';


const CORE_NODES = [
  { id: 'srv-gateway', name: '🌐 Edge API Gateway', status: 'Healthy', latency: 42, memory: 34 },
  { id: 'srv-auth', name: ' Auth Validation Service', status: 'Healthy', latency: 15, memory: 12 },
  { id: 'srv-billing', name: ' Stripe Micro-Transaction API', status: 'Healthy', latency: 85, memory: 48 },
  { id: 'srv-db', name: ' PostgreSQL Main Database', status: 'Healthy', latency: 8, memory: 72 }
];

function App() {
  
  const [nodes, setNodes] = useState(CORE_NODES);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inputNodeName, setInputNodeName] = useState('');

  
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          
          const latencyVariance = Math.max(5, node.latency + Math.floor(Math.random() * 31) - 15);
          const memoryVariance = Math.min(99, Math.max(5, node.memory + Math.floor(Math.random() * 11) - 5));
          
         
          let calculatedStatus = 'Healthy';
          if (latencyVariance > 100) calculatedStatus = 'Anomalous';
          if (latencyVariance > 150) calculatedStatus = 'Critical';

          return {
            ...node,
            latency: latencyVariance,
            memory: memoryVariance,
            status: calculatedStatus
          };
        })
      );
    }, 2500);

    return () => clearInterval(pulseInterval);
  }, []);

  
  const handleInjectNode = (e) => {
    e.preventDefault();
    if (!inputNodeName.trim()) return;

    const freshNode = {
      id: `srv-${Date.now().toString().slice(-4)}`,
      name: inputNodeName,
      status: 'Healthy',
      latency: 25,
      memory: 20
    };

    setNodes([...nodes, freshNode]);
    setInputNodeName('');
  };

  
  const terminateNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

 
  const totalNodesCount = nodes.length;
  const criticalCount = nodes.filter(n => n.status === 'Critical' || n.status === 'Anomalous').length;
  const clusterHealthScore = totalNodesCount > 0 ? Math.round(((totalNodesCount - criticalCount) / totalNodesCount) * 100) : 100;

 
  const filteredNodes = nodes.filter(node => statusFilter === 'ALL' || node.status === statusFilter);

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', fontFamily: 'monospace', backgroundColor: '#070a13', color: '#f8fafc', minHeight: '90vh' }}>
      
     
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '25px', marginBottom: '35px', gap: '20px' }}>
        <div>
          <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#10b981', letterSpacing: '-0.5px' }}>📡 DevPulse Infrastructure HUD</h1>
          <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: '12px' }}>Real-time cluster telemetry processor simulating asynchronous microservice metrics streams.</p>
        </div>

       
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '10px 20px', borderRadius: '10px', textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase' }}>Cluster Integrity</span>
            <h3 style={{ margin: '0', fontSize: '20px', color: clusterHealthScore > 75 ? '#10b981' : '#f59e0b' }}>{clusterHealthScore}%</h3>
          </div>
        </div>
      </header>

      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'Healthy', 'Anomalous', 'Critical'].map(filter => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              style={{ border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: statusFilter === filter ? '#10b981' : '#0f172a', color: statusFilter === filter ? '#070a13' : '#94a3b8', transition: '0.15s', border: '1px solid #1e293b' }}
            >
              {filter}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '12px', color: '#475569' }}>Active Feed: Displaying {filteredNodes.length} of {totalNodesCount} system nodes</span>
      </div>

      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        {filteredNodes.map(node => (
          <div key={node.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '14px', position: 'relative' }}>
            
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '11px', color: '#475569' }}>{node.id}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px',
                  backgroundColor: node.status === 'Healthy' ? '#064e3b' : node.status === 'Anomalous' ? '#78350f' : '#4c0519',
                  color: node.status === 'Healthy' ? '#34d399' : node.status === 'Anomalous' ? '#fbbf24' : '#f43f5e'
                }}>{node.status}</span>
                <button onClick={() => terminateNode(node.id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}>✕</button>
              </div>
            </div>

            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#f8fafc' }}>{node.name}</h3>

            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #1e293b', paddingBottom: '4px' }}>
                <span style={{ color: '#475569' }}>RTT Latency:</span>
                <span style={{ color: node.latency > 100 ? '#f43f5e' : '#cbd5e1' }}>{node.latency} ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569' }}>RAM Footprint:</span>
                <span style={{ color: '#cbd5e1' }}>{node.memory}%</span>
              </div>
            </div>

            
            <div style={{ height: '3px', width: '100%', backgroundColor: '#1e293b', marginTop: '15px', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${node.memory}%`, backgroundColor: node.status === 'Healthy' ? '#10b981' : '#f59e0b', transition: 'width 0.5s ease' }}></div>
            </div>

          </div>
        ))}
      </div>

      
      <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '25px', borderRadius: '16px', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#475569', textTransform: 'uppercase' }}>Register Infrastructure Microservice Node</h3>
        <form onSubmit={handleInjectNode} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="e.g., Image Processing Optimizer Cluster..." 
            value={inputNodeName} 
            onChange={(e) => setInputNodeName(e.target.value)}
            style={{ flex: '1', minWidth: '260px', padding: '10px 14px', backgroundColor: '#070a13', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#070a13', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
            Deploy Vector Node 
          </button>
        </form>
      </section>

    </div>
  );
}

export default App;