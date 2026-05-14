import { useRef, useEffect } from 'react';

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;

#define S(a,b,t) smoothstep(a,b,t)

float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float zoom = 6.0;
  float dof = 0.04;
  
  // Mouse normalized 0-1
  vec2 mouse = u_mouse / u_res;
  
  // Aspect-correct UV
  uv.x *= u_res.x / u_res.y;
  
  // Apply zoom, time scroll, and mouse offset
  uv *= zoom;
  uv += u_time * 0.2;
  uv += mouse * 2.0 * zoom;

  vec2 gridId = floor(uv);
  vec2 gridUv = fract(uv) - 0.5;

  float minDist = 1e5;

  // Loop over neighboring cells
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 n = vec2(float(x), float(y));
      vec2 p = gridUv - n;
      vec2 cellId = gridId + n;

      // Field rotation angle
      float angle = (cellId.x + cellId.y) * 0.4;
      p *= rot(angle);

      // Mouse influence (in grid space)
      vec2 mouseCell = floor(mouse * zoom);
      float mouseDist = length((cellId - mouseCell)) / zoom;
      float mouseInfluence = exp(-mouseDist * 6.0);

      // Animated size
      float size = 0.3 + 0.1 * sin(u_time * 1.5 + cellId.x * 0.5 + cellId.y * 0.5) + mouseInfluence * 0.3;

      // Pill distance
      float d = length(p) - size;
      d = S(d, abs(sdSegment(p, vec2(0.0, -0.35), vec2(0.0, 0.35))) - 0.1, 0.3);

      // Depth of field
      d *= length(gridUv - 0.5) * dof;

      minDist = min(minDist, d);
    }
  }

  // Color computation - grayscale on dark background
  float col = S(0.0, 0.02, minDist);
  col *= 1.0 - gridUv.y * 0.3;
  col *= 1.0 - length(gridUv) * 0.5;
  
  // Add subtle color tint
  vec3 color = vec3(col);
  color = mix(vec3(0.02, 0.01, 0.03), vec3(0.15, 0.12, 0.2), col);

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function TactileMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Fullscreen triangle
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  3, -1,  -1, 3
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTimeLocation = gl.getUniformLocation(program, 'u_time');
    const uResLocation = gl.getUniformLocation(program, 'u_res');
    const uMouseLocation = gl.getUniformLocation(program, 'u_mouse');

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl!.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      // Pass mouse in pixel coordinates (normalized in shader)
      targetMouseRef.current.x = (e.clientX - rect.left) * dpr;
      // Flip Y for WebGL
      targetMouseRef.current.y = (rect.height - (e.clientY - rect.top)) * dpr;
    }

    window.addEventListener('mousemove', handleMouseMove);

    const startTime = performance.now();

    function render() {
      if (!gl || !canvas) return;

      const elapsed = (performance.now() - startTime) / 1000;

      // Lerp mouse for smooth trailing
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      gl.uniform1f(uTimeLocation, elapsed);
      gl.uniform2f(uResLocation, canvas.width, canvas.height);
      gl.uniform2f(uMouseLocation, mouseRef.current.x, mouseRef.current.y);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
