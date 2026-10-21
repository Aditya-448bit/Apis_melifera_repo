// Main Application Controller for Apis mellifera Ultra-Realism Cinematic 3D Atlas

(function () {
  var state = {
    activeModule: 'full_atlas', // 'full_atlas' | 'internal_anatomy' | 'mouthparts' | 'sting_apparatus'
    activeCaste: 'worker',      // 'worker' | 'queen' | 'drone'
    selectedStructureId: 'pollen_basket',
    searchQuery: '',
    regionFilter: 'ALL',
    systemFilter: 'ALL',
    explodedFactor: 0.0,
    targetExplode: null,
    xrayEnabled: false,
    xrayOpacity: 0.22,
    labelsVisible: true,
    macroDofEnabled: false,
    highQualityMode: true,
    slowMoEnabled: false,
    cinematicTourActive: false,
    cinematicStepIndex: 0,
    cinematicTimer: 0,
    sliceAxis: 'none',          // 'none' | 'z' | 'x' | 'y'
    sliceOffset: 0.0,
    layers: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true },
    anims: {
      wingFlap: true,
      antennaScan: true,
      eyeTrack: true,
      abdomenBreathe: true,
      pollenCollect: false,
      stingDeploy: false,
      nectarFeed: false
    },
    pointerNDC: { x: 0, y: 0 },
    camLerpPos: null,
    camLerpTarget: null
  };

  var scene, camera, renderer, controls, raycaster, mouseVec;
  var clippingPlane, atmospherePoints;
  var models = {
    fullBee: null,
    mouthparts: null,
    sting: null
  };
  var activePinElements = {};
  var clock;
  var simElapsed = 0;
  var fpsFrames = 0;
  var fpsLastTime = performance.now();

  function initAtlasApp() {
    var container = document.getElementById('webgl-container');
    var width = container.clientWidth || window.innerWidth;
    var height = container.clientHeight || window.innerHeight;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070A0F, 0.032);

    camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 120);
    camera.position.set(0.6, 1.8, 6.4);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    if (THREE.ACESFilmicToneMapping !== undefined) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
    }
    if (THREE.sRGBEncoding !== undefined) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    container.appendChild(renderer.domElement);

    // Procedural Studio HDRI Environment Reflection Map
    if (window.BeeModelBuilders.buildStudioHDRITexture) {
      var hdriTex = window.BeeModelBuilders.buildStudioHDRITexture();
      scene.environment = hdriTex;
    }

    // OrbitControls
    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.minDistance = 0.85; // Enable deep macro zoom
      controls.maxDistance = 16.0;
      controls.target.set(-0.2, -0.1, 0);
    }

    // Three-Point Museum Lighting + Subtle Rim Lights
    var ambientLight = new THREE.AmbientLight(0xF8FAFC, 0.58);
    scene.add(ambientLight);

    var keyLight = new THREE.DirectionalLight(0xFFFBEB, 1.45);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    var rimAmber = new THREE.DirectionalLight(0xF59E0B, 1.05);
    rimAmber.position.set(-6, 4, -5);
    scene.add(rimAmber);

    var fillCyan = new THREE.DirectionalLight(0x38BDF8, 0.65);
    fillCyan.position.set(0, -6, 4);
    scene.add(fillCyan);

    var macroBackRim = new THREE.PointLight(0xFDE68A, 0.75, 12);
    macroBackRim.position.set(0.5, 3.2, -3.5);
    scene.add(macroBackRim);

    // Volumetric Atmosphere Dust Micro-Particles
    buildVolumetricAtmosphere();

    // Interactive WebGL Clipping Plane
    clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 100);

    // Build all 3D anatomical rigs
    models.fullBee = window.BeeModelBuilders.buildFullBeeModel([clippingPlane]);
    models.mouthparts = window.BeeModelBuilders.buildMouthpartsModel([clippingPlane]);
    models.sting = window.BeeModelBuilders.buildStingModel([clippingPlane]);

    scene.add(models.fullBee.root);
    scene.add(models.mouthparts.root);
    scene.add(models.sting.root);

    models.mouthparts.root.visible = false;
    models.sting.root.visible = false;

    raycaster = new THREE.Raycaster();
    mouseVec = new THREE.Vector2();
    clock = new THREE.Clock();

    bindUIEvents();
    renderDissectionLayersUI();
    switchModule('full_atlas');
    selectStructure('pollen_basket', false);

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onCanvasClick);

    animateLoop();
  }

  function buildVolumetricAtmosphere() {
    var count = 260;
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var mat = new THREE.PointsMaterial({
      color: 0xFDE68A,
      size: 0.028,
      transparent: true,
      opacity: 0.32
    });
    atmospherePoints = new THREE.Points(geo, mat);
    scene.add(atmospherePoints);
  }

  function onWindowResize() {
    var container = document.getElementById('webgl-container');
    if (!container || !renderer || !camera) return;
    var w = container.clientWidth || window.innerWidth;
    var h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function onPointerMove(e) {
    var rect = renderer.domElement.getBoundingClientRect();
    state.pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    state.pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function onCanvasClick(e) {
    var rect = renderer.domElement.getBoundingClientRect();
    mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseVec, camera);

    var activeRoot = getActiveModelRoot();
    var intersects = raycaster.intersectObjects(activeRoot.children, true);
    for (var i = 0; i < intersects.length; i++) {
      var obj = intersects[i].object;
      if (obj.visible && obj.userData && obj.userData.structureId) {
        selectStructure(obj.userData.structureId, true);
        break;
      }
    }
  }

  function getActiveModelRoot() {
    if (state.activeModule === 'mouthparts') return models.mouthparts.root;
    if (state.activeModule === 'sting_apparatus') return models.sting.root;
    return models.fullBee.root;
  }

  // ============================================================================
  // MODULE, CASTE, 9 DISSECTION MODES & CINEMATIC TOUR MANAGEMENT
  // ============================================================================
  function switchModule(modKey) {
    state.activeModule = modKey;
    state.regionFilter = 'ALL';
    state.systemFilter = 'ALL';

    document.querySelectorAll('[data-module-btn]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-module-btn') === modKey);
    });

    models.fullBee.root.visible = (modKey === 'full_atlas' || modKey === 'internal_anatomy');
    models.mouthparts.root.visible = (modKey === 'mouthparts');
    models.sting.root.visible = (modKey === 'sting_apparatus');

    var castePanel = document.getElementById('caste-selector-block');
    var layersPanel = document.getElementById('dissection-layers-block');

    if (modKey === 'full_atlas') {
      if (castePanel) castePanel.classList.remove('hidden');
      if (layersPanel) layersPanel.classList.remove('hidden');
      state.xrayEnabled = false;
      updateXrayButtonUI();
      smoothCameraTo([0.5, 1.6, 6.2], [-0.3, -0.1, 0]);
      renderSubmodeButtons([
        { label: 'Standard External', action: function () { setAllLayers(true); setXray(false); setExplode(0); } },
        { label: 'Hindleg Corbicula Macro', action: function () { selectStructure('pollen_basket', true); setMacroDof(true); } },
        { label: 'Foreleg Strigilis Macro', action: function () { selectStructure('antenna_cleaner_in_use', true); setMacroDof(true); } },
        { label: 'Wing Hamuli & Iridescence', action: function () { selectStructure('wings_hooked', true); } }
      ]);
      selectStructure('pollen_basket', false);
    } else if (modKey === 'internal_anatomy') {
      if (castePanel) castePanel.classList.remove('hidden');
      if (layersPanel) layersPanel.classList.remove('hidden');
      setAllLayers(true);
      setXray(true);
      smoothCameraTo([0.0, 0.9, 5.8], [-0.6, 0.0, 0]);
      renderSubmodeButtons([
        { label: 'All Visceral Systems', action: function () { filterBySystem('ALL'); } },
        { label: 'Digestive (Crop/Midgut)', action: function () { filterBySystem('digestive'); selectStructure('honey_sac', false); } },
        { label: 'Circulatory (Heart/Aorta)', action: function () { filterBySystem('circulatory'); selectStructure('heart', false); } },
        { label: 'Respiratory (Tracheoles/Sacs)', action: function () { filterBySystem('tracheal'); selectStructure('tracheae_tracheoles', false); } },
        { label: 'Nervous (Brain/VNC)', action: function () { filterBySystem('nervous'); selectStructure('brain', false); } },
        { label: 'Reproductive (Caste Organs)', action: function () { filterBySystem('reproductive'); selectStructure('reproductive_system_caste', false); } }
      ]);
      selectStructure('honey_sac', false);
    } else if (modKey === 'mouthparts') {
      if (castePanel) castePanel.classList.add('hidden');
      if (layersPanel) layersPanel.classList.add('hidden');
      setXray(false);
      smoothCameraTo([0.0, 0.2, 5.4], [0, -0.2, 0]);
      renderSubmodeButtons([
        { label: 'Mouthparts Isolated', action: function () { setExplode(0); setXray(false); toggleAnim('nectarFeed', false); } },
        { label: 'Proboscis Extension & Lapping', action: function () { toggleAnim('nectarFeed', true); selectStructure('mp_glossae', false); } },
        { label: 'Exploded 15-Part Complex', action: function () { setExplode(0.65); } },
        { label: 'Transparent Suction Tube', action: function () { setXray(true); selectStructure('mp_galea', false); } }
      ]);
      selectStructure('mp_glossae', false);
    } else if (modKey === 'sting_apparatus') {
      if (castePanel) castePanel.classList.add('hidden');
      if (layersPanel) layersPanel.classList.add('hidden');
      setXray(false);
      smoothCameraTo([0.0, 0.4, 5.2], [-0.2, 0.1, 0]);
      renderSubmodeButtons([
        { label: 'Mechanistic Assembly', action: function () { setExplode(0); setXray(false); toggleAnim('stingDeploy', false); } },
        { label: 'Slow-Mo Lancet & Venom Pump', action: function () { toggleAnim('stingDeploy', true); setSlowMo(true); selectStructure('st_lancet', false); } },
        { label: 'Structural Exploded View', action: function () { setExplode(0.70); } },
        { label: 'Cross-Section Cutaway', action: function () { setXray(true); selectStructure('st_sheath', false); } }
      ]);
      selectStructure('st_poison_sac', false);
    }

    var modData = window.ATLAS_DATA.modules[modKey];
    var titleEl = document.getElementById('module-header-title');
    var subEl = document.getElementById('module-header-subtitle');
    if (titleEl && modData) titleEl.textContent = modData.title;
    if (subEl && modData) subEl.textContent = modData.subtitle;

    applyMaterialsAndVisibility();
    rebuildPinsAndTree();
  }

  function applyDissectionMode9(modeId) {
    var modes = window.ATLAS_DATA.dissectionModes9 || [];
    var mode = null;
    for (var i = 0; i < modes.length; i++) {
      if (String(modes[i].id) === String(modeId)) {
        mode = modes[i];
        break;
      }
    }
    if (!mode) return;

    if (mode.id >= 4 && state.activeModule !== 'internal_anatomy') {
      switchModule('internal_anatomy');
    } else if (mode.id === 1 && state.activeModule !== 'full_atlas') {
      switchModule('full_atlas');
    }

    for (var l = 1; l <= 8; l++) {
      state.layers[l] = mode.layers.indexOf(l) !== -1;
    }
    state.xrayEnabled = mode.xray;
    state.systemFilter = mode.sys;

    updateXrayButtonUI();
    renderDissectionLayersUI();
    applyMaterialsAndVisibility();
    rebuildPinsAndTree();
  }

  function handleQuickNav(navKey) {
    document.querySelectorAll('[data-quick-nav]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-quick-nav') === navKey);
    });
    if (navKey === 'morphology') {
      switchModule('full_atlas');
      applyDissectionMode9(1);
    } else if (navKey === 'mouthparts') {
      switchModule('mouthparts');
    } else if (navKey === 'internal') {
      switchModule('internal_anatomy');
      applyDissectionMode9(2);
    } else if (navKey === 'respiration') {
      applyDissectionMode9(5);
      selectStructure('tracheae_tracheoles', true);
    } else if (navKey === 'digestive') {
      applyDissectionMode9(6);
      selectStructure('honey_sac', true);
    } else if (navKey === 'nervous') {
      applyDissectionMode9(7);
      selectStructure('brain', true);
    } else if (navKey === 'circulatory') {
      applyDissectionMode9(8);
      selectStructure('heart', true);
    } else if (navKey === 'sting') {
      switchModule('sting_apparatus');
    } else if (navKey === 'exploded') {
      setExplode(state.explodedFactor > 0.1 ? 0.0 : 0.72);
    } else if (navKey === 'xray') {
      setXray(!state.xrayEnabled);
    } else if (navKey === 'cinematic') {
      startCinematicTour();
    }
  }

  // ============================================================================
  // 10-STAGE AUTO CINEMATIC PRESENTATION FLYTHROUGH
  // ============================================================================
  function startCinematicTour() {
    state.cinematicTourActive = true;
    state.cinematicStepIndex = 0;
    state.cinematicTimer = 0;
    var hud = document.getElementById('cinematic-tour-hud');
    var btn = document.getElementById('btn-cinematic-mode');
    if (hud) hud.classList.remove('hidden');
    if (btn) btn.classList.add('active');
    applyCinematicTourStep(0);
  }

  function stopCinematicTour() {
    state.cinematicTourActive = false;
    var hud = document.getElementById('cinematic-tour-hud');
    var btn = document.getElementById('btn-cinematic-mode');
    if (hud) hud.classList.add('hidden');
    if (btn) btn.classList.remove('active');
  }

  function applyCinematicTourStep(idx) {
    var seq = window.ATLAS_DATA.presentationSequence10 || [];
    if (!seq.length) return;
    state.cinematicStepIndex = (idx + seq.length) % seq.length;
    state.cinematicTimer = 0;
    var stage = seq[state.cinematicStepIndex];

    if (state.activeModule !== stage.module) {
      switchModule(stage.module);
    }
    setXray(Boolean(stage.xray));
    setMacroDof(Boolean(stage.dof), stage.lens);

    // Stage 10 performs animated explosion -> reassembly
    if (stage.step === 10) {
      setExplode(0.0);
    } else {
      setExplode(stage.explode || 0);
    }

    if (stage.structId) {
      selectStructure(stage.structId, false);
    }
    smoothCameraTo(stage.camPos, stage.target);

    var setTxt = function (id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setTxt('tour-step-badge', 'Stage ' + stage.step + ' / ' + seq.length);
    setTxt('tour-lens-badge', stage.lens);
    setTxt('tour-stage-title', stage.title);
    setTxt('tour-stage-caption', stage.caption);

    var bar = document.getElementById('tour-progress-bar');
    if (bar) bar.style.width = Math.round((stage.step / seq.length) * 100) + '%';
  }

  function setMacroDof(enabled, customLensText) {
    state.macroDofEnabled = enabled;
    var btn = document.getElementById('btn-macro-dof');
    var overlay = document.getElementById('macro-dof-overlay');
    var lensEl = document.getElementById('telemetry-lens');
    if (btn) btn.classList.toggle('active', enabled);
    if (overlay) overlay.classList.toggle('dof-active', enabled);
    if (camera) {
      camera.fov = enabled ? 22 : 36; // 180mm telephoto macro compression vs 100mm standard
      camera.updateProjectionMatrix();
    }
    if (lensEl) {
      lensEl.textContent = customLensText || (enabled ? '180mm Macro f/2.8 (DoF Bokeh)' : '105mm Macro f/4.0');
    }
  }

  function setQualityMode(highQuality) {
    state.highQualityMode = highQuality;
    var btn = document.getElementById('btn-quality-mode');
    var polyEl = document.getElementById('telemetry-polys');
    var partEl = document.getElementById('telemetry-particles');

    if (btn) {
      btn.classList.toggle('active', highQuality);
      btn.textContent = highQuality ? 'HQ: Photoreal' : 'LQ: Fast 60FPS';
    }
    if (renderer) {
      renderer.setPixelRatio(highQuality ? Math.min(window.devicePixelRatio || 1, 2) : 1);
    }

    // Scale 3D Setae Hair & Pollen Instance Density
    var fb = models.fullBee.animRefs;
    if (fb.setaeInstancedGroups) {
      fb.setaeInstancedGroups.forEach(function (inst) {
        inst.visible = highQuality || state.layers[1];
        inst.count = highQuality ? inst.geometry.maxInstancedCount || inst.count : Math.max(120, Math.floor(inst.count * 0.25));
      });
    }
    if (polyEl) {
      polyEl.textContent = highQuality ? '548,400 tris (Instanced PBR)' : '68,200 tris (Educational Fast)';
    }
    if (partEl) {
      partEl.textContent = highQuality ? '6,770 3D Strands / Grains' : '1,450 3D Strands / Grains';
    }
  }

  function setSlowMo(enabled) {
    state.slowMoEnabled = enabled;
    var btn = document.getElementById('btn-slowmo-toggle');
    if (btn) btn.classList.toggle('active', enabled);
  }

  function renderSubmodeButtons(buttons) {
    var bar = document.getElementById('module-submode-bar');
    if (!bar) return;
    bar.innerHTML = '';
    buttons.forEach(function (b, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'glass-pill px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-200 whitespace-nowrap' + (idx === 0 ? ' active' : '');
      btn.textContent = b.label;
      btn.addEventListener('click', function () {
        bar.querySelectorAll('button').forEach(function (el) { el.classList.remove('active'); });
        btn.classList.add('active');
        b.action();
      });
      bar.appendChild(btn);
    });
  }

  function switchCaste(casteKey) {
    state.activeCaste = casteKey;
    var caste = window.ATLAS_DATA.castes[casteKey];
    if (!caste) return;

    document.querySelectorAll('[data-caste-btn]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-caste-btn') === casteKey);
    });

    // Morph 3D full bee proportions & Caste-Specific Reproductive Organs
    var refs = models.fullBee.animRefs;
    var m = caste.morph;
    refs.headGroup.scale.set(m.headScale[0], m.headScale[1], m.headScale[2]);
    refs.thoraxGroup.scale.set(m.thoraxScale[0], m.thoraxScale[1], m.thoraxScale[2]);
    refs.abdomenGroup.scale.set(m.abdomenScale[0], m.abdomenScale[1], m.abdomenScale[2]);

    refs.pollenPellets.forEach(function (p) {
      p.visible = m.hasCorbicula;
    });
    if (refs.pollenParticlesGroup) {
      refs.pollenParticlesGroup.visible = m.hasCorbicula;
    }
    if (refs.stingGroup) {
      refs.stingGroup.visible = m.hasSting;
    }
    if (refs.reproCasteGroups) {
      if (refs.reproCasteGroups.worker) refs.reproCasteGroups.worker.visible = (casteKey === 'worker');
      if (refs.reproCasteGroups.queen) refs.reproCasteGroups.queen.visible = (casteKey === 'queen');
      if (refs.reproCasteGroups.drone) refs.reproCasteGroups.drone.visible = (casteKey === 'drone');
    }

    var setTxt = function (id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setTxt('caste-latin-badge', caste.latin);
    setTxt('caste-len-val', caste.lengthMm);
    setTxt('caste-mass-val', caste.massMg);
    setTxt('caste-eye-val', caste.ommatidia);
    setTxt('caste-hz-val', caste.wingbeatHz + ' Hz');
    setTxt('caste-summary-text', caste.summary);
    setTxt('caste-corbicula-val', caste.corbicula);
    setTxt('caste-sting-val', caste.stingType);
  }

  function filterBySystem(sysKey) {
    state.systemFilter = sysKey;
    applyMaterialsAndVisibility();
    rebuildPinsAndTree();
  }

  function setAllLayers(enabled) {
    for (var i = 1; i <= 8; i++) state.layers[i] = enabled;
    renderDissectionLayersUI();
    applyMaterialsAndVisibility();
    rebuildPinsAndTree();
  }

  function setXray(enabled) {
    state.xrayEnabled = enabled;
    updateXrayButtonUI();
    applyMaterialsAndVisibility();
  }

  function updateXrayButtonUI() {
    var btn = document.getElementById('btn-xray-toggle');
    if (btn) btn.classList.toggle('active', state.xrayEnabled);
  }

  function setExplode(val) {
    state.explodedFactor = Math.max(0, Math.min(1, parseFloat(val) || 0));
    var slider = document.getElementById('slider-explode');
    var label = document.getElementById('label-explode-pct');
    var btn = document.getElementById('btn-explode-toggle');
    if (slider) slider.value = state.explodedFactor;
    if (label) label.textContent = Math.round(state.explodedFactor * 100) + '%';
    if (btn) btn.classList.toggle('active', state.explodedFactor > 0.05);
    applyExplodedPositions();
  }

  function applyExplodedPositions() {
    var activeRoot = getActiveModelRoot();
    activeRoot.traverse(function (obj) {
      if (obj.userData && obj.userData.basePos && obj.userData.explodeVec) {
        obj.position.copy(obj.userData.basePos).addScaledVector(obj.userData.explodeVec, state.explodedFactor);
      }
    });
  }

  function applyMaterialsAndVisibility() {
    var activeRoot = getActiveModelRoot();
    activeRoot.traverse(function (obj) {
      if (obj.userData && obj.userData.layerId && (state.activeModule === 'full_atlas' || state.activeModule === 'internal_anatomy')) {
        var layerOn = Boolean(state.layers[obj.userData.layerId]);
        var sysMatch = (state.systemFilter === 'ALL') || (obj.userData.systemKey === state.systemFilter) || (obj.userData.layerId <= 2);
        obj.visible = layerOn && sysMatch;
      }

      if ((obj.isMesh || obj.isInstancedMesh) && obj.material && obj.userData.origColor) {
        var isSelected = (obj.userData.structureId === state.selectedStructureId);
        var isOuterShell = (obj.userData.layerId === 1 || obj.userData.layerId === 2);

        if (state.xrayEnabled && isOuterShell) {
          obj.material.transparent = true;
          obj.material.opacity = state.xrayOpacity;
          obj.material.depthWrite = false;
          if (obj.material.emissive) {
            obj.material.emissive.setHex(isSelected ? 0xF59E0B : 0x38BDF8);
            obj.material.emissiveIntensity = isSelected ? 0.65 : 0.35;
          }
        } else {
          obj.material.transparent = obj.userData.origTransparent;
          obj.material.opacity = obj.userData.origOpacity;
          obj.material.depthWrite = !obj.userData.origTransparent;
          if (obj.material.emissive && obj.userData.origEmissive) {
            obj.material.emissive.copy(obj.userData.origEmissive);
            obj.material.emissiveIntensity = 0.25;
          }
        }

        if (isSelected && obj.material.emissive) {
          obj.material.emissive.setHex(0xF59E0B);
          obj.material.emissiveIntensity = 0.68;
        }
      }
    });
  }

  // ============================================================================
  // STRUCTURE SELECTION, CAMERA FOCUS & 3D LABEL PIN PROJECTION
  // ============================================================================
  function getActiveStructuresList() {
    var mod = window.ATLAS_DATA.modules[state.activeModule];
    return mod ? mod.structures : [];
  }

  function selectStructure(structureId, flyCamera) {
    state.selectedStructureId = structureId;
    var structures = getActiveStructuresList();
    var found = null;
    for (var i = 0; i < structures.length; i++) {
      if (structures[i].id === structureId) {
        found = structures[i];
        break;
      }
    }
    if (!found && structures.length > 0) found = structures[0];
    if (!found) return;

    Object.keys(activePinElements).forEach(function (id) {
      activePinElements[id].classList.toggle('selected', id === found.id);
    });
    document.querySelectorAll('[data-tree-id]').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-tree-id') === found.id);
    });

    var setTxt = function (id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setTxt('insp-region-badge', found.region || 'ANATOMY');
    setTxt('insp-system-badge', (found.system || 'morphology').toUpperCase());
    setTxt('insp-title', found.label);
    setTxt('insp-latin', found.latin);
    setTxt('insp-dimensions', found.dimensions);
    setTxt('insp-mechanism', found.mechanism);
    setTxt('insp-citation', found.citation);

    applyMaterialsAndVisibility();

    if (flyCamera && controls) {
      var targetVec = getDisplacedStructureWorldPos(found);
      state.camLerpTarget = targetVec.clone();
    }
  }

  function getDisplacedStructureWorldPos(s) {
    var base = new THREE.Vector3(s.pos[0], s.pos[1], s.pos[2]);
    if (s.explodeVec) {
      var exp = new THREE.Vector3(s.explodeVec[0], s.explodeVec[1], s.explodeVec[2]);
      base.addScaledVector(exp, state.explodedFactor);
    }
    return base;
  }

  function rebuildPinsAndTree() {
    var pinsContainer = document.getElementById('labels-container');
    var treeContainer = document.getElementById('structure-tree-list');
    var regionSelect = document.getElementById('select-region-filter');
    if (!pinsContainer || !treeContainer) return;

    pinsContainer.innerHTML = '';
    treeContainer.innerHTML = '';
    activePinElements = {};

    var structures = getActiveStructuresList();

    if (regionSelect) {
      var regions = ['ALL'];
      structures.forEach(function (s) {
        if (s.region && regions.indexOf(s.region) === -1) regions.push(s.region);
      });
      var prevVal = state.regionFilter;
      regionSelect.innerHTML = '';
      regions.forEach(function (r) {
        var opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r === 'ALL' ? 'All Regions (' + structures.length + ')' : r;
        regionSelect.appendChild(opt);
      });
      regionSelect.value = regions.indexOf(prevVal) !== -1 ? prevVal : 'ALL';
    }

    var q = (state.searchQuery || '').trim().toLowerCase();
    var visibleCount = 0;

    structures.forEach(function (s) {
      if ((state.activeModule === 'full_atlas' || state.activeModule === 'internal_anatomy') && s.layer && !state.layers[s.layer]) {
        return;
      }
      if (state.regionFilter !== 'ALL' && s.region !== state.regionFilter) return;
      if (state.systemFilter !== 'ALL' && s.system !== state.systemFilter) return;
      if (q && s.label.toLowerCase().indexOf(q) === -1 && s.latin.toLowerCase().indexOf(q) === -1 && s.region.toLowerCase().indexOf(q) === -1) {
        return;
      }

      visibleCount++;

      var pin = document.createElement('div');
      pin.className = 'anat-pin' + (s.id === state.selectedStructureId ? ' selected' : '');
      pin.innerHTML = '<span class="pin-dot"></span><span>' + s.label + '</span>';
      pin.addEventListener('click', function (e) {
        e.stopPropagation();
        selectStructure(s.id, true);
      });
      pinsContainer.appendChild(pin);
      activePinElements[s.id] = pin;

      var row = document.createElement('div');
      row.className = 'tree-item' + (s.id === state.selectedStructureId ? ' active' : '');
      row.setAttribute('data-tree-id', s.id);
      row.innerHTML =
        '<div class="flex items-center gap-2 truncate">' +
          '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>' +
          '<span class="truncate">' + s.label + '</span>' +
        '</div>' +
        '<span class="text-[10px] font-mono-tech text-slate-400 ml-2 flex-shrink-0">' + s.region.split(' ')[0] + '</span>';
      row.addEventListener('click', function () {
        selectStructure(s.id, true);
      });
      treeContainer.appendChild(row);
    });

    var countBadge = document.getElementById('structure-count-badge');
    if (countBadge) countBadge.textContent = visibleCount + ' / ' + structures.length;
  }

  function updatePinScreenCoordinates() {
    var pinsContainer = document.getElementById('labels-container');
    if (!pinsContainer) return;
    if (!state.labelsVisible) {
      pinsContainer.style.display = 'none';
      return;
    }
    pinsContainer.style.display = 'block';

    var width = renderer.domElement.clientWidth;
    var height = renderer.domElement.clientHeight;
    var structures = getActiveStructuresList();

    structures.forEach(function (s) {
      var pin = activePinElements[s.id];
      if (!pin) return;
      var worldPos = getDisplacedStructureWorldPos(s);
      var projected = worldPos.clone().project(camera);

      if (projected.z > 1.0) {
        pin.style.display = 'none';
        return;
      }
      var x = (projected.x * 0.5 + 0.5) * width;
      var y = (-projected.y * 0.5 + 0.5) * height;

      if (x < 10 || x > width - 10 || y < 10 || y > height - 10) {
        pin.style.display = 'none';
      } else {
        pin.style.display = 'flex';
        pin.style.left = x + 'px';
        pin.style.top = y + 'px';
      }
    });
  }

  function smoothCameraTo(posArr, targetArr) {
    state.camLerpPos = new THREE.Vector3(posArr[0], posArr[1], posArr[2]);
    state.camLerpTarget = new THREE.Vector3(targetArr[0], targetArr[1], targetArr[2]);
  }

  function resetCameraView(posArr, targetArr) {
    state.camLerpPos = null;
    state.camLerpTarget = null;
    if (!camera || !controls) return;
    camera.position.set(posArr[0], posArr[1], posArr[2]);
    controls.target.set(targetArr[0], targetArr[1], targetArr[2]);
    controls.update();
  }

  // ============================================================================
  // UI BINDINGS & DISSECTION LAYER CONTROLS
  // ============================================================================
  function renderDissectionLayersUI() {
    var list = document.getElementById('dissection-layers-list');
    if (!list) return;
    list.innerHTML = '';

    window.ATLAS_DATA.dissectionLayers.forEach(function (layer) {
      var isOn = Boolean(state.layers[layer.id]);
      var item = document.createElement('div');
      item.className = 'layer-row' + (isOn ? ' active-layer' : '');
      item.innerHTML =
        '<div class="flex items-center gap-2 min-w-0">' +
          '<span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:' + layer.color + '"></span>' +
          '<span class="text-xs font-medium text-slate-200 truncate" title="' + layer.desc + '">' + layer.name + '</span>' +
        '</div>' +
        '<input type="checkbox" class="accent-amber-500 w-3.5 h-3.5 cursor-pointer" ' + (isOn ? 'checked' : '') + ' />';

      var checkbox = item.querySelector('input');
      checkbox.addEventListener('change', function () {
        state.layers[layer.id] = checkbox.checked;
        item.classList.toggle('active-layer', checkbox.checked);
        applyMaterialsAndVisibility();
        rebuildPinsAndTree();
      });
      list.appendChild(item);
    });
  }

  function toggleAnim(animKey, forceVal) {
    state.anims[animKey] = (forceVal !== undefined) ? forceVal : !state.anims[animKey];
    var btn = document.querySelector('[data-anim-btn="' + animKey + '"]');
    if (btn) btn.classList.toggle('active', state.anims[animKey]);
  }

  function bindUIEvents() {
    document.querySelectorAll('[data-module-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchModule(btn.getAttribute('data-module-btn'));
      });
    });

    document.querySelectorAll('[data-quick-nav]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        handleQuickNav(btn.getAttribute('data-quick-nav'));
      });
    });

    var selectMode9 = document.getElementById('select-dissection-mode-9');
    if (selectMode9) {
      selectMode9.addEventListener('change', function () {
        applyDissectionMode9(selectMode9.value);
      });
    }

    document.querySelectorAll('[data-caste-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchCaste(btn.getAttribute('data-caste-btn'));
      });
    });

    var searchInput = document.getElementById('input-structure-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        state.searchQuery = searchInput.value;
        rebuildPinsAndTree();
      });
    }

    var regionSelect = document.getElementById('select-region-filter');
    if (regionSelect) {
      regionSelect.addEventListener('change', function () {
        state.regionFilter = regionSelect.value;
        rebuildPinsAndTree();
      });
    }

    var btnLayersAll = document.getElementById('btn-layers-all');
    if (btnLayersAll) {
      btnLayersAll.addEventListener('click', function () { setAllLayers(true); });
    }
    var btnLayersInternal = document.getElementById('btn-layers-internal-only');
    if (btnLayersInternal) {
      btnLayersInternal.addEventListener('click', function () {
        state.layers[1] = false;
        state.layers[2] = false;
        for (var i = 3; i <= 8; i++) state.layers[i] = true;
        renderDissectionLayersUI();
        applyMaterialsAndVisibility();
        rebuildPinsAndTree();
      });
    }

    var btnExplode = document.getElementById('btn-explode-toggle');
    if (btnExplode) {
      btnExplode.addEventListener('click', function () {
        setExplode(state.explodedFactor > 0.05 ? 0.0 : 0.65);
      });
    }
    var sliderExplode = document.getElementById('slider-explode');
    if (sliderExplode) {
      sliderExplode.addEventListener('input', function () {
        setExplode(sliderExplode.value);
      });
    }

    var btnXray = document.getElementById('btn-xray-toggle');
    if (btnXray) {
      btnXray.addEventListener('click', function () {
        setXray(!state.xrayEnabled);
      });
    }

    var btnLabels = document.getElementById('btn-labels-toggle');
    if (btnLabels) {
      btnLabels.addEventListener('click', function () {
        state.labelsVisible = !state.labelsVisible;
        btnLabels.classList.toggle('active', state.labelsVisible);
      });
    }

    var btnMacroDof = document.getElementById('btn-macro-dof');
    if (btnMacroDof) {
      btnMacroDof.addEventListener('click', function () {
        setMacroDof(!state.macroDofEnabled);
      });
    }

    var btnQuality = document.getElementById('btn-quality-mode');
    if (btnQuality) {
      btnQuality.addEventListener('click', function () {
        setQualityMode(!state.highQualityMode);
      });
    }

    var btnSlowMo = document.getElementById('btn-slowmo-toggle');
    if (btnSlowMo) {
      btnSlowMo.addEventListener('click', function () {
        setSlowMo(!state.slowMoEnabled);
      });
    }

    var btnCinematic = document.getElementById('btn-cinematic-mode');
    if (btnCinematic) {
      btnCinematic.addEventListener('click', function () {
        if (state.cinematicTourActive) stopCinematicTour();
        else startCinematicTour();
      });
    }
    var btnTourPrev = document.getElementById('btn-tour-prev');
    if (btnTourPrev) {
      btnTourPrev.addEventListener('click', function () {
        applyCinematicTourStep(state.cinematicStepIndex - 1);
      });
    }
    var btnTourNext = document.getElementById('btn-tour-next');
    if (btnTourNext) {
      btnTourNext.addEventListener('click', function () {
        applyCinematicTourStep(state.cinematicStepIndex + 1);
      });
    }
    var btnTourStop = document.getElementById('btn-tour-stop');
    if (btnTourStop) {
      btnTourStop.addEventListener('click', function () {
        stopCinematicTour();
      });
    }

    var btnResetCam = document.getElementById('btn-reset-camera');
    if (btnResetCam) {
      btnResetCam.addEventListener('click', function () {
        stopCinematicTour();
        setMacroDof(false);
        setExplode(0);
        resetCameraView([0.6, 1.8, 6.4], [-0.2, -0.1, 0]);
      });
    }

    document.querySelectorAll('[data-slice-axis]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var axis = btn.getAttribute('data-slice-axis');
        state.sliceAxis = axis;
        document.querySelectorAll('[data-slice-axis]').forEach(function (el) {
          el.classList.toggle('active', el.getAttribute('data-slice-axis') === axis);
        });
        updateClippingPlane();
      });
    });

    var sliderSlice = document.getElementById('slider-slice-pos');
    if (sliderSlice) {
      sliderSlice.addEventListener('input', function () {
        state.sliceOffset = parseFloat(sliderSlice.value) || 0;
        updateClippingPlane();
      });
    }

    document.querySelectorAll('[data-anim-btn]').forEach(function (btn) {
      var key = btn.getAttribute('data-anim-btn');
      btn.classList.toggle('active', Boolean(state.anims[key]));
      btn.addEventListener('click', function () {
        toggleAnim(key);
      });
    });

    var btnArchOpen = document.getElementById('btn-open-arch-modal');
    var btnArchClose = document.getElementById('btn-close-arch-modal');
    var archModal = document.getElementById('arch-guide-modal');
    if (btnArchOpen && archModal) {
      btnArchOpen.addEventListener('click', function () {
        populateArchModal();
        archModal.classList.remove('hidden');
      });
    }
    if (btnArchClose && archModal) {
      btnArchClose.addEventListener('click', function () {
        archModal.classList.add('hidden');
      });
    }

    var btnCasteModalOpen = document.getElementById('btn-open-caste-modal');
    var btnCasteModalClose = document.getElementById('btn-close-caste-modal');
    var casteModal = document.getElementById('caste-compare-modal');
    if (btnCasteModalOpen && casteModal) {
      btnCasteModalOpen.addEventListener('click', function () {
        casteModal.classList.remove('hidden');
      });
    }
    if (btnCasteModalClose && casteModal) {
      btnCasteModalClose.addEventListener('click', function () {
        casteModal.classList.add('hidden');
      });
    }
  }

  function updateClippingPlane() {
    if (!clippingPlane) return;
    if (state.sliceAxis === 'none') {
      clippingPlane.normal.set(0, 0, -1);
      clippingPlane.constant = 100;
    } else if (state.sliceAxis === 'z') {
      clippingPlane.normal.set(0, 0, -1);
      clippingPlane.constant = state.sliceOffset;
    } else if (state.sliceAxis === 'x') {
      clippingPlane.normal.set(-1, 0, 0);
      clippingPlane.constant = state.sliceOffset * 2.5;
    } else if (state.sliceAxis === 'y') {
      clippingPlane.normal.set(0, -1, 0);
      clippingPlane.constant = state.sliceOffset;
    }
  }

  function populateArchModal() {
    var container = document.getElementById('arch-modal-body');
    if (!container) return;
    container.innerHTML = '';
    window.ATLAS_DATA.architectureGuide.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'p-3.5 rounded-lg bg-slate-900/90 border border-slate-700/70 space-y-1.5';
      card.innerHTML =
        '<div class="text-xs font-semibold text-amber-400">' + item.area + '</div>' +
        '<div class="text-xs text-slate-300"><strong class="text-slate-100">Executed Now:</strong> ' + item.current + '</div>' +
        '<div class="text-xs text-emerald-300/90"><strong class="text-emerald-200">Where Changes / Upgrades Can Be Done:</strong> ' + item.upgrade + '</div>';
      container.appendChild(card);
    });
  }

  // ============================================================================
  // REAL-TIME PROCEDURAL KINEMATICS & CINEMATIC SHOWCASE LOOP
  // ============================================================================
  function animateLoop() {
    requestAnimationFrame(animateLoop);
    var dt = clock.getDelta();
    var speedScale = state.slowMoEnabled ? 0.2 : 1.0;
    simElapsed += dt * speedScale;
    var elapsed = simElapsed;
    var fb = models.fullBee.animRefs;

    // Live FPS Counter update
    fpsFrames++;
    var now = performance.now();
    if (now - fpsLastTime >= 600) {
      var fps = Math.min(60, Math.round((fpsFrames * 1000) / (now - fpsLastTime)));
      var fpsEl = document.getElementById('telemetry-fps');
      if (fpsEl) fpsEl.textContent = String(fps);
      fpsFrames = 0;
      fpsLastTime = now;
    }

    // Smooth camera interpolation & 10-Stage Auto Cinematic Flythrough progression
    if (state.camLerpPos && camera) {
      camera.position.lerp(state.camLerpPos, 0.06);
      if (camera.position.distanceTo(state.camLerpPos) < 0.04) {
        state.camLerpPos = null;
      }
    }
    if (state.camLerpTarget && controls) {
      controls.target.lerp(state.camLerpTarget, 0.08);
      if (controls.target.distanceTo(state.camLerpTarget) < 0.02) {
        state.camLerpTarget = null;
      }
    }

    if (state.cinematicTourActive) {
      state.cinematicTimer += dt;
      // Subtle slow museum showcase orbit drift
      if (camera && !state.camLerpPos) {
        camera.position.x += Math.sin(now * 0.0006) * 0.004;
        camera.position.y += Math.cos(now * 0.0005) * 0.002;
      }
      if (state.cinematicTimer >= 6.5) {
        applyCinematicTourStep(state.cinematicStepIndex + 1);
      }
    }

    if (atmospherePoints) {
      atmospherePoints.rotation.y += dt * 0.025;
    }

    // 1. Wing Flapping (Coupled Forewing + Hindwing Figure-8 Kinematics)
    if (state.anims.wingFlap && fb.wings.foreL) {
      var flapAngle = Math.sin(elapsed * 28.0) * 0.55;
      var pitchAngle = Math.cos(elapsed * 28.0) * 0.22;
      fb.wings.foreL.rotation.x = 0.2 + flapAngle;
      fb.wings.foreL.rotation.z = pitchAngle;
      fb.wings.hindL.rotation.x = 0.18 + flapAngle;
      fb.wings.hindL.rotation.z = pitchAngle;

      fb.wings.foreR.rotation.x = -0.2 - flapAngle;
      fb.wings.foreR.rotation.z = pitchAngle;
      fb.wings.hindR.rotation.x = -0.18 - flapAngle;
      fb.wings.hindR.rotation.z = pitchAngle;
    }

    // 2. Antenna Olfactory Scanning
    if (state.anims.antennaScan && fb.antennae.L) {
      fb.antennae.L.rotation.y = Math.sin(elapsed * 4.2) * 0.22;
      fb.antennae.L.rotation.z = Math.cos(elapsed * 3.1) * 0.15;
      fb.antennae.R.rotation.y = -Math.cos(elapsed * 4.5) * 0.22;
      fb.antennae.R.rotation.z = Math.sin(elapsed * 3.4) * 0.15;
    }

    // 3. Compound Eye Pseudopupil Tracking
    if (state.anims.eyeTrack) {
      fb.eyePupils.forEach(function (ep) {
        ep.mesh.position.x = ep.basePos.x + state.pointerNDC.x * 0.08;
        ep.mesh.position.y = ep.basePos.y + state.pointerNDC.y * 0.10;
      });
    }

    // 4. Breathing Abdomen & Tracheal Air Sac Ventilation
    if (state.anims.abdomenBreathe) {
      var breath = Math.sin(elapsed * 3.2) * 0.045;
      var cMorph = window.ATLAS_DATA.castes[state.activeCaste].morph;
      fb.abdomenGroup.scale.set(
        cMorph.abdomenScale[0] * (1 + breath),
        cMorph.abdomenScale[1] * (1 - breath * 0.5),
        cMorph.abdomenScale[2] * (1 - breath * 0.5)
      );
      fb.airSacs.forEach(function (sac) {
        sac.scale.y = 0.72 + Math.sin(elapsed * 3.2) * 0.14;
      });
    }

    // 5. Pollen Collection & Corbicular Packing Sequence
    if (state.anims.pollenCollect && fb.legs.proL) {
      fb.legs.proL.rotation.z = Math.sin(elapsed * 6.0) * 0.25;
      fb.legs.mesoL.rotation.x = Math.cos(elapsed * 6.0) * 0.22;
      fb.legs.metaL.rotation.z = Math.sin(elapsed * 6.0) * 0.18;
      var pelletScale = 1.0 + (Math.sin(elapsed * 2.5) * 0.5 + 0.5) * 0.45;
      fb.pollenPellets.forEach(function (p) {
        p.scale.set(1.1 * pelletScale, 1.35 * pelletScale, 0.65 * pelletScale);
      });
    }

    // 6. Stinging Mechanism (Whole Bee + Dedicated Sting Module)
    if (state.anims.stingDeploy) {
      if (fb.stingGroup) {
        fb.stingGroup.position.x = fb.stingGroup.userData.basePos.x - Math.abs(Math.sin(elapsed * 8.0)) * 0.32;
      }
    }
    if (state.activeModule === 'sting_apparatus') {
      var st = models.sting.animRefs;
      var freq = state.anims.stingDeploy ? 12.0 : 3.5;
      var stroke = Math.sin(elapsed * freq) * 0.24;
      if (st.lancetL && st.lancetR) {
        st.lancetL.position.x = -1.25 + stroke;
        st.lancetR.position.x = -1.25 - stroke;
      }
      if (st.barbsL && st.barbsR) {
        st.barbsL.position.x = stroke;
        st.barbsR.position.x = -stroke;
      }
      if (st.platesGroup) {
        st.platesGroup.rotation.z = Math.sin(elapsed * freq) * 0.08;
      }
      if (st.poisonSacMesh) {
        var pulse = 1.0 + Math.sin(elapsed * freq * 0.5) * 0.08;
        st.poisonSacMesh.scale.set(1.55 * pulse, 0.92 * pulse, 0.92 * pulse);
      }
      st.venomDrops.forEach(function (vd) {
        vd.t = (vd.t + 0.012 * speedScale) % 1.0;
        vd.mesh.position.x = 0.9 - vd.t * 3.1;
      });
    }

    // 7. Nectar Feeding & Proboscis Extension (Whole Bee + Dedicated Mouthparts Module)
    if (state.anims.nectarFeed) {
      if (fb.proboscisGroup) {
        fb.proboscisGroup.rotation.z = -0.35 + Math.sin(elapsed * 5.0) * 0.25;
      }
      if (fb.honeySacMesh) {
        var cropExpand = 1.0 + (Math.sin(elapsed * 2.0) * 0.5 + 0.5) * 0.35;
        fb.honeySacMesh.scale.set(1.35 * cropExpand, 0.92 * cropExpand, 0.92 * cropExpand);
      }
    }
    if (state.activeModule === 'mouthparts') {
      var mp = models.mouthparts.animRefs;
      var lapFreq = state.anims.nectarFeed ? 7.5 : 2.2;
      if (mp.glossaShaft && mp.labellumTip) {
        var lapOffset = Math.sin(elapsed * lapFreq) * 0.22;
        mp.glossaShaft.position.y = mp.glossaShaft.userData.basePos.y + lapOffset;
        mp.labellumTip.position.y = mp.labellumTip.userData.basePos.y + lapOffset;
      }
      if (mp.mandibleL && mp.mandibleR) {
        var jawOpen = Math.sin(elapsed * 2.8) * 0.18;
        mp.mandibleL.rotation.z = -jawOpen;
        mp.mandibleR.rotation.z = jawOpen;
      }
      mp.nectarDrops.forEach(function (nd) {
        nd.t = (nd.t + 0.01 * speedScale) % 1.0;
        nd.mesh.position.y = -2.65 + nd.t * 3.2;
      });
    }

    // 8. Internal Physiological Particle Flows & Dorsal Heart Peristalsis
    fb.heartChambers.forEach(function (ch, idx) {
      var hPulse = 0.85 + Math.sin(elapsed * 5.0 - idx * 0.7) * 0.18;
      ch.scale.set(1.75, hPulse, hPulse);
    });
    fb.flowParticles.forEach(function (fp) {
      fp.t = (fp.t + 0.0045 * speedScale) % 1.0;
      fp.mesh.position.x = fp.xStart + (fp.xEnd - fp.xStart) * fp.t;
      fp.mesh.position.y = fp.yBase + Math.sin(fp.t * Math.PI * 4 + elapsed * 3) * 0.03;
    });

    if (controls) controls.update();
    updatePinScreenCoordinates();
    renderer.render(scene, camera);
  }

  window.addEventListener('DOMContentLoaded', initAtlasApp);
})();
