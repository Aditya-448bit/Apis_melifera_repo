// Complete Anatomical Dataset & Scientific Monographs for Apis mellifera Atlas

window.ATLAS_DATA = {
  castes: {
    worker: {
      id: 'worker',
      name: 'Worker (Sterile Female)',
      latin: 'Apis mellifera — Operaria',
      lengthMm: '12.0 – 15.0 mm',
      massMg: '90 – 120 mg',
      ommatidia: '4,500 – 5,500 / eye',
      antennalSegments: '12 (10 flagellomeres)',
      wingbeatHz: 235,
      corbicula: 'Present (specialized metathoracic tibia)',
      stingType: 'Strongly barbed lancets (10–11 recurved barbs); autotomy upon mammal envenomation',
      waxGlands: 'Active on abdominal sternites IV–VII',
      summary: 'Non-reproductive female performing age-polyethic tasks: nursing, comb construction via ventral wax mirrors, nest thermoregulation, guarding, and nectar/pollen foraging.',
      morph: { headScale: [1, 1, 1], eyeScale: [1, 1, 1], thoraxScale: [1, 1, 1], abdomenScale: [1, 1, 1], wingScale: 1.0, hasCorbicula: true, hasSting: true }
    },
    queen: {
      id: 'queen',
      name: 'Queen (Reproductive Female)',
      latin: 'Apis mellifera — Regina',
      lengthMm: '18.0 – 22.0 mm',
      massMg: '180 – 280 mg',
      ommatidia: '3,500 – 4,500 / eye',
      antennalSegments: '12 (10 flagellomeres)',
      wingbeatHz: 195,
      corbicula: 'Absent (smooth hind tibia lacking pollen basket & pecten)',
      stingType: 'Weakly barbed, decurved lancets; used repeatedly against rival queens',
      waxGlands: 'Degenerate / absent; hypertrophied mandibular glands secrete 9-ODA queen pheromone',
      summary: 'Sole fertile female in a monogynous colony, possessing 150–180 ovarioles per ovary capable of laying 1,500–2,000 eggs daily and regulating colony cohesion via queen mandibular pheromone (QMP).',
      morph: { headScale: [0.95, 0.92, 0.95], eyeScale: [0.9, 0.9, 0.9], thoraxScale: [1.12, 1.1, 1.12], abdomenScale: [1.55, 1.08, 1.08], wingScale: 0.92, hasCorbicula: false, hasSting: true }
    },
    drone: {
      id: 'drone',
      name: 'Drone (Haploid Male)',
      latin: 'Apis mellifera — Fucus',
      lengthMm: '15.0 – 17.0 mm',
      massMg: '190 – 220 mg',
      ommatidia: '7,500 – 8,600 / eye (Holoptic)',
      antennalSegments: '13 (11 flagellomeres; 10x pore plates)',
      wingbeatHz: 185,
      corbicula: 'Absent (no foraging apparatus)',
      stingType: 'Absent (homologous sclerites modified into eversible endophallus)',
      waxGlands: 'Absent',
      summary: 'Haploid male developed from unfertilized eggs via arrhenotokous parthenogenesis. Specialized for high-speed aerial pursuit of virgin queens in drone congregation areas (DCAs).',
      morph: { headScale: [1.18, 1.15, 1.15], eyeScale: [1.45, 1.38, 1.35], thoraxScale: [1.22, 1.2, 1.22], abdomenScale: [1.05, 1.22, 1.25], wingScale: 1.18, hasCorbicula: false, hasSting: false }
    }
  },

  dissectionLayers: [
    { id: 1, key: 'external', name: '1. External Morphology & Setae', color: '#F59E0B', defaultOn: true, desc: 'Branched plumose hairs (setae), compound eyes, wings, and specialized leg grooming/foraging tools.' },
    { id: 2, key: 'exoskeleton', name: '2. Exoskeleton (Chitinous Sclerites)', color: '#D97706', defaultOn: true, desc: 'Cuticular head capsule, thoracic nota/pleura, and telescoping abdominal tergites and sternites.' },
    { id: 3, key: 'muscular', name: '3. Flight & Locomotor Musculature', color: '#EF4444', defaultOn: true, desc: 'Asynchronous indirect flight muscles (dorsoventral & dorsal longitudinal) driving 230 Hz thoracic deformation.' },
    { id: 4, key: 'tracheal', name: '4. Tracheal & Air Sac System', color: '#38BDF8', defaultOn: true, desc: 'Ten pairs of spiracles feeding compressible cephalic, thoracic, and abdominal tracheal air sacs.' },
    { id: 5, key: 'digestive', name: '5. Digestive & Excretory System', color: '#10B981', defaultOn: true, desc: 'Pharynx, oesophagus, expandable honey sac (crop), proventriculus, ventriculus, Malpighian tubules, and rectum.' },
    { id: 6, key: 'nervous', name: '6. Central Nervous System', color: '#A855F7', defaultOn: true, desc: 'Supraoesophageal brain with mushroom bodies, suboesophageal ganglion, and fused thoracic/abdominal ganglia.' },
    { id: 7, key: 'circulatory', name: '7. Open Circulatory System', color: '#F43F5E', defaultOn: true, desc: 'Pulsatile dorsal vessel with 5 ostia pairs, anterior aorta looping through the petiole, and open haemocoel.' },
    { id: 8, key: 'reproductive', name: '8. Reproductive & Glandular System', color: '#EC4899', defaultOn: true, desc: 'Ovaries/ovarioles (or drone endophallus), hypopharyngeal, salivary, wax glands, and venom/sting apparatus.' }
  ],

  modules: {
    full_atlas: {
      title: 'Whole-Bee Atlas & Caste Dissection',
      subtitle: 'External reference labels, 8-layer progressive dissection, and Worker / Queen / Drone morphometrics',
      structures: [
        // HEAD
        {
          id: 'ocelli', label: 'ocelli', region: 'HEAD', system: 'nervous', layer: 1,
          pos: [1.92, 0.92, 0.0], explodeVec: [0.8, 0.9, 0],
          latin: 'Ocelli (Stemmata dorsalia)',
          dimensions: '3 lenses (1 median, 2 lateral), ~180 µm diameter each',
          mechanism: 'Single-lens photoreceptors sensitive to ultraviolet and green light intensity gradients; stabilize pitch and roll relative to the horizon during flight rather(than) forming high-resolution images.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee. Cornell University Press, Ch. 13.'
        },
        {
          id: 'compound_eye', label: 'compound eye', region: 'HEAD', system: 'external', layer: 1,
          pos: [1.85, 0.42, 0.56], explodeVec: [0.7, 0.3, 0.9],
          latin: 'Oculus compositus',
          dimensions: '4,500–5,500 ommatidia (Worker); trichromatic UV/Blue/Green (300–650 nm)',
          mechanism: 'Apposition compound eye containing crystalline cones and eight retinula cells per ommatidium. Detects polarized skylight vectors for solar navigation and high-flicker-fusion floral patterns (up to 300 Hz).',
          citation: 'Menzel, R. & Backhaus, W. (1991). Color Vision in Honey Bees. Vision and Visual Dysfunction.'
        },
        {
          id: 'antenna', label: 'antenna', region: 'HEAD', system: 'nervous', layer: 1,
          pos: [2.55, 0.35, 0.45], explodeVec: [1.3, 0.4, 0.6],
          latin: 'Antenna (Scapus, Pedicellus, Flagellum)',
          dimensions: '12 segments in females (scape, pedicel + 10 flagellomeres); ~4.5 mm length',
          mechanism: 'Geniculate (elbowed) sensory appendage housing Johnston’s organ in the pedicel (detecting airspeed and waggle-dance acoustic near-fields) and ~6,000 sensilla placodea/trichodea on the flagellum for olfactory coding.',
          citation: 'Esslen, J. & Kaissling, K. E. (1976). Number and distribution ofantennal sensilla in Apis mellifera.'
        },
        {
          id: 'antenna_cleaner_in_use', label: 'antenna cleaner in use', region: 'HEAD', system: 'external', layer: 1,
          pos: [2.15, -0.55, 0.58], explodeVec: [0.9, -0.6, 0.8],
          latin: 'Strigilis (Fibular-basitarsal notch)',
          dimensions: 'Semi-circular comb notch (~320 µm diameter) clamped by tibial velum',
          mechanism: 'During grooming, the prothoracic leg raises and clamps the antennal flagellum between the toothed basitarsal notch (antenna comb) and the movable tibial spur (velum), scraping pollen and dust in a single draw.',
          citation: 'Schönitzer, K. (1986). Comparative morphology of the antenna cleaner in bees (Apoidea).'
        },
        {
          id: 'clypeus', label: 'clypeus', region: 'HEAD', system: 'exoskeleton', layer: 2,
          pos: [2.18, 0.12, 0.0], explodeVec: [1.1, 0.1, 0],
          latin: 'Clypeus facialis',
          dimensions: 'Convex median facial sclerite (~1.4 mm × 1.1 mm)',
          mechanism: 'Forms the rigid anterior dome of the head capsule bounded by the epistomal sulcus; serves as the internal attachment roof for the powerful cibarial dilator muscles that drive nectar suction.',
          citation: 'Michener, C. D. (2007). The Bees of the World (2nd ed.). Johns Hopkins University Press.'
        },
        {
          id: 'labrum', label: 'labrum', region: 'HEAD', system: 'exoskeleton', layer: 2,
          pos: [2.22, -0.22, 0.0], explodeVec: [1.2, -0.2, 0],
          latin: 'Labrum (Upper Lip)',
          dimensions: 'Transverse hinged flap (~0.85 mm width) below clypeus',
          mechanism: 'Hinged sclerite hanging from the lower margin of the clypeus over the base of the mandibles and proboscis; seals the preoral cavity during nectar pumping.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, pp. 62–66.'
        },
        {
          id: 'mouthparts', label: 'Mouthparts', region: 'HEAD', system: 'external', layer: 1,
          pos: [2.15, -0.78, 0.0], explodeVec: [1.3, -0.9, 0],
          latin: 'Apparatus oralis (Mandibulae + Proboscis)',
          dimensions: 'Retractable 6.0–6.8 mm glossal-maxillary complex',
          mechanism: 'Chewing-lapping composite structure: spoon-shaped mandibles manipulate wax and propolis, while the galeae and labial palps interlock around the hairy glossa to form an airtight suction tube.',
          citation: 'Winston, M. L. (1987). The Biology of the Honey Bee. Harvard University Press.'
        },
        // THORAX
        {
          id: 'wings_hooked', label: 'fore and hindwings hooked together', region: 'THORAX', system: 'external', layer: 1,
          pos: [-0.25, 1.35, 1.45], explodeVec: [-0.3, 1.4, 1.6],
          latin: 'Alae anteriores et posteriores cum hamulis',
          dimensions: 'Forewing ~9.2 mm, Hindwing ~6.5 mm; linked by 18–24 chitinous hamuli hooks',
          mechanism: 'A row of microscopic curved hooks (hamuli) on the leading costal margin of the hindwing latches onto the rolled posterior fold of the forewing in flight, coupling both wings into a single high-lift airfoil.',
          citation: 'ellington, C. P. (1984). The aerodynamics of hovering insect flight. Phil. Trans. R. Soc. Lond. B.'
        },
        // PROTHORACIC LEG
        {
          id: 'eye_brush', label: 'eye brush', region: 'PROTHORACIC LEG', system: 'external', layer: 1,
          pos: [1.35, -0.95, 0.82], explodeVec: [0.9, -0.8, 1.1],
          latin: 'Scopa ocularis (Prothoracic tibial bristles)',
          dimensions: 'Dense array of stiff curved setae along anterior fore-tibia',
          mechanism: 'Sweeps over the convex corneal facets of the compound eye to dislodge adhering pollen grains and particulate debris that would otherwise degrade optical resolution.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, Ch. 5 (The Thorax and Legs).'
        },
        {
          id: 'velum_or_fibula', label: 'velum or fibula', region: 'PROTHORACIC LEG', system: 'external', layer: 1,
          pos: [1.32, -1.18, 0.86], explodeVec: [0.9, -1.1, 1.2],
          latin: 'Fibula / Velum tibiale',
          dimensions: 'Articulated apical tibial spine with translucent membranous lobe (~450 µm)',
          mechanism: 'Closes like a thumb clamp over the semicircular basitarsal notch when the tarsus flexes against the tibia, pressing the antenna tightly against the cleaning comb.',
          citation: 'Dade, H. A. (1962). Anatomy and Dissection of the Honeybee. IBRA.'
        },
        {
          id: 'antenna_comb', label: 'antenna comb', region: 'PROTHORACIC LEG', system: 'external', layer: 1,
          pos: [1.30, -1.35, 0.88], explodeVec: [0.9, -1.3, 1.25],
          latin: 'Pecten antennalis (Basitarsal notch)',
          dimensions: 'Semicircular indentation lined with ~45 uniform chitinous teeth',
          mechanism: 'Precision micro-comb at the proximal base of the prothoracic basitarsus (metatarsus) that strips debris from antennal olfactory pore plates.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 99.'
        },
        {
          id: 'pollen_brush_1', label: 'pollen brush', region: 'PROTHORACIC LEG', system: 'external', layer: 1,
          pos: [1.28, -1.52, 0.90], explodeVec: [0.9, -1.5, 1.3],
          latin: 'Scopa basitarsalis prothoracica',
          dimensions: 'Cylindrical bristle field along prothoracic basitarsus',
          mechanism: 'Gathers pollen grains from the head, mouthparts, and anterior thorax, passing them backward to the mesothoracic legs.',
          citation: 'Hodges, D. (1952). The Pollen Loads of the Honeybee. Bee Research Association.'
        },
        // MESOTHORACIC LEG
        {
          id: 'spur', label: 'spur', region: 'MESOTHORACIC LEG', system: 'external', layer: 1,
          pos: [0.22, -1.25, 1.05], explodeVec: [0.2, -1.2, 1.4],
          latin: 'Calcar mesotibiale',
          dimensions: 'Stout apical spine (~0.65 mm) on distal mesothoracic tibia',
          mechanism: 'Specialized spine at the distal apex of the middle tibia used for cleaning the wings, clearing spiracles, and assisting pollen transfer between legs.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 101.'
        },
        {
          id: 'pollen_brush_2', label: 'pollen brush (II)', region: 'MESOTHORACIC LEG', system: 'external', layer: 1,
          pos: [0.18, -1.48, 1.08], explodeVec: [0.2, -1.5, 1.45],
          latin: 'Scopa basitarsalis mesothoracica',
          dimensions: 'Flattened basitarsal brush (~1.8 mm length)',
          mechanism: 'Combs pollen from the thorax and forelegs and pats the accumulating pollen mass firmly into the corbicula (pollen basket) on the outer hind tibia.',
          citation: 'Winston, M. L. (1987). The Biology of the Honey Bee, Ch. 3.'
        },
        // METATHORACIC LEG
        {
          id: 'coxa', label: 'coxa', region: 'METATHORACIC LEG', system: 'exoskeleton', layer: 2,
          pos: [-0.48, -0.45, 0.55], explodeVec: [-0.3, -0.5, 0.8],
          latin: 'Coxa metathoracica',
          dimensions: 'Basal hip segment (~0.9 mm) articulating with metathoracic pleuron',
          mechanism: 'Provides dicondylic basal pivot anchoring the hind leg to the thorax and housing extrinsic promotor/remotor muscles.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, pp. 93–96.'
        },
        {
          id: 'trochanter', label: 'trochanter', region: 'METATHORACIC LEG', system: 'exoskeleton', layer: 2,
          pos: [-0.62, -0.62, 0.68], explodeVec: [-0.45, -0.7, 0.95],
          latin: 'Trochanter metathoracicus',
          dimensions: 'Short hinge segment (~0.7 mm) between coxa and femur',
          mechanism: 'Articulates vertically with the coxa to elevate and depress the entire distal limb during walking and in-flight pollen packing.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 95.'
        },
        {
          id: 'femur', label: 'femur', region: 'METATHORACIC LEG', system: 'exoskeleton', layer: 2,
          pos: [-0.88, -0.82, 0.85], explodeVec: [-0.7, -0.9, 1.15],
          latin: 'Femur metathoracicum',
          dimensions: 'Robust muscular segment (~2.4 mm length)',
          mechanism: 'Contains the massive tibial extensor and flexor muscles that power the pollen press at the femoro-tibial and tibio-tarsal joints.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 96.'
        },
        {
          id: 'tibia', label: 'tibia', region: 'METATHORACIC LEG', system: 'exoskeleton', layer: 2,
          pos: [-1.18, -1.12, 0.98], explodeVec: [-1.0, -1.2, 1.35],
          latin: 'Tibia metathoracica',
          dimensions: 'Broadened triangular segment (~3.1 mm length × 1.2 mm distal width)',
          mechanism: 'Distally expanded segment modified in worker bees: its concave smooth outer surface forms the corbicula, and its distal margin bears the rake (pecten).',
          citation: 'Michener, C. D. (1999). The corbiculate bees. Univ. Kansas Sci. Bull.'
        },
        {
          id: 'pollen_basket', label: 'pollen basket', region: 'METATHORACIC LEG', system: 'external', layer: 1,
          pos: [-1.22, -1.18, 1.05], explodeVec: [-1.1, -1.25, 1.5],
          latin: 'Corbicula',
          dimensions: 'Polished concave tibial depression fringed by long curved retaining setae; holds ~10–15 mg pollen/propolis per leg',
          mechanism: 'Pollen moistened with regurgitated nectar is squeezed upward from the pollen press onto the smooth corbicular floor, anchored by a single central seta and curved marginal hairs.',
          citation: 'Hodges, D. (1952). The Pollen Loads of the Honeybee.'
        },
        {
          id: 'pecten_and_auricle', label: 'pecten & auricle (pollen packer)', region: 'METATHORACIC LEG', system: 'external', layer: 1,
          pos: [-1.32, -1.36, 1.02], explodeVec: [-1.2, -1.45, 1.45],
          latin: 'Pecten tibialis et Auricula basitarsalis (Pollen Press)',
          dimensions: '15–18 rigid tibial rake spines opposing the papillate auricle shelf',
          mechanism: 'As the basitarsus flexes against the tibia, the pecten rakes pollen from the opposite leg’s pollen combs into the gap, and the wedge-shaped auricle compresses and forces the paste upward into the bottom of the pollen basket.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, pp. 102–105.'
        },
        {
          id: 'metatarsus', label: 'metatarsus', region: 'METATHORACIC LEG', system: 'exoskeleton', layer: 2,
          pos: [-1.42, -1.54, 1.04], explodeVec: [-1.35, -1.65, 1.5],
          latin: 'Basitarsus (Metatarsus) metathoracicus',
          dimensions: 'Enlarged rectangular first tarsomere (~2.1 mm × 1.1 mm)',
          mechanism: 'Broadened proximal tarsal segment carrying the auricle at its upper base and nine transverse rows of pollen combs on its inner surface.',
          citation: 'Dade, H. A. (1962). Anatomy and Dissection of the Honeybee.'
        },
        {
          id: 'pollen_combs_inner', label: 'pollen combs (Inner view)', region: 'METATHORACIC LEG', system: 'external', layer: 1,
          pos: [-1.40, -1.58, 0.88], explodeVec: [-1.35, -1.7, 1.2],
          latin: 'Pectines pollinis interni (Scopa basitarsalis)',
          dimensions: '9–11 transverse rows of stiff golden-amber bristles on medial basitarsus',
          mechanism: 'Scrapes pollen accumulated on the abdominal hairs and middle legs, holding it in tidy rows until combed off by the opposite hind leg’s pecten.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 103.'
        },
        {
          id: 'tarsus', label: 'tarsus', region: 'METATHORACIC LEG', system: 'exoskeleton', layer: 2,
          pos: [-1.52, -1.78, 1.06], explodeVec: [-1.5, -1.9, 1.55],
          latin: 'Tarsomeres II–V (Distitarsus & Mediolarsus)',
          dimensions: 'Four small articulated sub-segments (~1.2 mm combined)',
          mechanism: 'Provides multi-axis compliance allowing the foot to conform to vertical comb cells and floral petals.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 97.'
        },
        {
          id: 'pulvillus_and_claws', label: 'pulvillus & claws', region: 'METATHORACIC LEG', system: 'external', layer: 1,
          pos: [-1.62, -1.94, 1.08], explodeVec: [-1.65, -2.1, 1.6],
          latin: 'Arolium (Pulvillus) et Ungues',
          dimensions: 'Paired cleft tarsal claws + inflatable adhesive median pad (~280 µm)',
          mechanism: 'Bifid claws grip rough bark and wax comb edges; on smooth glass or waxy petals, the claws fold back and hydraulic haemolymph pressure unfurls the wet adhesive arolium (pulvillus).',
          citation: 'Federle, W. et al. (2001). Biomechanics of the movable pretarsal adhesive pad in Apis mellifera. PNAS.'
        },
        // ABDOMEN
        {
          id: 'spiracles', label: 'spiracles', region: 'ABDOMEN', system: 'tracheal', layer: 4,
          pos: [-1.95, 0.05, 0.92], explodeVec: [-1.8, 0.1, 1.35],
          latin: 'Stigmata respiratoria (3 thoracic + 7 abdominal pairs)',
          dimensions: '10 bilateral pairs of valvular apertures (~120–220 µm diameter)',
          mechanism: 'Muscularly controlled respiratory valves lined with hydrophobic filtering bristles to prevent dust/water entry and regulate convective gas exchange and water conservation.',
          citation: 'Bailey, L. (1954). The respiratory currents in the tracheal system of the adult honey-bee. J. Exp. Biol.'
        },
        {
          id: 'wax_plates', label: 'wax plates or scales', region: 'ABDOMEN', system: 'reproductive', layer: 8,
          pos: [-2.05, -0.58, 0.35], explodeVec: [-2.0, -0.95, 0.5],
          latin: 'Specula cerifera (Sternites IV–VII)',
          dimensions: '4 bilateral pairs of polished cuticular mirrors (~1.5 mm × 0.8 mm)',
          mechanism: 'Liquid wax secreted by underlying epidermal wax glands diffuses through nanopores onto the smooth ventral wax mirrors, solidifying into translucent scales (~0.8 mg each) chewed by the mandibles for comb building.',
          citation: 'Hepburn, H. R. (1986). Honeybees and Wax: An Experimental Natural History. Springer.'
        },
        {
          id: 'sting_ext', label: 'sting', region: 'ABDOMEN', system: 'reproductive', layer: 8,
          pos: [-3.55, -0.12, 0.0], explodeVec: [-4.2, -0.2, 0],
          latin: 'Aculeus (Terebra modificata)',
          dimensions: '2.0–2.5 mm chitinous stylet-lancet complex housed in sting chamber',
          mechanism: 'Modified ovipositor concealed within abdominal segment VII; deployed via quadrate and oblong articulating plates to inject apitoxin (melittin, phospholipase A2, apamin).',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, Ch. 9 (The Sting).'
        }
      ]
    },

    internal_anatomy: {
      title: 'Internal Organ Systems & Physiological Flow Atlas',
      subtitle: '22 exact visceral structures across Digestive, Circulatory, Respiratory, Nervous, Muscular & Glandular systems',
      structures: [
        {
          id: 'brain', label: 'brain', region: 'NERVOUS SYSTEM', system: 'nervous', layer: 6,
          pos: [1.95, 0.38, 0.0], explodeVec: [1.1, 0.6, 0],
          latin: 'Cerebrum supraoesophageale',
          dimensions: '~1 mm³ volume (~960,000 neurons); prominent corpora pedunculata (mushroom bodies)',
          mechanism: 'Integrates visual input from large optic lobes and olfactory input from antennal lobes; mushroom bodies govern associative learning, sun-compass navigation, and waggle-dance symbolic decoding.',
          citation: 'Menzel, R. (2012). The honeybee as a model for understanding the basis of cognition. Nat. Rev. Neurosci.'
        },
        {
          id: 'pharyngeal_gland', label: 'pharyngeal gland', region: 'GLANDULAR SYSTEM', system: 'reproductive', layer: 8,
          pos: [1.78, 0.55, 0.25], explodeVec: [1.0, 0.85, 0.4],
          latin: 'Glandula hypopharyngealis',
          dimensions: 'Paired grape-like acinar chains (~12–15 mm uncoiled length) coiled in head capsule',
          mechanism: 'Hypertrophied in nurse workers (days 5–15) to synthesize protein-rich royal jelly and worker brood food; transitions in foragers to secreting invertase, glucose oxidase, and α-amylase for ripening nectar into honey.',
          citation: 'Deseyn, J. & Billen, J. (2005). Age-dependent morphology and ultrastructure of the hypopharyngeal gland in Apis mellifera. Apidologie.'
        },
        {
          id: 'pharynx', label: 'pharynx', region: 'DIGESTIVE SYSTEM', system: 'digestive', layer: 5,
          pos: [1.98, 0.05, 0.0], explodeVec: [1.2, 0.0, 0],
          latin: 'Pharynx et Cibarium (Sucking Pump)',
          dimensions: 'Muscular anterior foregut chamber (~1.1 mm length)',
          mechanism: 'Acts as a powerful muscular suction pump driven by dilator muscles anchored to the clypeus and frons, drawing liquid nectar up the proboscis and propelling it into the oesophagus.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, pp. 168–172.'
        },
        {
          id: 'oesophagus', label: 'oesophagus', region: 'DIGESTIVE SYSTEM', system: 'digestive', layer: 5,
          pos: [0.65, 0.02, 0.0], explodeVec: [0.3, 0.1, 0],
          latin: 'Oesophagus',
          dimensions: 'Slender muscular tube (~4.5 mm long × 0.25 mm diameter)',
          mechanism: 'Conveys ingested nectar, water, and pollen by bidirectional peristalsis from the head capsule through the cervix, thorax, and narrow petiole into the abdominal honey sac.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 173.'
        },
        {
          id: 'salivary_gland', label: 'salivary gland', region: 'GLANDULAR SYSTEM', system: 'reproductive', layer: 8,
          pos: [1.15, -0.25, 0.22], explodeVec: [0.5, -0.45, 0.45],
          latin: 'Glandulae labiales (Cephalic & Thoracic Salivary Glands)',
          dimensions: 'Paired postcerebral cephalic lobes + thoracic tubular lobes uniting in common salivary duct',
          mechanism: 'Secretes watery enzymatic saliva and lipidic lubricants delivered to the salivarium at the base of the labium to dissolve crystallized sugars, soften wax, and clean the glossa.',
          citation: 'Simpson, J. (1960). The functions of the salivary glands of Apis mellifera. J. Insect Physiol.'
        },
        {
          id: 'thoracic_ganglia', label: 'thoracic ganglia', region: 'NERVOUS SYSTEM', system: 'nervous', layer: 6,
          pos: [0.35, -0.42, 0.0], explodeVec: [0.2, -0.75, 0],
          latin: 'Ganglia thoracica (Prothoracic + Fused Meso/Metathoracic-Abdominal I)',
          dimensions: '2 major ventral thoracic ganglionic masses (~0.6 mm & 1.1 mm)',
          mechanism: 'Motor coordination centers controlling walking kinematics of the three leg pairs, wing articulation steering muscles, and thoracic thermogenesis.',
          citation: 'Dade, H. A. (1962). Anatomy and Dissection of the Honeybee, Plate 11.'
        },
        {
          id: 'anterior_blood_vessel', label: 'anterior blood vessel', region: 'CIRCULATORY SYSTEM', system: 'circulatory', layer: 7,
          pos: [0.75, 0.28, 0.0], explodeVec: [0.4, 0.55, 0],
          latin: 'Aorta dorsalis',
          dimensions: 'Slender non-valvular vessel (~0.18 mm diameter) with 18 convolute loops in petiole',
          mechanism: 'Conducts haemolymph forward from the abdominal heart through the narrow petiole (where tight convolutions act as a counter-current heat exchanger) into the thorax and brain.',
          citation: 'Heinrich, B. (1980). Mechanisms of body-temperature regulation in honeybees, Apis mellifera. J. Exp. Biol.'
        },
        {
          id: 'muscles', label: 'muscles', region: 'MUSCULAR SYSTEM', system: 'muscular', layer: 3,
          pos: [0.38, 0.45, 0.35], explodeVec: [0.2, 0.85, 0.65],
          latin: 'Musculi indirecti alarum (Dorsoventral & Dorsal Longitudinal)',
          dimensions: 'Comprise ~25–30% of total body mass; myofibrillar stretch-activated fibers',
          mechanism: 'Contract asynchronously at 220–250 Hz without 1:1 neural spikes, rhythmically compressing the thoracic box vertically and longitudinally to drive wing upstrokes and downstrokes, and shivering during winter clustering to maintain 35 °C.',
          citation: 'Josephson, R. K. et al. (2000). Asynchronous muscle: a primer. J. Exp. Biol.'
        },
        {
          id: 'air_sac', label: 'air sac', region: 'RESPIRATORY SYSTEM', system: 'tracheal', layer: 4,
          pos: [-1.45, 0.32, 0.52], explodeVec: [-1.2, 0.65, 0.85],
          latin: 'Sacci aerei tracheales',
          dimensions: 'Paired thin-walled collapsible reservoirs lacking spiral taenidia',
          mechanism: 'Expand and collapse like bellows during telescopic abdominal pumping, driving high-volume tidal ventilation of oxygen directly to flight muscles and nervous tissue while reducing specific gravity in flight.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, Ch. 11 (The Respiratory System).'
        },
        {
          id: 'ostia', label: 'ostia', region: 'CIRCULATORY SYSTEM', system: 'circulatory', layer: 7,
          pos: [-1.95, 0.68, 0.0], explodeVec: [-1.8, 1.05, 0],
          latin: 'Ostia cardiaca (5 bilateral pairs)',
          dimensions: '5 pairs of slit-like one-way inflow valves along abdominal chambers III–VII',
          mechanism: 'Open during cardiac diastole to draw haemolymph from the dorsal pericardial sinus into the heart lumen, then snap shut during systole to prevent backflow.',
          citation: 'Dade, H. A. (1962). Anatomy and Dissection of the Honeybee, Ch. 6.'
        },
        {
          id: 'haemocoel', label: 'haemocoel', region: 'CIRCULATORY SYSTEM', system: 'circulatory', layer: 7,
          pos: [-2.15, -0.18, 0.42], explodeVec: [-2.0, -0.35, 0.75],
          latin: 'Haemocoeloma (Dorsal, Perivisceral & Ventral Sinuses)',
          dimensions: 'Open body cavity divided by dorsal and ventral fibromuscular diaphragms',
          mechanism: 'Bathes all visceral organs directly in colourless haemolymph rich in trehalose, amino acids, vitellogenin, and immune haemocytes; flow is propelled posteriorly by the undulating ventral diaphragm.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, pp. 210–222.'
        },
        {
          id: 'heart', label: 'heart', region: 'CIRCULATORY SYSTEM', system: 'circulatory', layer: 7,
          pos: [-2.25, 0.65, 0.0], explodeVec: [-2.1, 1.0, 0],
          latin: 'Cor dorsale (5-chambered abdominal dorsal vessel)',
          dimensions: 'Muscular dorsal tube spanning abdominal tergites III–VI (~4.2 mm length)',
          mechanism: 'Generates posterior-to-anterior peristaltic waves supported by fan-shaped alary muscles, pumping haemolymph forward into the thoracic aorta.',
          citation: 'Glenn, G. S. et al. (2010). Mechanics of the honeybee dorsal vessel. J. Insect Physiol.'
        },
        {
          id: 'honey_sac', label: 'honey sac', region: 'DIGESTIVE SYSTEM', system: 'digestive', layer: 5,
          pos: [-1.35, 0.08, 0.0], explodeVec: [-1.1, 0.15, 0],
          latin: 'Ingluvies (Crop / Social Stomach)',
          dimensions: 'Distensible cuticular-lined sac; expands from 15 µL to 55–70 µL capacity (~80% of bee body weight)',
          mechanism: 'Stores foraged nectar or water for transport back to the hive without digestion; cuticular intima prevents osmotic water loss and enables regurgitation via trophallaxis.',
          citation: 'Brosch, U. & Schneider, L. (1985). Fine structure and innervation of the honey stomach of Apis mellifera.'
        },
        {
          id: 'honey_stopper', label: 'honey stopper', region: 'DIGESTIVE SYSTEM', system: 'digestive', layer: 5,
          pos: [-1.72, 0.04, 0.0], explodeVec: [-1.5, 0.08, 0],
          latin: 'Proventriculus',
          dimensions: 'Cruciform 4-lipped muscular valve (~0.65 mm diameter) with pectinate filtering spines',
          mechanism: 'Selectively snaps up and filters suspended pollen grains and fungal spores (down to 1 µm) out of the nectar stored in the honey sac and passes them into the stomach for digestion, while retaining pure nectar in the crop.',
          citation: 'Bailey, L. (1952). The action of the proventriculus of the worker honeybee, Apis mellifera L. J. Exp. Biol.'
        },
        {
          id: 'stomach', label: 'stomach', region: 'DIGESTIVE SYSTEM', system: 'digestive', layer: 5,
          pos: [-2.22, -0.05, 0.0], explodeVec: [-2.1, -0.1, 0],
          latin: 'Ventriculus (Midgut)',
          dimensions: 'Annulated U-shaped muscular tube (~5.5 mm long); lined by peritrophic membrane',
          mechanism: 'Primary site of enzymatic digestion (proteases, lipases, amylases) and nutrient absorption across microvillar epithelium; delaminating peritrophic envelopes protect the gut wall from abrasive pollen exines.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, pp. 176–184.'
        },
        {
          id: 'malpighian_tubules', label: 'Malpighian tubules', region: 'DIGESTIVE SYSTEM', system: 'digestive', layer: 5,
          pos: [-2.58, -0.12, 0.28], explodeVec: [-2.5, -0.25, 0.55],
          latin: 'Vasa Malpighiana',
          dimensions: '~100 slender blind-ending tubules (2–4 mm long × 40 µm wide) opening at pyloric valve',
          mechanism: 'Renal-analogous excretory tubules floating in the abdominal haemocoel; actively extract uric acid, nitrogenous wastes, and xenobiotics from haemolymph and empty into the anterior hindgut.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, pp. 186–188.'
        },
        {
          id: 'intestine', label: 'intestine', region: 'DIGESTIVE SYSTEM', system: 'digestive', layer: 5,
          pos: [-2.78, -0.18, 0.0], explodeVec: [-2.7, -0.35, 0],
          latin: 'Ileum (Small Intestine / Anterior Hindgut)',
          dimensions: 'Looped tube (~3.2 mm long) with 6 longitudinal cuticular folds',
          mechanism: 'Conducts undigested pollen husks and Malpighian excretory fluid from the ventriculus toward the rectum while initiating water and ion reabsorption.',
          citation: 'Dade, H. A. (1962). Anatomy and Dissection of the Honeybee, p. 44.'
        },
        {
          id: 'rectal_gland', label: 'rectal gland', region: 'DIGESTIVE SYSTEM', system: 'digestive', layer: 5,
          pos: [-3.05, 0.14, 0.18], explodeVec: [-3.0, 0.25, 0.35],
          latin: 'Papillae rectales (6 longitudinal rectal pads)',
          dimensions: '6 elongated columnar epithelial pads (~1.1 mm × 0.2 mm) in anterior rectum',
          mechanism: 'Reabsorb water, potassium, and sodium ions from rectal contents against steep osmotic gradients, and secrete catalase enzymes that prevent fermentation during winter confinement.',
          citation: 'Wigglesworth, V. B. (1932). On the function of the rectal glands in insects. Q. J. Microsc. Sci.'
        },
        {
          id: 'rectum', label: 'rectum', region: 'DIGESTIVE SYSTEM', system: 'digestive', layer: 5,
          pos: [-3.18, 0.05, 0.0], explodeVec: [-3.2, 0.08, 0],
          latin: 'Rectum (Ampulla recti)',
          dimensions: 'Highly distensible posterior hindgut sac; expands to fill >50% of abdomen in overwintering bees',
          mechanism: 'Stores fecal matter inside the hive to maintain nest hygiene until warm weather permits cleansing flights outside the colony.',
          citation: 'Winston, M. L. (1987). The Biology of the Honey Bee, p. 41.'
        },
        {
          id: 'wax_gland', label: 'wax gland', region: 'GLANDULAR SYSTEM', system: 'reproductive', layer: 8,
          pos: [-2.12, -0.55, 0.25], explodeVec: [-2.0, -0.95, 0.45],
          latin: 'Glandulae ceriferae',
          dimensions: '4 bilateral pairs of columnar epidermal pads underlying sternites IV–VII',
          mechanism: 'Peak activity in 12–18 day-old worker bees; converts dietary sugars into complex wax esters and hydrocarbons (C25–C33) extruded onto the ventral wax mirrors at 33–36 °C.',
          citation: 'Hepburn, H. R. et al. (1991). Development of the epidermal wax glands in Apis mellifera. Apidologie.'
        },
        {
          id: 'ventral_nerve_cord', label: 'ventral nerve cord', region: 'NERVOUS SYSTEM', system: 'nervous', layer: 6,
          pos: [-1.85, -0.45, 0.0], explodeVec: [-1.7, -0.8, 0],
          latin: 'Catena nervosa ventralis (5 abdominal ganglia)',
          dimensions: 'Paired longitudinal connectives linking 2 thoracic and 5 abdominal ganglia',
          mechanism: 'Transmits descending motor commands and ascending mechanosensory feedback; abdominal ganglia autonomously regulate respiratory pumping, gut peristalsis, and sting reflex arcs even after decapitation.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, Ch. 12.'
        },
        {
          id: 'sting', label: 'sting', region: 'REPRODUCTIVE & VENOM', system: 'reproductive', layer: 8,
          pos: [-3.52, -0.12, 0.0], explodeVec: [-3.9, -0.25, 0],
          latin: 'Apparatus vulnerans (Aculeus + Glandulae veneni)',
          dimensions: '2.2 mm stylet-lancet shaft + venom sac (~0.15 mg venom capacity)',
          mechanism: 'Reciprocating barbed lancets saw into dermis while the poison bulb pumps acidic venom (melittin, phospholipase A2) and Dufour’s alkaline secretion down the central venom canal.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, Ch. 9.'
        }
      ]
    },

    mouthparts: {
      title: 'Chewing-Lapping Mouthparts Module',
      subtitle: 'High-magnification 3D reconstruction of the 15 maxillary, labial, and mandibular structures',
      structures: [
        {
          id: 'mp_labrum', label: 'labrum', region: 'UPPER LIP & MANDIBLES', system: 'exoskeleton',
          pos: [0.0, 2.35, 0.42], explodeVec: [0.0, 0.9, 0.7],
          latin: 'Labrum',
          dimensions: '0.85 mm × 0.28 mm transverse sclerite',
          mechanism: 'Hinged upper lip suspended from the lower clypeal margin; shields the epipharynx and base of the mandibles and seals the preoral food canal.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 63.'
        },
        {
          id: 'mp_mandible', label: 'mandible', region: 'UPPER LIP & MANDIBLES', system: 'external',
          pos: [1.05, 1.85, 0.45], explodeVec: [1.3, 0.6, 0.65],
          latin: 'Mandibula',
          dimensions: '1.35 mm hourglass-shaped jaw; smooth spoon-like concave edge in workers (toothed in queens/drones)',
          mechanism: 'Dicondylic jaws driven by massive cranial adductor muscles; knead beeswax to 0.07 mm comb wall precision, collect propolis, groom nestmates, and bite varroa mites.',
          citation: 'Michener, C. D. (2007). The Bees of the World, pp. 42–45.'
        },
        {
          id: 'mp_cardo', label: 'cardo', region: 'MAXILLA (PAIRED)', system: 'exoskeleton',
          pos: [0.82, 1.55, -0.25], explodeVec: [1.1, 0.7, -0.5],
          latin: 'Cardo maxillaris',
          dimensions: '0.95 mm rod-like basal hinge rod',
          mechanism: 'Basal rod of the maxilla articulating with the hypostomal cranial wall; swings the entire maxillo-labial complex forward from its resting Z-fold beneath the head.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 67.'
        },
        {
          id: 'mp_submentum', label: 'submentum', region: 'LABIUM (MEDIAN)', system: 'exoskeleton',
          pos: [0.0, 1.42, -0.32], explodeVec: [0.0, 0.65, -0.75],
          latin: 'Submentum (Lorum)',
          dimensions: 'V-shaped transverse sclerite (~0.75 mm span)',
          mechanism: 'Connects the median labium to the distal tips of the paired maxillary cardines, synchronizing extension and retraction of both maxillae and the labium as a unified proboscis.',
          citation: 'Plant, J. D. & Paulus, H. F. (1987). Comparative morphology of the postmentum of bees. Zool. Scr.'
        },
        {
          id: 'mp_mentum', label: 'mentum', region: 'LABIUM (MEDIAN)', system: 'exoskeleton',
          pos: [0.0, 1.05, -0.22], explodeVec: [0.0, 0.35, -0.65],
          latin: 'Mentum',
          dimensions: 'Triangular sclerotized plate (~0.55 mm length)',
          mechanism: 'Links the V-shaped submentum (lorum) to the elongated prementum, acting as the central pivot hinge during Z-folding of the proboscis.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 69.'
        },
        {
          id: 'mp_stipes', label: 'stipes', region: 'MAXILLA (PAIRED)', system: 'exoskeleton',
          pos: [0.76, 0.55, -0.05], explodeVec: [1.15, 0.1, -0.2],
          latin: 'Stipes maxillaris',
          dimensions: '1.65 mm boat-shaped sclerotized shaft',
          mechanism: 'Principal body sclerite of each maxilla flanking the prementum; houses intrinsic muscles that adduct the galea to seal the suction tube.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 68.'
        },
        {
          id: 'mp_prementum', label: 'prementum', region: 'LABIUM (MEDIAN)', system: 'exoskeleton',
          pos: [0.0, 0.35, -0.12], explodeVec: [0.0, 0.0, -0.55],
          latin: 'Prementum',
          dimensions: '1.85 mm pear-shaped sclerotized median trough',
          mechanism: 'Houses the powerful retractor muscles of the glossa and paraglossae and the salivary syringe (salivarium) that injects enzymatic saliva onto the food.',
          citation: 'Dade, H. A. (1962). Anatomy and Dissection of the Honeybee, Plate 4.'
        },
        {
          id: 'mp_lacinia', label: 'lacinia', region: 'MAXILLA (PAIRED)', system: 'external',
          pos: [0.48, 0.15, 0.18], explodeVec: [0.85, 0.05, 0.45],
          latin: 'Lacinia maxillaris',
          dimensions: 'Membranous inner cushion (~0.45 mm) at base of galea',
          mechanism: 'Soft setose lobe on the inner mesal face of the maxilla that presses against its opposite partner to form an airtight proximal gasket at the entrance to the cibarial pump.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 68.'
        },
        {
          id: 'mp_maxillary_palp', label: 'maxillary palp', region: 'MAXILLA (PAIRED)', system: 'nervous',
          pos: [0.92, -0.05, 0.15], explodeVec: [1.45, -0.05, 0.35],
          latin: 'Palpus maxillaris',
          dimensions: 'Vestigial 2-segmented peg (~0.22 mm length)',
          mechanism: 'Reduced peg-like sensory appendage at the distal outer angle of the stipes bearing contact chemoreceptors and mechanoreceptors.',
          citation: 'Michener, C. D. (2007). The Bees of the World, p. 46.'
        },
        {
          id: 'mp_palpifer', label: 'palpifer', region: 'LABIUM (MEDIAN)', system: 'exoskeleton',
          pos: [0.35, -0.35, -0.10], explodeVec: [0.65, -0.3, -0.35],
          latin: 'Palpiger / Palpifer labialis',
          dimensions: 'Flexible lateral lobe (~0.38 mm) at distal prementum',
          mechanism: 'Supports and articulates the elongated 4-segmented labial palp at the distal lateral corner of the prementum.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 71.'
        },
        {
          id: 'mp_paraglossa', label: 'paraglossa', region: 'LABIUM (MEDIAN)', system: 'external',
          pos: [0.22, -0.58, 0.05], explodeVec: [0.48, -0.5, 0.25],
          latin: 'Paraglossa',
          dimensions: '0.52 mm paired concave membranous lobes embracing glossal base',
          mechanism: 'Channels saliva emerging from the salivarium on the dorsal face of the labium around the base of the tongue into the ventral glossal canal.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 72.'
        },
        {
          id: 'mp_galea', label: 'galea', region: 'MAXILLA (PAIRED)', system: 'external',
          pos: [0.52, -1.15, 0.22], explodeVec: [1.15, -0.8, 0.55],
          latin: 'Galea maxillaris',
          dimensions: '3.2 mm tapering concave chitinous blade with pectinate marginal hairs',
          mechanism: 'Interlocks dorsally with its opposite partner and ventrolaterally with the labial palps to form the rigid outer walls of the temporary nectar suction tube.',
          citation: 'Krenn, H. W. et al. (2005). Mouthparts of flower-visiting insects. Arthropod Struct. Dev.'
        },
        {
          id: 'mp_labial_palp', label: 'labial palp', region: 'LABIUM (MEDIAN)', system: 'external',
          pos: [0.38, -1.35, -0.18], explodeVec: [0.85, -1.0, -0.45],
          latin: 'Palpus labialis (4-segmented)',
          dimensions: '2.9 mm; two long flattened basal segments + two short apical sensory segments',
          mechanism: 'Two blade-like proximal segments close beneath the glossa to seal the floor of the proboscis tube; two distal segments carry gustatory sensilla to assay nectar sucrose concentration.',
          citation: 'Whitehead, A. T. & Larsen, J. R. (1976). Ultrastructure of the contact chemoreceptors of Apis mellifera.'
        },
        {
          id: 'mp_glossae', label: 'glossae (ligula)', region: 'LABIUM (MEDIAN)', system: 'external',
          pos: [0.0, -1.55, 0.0], explodeVec: [0.0, -1.2, 0.0],
          latin: 'Glossa (Fused Ligula)',
          dimensions: '3.5–4.2 mm flexible annulated tongue ringed with ~120 whorls of erectile hairs',
          mechanism: 'Protracts and retracts at 4–6 Hz; when immersed in nectar, haemolymph injection erects thousands of micro-hairs simultaneously (0–70° angle), trapping viscous nectar via capillary action.',
          citation: 'Yang, S. et al. (2014). Haemo-hydraulic erection of glossal hairs in honeybees. J. Exp. Biol.'
        },
        {
          id: 'mp_labellum', label: 'labellum (honey spoon)', region: 'LABIUM (MEDIAN)', system: 'external',
          pos: [0.0, -2.55, 0.0], explodeVec: [0.0, -2.0, 0.0],
          latin: 'Flabellum / Labellum',
          dimensions: '0.18 mm spoon-shaped fringed lobe at extreme tip of glossa',
          mechanism: 'Scavenges thin liquid films from shallow floral nectaries and directs nectar into the ventral glossal groove.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 73.'
        }
      ]
    },

    sting_apparatus: {
      title: 'Sting Apparatus Mechanistic Reconstruction',
      subtitle: 'Biomechanical 3D model of the venom glands, articulating plates, stylet bulb, and reciprocating barbed lancets',
      structures: [
        {
          id: 'st_acid_glands', label: 'acid glands', region: 'VENOM GLANDS', system: 'reproductive',
          pos: [1.65, 1.35, 0.45], explodeVec: [1.2, 1.1, 0.65],
          latin: 'Glandula veneni (Filiform Venom Gland)',
          dimensions: 'Bifurcated secretory tubule (~15–20 mm total length) emptying into poison sac',
          mechanism: 'Synthesizes the complex acidic apitoxin cocktail: melittin (50% dry weight, cytolytic peptide), phospholipase A2 (12%), apamin (neurotoxin), hyaluronidase, and alarm pheromones (isopentyl acetate).',
          citation: 'Bridges, A. R. & Owen, M. D. (1984). The morphology of the honey bee venom gland. J. Morphol.'
        },
        {
          id: 'st_poison_sac', label: 'poison sac', region: 'VENOM GLANDS', system: 'reproductive',
          pos: [1.15, 0.72, 0.0], explodeVec: [0.8, 0.65, 0.0],
          latin: 'Saccus veneni (Venom Reservoir)',
          dimensions: 'Ovoid chitin-lined sac (~1.4 mm × 0.8 mm; holds 0.10–0.15 mg liquid venom)',
          mechanism: 'Stores synthesized apitoxin and feeds it via a slender neck duct directly into the dilated bulb of the sting stylet.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, pp. 162–165.'
        },
        {
          id: 'st_alkaline_gland', label: 'alkaline gland', region: 'VENOM GLANDS', system: 'reproductive',
          pos: [0.95, -0.45, 0.35], explodeVec: [0.7, -0.65, 0.55],
          latin: 'Glandula Dufouri (Dufour’s / Alkaline Gland)',
          dimensions: 'Blind cylindrical pouch (~1.2 mm × 0.25 mm) ventral to poison duct',
          mechanism: 'Secretes long-chain hydrocarbons and waxy esters that lubricate the sliding tongue-and-groove rails of the lancets and mark eggs laid by the queen.',
          citation: 'Katzav-Gozansky, T. et al. (1997). Dufour’s gland secretion of the queen honeybee. Naturwissenschaften.'
        },
        {
          id: 'st_basal_arm', label: 'basal arm', region: 'MOTOR LEVER SYSTEM', system: 'exoskeleton',
          pos: [0.55, 0.25, 0.38], explodeVec: [0.4, 0.35, 0.65],
          latin: 'Rami valvularum (Curved Basal Arms of Stylet & Lancets)',
          dimensions: 'Paired arched chitinous arcs (~1.1 mm radius of curvature)',
          mechanism: 'Elastic curved extensions of the stylet and lancets that bend around the base of the bulb; convert the angular rocking of the triangular plates into linear forward-and-backward strokes of the lancets.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, p. 156.'
        },
        {
          id: 'st_plates', label: 'plates to move barbs', region: 'MOTOR LEVER SYSTEM', system: 'exoskeleton',
          pos: [0.45, 0.65, 0.58], explodeVec: [0.35, 0.85, 0.95],
          latin: 'Laminae quadratae, oblongae et triangulares',
          dimensions: '3 paired articulated sclerites (Quadrate, Oblong, Triangular plates) Driven by muscles 196–199',
          mechanism: 'Four-bar biomechanical linkage: rhythmic contraction of protractor/retractor muscles rocks the quadrate plate relative to the oblong plate, pivoting the triangular plate to drive the left and right lancets in alternating opposition.',
          citation: 'Dade, H. A. (1962). Anatomy and Dissection of the Honeybee, Plate 14.'
        },
        {
          id: 'st_palpus', label: 'palpus of sting', region: 'SENSORY SHEATH', system: 'nervous',
          pos: [-0.85, 0.18, 0.42], explodeVec: [-0.6, 0.3, 0.85],
          latin: 'Gonostyli (Sting Sheath Palpi)',
          dimensions: 'Paired finger-like tactile lobes (~1.3 mm length) flanking the shaft',
          mechanism: 'Encloses the sting shaft at rest inside the sting chamber; densely innervated with mechanoreceptive hairs that palpate the target surface to locate penetrable skin before firing the lancets.',
          citation: 'Ogawa, H. et al. (1995). Sensory innervation of the sting palpi in Apis mellifera. J. Comp. Physiol. A.'
        },
        {
          id: 'st_sheath', label: 'sheath to hold lancets', region: 'PENETRATION SHAFT', system: 'exoskeleton',
          pos: [-0.55, 0.08, 0.0], explodeVec: [-0.3, 0.25, 0.0],
          latin: 'Stylet & Bulb (Valvula secunda fusa)',
          dimensions: '2.1 mm rigid dorsal rod with dilated basal bulb and twin ventral dovetail guide rails',
          mechanism: 'Forms the rigid dorsal spine of the sting shaft; two T-shaped ventral ridges (rhachis) interlock with grooves (aulax) on the lancets, holding them parallel while enclosing the central venom canal.',
          citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, pp. 154–158.'
        },
        {
          id: 'st_lancet', label: 'lancet', region: 'PENETRATION SHAFT', system: 'exoskeleton',
          pos: [-1.25, -0.08, 0.14], explodeVec: [-1.1, -0.25, 0.35],
          latin: 'Lancettae (Valvulae primae)',
          dimensions: 'Paired slender hollow rods (~2.2 mm × 0.06 mm) with umbrella-like valve flaps inside the bulb',
          mechanism: 'Slide reciprocally along the stylet’s ventral dovetail tracks; each lancet bears an internal valve umbrella that pushes liquid venom forward through the venom canal with every forward stroke.',
          citation: 'Zhao, Z. et al. (2015). Biomechanics of the honey bee sting penetration mechanism. J. Bionic Eng.'
        },
        {
          id: 'st_barbs', label: 'barbs', region: 'PENETRATION SHAFT', system: 'external',
          pos: [-2.15, -0.10, 0.14], explodeVec: [-2.1, -0.35, 0.45],
          latin: 'Uncini lancettarum (Recurved Apical Barbs)',
          dimensions: '10–11 backward-pointing sawtooth barbs (~15–28 µm height) at distal lancet tip',
          mechanism: 'As Lancet A anchors its recurved barbs in fibrous tissue, it serves as a stationary fulcrum pulling the stylet and Lancet B deeper on the next stroke—enabling self-burrowing penetration even after sting autotomy.',
          citation: 'Ling, J. et al. (2016). Micro-CT and mechanical analysis of honeybee sting barbs. Acta Biomater.'
        }
      ]
    }
  },

  // Personal Intelligence & Architectural Extension Advisory
  architectureGuide: [
    {
      area: '1. 3D Asset Pipeline (Procedural Parametric → Micro-CT GLTF/Draco)',
      current: 'High-precision procedural parametric Three.js mesh assembly with hierarchical rigs, cuticle shaders, and zero external binary dependencies (100% self-contained & offline-safe).',
      upgrade: 'Drop micro-CT segmented `.glb` meshes (e.g., Smithsonian or MorphoSource Apis mellifera datasets) into `assets/models/` and swap `BeeGeometryBuilder` nodes via `GLTFLoader` + `DRACOLoader` while keeping the exact node IDs and `userData.structureId` hooks intact.'
    },
    {
      area: '2. Shader & Volume Rendering Pipeline',
      current: 'Custom Fresnel X-Ray material modulation, emissive physiological pulse shaders, and WebGL `clippingPlanes` for live X/Y/Z anatomical cross-sections.',
      upgrade: 'Extend with a 3D volumetric raymarching shader (`THREE.Data3DTexture`) to visualize real micro-CT voxel density gradients inside the head capsule (mushroom bodies & optic neuropils) and thoracic indirect muscles.'
    },
    {
      area: '3. Biomechanical Kinematics & Physics',
      current: '7 coupled real-time trigonometric & kinematic procedural loops (figure-8 wing stroke with hamuli coupling, Z-fold proboscis extension, strigilis antenna grooming, corbicular packing, and alternating lancet reciprocation).',
      upgrade: 'Connect wingbeat kinematics to a quasi-steady blade-element aerodynamic solver to plot live lift/torque vectors and leading-edge vortex (LEV) ribbons as wingbeat frequency (180–250 Hz) and stroke amplitude are varied.'
    },
    {
      area: '4. Comparative & Pathological Datasets',
      current: 'Interactive Worker, Queen, and Drone caste comparison morphing head/eye/abdomen allometry, corbicula presence, and biometric telemetry.',
      upgrade: 'Add a "Pathology & Colony Health" overlay mode (e.g., Varroa destructor attachment on ventral abdominal sternites, Acarapis woodi tracheal mites in prothoracic tracheae, and Nosema ceranae midgut lesions).'
    }
  ]
};


// ULTRA-REALISM CINEMATIC DIRECTIVE EXTENSIONS: 9 Dissection Modes, 10-Stage Presentation Flythrough & Additional Structures
window.ATLAS_DATA.dissectionModes9 = [
  { id: 1, key: 'ext_view', name: '1. External View', layers: [1,2,3,4,5,6,7,8], xray: false, sys: 'ALL', desc: 'Complete external chitinous cuticle, 3D plumose setae coat, and attached pollen grains.' },
  { id: 2, key: 'transparency', name: '2. Transparency (X-Ray)', layers: [1,2,3,4,5,6,7,8], xray: true, sys: 'ALL', desc: 'Medical-grade Fresnel depth-fading exoskeleton revealing all internal organ systems in situ.' },
  { id: 3, key: 'cuticle', name: '3. Cuticle (Exoskeleton)', layers: [2], xray: false, sys: 'exoskeleton', desc: 'Isolated chitinous sclerites (head capsule, thoracic nota/pleura, abdominal tergites/sternites) stripped of setae.' },
  { id: 4, key: 'musculature', name: '4. Musculature', layers: [2,3], xray: true, sys: 'muscular', desc: 'Asynchronous indirect flight muscles (dorsoventral & dorsal longitudinal bundles) inside translucent thorax.' },
  { id: 5, key: 'respiratory', name: '5. Respiratory', layers: [2,4], xray: true, sys: 'tracheal', desc: 'Spiracles, branching tracheal trunks, microscopic tracheoles, and compressible air sacs.' },
  { id: 6, key: 'digestive', name: '6. Digestive', layers: [2,5], xray: true, sys: 'digestive', desc: 'Pharynx, oesophagus, crop (honey stomach), proventriculus, midgut (ventriculus), hindgut (ileum), and rectum.' },
  { id: 7, key: 'nervous', name: '7. Nervous', layers: [2,6], xray: true, sys: 'nervous', desc: 'Supraoesophageal brain, mushroom bodies, optic lobes, thoracic ganglia, and ventral nerve cord.' },
  { id: 8, key: 'circulatory', name: '8. Circulatory', layers: [2,7], xray: true, sys: 'circulatory', desc: '5-chambered dorsal heart, ostia inflow valves, convoluted petiolar aorta, and open haemocoel.' },
  { id: 9, key: 'reproductive', name: '9. Reproductive', layers: [2,8], xray: true, sys: 'reproductive', desc: 'Caste-specific reproductive system (Worker vestigial ovarioles, Queen ovaries/spermatheca, Drone endophallus) & sting.' }
];

window.ATLAS_DATA.presentationSequence10 = [
  {
    step: 1, title: '1. Full Bee Specimen', lens: '100mm Macro f/4.0', module: 'full_atlas',
    camPos: [0.6, 1.6, 5.8], target: [-0.2, 0.0, 0.0], explode: 0.0, xray: false, dof: false, structId: 'pollen_basket',
    caption: 'Apis mellifera specimen under 3-point museum HDRI illumination: chitinous exoskeleton, 3D plumose setae, and coupled wings.'
  },
  {
    step: 2, title: '2. Head Capsule & Sensory Array', lens: '140mm Macro f/2.8', module: 'full_atlas',
    camPos: [3.2, 0.65, 2.1], target: [1.9, 0.2, 0.0], explode: 0.0, xray: false, dof: true, structId: 'clypeus',
    caption: 'Hypognathous head capsule housing three dorsal ocelli, geniculate 12-segmented antennae, and facial plumose hairs.'
  },
  {
    step: 3, title: '3. Chewing-Lapping Mouthparts', lens: '180mm Macro f/2.8', module: 'mouthparts',
    camPos: [0.0, 0.1, 4.5], target: [0.0, -0.4, 0.0], explode: 0.0, xray: false, dof: true, structId: 'mp_glossae',
    caption: 'High-magnification view of the 15-part proboscis complex: mandibles, galeae, labial palps, and annulated glossa with labellum.'
  },
  {
    step: 4, title: '4. Compound Eyes & Hexagonal Ommatidia', lens: '180mm Macro f/2.8', module: 'full_atlas',
    camPos: [2.5, 0.55, 1.75], target: [1.85, 0.35, 0.52], explode: 0.0, xray: false, dof: true, structId: 'compound_eye',
    caption: 'Thousands of convex hexagonal ommatidia with corneal clearcoat specularity, subsurface scattering, and active gaze tracking.'
  },
  {
    step: 5, title: '5. Forewing, Hindwing & Hamuli', lens: '135mm Macro f/3.5', module: 'full_atlas',
    camPos: [-0.8, 2.2, 2.8], target: [-0.3, 1.1, 0.9], explode: 0.0, xray: false, dof: true, structId: 'wings_hooked',
    caption: 'Refractive iridescent wing membranes supported by tubular chitin veins and coupled in flight by 20 costal hamuli hooks.'
  },
  {
    step: 6, title: '6. Specialized Legs, Corbicula & Pollen Grains', lens: '160mm Macro f/2.8', module: 'full_atlas',
    camPos: [-1.1, -1.1, 2.5], target: [-1.15, -1.15, 0.85], explode: 0.0, xray: false, dof: true, structId: 'pollen_basket',
    caption: 'Microscopic claws, inflatable pulvillus, basitarsal pollen combs, and individual spherical, spiky, and oval pollen grains in the corbicula.'
  },
  {
    step: 7, title: '7. Abdomen, Spiracles & Wax Mirrors', lens: '120mm Macro f/3.2', module: 'full_atlas',
    camPos: [-2.4, -0.3, 3.1], target: [-2.0, -0.1, 0.2], explode: 0.0, xray: false, dof: true, structId: 'spiracles',
    caption: 'Telescoping metasomal tergites and sternites bearing respiratory spiracles and ventral wax-secreting mirrors.'
  },
  {
    step: 8, title: '8. Internal Organ Systems (Medical X-Ray)', lens: '105mm Macro f/4.0', module: 'internal_anatomy',
    camPos: [0.0, 0.8, 5.2], target: [-0.6, 0.0, 0.0], explode: 0.0, xray: true, dof: false, structId: 'honey_sac',
    caption: 'Translucent depth-faded exoskeleton exposing the dorsal heart, brain, tracheae/tracheoles, honey stomach, midgut, and reproductive organs.'
  },
  {
    step: 9, title: '9. Sting Apparatus & Reciprocating Barbs', lens: '180mm Macro f/2.8', module: 'sting_apparatus',
    camPos: [0.0, 0.35, 4.6], target: [-0.2, 0.1, 0.0], explode: 0.0, xray: false, dof: true, structId: 'st_barbs',
    caption: 'Slow-motion biomechanics of the poison sac, acid/alkaline glands, quadrate-triangular lever plates, and barbed lancets.'
  },
  {
    step: 10, title: '10. Exploded Inspection & Full Reassembly', lens: '100mm Macro f/4.0', module: 'full_atlas',
    camPos: [0.6, 1.8, 6.2], target: [-0.2, -0.1, 0.0], explode: 0.0, xray: false, dof: false, structId: 'pollen_basket',
    caption: 'Full anatomical reassembly completing the museum showcase tour.'
  }
];

// Append Tracheae, Tracheoles, and Caste-Specific Reproductive Organs to internal_anatomy structures
window.ATLAS_DATA.modules.internal_anatomy.structures.push(
  {
    id: 'tracheae_tracheoles', label: 'tracheae & tracheoles', region: 'RESPIRATORY SYSTEM', system: 'tracheal', layer: 4,
    pos: [-0.55, 0.25, 0.48], explodeVec: [-0.5, 0.55, 0.85],
    latin: 'Tracheae et Tracheolae',
    dimensions: 'Taenidia-reinforced tracheal trunks (50–200 µm) branching into <1 µm intracellular tracheoles',
    mechanism: 'Convey gaseous oxygen directly from the 10 spiracular pairs and compressible air sacs into individual flight muscle mitochondria and neural synapses without requiring oxygen-carrying respiratory pigments in haemolymph.',
    citation: 'Snodgrass, R. E. (1956). Anatomy of the Honey Bee, Ch. 11.'
  },
  {
    id: 'reproductive_system_caste', label: 'reproductive organs (caste-specific)', region: 'REPRODUCTIVE & VENOM', system: 'reproductive', layer: 8,
    pos: [-2.45, 0.32, 0.25], explodeVec: [-2.4, 0.75, 0.55],
    latin: 'Ovaria et Spermatheca (♀/♛) / Testes et Endophallus (♂)',
    dimensions: 'Queen: 150–180 ovarioles/ovary + 1.2 mm spermatheca; Worker: 2–12 vestigial ovarioles; Drone: paired testes + mucus glands + endophallus',
    mechanism: 'Exhibits extreme caste dimorphism: Queen ovaries occupy >60% of the metasoma to produce up to 2,000 eggs/day fertilized via the spermatheca; Worker ovarioles remain suppressed by Queen Mandibular Pheromone; Drones store spermatozoa in seminal vesicles for nuptial eversion.',
    citation: 'Winston, M. L. (1987). The Biology of the Honey Bee, Ch. 3.'
  }
);
