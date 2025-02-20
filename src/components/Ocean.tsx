import * as THREE from 'three';

export class Ocean {
  public mesh: THREE.Mesh;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private time: number = 0;

  constructor(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;

    // Create Ocean Geometry
    const geometry = new THREE.PlaneGeometry(1000, 1000, 256, 256);

    // Create Ocean Material
    const material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader(),
      fragmentShader: this.fragmentShader(),
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      wireframe: false,
    });

    // Create Ocean Mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  }

  public update(delta: number): void {
    this.time += delta;
    if (this.mesh.material instanceof THREE.ShaderMaterial) {
      this.mesh.material.uniforms['time'].value = this.time;
    }
  }

  private vertexShader(): string {
    return `
      uniform float time;
      varying vec3 vPosition;

      void main() {
        vPosition = position;
        float waveHeight = sin(position.x * 0.1 + time) * cos(position.z * 0.1 + time) * 2.0;
        vec3 newPosition = position + vec3(0.0, waveHeight, 0.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;
  }

  private fragmentShader(): string {
    return `
      uniform float time;
      varying vec3 vPosition;

      void main() {
        float waveIntensity = sin(vPosition.x * 0.1 + time) * cos(vPosition.z * 0.1 + time) * 0.5 + 0.5;
        gl_FragColor = vec4(0.0, 0.3, 0.5, 1.0) * waveIntensity;
      }
    `;
  }
}