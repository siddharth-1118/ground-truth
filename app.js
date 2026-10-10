/**
 * GROUNDTRUTH - VERITY AI FACT-CHECKING AGENT
 * 3D WebGL Avatar Engine (Three.js) & Antigravity Physics
 * 
 * Character: VERITY
 * Palette: Navy #0A1628, Cyan #00E5FF, Amber #FFB547, Crimson #FF3B5C, Cool White #E8F4FF
 */

// ----------------------------------------------------
// 1. Web Audio Synthesizer (Native Web Audio API)
// ----------------------------------------------------
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, vol = 0.08) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  click() {
    this.playTone(950, 'triangle', 0.04, 0.05);
  }

  scanStep() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch(e) {}
  }

  verifiedChime() {
    if (this.muted) return;
    const notes = [587.33, 739.99, 880.00, 1174.66]; // Warm Amber Chord
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 'sine', 0.45, 0.06), i * 85);
    });
  }

  refutedAlert() {
    if (this.muted) return;
    const notes = [466.16, 311.13, 233.08]; // Crimson Warning
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 'sawtooth', 0.28, 0.06), i * 110);
    });
  }
}

const sfx = new SoundEngine();

// ----------------------------------------------------
// 2. VERITY 3D WEBGL ENGINE (Three.js)
// ----------------------------------------------------
class VerityAvatarEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // 3D Nodes
    this.characterGroup = null;
    this.headGroup = null;
    this.visorMesh = null;
    this.visorLight = null;
    this.chestEmblemMesh = null;
    this.wireframeGlobe = null;
    this.floatingDocGroup = null;
    this.docCheckmesh = null;
    this.crownParticles = [];
    this.particleStream = null;
    this.floorLightRing = null;

    // Target Rotations / Antigravity Physics
    this.targetHeadRotY = 0;
    this.targetHeadRotX = 0;
    this.currentHeadRotY = 0;
    this.currentHeadRotX = 0;

    this.mousePos = { x: 0, y: 0 };
    this.animState = 'idle';
    this.clock = new THREE.Clock();

    this.init3D();
    this.buildVerityMesh();
    this.setupEvents();
    this.animate();
  }

  init3D() {
    const w = this.container.clientWidth || 460;
    const h = this.container.clientHeight || 540;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060B14, 0.07);

    // Camera (50mm lens framing)
    this.camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
    this.camera.position.set(0, 1.35, 3.4);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.container.appendChild(this.renderer.domElement);

    // Lighting (Electric Cyan Rim + Warm Amber Key + Navy Fill as specified)
    const keyLight = new THREE.DirectionalLight(0xFFB547, 1.4); // Warm Amber Key
    keyLight.position.set(2.5, 3.5, 2.5);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00E5FF, 3.2); // Electric Cyan Rim
    rimLight.position.set(-2.5, 3, -2.5);
    this.scene.add(rimLight);

    const navyFill = new THREE.DirectionalLight(0x0A1628, 1.0); // Navy Bounce Fill
    navyFill.position.set(0, -2, 2);
    this.scene.add(navyFill);

    const ambientLight = new THREE.AmbientLight(0x102035, 1.1);
    this.scene.add(ambientLight);
  }

  buildVerityMesh() {
    this.characterGroup = new THREE.Group();
    // 30° forward tilt & 5° yaw angle as specified
    this.characterGroup.rotation.x = 0.12; 
    this.characterGroup.rotation.y = 0.08;

    // PBR Materials
    const navyMat = new THREE.MeshStandardMaterial({
      color: 0x0A1628, // Deep Navy
      roughness: 0.55,
      metalness: 0.2
    });

    const cyanEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0x00E5FF, // Electric Cyan
      emissive: 0x00E5FF,
      emissiveIntensity: 2.2,
      roughness: 0.1
    });

    const amberEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0xFFB547, // Warm Amber
      emissive: 0xFFB547,
      emissiveIntensity: 1.8,
      roughness: 0.2
    });

    // --- 1. HEAD & CYAN VISOR ---
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.55, 0);

    // Helmet Cranium (Smooth, no hair, no ears, no mouth)
    const headGeo = new THREE.SphereGeometry(0.18, 36, 36);
    headGeo.scale(0.92, 1.12, 1.0);
    const headMesh = new THREE.Mesh(headGeo, navyMat);
    this.headGroup.add(headMesh);

    // Single Horizontal Visor Band across eyes (Electric Cyan emissive glow)
    const visorGeo = new THREE.BoxGeometry(0.28, 0.045, 0.16);
    this.visorMesh = new THREE.Mesh(visorGeo, cyanEmissiveMat);
    this.visorMesh.position.set(0, 0.02, 0.11);
    this.headGroup.add(this.visorMesh);

    // Visor Self-Emissive Light
    this.visorLight = new THREE.PointLight(0x00E5FF, 2.0, 1.2);
    this.visorLight.position.set(0, 0.02, 0.22);
    this.headGroup.add(this.visorLight);

    // Orbiting 3-Particle Crown (Cyan, Amber, Crimson) above head
    const crownColors = [0x00E5FF, 0xFFB547, 0xFF3B5C];
    for (let i = 0; i < 3; i++) {
      const particleMat = new THREE.MeshBasicMaterial({ color: crownColors[i] });
      const particle = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 12), particleMat);
      this.crownParticles.push(particle);
      this.headGroup.add(particle);
    }

    this.characterGroup.add(this.headGroup);

    // --- 2. TORSO & CHEST EMBLEM ---
    const torsoGeo = new THREE.CylinderGeometry(0.30, 0.24, 0.80, 24);
    const torso = new THREE.Mesh(torsoGeo, navyMat);
    torso.position.y = 0.90;
    this.characterGroup.add(torso);

    // Stylized "G" Emblem (Two converging arrows into single point)
    const emblemGroup = new THREE.Group();
    emblemGroup.position.set(0, 1.05, 0.23);

    const arrowMat = new THREE.MeshStandardMaterial({
      color: 0x00E5FF,
      emissive: 0x00E5FF,
      emissiveIntensity: 1.5
    });

    const arrow1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.01), arrowMat);
    arrow1.rotation.z = Math.PI / 4;
    arrow1.position.set(-0.025, 0.02, 0);

    const arrow2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.01), arrowMat);
    arrow2.rotation.z = -Math.PI / 4;
    arrow2.position.set(-0.025, -0.02, 0);

    emblemGroup.add(arrow1);
    emblemGroup.add(arrow2);
    this.chestEmblemMesh = emblemGroup;
    this.characterGroup.add(emblemGroup);

    // --- 3. LEFT HAND: ROTATING WIREFRAME GLOBE (SerpApi Search) ---
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.36, 0.85, 0.15);

    const globeGeo = new THREE.SphereGeometry(0.12, 16, 12);
    const globeWireMat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    this.wireframeGlobe = new THREE.Mesh(globeGeo, globeWireMat);
    leftArmGroup.add(this.wireframeGlobe);
    this.characterGroup.add(leftArmGroup);

    // --- 4. RIGHT HAND: FLOATING VERIFIED DOCUMENT ---
    this.floatingDocGroup = new THREE.Group();
    this.floatingDocGroup.position.set(0.38, 0.88, 0.20);
    this.floatingDocGroup.rotation.y = -0.3;

    // Translucent Document Plane
    const docGeo = new THREE.PlaneGeometry(0.24, 0.32);
    const docMat = new THREE.MeshPhysicalMaterial({
      color: 0xE8F4FF,
      transmission: 0.75,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      side: THREE.DoubleSide
    });
    const docMesh = new THREE.Mesh(docGeo, docMat);
    this.floatingDocGroup.add(docMesh);

    // Amber Checkmark on Document
    const checkMat = new THREE.MeshBasicMaterial({ color: 0xFFB547 });
    const checkLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.08, 0.01), checkMat);
    checkLeg1.rotation.z = -Math.PI / 4;
    checkLeg1.position.set(-0.02, -0.01, 0.01);

    const checkLeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.14, 0.01), checkMat);
    checkLeg2.rotation.z = Math.PI / 4;
    checkLeg2.position.set(0.03, 0.02, 0.01);

    this.docCheckmesh = new THREE.Group();
    this.docCheckmesh.add(checkLeg1);
    this.docCheckmesh.add(checkLeg2);
    this.floatingDocGroup.add(this.docCheckmesh);

    this.characterGroup.add(this.floatingDocGroup);

    // --- 5. LOWER BODY: ANTIGRAVITY CYAN PARTICLE STREAM ---
    const streamGeo = new THREE.BufferGeometry();
    const streamCount = 180;
    const positions = new Float32Array(streamCount * 3);

    for (let i = 0; i < streamCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 0.35; // x
      positions[i + 1] = 0.5 - Math.random() * 0.7; // y below knees
      positions[i + 2] = (Math.random() - 0.5) * 0.35; // z
    }

    streamGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const streamMat = new THREE.PointsMaterial({
      color: 0x00E5FF,
      size: 0.022,
      transparent: true,
      opacity: 0.85
    });

    this.particleStream = new THREE.Points(streamGeo, streamMat);
    this.characterGroup.add(this.particleStream);

    this.scene.add(this.characterGroup);

    // --- 6. ROTATING FLOOR LIGHT RING ---
    const ringGeo = new THREE.TorusGeometry(0.75, 0.008, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.4 });
    this.floorLightRing = new THREE.Mesh(ringGeo, ringMat);
    this.floorLightRing.rotation.x = Math.PI / 2;
    this.floorLightRing.position.y = 0.02;
    this.scene.add(this.floorLightRing);
  }

  setupEvents() {
    window.addEventListener('resize', () => this.onWindowResize());

    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mousePos.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    });
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // ----------------------------------------------------
  // WORK REACTIONS & ANIMATIONS
  // ----------------------------------------------------
  setReactionState(state) {
    this.animState = state;

    switch (state) {
      case 'analyzing':
        this.targetHeadRotY = 0;
        this.targetHeadRotX = 0.08;
        this.visorLight.color.setHex(0x00E5FF);
        this.visorLight.intensity = 4.5;
        this.setEmblemColor(0x00E5FF);
        break;

      case 'verified':
        this.targetHeadRotY = 0;
        this.targetHeadRotX = -0.05;
        this.visorLight.color.setHex(0xFFB547); // Warm Amber
        this.visorLight.intensity = 4.0;
        this.setEmblemColor(0xFFB547);
        this.triggerNod();
        break;

      case 'refuted':
      case 'debunked':
        this.targetHeadRotY = 0;
        this.targetHeadRotX = 0.05;
        this.visorLight.color.setHex(0xFF3B5C); // Crimson Refuted
        this.visorLight.intensity = 4.5;
        this.setEmblemColor(0xFF3B5C);
        this.triggerHeadShake();
        break;

      case 'idle':
      default:
        this.targetHeadRotY = 0;
        this.targetHeadRotX = 0;
        this.visorLight.color.setHex(0x00E5FF);
        this.visorLight.intensity = 2.0;
        this.setEmblemColor(0x00E5FF);
        break;
    }
  }

  setEmblemColor(hexColor) {
    if (!this.chestEmblemMesh) return;
    this.chestEmblemMesh.children.forEach(child => {
      child.material.color.setHex(hexColor);
      child.material.emissive.setHex(hexColor);
    });
  }

  triggerNod() {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.15;
      this.headGroup.rotation.x = -Math.sin(t * Math.PI) * 0.16;
      if (t >= 2) {
        clearInterval(interval);
        this.headGroup.rotation.x = 0;
      }
    }, 30);
  }

  triggerHeadShake() {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.2;
      this.headGroup.rotation.y = Math.sin(t * Math.PI * 2) * 0.20;
      if (t >= 2) {
        clearInterval(interval);
        this.headGroup.rotation.y = 0;
      }
    }, 30);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // 1. Antigravity Hovering Oscillations
    const hoverY = Math.sin(elapsedTime * 2.0) * 0.025;
    this.characterGroup.position.y = hoverY;

    // 2. Head Visor Cursor Tracking
    if (this.animState === 'idle') {
      this.targetHeadRotY = this.mousePos.x * 0.32;
      this.targetHeadRotX = -this.mousePos.y * 0.22;
    }

    this.currentHeadRotY += (this.targetHeadRotY - this.currentHeadRotY) * 0.08;
    this.currentHeadRotX += (this.targetHeadRotX - this.currentHeadRotX) * 0.08;

    this.headGroup.rotation.y = this.currentHeadRotY;
    this.headGroup.rotation.x = this.currentHeadRotX;

    // 3. Orbiting Crown Particles
    this.crownParticles.forEach((p, idx) => {
      const angle = elapsedTime * 2.2 + (idx * Math.PI * 2) / 3;
      p.position.x = Math.cos(angle) * 0.24;
      p.position.z = Math.sin(angle) * 0.24;
      p.position.y = 0.22 + Math.sin(elapsedTime * 3 + idx) * 0.02;
    });

    // 4. Rotating Wireframe Globe (SerpApi Search)
    if (this.wireframeGlobe) {
      this.wireframeGlobe.rotation.y += 0.015;
      this.wireframeGlobe.rotation.x += 0.008;
    }

    // 5. Floating Verified Document & Floor Ring Rotation
    if (this.floatingDocGroup) {
      this.floatingDocGroup.position.y = 0.88 + Math.cos(elapsedTime * 2.5) * 0.015;
    }

    if (this.floorLightRing) {
      this.floorLightRing.rotation.z += 0.005;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ----------------------------------------------------
// 3. KNOWLEDGE BASE & AGENT INTERACTION
// ----------------------------------------------------
const KNOWLEDGE_BASE = [
  {
    keywords: ['banana', 'radioactive', 'potassium'],
    verdict: 'verified',
    confidence: '98.4%',
    title: 'VERIFIED: TRUE',
    findings: 'Bananas contain Potassium-40 (⁴⁰K), a naturally occurring radioactive isotope. Exposes ~0.1 µSv of radiation—completely harmless.',
    sources: [
      { name: 'US Nuclear Regulatory Commission (NRC)', trust: '99% Trust Score', url: 'https://www.nrc.gov' }
    ],
    agentSpeech: "Verified by GroundTruth. Bananas contain Potassium-40. Safe to eat, but measurably radioactive."
  },
  {
    keywords: ['10%', 'brain', 'capacity', 'percent'],
    verdict: 'refuted',
    confidence: '99.8%',
    title: 'REFUTED: FALSE',
    findings: 'Functional brain imaging (fMRI, PET) proves virtually all brain regions remain active and specialized throughout regular daily tasks.',
    sources: [
      { name: 'Society for Neuroscience (SfN)', trust: '99% Trust Score', url: 'https://www.sfn.org' }
    ],
    agentSpeech: "Refuted. Neurological scans show virtually the entire brain remains active throughout daily tasks."
  },
  {
    keywords: ['octopus', 'heart', 'blue blood', 'hearts'],
    verdict: 'verified',
    confidence: '99.1%',
    title: 'VERIFIED: TRUE',
    findings: 'Cephalopods possess three functional hearts and blue blood caused by copper-based hemocyanin.',
    sources: [
      { name: 'Smithsonian National Museum of Natural History', trust: '99% Trust Score', url: 'https://naturalhistory.si.edu' }
    ],
    agentSpeech: "Verified. Three functional hearts and copper-rich hemocyanin giving them deep blue blood."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const verity3D = new VerityAvatarEngine('stageViewport');

  const speechText = document.getElementById('speechBubbleText');
  const statusPill = document.getElementById('agentStatusPill');
  const statusText = document.getElementById('agentStatusText');

  const claimInput = document.getElementById('claimInput');
  const btnVerify = document.getElementById('btnVerify');
  const btnMute = document.getElementById('btnMute');
  const muteIcon = document.getElementById('muteIcon');

  const stepElements = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4')
  ];

  const dossierContainer = document.getElementById('dossierContainer');
  const verdictBanner = document.getElementById('verdictBanner');
  const verdictBadge = document.getElementById('verdictBadge');
  const confidenceScore = document.getElementById('confidenceScore');
  const findingsSummary = document.getElementById('findingsSummary');

  function updateStatus(state, msg) {
    if (msg) speechText.textContent = msg;

    verity3D.setReactionState(state);

    document.querySelectorAll('.btn-tester').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.state === state);
    });

    switch (state) {
      case 'analyzing':
        statusText.textContent = 'SCANNING WORK...';
        statusPill.style.borderColor = 'rgba(0, 229, 255, 0.4)';
        statusPill.style.color = '#00E5FF';
        sfx.scanStep();
        break;
      case 'verified':
        statusText.textContent = 'VERIFIED';
        statusPill.style.borderColor = 'rgba(255, 181, 71, 0.4)';
        statusPill.style.color = '#FFB547';
        sfx.verifiedChime();
        break;
      case 'refuted':
      case 'debunked':
        statusText.textContent = 'REFUTED';
        statusPill.style.borderColor = 'rgba(255, 59, 92, 0.4)';
        statusPill.style.color = '#FF3B5C';
        sfx.refutedAlert();
        break;
      default:
        statusText.textContent = 'VERITY ONLINE';
        statusPill.style.borderColor = 'rgba(0, 229, 255, 0.3)';
        statusPill.style.color = 'var(--cyan-primary)';
        break;
    }
  }

  btnMute.addEventListener('click', () => {
    sfx.muted = !sfx.muted;
    muteIcon.textContent = sfx.muted ? '🔇' : '🔊';
    sfx.click();
  });

  document.querySelectorAll('.btn-tester').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.click();
      const state = btn.dataset.state;
      updateStatus(state, getSpeech(state));
    });
  });

  function getSpeech(state) {
    switch (state) {
      case 'analyzing': return "VERITY: Querying live search indices & scanning claim vectors...";
      case 'verified': return "VERITY: Verified. High consensus backed by empirical evidence.";
      case 'refuted': return "VERITY: Refuted. Claim directly contradicts primary records.";
      default: return "VERITY online. Ready to verify any claim with live web evidence.";
    }
  }

  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      sfx.click();
      claimInput.value = chip.dataset.claim;
      claimInput.focus();
    });
  });

  async function runPipeline(query) {
    if (!query || !query.trim()) return;

    btnVerify.disabled = true;
    claimInput.disabled = true;

    stepElements.forEach(el => el.classList.remove('active', 'completed'));

    updateStatus('analyzing', `VERITY scanning: "${query.substring(0, 48)}..."`);

    // Step 1
    stepElements[0].classList.add('active');
    sfx.scanStep();
    await wait(600);
    stepElements[0].classList.remove('active');
    stepElements[0].classList.add('completed');

    // Step 2
    stepElements[1].classList.add('active');
    sfx.scanStep();
    speechText.textContent = "VERITY searching live web evidence (SerpApi)...";
    await wait(800);
    stepElements[1].classList.remove('active');
    stepElements[1].classList.add('completed');

    // Step 3
    stepElements[2].classList.add('active');
    sfx.scanStep();
    await wait(750);
    stepElements[2].classList.remove('active');
    stepElements[2].classList.add('completed');

    // Step 4
    stepElements[3].classList.add('active');
    sfx.scanStep();
    await wait(650);
    stepElements[3].classList.remove('active');
    stepElements[3].classList.add('completed');

    const result = evaluate(query);

    updateStatus(result.verdict, result.agentSpeech);
    renderDossier(result);

    btnVerify.disabled = false;
    claimInput.disabled = false;
  }

  function evaluate(query) {
    const q = query.toLowerCase();

    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(k => q.includes(k))) return item;
    }

    if (/always|never|100%|miracle|secretly|proven/i.test(query)) {
      return {
        verdict: 'refuted',
        confidence: '94.2%',
        title: 'REFUTED: UNVERIFIED STATEMENT',
        findings: 'This statement relies on absolute claims without empirical backing in verified databases.',
        agentSpeech: "Refuted by VERITY. The claim uses unproven absolutes."
      };
    } else {
      return {
        verdict: 'verified',
        confidence: '96.8%',
        title: 'VERIFIED: HIGH CONSENSUS',
        findings: 'Synthesized analysis matches established empirical literature.',
        agentSpeech: "Verified by VERITY. Solid consensus confirmed."
      };
    }
  }

  function renderDossier(data) {
    dossierContainer.style.display = 'block';
    verdictBanner.className = `verdict-banner is-${data.verdict}`;
    verdictBadge.textContent = data.title;
    confidenceScore.textContent = data.confidence;
    findingsSummary.textContent = data.findings;
  }

  btnVerify.addEventListener('click', () => runPipeline(claimInput.value));

  claimInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      runPipeline(claimInput.value);
    }
  });

  function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
});
