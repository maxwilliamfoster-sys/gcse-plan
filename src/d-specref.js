/* Where each topic sits in the official specification (checked against the board spec PDFs, Sept 2026).
   Maths: Pearson Edexcel 1MA1 Issue 2 · Science: AQA 8464 v1.1 · Eng Lang: AQA 8700 · Eng Lit: OCR J352
   Geography: AQA 8035 v1.1 · History: OCR J410 v1.9 · German: AQA 8662 (first exams 2026) */
RG.spec = {
  // Maths — Edexcel 1MA1 subject content (N number, A algebra, R ratio, G geometry, P probability, S statistics)
  'm-num': '1MA1 Number N4, N6, N7', 'm-frac': '1MA1 Number N2, N8, N10, N12 · Ratio R9–R16', 'm-bounds': '1MA1 Number N9, N14, N15, N16',
  'm-surds': '1MA1 Number N8 (Higher)', 'm-alg': '1MA1 Algebra A4', 'm-eq': '1MA1 Algebra A5, A17, A22', 'm-quad': '1MA1 Algebra A11, A18',
  'm-simul': '1MA1 Algebra A19, A21', 'm-seq': '1MA1 Algebra A23–A25', 'm-lines': '1MA1 Algebra: graphs (y = mx + c)', 'm-graphs': '1MA1 Algebra A7, A12–A16 (graphs & functions)',
  'm-ratio': '1MA1 Ratio R4–R8, R10', 'm-rates': '1MA1 Ratio R1, R11 · Number N13', 'm-angles': '1MA1 Geometry G1, G3, G4 · bearings',
  'm-area': '1MA1 Geometry: mensuration (G14–G18) · Appendix 3 formulae', 'm-trig': '1MA1 Geometry G6, G20–G23 (Pythagoras & trigonometry)',
  'm-transf': '1MA1 Geometry G2, G5, G7, G19', 'm-circle': '1MA1 Geometry G10 (Higher)', 'm-vectors': '1MA1 Geometry G24, G25',
  'm-prob': '1MA1 Probability P1–P9', 'm-stats': '1MA1 Statistics S1–S6', 'm-proof': '1MA1 Algebra A6, A20', 'm-exam': '1MA1 AO2 & AO3 (reasoning & problem solving)',
  // Combined Science — AQA 8464
  'b-cells': 'AQA 8464 4.1.1 Cell structure', 'b-div': 'AQA 8464 4.1.2 Cell division', 'b-transport': 'AQA 8464 4.1.3 Transport in cells',
  'b-digest': 'AQA 8464 4.2.1–4.2.2 (digestive system, enzymes)', 'b-heart': 'AQA 8464 4.2.2 (heart, blood vessels, blood, lungs)',
  'b-disease': 'AQA 8464 4.2.2 (health, non-communicable disease, cancer) · 4.2.3 Plant tissues', 'b-infection': 'AQA 8464 4.3.1 Communicable diseases',
  'b-energy': 'AQA 8464 4.4.1 Photosynthesis · 4.4.2 Respiration', 'b-nerves': 'AQA 8464 4.5.1 Homeostasis · 4.5.2 Nervous system',
  'b-hormones': 'AQA 8464 4.5.3 Hormonal coordination', 'b-genetics': 'AQA 8464 4.6.1 Reproduction',
  'b-evolution': 'AQA 8464 4.6.2 Variation & evolution · 4.6.3 · 4.6.4 Classification', 'b-ecology': 'AQA 8464 4.7.1–4.7.3 Ecology',
  'c-atoms': 'AQA 8464 5.1 Atomic structure & the periodic table', 'c-bonding': 'AQA 8464 5.2 Bonding, structure & properties',
  'c-quant': 'AQA 8464 5.3 Quantitative chemistry', 'c-changes': 'AQA 8464 5.4 Chemical changes', 'c-energy': 'AQA 8464 5.5 Energy changes',
  'c-rates': 'AQA 8464 5.6 Rate & extent of chemical change', 'c-organic': 'AQA 8464 5.7 Organic chemistry', 'c-analysis': 'AQA 8464 5.8 Chemical analysis',
  'c-atmos': 'AQA 8464 5.9 Chemistry of the atmosphere', 'c-resources': 'AQA 8464 5.10 Using resources',
  'p-energy': 'AQA 8464 6.1 Energy', 'p-elec': 'AQA 8464 6.2 Electricity', 'p-particles': 'AQA 8464 6.3 Particle model of matter',
  'p-atomic': 'AQA 8464 6.4 Atomic structure', 'p-forces': 'AQA 8464 6.5 Forces', 'p-waves': 'AQA 8464 6.6 Waves',
  'p-magnet': 'AQA 8464 6.7 Magnetism & electromagnetism', 'p-equations': 'AQA 8464 Appendix B: Physics equations',
  'p-skills': 'AQA 8464 Working scientifically · 21 required practicals',
  // English Language — AQA 8700
  'el-p1q1': 'AQA 8700 Paper 1 Q1 & Paper 2 Q1 (AO1)', 'el-lang': 'AQA 8700 P1 Q2 & P2 Q3 (AO2)', 'el-struct': 'AQA 8700 P1 Q3 (AO2)',
  'el-eval': 'AQA 8700 P1 Q4 (AO4)', 'el-compare': 'AQA 8700 P2 Q2 (AO1) & Q4 (AO3)', 'el-creative': 'AQA 8700 P1 Section B (AO5, AO6)',
  'el-viewpoint': 'AQA 8700 P2 Section B (AO5, AO6)', 'el-spag': 'AQA 8700 AO6 technical accuracy',
  // English Literature — OCR J352
  'aic-plot': 'OCR J352/01 Section A: modern drama (An Inspector Calls)', 'aic-chars': 'OCR J352/01 Section A: modern drama (An Inspector Calls)',
  'jh-plot': 'OCR J352/01 Section B: 19th-century prose (Jekyll and Hyde)', 'jh-themes': 'OCR J352/01 Section B: 19th-century prose (Jekyll and Hyde)',
  'rj-plot': 'OCR J352/02 Section B: Shakespeare (Romeo and Juliet)', 'rj-themes': 'OCR J352/02 Section B: Shakespeare (Romeo and Juliet)',
  'poem-heritage': 'OCR J352/02 Section A: Poetry Anthology — Conflict cluster', 'poem-war': 'OCR J352/02 Section A: Poetry Anthology — Conflict cluster',
  'poem-modern': 'OCR J352/02 Section A: Poetry Anthology — Conflict cluster', 'lit-unseen': 'OCR J352/01 A(a) unseen extract · J352/02 A(a) unseen poem',
  // Geography — AQA 8035
  'g-tect': 'AQA 8035 3.1.1.1 Natural hazards · 3.1.1.2 Tectonic hazards', 'g-weather': 'AQA 8035 3.1.1.3 Weather hazards', 'g-climate': 'AQA 8035 3.1.1.4 Climate change',
  'g-eco': 'AQA 8035 3.1.2.1 Ecosystems · 3.1.2.2 Tropical rainforests', 'g-desert': 'AQA 8035 3.1.2.3 Hot deserts',
  'g-coast': 'AQA 8035 3.1.3.1 UK physical landscapes · 3.1.3.2 Coastal landscapes', 'g-river': 'AQA 8035 3.1.3.3 River landscapes',
  'g-urban-rio': 'AQA 8035 3.2.1 Urban issues (LIC/NEE city case study)', 'g-urban-cam': 'AQA 8035 3.2.1 Urban issues (UK city case study, sustainability)',
  'g-dev': 'AQA 8035 3.2.2 Changing economic world (development gap)', 'g-nigeria': 'AQA 8035 3.2.2 (LIC/NEE case study)', 'g-ukecon': 'AQA 8035 3.2.2 (economic futures in the UK)',
  'g-resources': 'AQA 8035 3.2.3.1 Resource management · 3.2.3.2 Food', 'g-fieldwork': 'AQA 8035 3.3.2 Fieldwork', 'g-issue': 'AQA 8035 3.3.1 Issue evaluation · 3.4 Geographical skills',
  // History — OCR J410
  'h-ir-peace': 'OCR J410 period study: Conflict and co-operation 1918–1939', 'h-ir-war': 'OCR J410 period study: Conflict and co-operation 1918–1939 (1930s)',
  'h-ir-interp': 'OCR J410 period study: historical controversy (interpretations)', 'h-ir-cw1': 'OCR J410 period study: The Cold War in Europe 1945–1961',
  'h-ir-cw2': 'OCR J410 period study: Cold War confrontations 1954–1975 (Cuba, Vietnam origins)', 'h-ir-vietnam': 'OCR J410 period study: Cold War confrontations 1954–1975 (Vietnam War)',
  'h-usa-20s': 'OCR J410/06 The \'Roaring Twenties\'', 'h-usa-prej': 'OCR J410/06 The \'Roaring Twenties\' (prohibition, prejudice)',
  'h-usa-30s': 'OCR J410/06 The 1930s and the New Deal', 'h-usa-war': 'OCR J410/06 The impact of the Second World War on US society',
  'h-mig-med': 'OCR J410/08 Migration c.1000–1500', 'h-mig-early': 'OCR J410/08 Migration c.1500–1900 (to c.1700)', 'h-mig-modern': 'OCR J410/08 Migration c.1500–1900 (industrial era)',
  'h-mig-20c': 'OCR J410/08 Migration 1900–c.2010', 'h-empire': 'OCR J410/11 English expansion and its impact on the British Isles c.1688–c.1730',
  'h-empire-econ': 'OCR J410/11 Economic impact of empire on Britain 1688–c.1730', 'h-empire-soc': 'OCR J410/11 Political and social impact of empire on Britain 1688–c.1730',
  'h-spitalfields': 'OCR J410/11 Urban Environments: Patterns of Migration (set site: Spitalfields)', 'h-skills': 'OCR J410 AO1–AO4 (sources & interpretations)',
  // German — AQA 8662
  'de-rel': 'AQA 8662 Theme 1 Topic 1: Identity and relationships with others', 'de-health': 'AQA 8662 Theme 1 Topic 2: Healthy living and lifestyle',
  'de-school': 'AQA 8662 Theme 1 Topic 3: Education and work', 'de-free': 'AQA 8662 Theme 2 Topic 1: Free-time activities',
  'de-fest': 'AQA 8662 Theme 2 Topic 2: Customs, festivals and celebrations', 'de-celeb': 'AQA 8662 Theme 2 Topic 3: Celebrity culture',
  'de-travel': 'AQA 8662 Theme 3 Topic 1: Travel and tourism, including places of interest', 'de-media': 'AQA 8662 Theme 3 Topic 2: Media and technology',
  'de-env': 'AQA 8662 Theme 3 Topic 3: The environment and where people live', 'de-tenses': 'AQA 8662 3.2 Grammar (verbs & tenses)',
  'de-wordorder': 'AQA 8662 3.2 Grammar (word order, conjunctions)', 'de-cases': 'AQA 8662 3.2 Grammar (cases, prepositions, adjectives)',
  'de-exam': 'AQA 8662 Papers 1–4 assessment structure'
};
