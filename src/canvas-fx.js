export function initCanvasBg(id) {
  const c = document.getElementById(id);
  if (!c) return;
  const ctx = c.getContext('2d');
  if(!ctx) return;
  
  const resize = () => { 
    c.width = c.parentElement?.clientWidth || window.innerWidth; 
    c.height = c.parentElement?.clientHeight || window.innerHeight; 
  };
  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  for(let i=0; i<30; i++) {
    particles.push({ 
      x: Math.random()*c.width, 
      y: Math.random()*c.height, 
      r: Math.random()*6+2, 
      vx: (Math.random()-0.5)*1.5, 
      vy: (Math.random()-0.5)*1.5,
      alpha: Math.random()*0.5 + 0.1
    });
  }

  function render() {
    ctx.clearRect(0,0,c.width,c.height);
    particles.forEach(p => {
       p.x += p.vx; p.y += p.vy;
       if(p.x < 0 || p.x > c.width) p.vx *= -1;
       if(p.y < 0 || p.y > c.height) p.vy *= -1;
       ctx.beginPath();
       ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha})`;
       ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
       ctx.fill();
    });
    requestAnimationFrame(render);
  }
  render();
}

export function drawRadarChart(id, data) {
  const c = document.getElementById(id);
  if (!c) return;
  const ctx = c.getContext('2d');
  if(!ctx) return;
  
  const width = c.width; 
  const height = c.height; 
  const cx = width/2; 
  const cy = height/2 + 5; 
  const radius = Math.min(cx, cy) - 25;
  const keys = Object.keys(data); 
  const len = keys.length;
  if (len === 0) return;

  ctx.clearRect(0,0,width,height);
  
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for(let i=0; i<len; i++) {
    const angle = (Math.PI * 2 * i) / len - Math.PI/2;
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
  }
  ctx.stroke();

  for(let j=1; j<=5; j++){
    ctx.beginPath();
    for(let i=0; i<len; i++) {
      const angle = (Math.PI * 2 * i) / len - Math.PI/2;
      const x = cx + Math.cos(angle) * radius * (j/5);
      const y = cy + Math.sin(angle) * radius * (j/5);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2;
  keys.forEach((k, i) => {
    const angle = (Math.PI * 2 * i) / len - Math.PI/2;
    const val = Math.min(Math.max(data[k], 0), 10) / 10;
    const x = cx + Math.cos(angle) * radius * val;
    const y = cy + Math.sin(angle) * radius * val;
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.closePath();
  ctx.fill(); 
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  keys.forEach((k, i) => {
    const angle = (Math.PI * 2 * i) / len - Math.PI/2;
    const x = cx + Math.cos(angle) * (radius + 15);
    const y = cy + Math.sin(angle) * (radius + 15);
    ctx.fillText(k, x, y);
  });
}
