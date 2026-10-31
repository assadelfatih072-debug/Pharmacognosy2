export interface DrugMatrixItem {
  name: string;
  botanicalSource: string;
  partUsed: string;
  majorConstituent: string;
  chemicalClass: string;
  therapeuticUse: string;
  keyExamFact: string;
}

export interface PhytohormoneItem {
  name: string;
  type: string;
  primaryAction: string;
  agriculturalPharmaUses: string;
  keyExamFact: string;
}

export interface EvaluationMethodItem {
  type: string;
  definition: string;
  parameters: string[];
  keyExamples: string;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  items: { id: string; text: string; details: string }[];
}

export const DRUG_MATRIX: DrugMatrixItem[] = [
  {
    name: 'Senna',
    botanicalSource: 'Cassia senna / Cassia angustifolia',
    partUsed: 'Dried leaflets and pods',
    majorConstituent: 'Sennosides A and B',
    chemicalClass: 'Anthraquinone / Dianthrone glycosides',
    therapeuticUse: 'Stimulant laxative (cathartic for constipation / bowel prep)',
    keyExamFact: 'Contains dianthrone glycosides hydrolysed by colonic microflora into active rhein anthrones.'
  },
  {
    name: 'Digitalis (Foxglove)',
    botanicalSource: 'Digitalis purpurea / Digitalis lanata',
    partUsed: 'Dried leaves',
    majorConstituent: 'Digitoxin, Digoxin',
    chemicalClass: 'Cardiac glycosides (Cardenolides)',
    therapeuticUse: 'Congestive heart failure, atrial fibrillation',
    keyExamFact: 'Inhibits myocardial Na+/K+-ATPase pump, exerting positive inotropic effect with narrow therapeutic index.'
  },
  {
    name: 'Cinchona',
    botanicalSource: 'Cinchona succirubra / C. calisaya',
    partUsed: 'Dried stem and root bark',
    majorConstituent: 'Quinine, Quinidine',
    chemicalClass: 'Quinoline alkaloids',
    therapeuticUse: 'Quinine = Antimalarial (erythrocytic schizonticide); Quinidine = Antiarrhythmic (Class IA)',
    keyExamFact: 'Classic bark drug; contains over 30 cinchona alkaloids including cinchonine and cinchonidine.'
  },
  {
    name: 'Belladonna',
    botanicalSource: 'Atropa belladonna',
    partUsed: 'Dried leaves and flowering tops',
    majorConstituent: '(-)-Hyoscyamine, Atropine, Scopolamine',
    chemicalClass: 'Tropane alkaloids',
    therapeuticUse: 'Anticholinergic/antispasmodic, mydriatic, reduces secretions, organophosphate antidote',
    keyExamFact: 'Contains the characteristic tropane ring; acts as competitive muscarinic acetylcholine receptor antagonist.'
  },
  {
    name: 'Opium',
    botanicalSource: 'Papaver somniferum',
    partUsed: 'Air-dried milky exudate (latex) from incised unripe capsules',
    majorConstituent: 'Morphine, Codeine, Papaverine, Noscapine',
    chemicalClass: 'Isoquinoline / Phenanthrene alkaloids',
    therapeuticUse: 'Potent central analgesic (morphine), antitussive (codeine), smooth muscle relaxant (papaverine)',
    keyExamFact: 'Morphine is the principal narcotic opioid analgesic; serves as prototypical standard for pain relief.'
  },
  {
    name: 'Ipecacuanha',
    botanicalSource: 'Cephaelis ipecacuanha / C. acuminata',
    partUsed: 'Dried roots and rhizomes',
    majorConstituent: 'Emetine, Cephaeline',
    chemicalClass: 'Isoquinoline alkaloids',
    therapeuticUse: 'Emetic (poisoning management), amebicide (amebic dysentery / liver abscess)',
    keyExamFact: 'Emetine exerts local and central emetic effects and inhibits eukaryotic protein synthesis.'
  },
  {
    name: 'Rauwolfia',
    botanicalSource: 'Rauwolfia serpentina (Indian Snakeroot)',
    partUsed: 'Dried roots',
    majorConstituent: 'Reserpine, Ajmaline, Serpentine',
    chemicalClass: 'Indole alkaloids',
    therapeuticUse: 'Antihypertensive agent, sedative / antipsychotic',
    keyExamFact: 'Reserpine depletes vesicular monoamines (dopamine, norepinephrine, serotonin) via VMAT inhibition.'
  },
  {
    name: 'Turmeric',
    botanicalSource: 'Curcuma longa',
    partUsed: 'Dried rhizome',
    majorConstituent: 'Curcumin (diferuloylmethane) and curcuminoids',
    chemicalClass: 'Diarylmethane / Phenolic curcuminoids',
    therapeuticUse: 'Antioxidant, anti-inflammatory, hepatoprotective, chemopreventive',
    keyExamFact: 'Gives characteristic yellow color; derived from subterranean stems (rhizomes).'
  },
  {
    name: 'Clove',
    botanicalSource: 'Syzygium aromaticum (Eugenia caryophyllata)',
    partUsed: 'Dried unopened flower buds',
    majorConstituent: 'Eugenol (70-90% in clove oil)',
    chemicalClass: 'Phenylpropanoid volatile oil',
    therapeuticUse: 'Topical dental analgesic, antiseptic, carminative, flavouring agent',
    keyExamFact: 'Forms characteristic needle-shaped potassium euginate crystals on microscope slides with KOH.'
  },
  {
    name: 'Catharanthus (Vinca)',
    botanicalSource: 'Catharanthus roseus (Vinca rosea)',
    partUsed: 'Dried whole plant / leaves',
    majorConstituent: 'Vincristine, Vinblastine',
    chemicalClass: 'Bisindole (dimeric indole-indoline) alkaloids',
    therapeuticUse: 'Antineoplastic: Vincristine in pediatric leukemia/Hodgkin lymphoma; Vinblastine in testicular cancer',
    keyExamFact: 'Binds tubulin dimers to inhibit microtubule assembly, arresting mitotic spindle in metaphase.'
  },
  {
    name: 'Ephedra (Ma Huang)',
    botanicalSource: 'Ephedra sinica / Ephedra equisetina',
    partUsed: 'Dried green aerial stems',
    majorConstituent: '(-)-Ephedrine, Pseudoephedrine',
    chemicalClass: 'Protoalkaloids (phenylalkylamines)',
    therapeuticUse: 'Bronchodilator (asthma relief), nasal decongestant, CNS stimulant',
    keyExamFact: 'Protoalkaloid lacking heterocyclic nitrogen; exerts mixed direct and indirect sympathomimetic actions.'
  },
  {
    name: 'Cod Liver Oil',
    botanicalSource: 'Gadus morhua (Atlantic cod)',
    partUsed: 'Fresh, cleaned liver oil',
    majorConstituent: 'Vitamin A, Vitamin D3, Omega-3 fatty acids (EPA & DHA)',
    chemicalClass: 'Fixed oil / Fat-soluble vitamins',
    therapeuticUse: 'Rickets prevention, vitamin A/D supplement, cardiovascular health',
    keyExamFact: 'Classic animal-derived natural pharmaceutical drug noted in lecture as prime source of Vitamin D.'
  },
  {
    name: 'Ziconotide (Prialt)',
    botanicalSource: 'Conus magus (Magician cone snail)',
    partUsed: 'Marine cone snail venom',
    majorConstituent: '25-amino acid disulfide-linked peptide (omega-conotoxin MVIIA)',
    chemicalClass: 'Marine venom peptide',
    therapeuticUse: 'Severe chronic refractory intractable pain (intrathecal administration)',
    keyExamFact: 'Selective N-type voltage-sensitive calcium channel blocker, ~1000x more potent than morphine.'
  },
  {
    name: 'Agar & Alginic Acid',
    botanicalSource: 'Red algae (Gelidium/Gracilaria) & Brown algae (Laminaria)',
    partUsed: 'Dried hydrophilic colloidal polysaccharides',
    majorConstituent: 'Agarose/Agaropectin (Agar); D-mannuronic & L-guluronic acids (Alginate)',
    chemicalClass: 'Marine sulfated & acidic polysaccharides',
    therapeuticUse: 'Microbiology culture media, laxative, tablet disintegrant, dental impression material',
    keyExamFact: 'Marine-derived pharmaceutical excipients that form reversible hydrogels with high swelling power.'
  },
  {
    name: 'Acacia (Gum Arabic)',
    botanicalSource: 'Senegalia senegal (Acacia senegal)',
    partUsed: 'Dried gummy exudate from stems/branches',
    majorConstituent: 'Arabinogalactan complex, calcium/magnesium/potassium salts of arabic acid',
    chemicalClass: 'Branched acidic arabinogalactan polysaccharide',
    therapeuticUse: 'Suspending agent, emulsifier, tablet binder, demulcent',
    keyExamFact: 'Classic unorganized drug formed via pathological gummosis after injury.'
  },
  {
    name: 'Guar Gum',
    botanicalSource: 'Cyamopsis tetragonoloba seeds',
    partUsed: 'Ground endosperms',
    majorConstituent: 'Galactomannan polysaccharide',
    chemicalClass: 'Neutral galactomannan polysaccharide',
    therapeuticUse: 'Thickening agent, tablet disintegrant, appetite suppressant, dietary fiber',
    keyExamFact: 'Hydrates rapidly in cold water to produce high-viscosity pseudoplastic mucilaginous dispersions.'
  },
  {
    name: 'Bentonite',
    botanicalSource: 'Natural colloidal hydrated aluminum silicate clay',
    partUsed: 'Purified mineral powder',
    majorConstituent: 'Montmorillonite [Al2O3·4SiO2·H2O]',
    chemicalClass: 'Inorganic smectite clay mineral',
    therapeuticUse: 'Suspending agent, clarifying agent, ointment base, skin protectant adsorbent',
    keyExamFact: 'Specifically cited in Pharmacognosy fundamentals as a prominent mineral-origin crude drug.'
  }
];

export const PHYTOHORMONES: PhytohormoneItem[] = [
  {
    name: 'Auxins (IAA)',
    type: 'Indole-3-acetic acid',
    primaryAction: 'Cell elongation, apical dominance, root initiation, vascular differentiation.',
    agriculturalPharmaUses: 'Promotes adventitious rooting in plant cuttings; synthetic analogues (2,4-D) used as selective herbicides.',
    keyExamFact: 'Major natural auxin is IAA (Indole-3-acetic acid). Produced primarily in apical shoot meristems.'
  },
  {
    name: 'Gibberellins (GA3)',
    type: 'Diterpenoid acids',
    primaryAction: 'Internodal stem elongation, bolting, breaking seed/bud dormancy, induction of alpha-amylase in seed germination.',
    agriculturalPharmaUses: 'Malting in brewing, increasing stalk length in seedless table grapes, overcoming seed dormancy.',
    keyExamFact: 'Associated with stem elongation, overcoming dwarfism, and breaking dormancy.'
  },
  {
    name: 'Cytokinins (Kinetin, Zeatin)',
    type: 'Adenine-derived purines',
    primaryAction: 'Promotes cell division (cytokinesis), morphogenesis in tissue culture, delays leaf senescence, promotes lateral bud growth.',
    agriculturalPharmaUses: 'Crucial in plant tissue culture: high cytokinin/auxin ratio induces shoot proliferation.',
    keyExamFact: 'Primarily associated with cell division and anti-senescence activity.'
  },
  {
    name: 'Abscisic Acid (ABA)',
    type: 'Sesquiterpenoid',
    primaryAction: '"Plant stress hormone"; triggers stomatal closure during water deficit, maintains seed and bud dormancy.',
    agriculturalPharmaUses: 'Regulates water stress responses, drought adaptation, and prevents premature viviparous seed germination.',
    keyExamFact: 'Triggers stomatal closure during water stress to prevent lethal dehydration.'
  },
  {
    name: 'Ethylene',
    type: 'Gaseous alkene (C2H4)',
    primaryAction: 'Fruit ripening, leaf and fruit abscission, flower senescence, response to mechanical wounding.',
    agriculturalPharmaUses: 'Commercial uniform fruit ripening chambers (bananas, tomatoes, citrus fruit degreening).',
    keyExamFact: 'The only gaseous phytohormone; triggers climacteric fruit ripening and abscission.'
  }
];

export const EVALUATION_METHODS: EvaluationMethodItem[] = [
  {
    type: '1. Organoleptic (Macroscopic)',
    definition: 'Evaluation using human sensory organs: sight, touch, odor, taste, and sound.',
    parameters: ['Color', 'Shape and size', 'Surface texture/fracture', 'Aroma/odor', 'Characteristic taste (bitter, sweet, acrid)'],
    keyExamples: 'Identifying Senna leaflets by asymmetrical base; Cinchona by bitter taste and quill shape; Clove by characteristic pungent aroma.'
  },
  {
    type: '2. Microscopic (Anatomical)',
    definition: 'Examination of cellular histology and diagnostic micro-structures under brightfield/polarized light.',
    parameters: ['Stomata types (anomocytic, diacytic, paracytic)', 'Trichomes (glandular vs non-glandular)', 'Calcium oxalate crystals', 'Starch grains', 'Microchemical slide tests'],
    keyExamples: 'Precipitation of needle-like potassium euginate crystals on slide with KOH from clove oil; diagnostic stomata in leaves.'
  },
  {
    type: '3. Physical Evaluation',
    definition: 'Determination of physical constants and quantitative purity standards.',
    parameters: ['Moisture content / Loss on drying (LOD)', 'Ash values (Total ash, Acid-insoluble ash, Water-soluble ash)', 'Extractive values (Alcohol-soluble, Water-soluble)', 'Specific gravity, optical rotation, refractive index, melting/boiling points'],
    keyExamples: 'High acid-insoluble ash indicates contamination with silica, sand, or dirt; high moisture (>10-12%) encourages fungal spoilage.'
  },
  {
    type: '4. Chemical Evaluation',
    definition: 'Qualitative chemical color tests and constant assays measuring functional group composition.',
    parameters: ['Borntrager test (anthraquinones)', 'Mayer/Dragendorff/Wagner tests (alkaloids)', 'Acid value, Iodine value, Saponification value, Ester value (fats/oils)'],
    keyExamples: 'Acid, iodine, and ester values differentiate and detect adulteration/rancidity in fixed oils and fats.'
  },
  {
    type: '5. Analytical / Instrumental',
    definition: 'High-precision modern instrumental chromatography and spectrometry for chemical profiling and trace contamination.',
    parameters: ['Chromatography: TLC, HPTLC, HPLC, UPLC, GLC (GC)', 'Spectrometry: UV-Vis, IR, NMR, Mass Spectrometry (LC-MS, GC-MS, HRMS)', 'Heavy metals: Atomic Absorption Spectrophotometry (AAS), ICP-MS', 'Microbiological: Pharmacopoeial microbial counts, pathogen absence'],
    keyExamples: 'GLC for volatile oil fingerprinting; HPLC/LC-MS for complex botanical mixtures; AAS for lead (Pb), mercury (Hg), arsenic (As); E. coli & Salmonella absence tests.'
  },
  {
    type: '6. Biological Evaluation (Bioassay)',
    definition: 'Assaying pharmacological response or potency in living biological systems (animals, tissues, microbes).',
    parameters: ['Bioassays for drugs lacking clear single chemical markers', 'In vitro cell receptor binding', 'Microbiological antibiotic potency assays', 'Toxicity testing (LD50)'],
    keyExamples: 'Assaying cardiac potency of Digitalis on pigeon or frog hearts when chemical assays do not reflect clinical inotropic activity.'
  }
];

export const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  {
    id: 'core-defs',
    title: 'Definitions & Foundations',
    items: [
      { id: 'c1', text: 'Pharmacognosy definition', details: 'Scientific study of medicines obtained from natural sources (plants, animals, microorganisms, minerals).' },
      { id: 'c2', text: 'Etymology: Pharmakon + Gnosis', details: 'Pharmakon = drug/poison; Gnosis = knowledge. Introduced into literature by C.A. Seydler in 1815.' },
      { id: 'c3', text: 'Crude drugs concept', details: 'Dried, unprepared natural materials representing whole plants, animals, minerals or non-cellular exudates.' },
      { id: 'c4', text: 'Three major concerns of Pharmacognosy', details: 'Quality, Efficacy, and Safety (the fundamental triad).' },
      { id: 'c5', text: 'Historical masters', details: 'Hippocrates (Father of Medicine); Dioscorides (De Materia Medica, >600 plants); Seydler (coined Pharmacognosy, 1815); 1930–1960 modern era.' }
    ]
  },
  {
    id: 'sequence-standards',
    title: 'Plant-to-Product & Quality Pillars',
    items: [
      { id: 's1', text: '7-step development cascade', details: 'Selection → Collection → Authentication → Extraction → Evaluation/Standardization → Formulation → Commercialization.' },
      { id: 's2', text: 'Six reliable phytopharmaceutical pillars', details: 'Identity, Purity, Quality, Efficacy, Safety, and Stability.' },
      { id: 's3', text: 'Ethno-guided selection', details: 'Using traditional, indigenous, and folkloric medical knowledge as the lead discovery mechanism.' },
      { id: 's4', text: 'Collection parameters & GACP', details: 'Documenting location/GPS, date/season, specific organ collected, and drying technique for reproducibility.' },
      { id: 's5', text: 'Environmental & CITES impact', details: 'Different altitudes/climates create varying chemotypes; CITES treaties protect threatened wild taxa from commercial extinction.' }
    ]
  },
  {
    id: 'production-phyto',
    title: 'Production & Phytohormones',
    items: [
      { id: 'p1', text: 'Formulation basics: API vs Excipient', details: 'API = biologically active therapeutic agent; Excipient = inactive technological carrier (binders, disintegrants, lubricants, coatings).' },
      { id: 'p2', text: 'Polymorphism & Particle Size', details: 'Polymorphs = distinct crystal lattice arrangements influencing solubility and dissolution. Particle size affects blend homogeneity, dissolution, and flow.' },
      { id: 'p3', text: 'Granulation & Tablet Coating', details: 'Granulation converts fine powder into flowing, compactable grains. Coating provides taste masking, moisture shielding, and modified release.' },
      { id: 'p4', text: 'Cleanrooms, HVAC & cGMP', details: 'HVAC regulates temperature, humidity, and particle air filtration. cGMP requires documentation, trace batch control, and clean processing.' },
      { id: 'p5', text: 'Primary vs Secondary growth', details: 'Primary = apical meristems driving length; Secondary = lateral cambial meristems driving diameter/girth.' },
      { id: 'p6', text: '5 Key Phytohormones', details: 'Auxin (IAA = elongation/rooting), Gibberellins (dormancy breaking/stem length), Cytokinins (cell division), ABA (stress/stomatal closure), Ethylene (gaseous/fruit ripening).' }
    ]
  },
  {
    id: 'adulteration-eval',
    title: 'Adulteration & The 6 Evaluation Methods',
    items: [
      { id: 'a1', text: 'Adulteration definitions', details: 'Debasement or cheating; may be deliberate (fraudulent) or accidental (admixture from carelessness/ignorance).' },
      { id: 'a2', text: 'Spoilage vs Deterioration', details: 'Spoilage = microbial or insect biological infestation; Deterioration = loss of chemical/potency quality from heat, light, air, or moisture.' },
      { id: 'a3', text: 'The Six Evaluation Types', details: 'Organoleptic, Microscopic, Physical, Chemical, Analytical, and Biological. (Economic is NOT a quality evaluation type).' },
      { id: 'a4', text: 'Ash analysis & Constants', details: 'Total ash and acid-insoluble ash evaluate inorganic earthy residues; acid/iodine/ester values evaluate fixed oils.' },
      { id: 'a5', text: 'Instrumental & Safety tests', details: 'AAS for heavy metals (lead, mercury, arsenic); GLC for volatile oils; HPLC for complex extracts; absence testing for Salmonella and E. coli.' },
      { id: 'a6', text: 'Clove eugenol microchemical test', details: 'Eugenol in clove oil reacts on glass slides with KOH to precipitate crystals of potassium euginate.' }
    ]
  },
  {
    id: 'classification-natural',
    title: 'Classification & Natural Drugs',
    items: [
      { id: 'd1', text: 'Organized vs Unorganized drugs', details: 'Organized = cellular structures (leaves, roots, barks, seeds); Unorganized = acellular exudates/extracts (gums, mucilages, resins, latex, oils).' },
      { id: 'd2', text: 'Gums vs Mucilages', details: 'Gums = pathological products resulting from gummosis after trauma/stress; Mucilages = normal physiological intracellular products.' },
      { id: 'd3', text: 'Taxonomical hierarchy mnemonic', details: 'Kingdom → Phylum/Division → Class → Order → Family → Genus → Species (King Philip Came Over For Good Soup).' },
      { id: 'd4', text: 'Key plant monographs', details: 'Senna (sennosides A/B), Digitalis (cardiac glycosides), Cinchona (quinine/quinidine), Belladonna (tropane alkaloids), Opium (morphine), Ipecac (emetine), Rauwolfia (reserpine), Clove (eugenol), Catharanthus (vincristine/vinblastine), Ephedra (ephedrine).' },
      { id: 'd5', text: 'Marine, animal & mineral sources', details: 'Cod liver oil (Vitamin D animal source); Ziconotide (marine cone snail peptide analgesic); Agar/alginate (algae); Bentonite (mineral clay).' },
      { id: 'd6', text: 'Plant tissue culture & Totipotency', details: 'Aseptic in-vitro cultivation; totipotency is the inherent ability of a single plant cell to regenerate into a complete organism.' },
      { id: 'd7', text: 'Pharmaceutical gums', details: 'Acacia (binding/suspending agent); Guar gum (thickening/disintegrating agent).' }
    ]
  }
];
