/* Timetable data, ported from the GCSE Study Plan (GCSE-Timetable/src/plan.html), Oct 2026.
   WEEK: weekday (1=Mon) -> 8 periods. A subject id is self-study, 'L:X' is a live online lesson (LIVE[X]), 'QUIZ' the Friday mixed quiz.
   HOLI: what a live lesson becomes when there are no online lessons. PLAN/HOW: weekly focus and 45-min recipe per phase and subject. */
(() => {
const L = {
  cm5:['Corbett 5-a-day (Higher)','https://corbettmaths.com/5-a-day/gcse/'],
  cmv:['Corbett videos + worksheets','https://corbettmaths.com/contents/'],
  mg:['Maths Genie questions by grade','https://mathsgenie.co.uk/gcse/maths'],
  mgp:['Maths Genie Edexcel past papers','https://mathsgenie.co.uk/gcse/maths/edexcel/papers'],
  pm1:['PMT Paper 1 (non-calc) papers','https://www.physicsandmathstutor.com/past-papers/gcse-maths/edexcel-paper-1/'],
  pm2:['PMT Paper 2 papers','https://www.physicsandmathstutor.com/past-papers/gcse-maths/edexcel-paper-2/'],
  pm3:['PMT Paper 3 papers','https://www.physicsandmathstutor.com/past-papers/gcse-maths/edexcel-paper-3/'],
  drf:['Dr Frost (free account)','https://www.drfrost.org/'],
  bbm:['Bitesize Maths (Edexcel)','https://www.bbc.co.uk/bitesize/examspecs/z9p3mnb'],
  pear:['Pearson 1MA1 page (spec, formulae sheet)','https://qualifications.pearson.com/en/qualifications/edexcel-gcses/mathematics-2015.html'],
  cog:['Cognito (free videos + quizzes)','https://cognito.org/'],
  cogyt:['Cognito on YouTube','https://www.youtube.com/@Cognitoedu'],
  fsl:['Freesciencelessons','https://www.youtube.com/@Freesciencelessons'],
  bbs:['Bitesize Combined Science: AQA Trilogy','https://www.bbc.co.uk/bitesize/examspecs/z8r997h'],
  pmb:['PMT AQA Biology questions by topic','https://www.physicsandmathstutor.com/biology-revision/gcse-aqa/'],
  pmc:['PMT AQA Chemistry questions by topic','https://www.physicsandmathstutor.com/chemistry-revision/gcse-aqa/'],
  pmp:['PMT AQA Physics questions by topic','https://www.physicsandmathstutor.com/physics-revision/gcse-aqa/'],
  aqas:['AQA 8464 papers, mark schemes, equation sheet','https://www.aqa.org.uk/subjects/science/gcse/science-8464/assessment-resources'],
  sen:['Seneca (free courses)','https://senecalearning.com/'],
  bruff:['Mr Bruff (YouTube)','https://www.youtube.com/@mrbruff'],
  salles:['Mr Salles (YouTube)','https://www.youtube.com/@mrsallesteachesenglish'],
  bbl:['Bitesize English Language: AQA','https://www.bbc.co.uk/bitesize/examspecs/zcbchv4'],
  bblit:['Bitesize English Literature: AQA','https://www.bbc.co.uk/bitesize/examspecs/zxqncwx'],
  bbpc:['Bitesize: AQA poetry anthology','https://www.bbc.co.uk/bitesize/topics/zqtmg2p'],
  bbrj:['Bitesize: Romeo and Juliet','https://www.bbc.co.uk/bitesize/topics/zykncwx'],
  bbaic:['Bitesize: An Inspector Calls','https://www.bbc.co.uk/bitesize/topics/zpr639q'],
  bbjh:['Bitesize: Jekyll and Hyde','https://www.bbc.co.uk/bitesize/topics/z8642p3'],
  aqalang:['AQA 8700 past papers + mark schemes','https://www.aqa.org.uk/subjects/english/gcse/english-8700/assessment-resources'],
  aqalit:['AQA 8702 past papers + mark schemes','https://www.aqa.org.uk/subjects/english/gcse/english-8702/assessment-resources'],
  gjh:['Jekyll and Hyde full text (free)','https://www.gutenberg.org/ebooks/43'],
  grj:['Romeo and Juliet full text (free)','https://www.gutenberg.org/ebooks/1513'],
  pme:['PMT AQA English resources','https://www.physicsandmathstutor.com/english-revision/gcse-aqa/'],
  ocr:['OCR J410 page','https://www.ocr.org.uk/qualifications/gcse/history-a-explaining-the-modern-world-j410-from-2016/'],
  ocrpp:['OCR past paper finder (pick J410)','https://www.ocr.org.uk/qualifications/past-paper-finder/'],
  ocrspec:['J410 specification (PDF)','https://www.ocr.org.uk/Images/207163-specification-accredited-gcse-history-a-first-teaching-2019-with-first-assessment-2021-j410.pdf'],
  bbh:['Bitesize History: OCR A','https://www.bbc.co.uk/bitesize/examspecs/z2d4rdm'],
  bbusa:['Bitesize: The USA 1919–1948','https://www.bbc.co.uk/bitesize/topics/z3bwqfr'],
  bbcwv:['Bitesize: The Cold War and Vietnam','https://www.bbc.co.uk/bitesize/topics/z8ntxsg'],
  bbcw:['Bitesize: The Cold War','https://www.bbc.co.uk/bitesize/topics/zrgb7v4'],
  bbmig:['Bitesize: Britain and migration','https://www.bbc.co.uk/bitesize/topics/zcrg239'],
  allsop:['Mr Allsop History (YouTube)','https://www.youtube.com/@mrallsophistory'],
  tna:['National Archives education (sources)','https://www.nationalarchives.gov.uk/education/'],
  aqag:['AQA 8662 German page','https://www.aqa.org.uk/subjects/german/gcse/german-8662'],
  aqagspec:['8662 spec: vocab list + sound rules (PDF)','https://filestore.aqa.org.uk/resources/german/specifications/AQA-8662-SP-2024.PDF'],
  aqagar:['AQA 8662 sample papers + mark schemes','https://www.aqa.org.uk/subjects/german/gcse/german-8662/assessment-resources'],
  bbg:['Bitesize German: AQA (grammar)','https://www.bbc.co.uk/bitesize/examspecs/z6t9fdm'],
  easy:['Easy German (listening, subtitles)','https://www.youtube.com/@EasyGerman'],
  app:['Your GCSE Plan app (flashcards)','https://maxwilliamfoster-sys.github.io/gcse-plan/'],
  anki:['Anki: your six subject decks (AnkiWeb for phone sync)','https://ankiweb.net/']
};
const WEEK = {
  1:['hist','german','science','L:M','L:S','maths','L:E','hist'],
  2:['german','englit','science','L:M','L:S','hist','L:E','german'],
  3:['science','hist','L:ESS','maths','german','L:WRI','englit','science'],
  4:['hist','science','german','L:M','L:S','maths','L:E','englang'],
  5:['englit','hist','german','science','maths','L:E','QUIZ','englang']
};
const LIVE = {
  M:{s:'maths', name:'KS4 Maths (online lesson)'},
  S:{s:'science', name:'KS4 Science (online lesson)'},
  E:{s:'englang', name:'Y11 English (online lesson)'},
  ESS:{s:'englang', name:'English Essentials (online lesson)'},
  WRI:{s:'englang', name:'KS4 Writing (online lesson)'}
};
// Holiday replacement when there are no live lessons.
const HOLI = {M:'maths', S:'science', E:{1:'englit',2:'englang',3:'englit',4:'englit',5:'englang'}, ESS:'englang', WRI:'englang'};
const BLOCK_TIMES = [['08:15','09:00'],['09:00','09:45'],['09:45','10:30'],['11:00','11:45'],['11:45','12:30'],['13:30','14:15'],['14:15','15:00'],['15:15','16:00']];
const SKIPPED = {3:{1:'ELAC (not attending)'},4:{1:'ELAC (not attending)'},5:{6:'ELAC (not attending)'}}; // weekday -> block index (0-based) -> label
const PLAN = {
 1:{ // 12 Oct – 18 Dec: learn everything once
  maths:['Number: indices, surds, standard form, bounds, recurring decimals','Algebra: expand/factorise (incl. ax²+bx+c), rearranging, algebraic fractions','Solving: quadratics (factorise, formula, completing the square), simultaneous (incl. linear + quadratic), inequalities','Graphs: y=mx+c, parallel/perpendicular, quadratic/cubic/reciprocal/exponential, turning points, transformations','Ratio & proportion: direct/inverse, compound measures (speed, density, pressure are NOT given), growth/decay, compound interest','Geometry: angles, polygons, circle theorems, congruence, similarity (length/area/volume scale factors)','Trigonometry: Pythagoras + SOHCAHTOA in 2D/3D, exact values (NOT given), sine/cosine rule, ½ab sin C, trig graphs','Area & volume (cones, spheres, frustums), arcs and sectors (NOT given), vectors and vector proof','Probability & statistics: tree and Venn diagrams, conditional probability, histograms, cumulative frequency, box plots','Higher algebra: functions (composite/inverse), iteration, algebraic proof, quadratic nth term, gradient/area under graphs, circle x²+y²=r² + tangents'],
  science:['B1 Cell biology · C1 Atomic structure & periodic table · P1 Energy','B2 Organisation · C2 Bonding, structure & properties · P2 Electricity','B3 Infection & response · C3 Quantitative chemistry (moles, concentration) · P2 Electricity (calculations)','B4 Bioenergetics · C4 Chemical changes (reactivity, acids, electrolysis) · P3 Particle model','C5 Energy changes · P4 Atomic structure (radiation, half-life) · Paper 1 required practicals','B5 Homeostasis & response · C6 Rates & equilibrium · P5 Forces (motion graphs)','B6 Inheritance, variation & evolution · C7 Organic chemistry · P5 Forces (Newton’s laws, momentum)','B6 finish (genetic crosses) · C8 Chemical analysis · P6 Waves','B7 Ecology · C9 Atmosphere · C10 Using resources · P7 Magnetism & electromagnetism','Paper 2 required practicals + mixed retrieval of everything'],
  hist:['IR: Treaty of Versailles; League of Nations in the 1920s; Dawes, Locarno, Kellogg-Briand, Young; disarmament · Migration c.1000–1500 (Normans, Jews 1066–1290, resident aliens)','IR: Depression; Manchuria & Abyssinia; Hitler’s foreign policy; Appeasement; outbreak of war 1939 · Migration: Africans in Tudor England, East India Company, lascars & ayahs','IR: interpretations of Appeasement; Yalta & Potsdam; Soviet takeover of Eastern Europe 1945–48 · Migration: readmission of Jews 1656, Huguenots, Palatines','IR: Truman Doctrine, Marshall Plan, Berlin Blockade & Airlift, NATO & Warsaw Pact, Berlin Wall 1961 · Migration: Royal African Company & Black communities, Irish & Scots, Abolition & Chartists, Eastern European Jews, Naturalisation Act 1870','IR: Cuban Missile Crisis 1962; interpretations of responsibility for the Cold War · Migration 1900–c.2010: Aliens Act 1905, Status of Aliens Act 1914, BNA 1948, 1930s Jewish refugees, the world wars, Poles','IR: Vietnam 1954–65 origins; US & Vietcong tactics · Migration: Commonwealth migration, racism & anti-racism, 1962 Act, race relations laws, 1981 BNA, 1990–2010 debates','IR: US withdrawal, opposition in the USA, end of the war and its impact · USA: 1920s economy, who did and didn’t prosper, women & Sheppard-Towner Act','USA: Prohibition; KKK & Jim Crow; Red Scare, Palmer Raids, Sacco & Vanzetti; immigration limits; NAACP & UNIA · Empire: Glorious Revolution, Ireland 1688–91, Glencoe, Darien, Act of Union 1707, Jacobites 1715, emigration','USA: Depression, 1932 election, Hundred Days & Alphabet Agencies, Second New Deal, reactions · Empire: Bank of England 1694, East India Company, end of RAC monopoly 1698, Treaty of Utrecht 1713, South Sea Bubble, colonies & slave-based economy','USA: WW2 mobilisation, government power, rationing, women, Japanese internment, Detroit 1943, EO 8802, desegregation 1948 · Empire: consumerism, slave ports, racial hierarchy ideas, resistance & opposition, coffee houses · Spitalfields site study'],
  german:['Theme 1: Identity & relationships · present tense (regular, irregular, separable), verb-second word order','Theme 1: Healthy living & lifestyle · cases & articles (nom/acc/dat), modal verbs','Theme 1: Education & work · perfect tense with haben/sein','Theme 2: Free-time activities · future (werden) + conditional (würde, hätte, wäre)','Theme 2: Customs, festivals & celebrations · subordinate clauses (weil, dass, wenn, obwohl): verb to the end','Theme 2: Celebrity culture · imperfect (war, hatte, common verbs), comparatives & superlatives','Theme 3: Travel & tourism · prepositions + case, adjective endings','Theme 3: Media & technology · pronouns incl. relative pronouns, um…zu','Theme 3: Environment & where people live · passive, pluperfect (Higher)','Speaking: role-play, reading aloud (sound rules, Appendix 1), photo-card answers for all 3 themes'],
  englit:['An Inspector Calls: plot, characters, 1912 vs 1945 context, Priestley’s socialism','An Inspector Calls: themes (responsibility, class, gender, age) + 15 key quotes','Romeo and Juliet Acts 1–3 + context (patriarchy, honour, fate, religion)','Romeo and Juliet Acts 4–5, characters, themes + extract-to-whole-play technique','Jekyll and Hyde plot + context (Victorian respectability, duality, science, Darwin, the city)','Jekyll and Hyde characters & themes + extract-to-whole-novel technique','Power & Conflict: Ozymandias, London, The Prelude (extract), My Last Duchess, Charge of the Light Brigade','Power & Conflict: Exposure, Storm on the Island, Bayonet Charge, Remains, Poppies','Power & Conflict: War Photographer, Tissue, The Émigrée, Checking Out Me History, Kamikaze','Unseen poetry method (24 + 8 marks) + comparison grid for all 15 poems'],
  englang:['Paper 1 Q1 + Q2 (language analysis)','Paper 1 Q3 (structure)','Paper 1 Q4 (evaluation)','Paper 1 Q5 (descriptive writing)','Paper 1 Q5 (narrative writing)','Paper 2 Q1 + Q2 (true statements, summary)','Paper 2 Q3 (language)','Paper 2 Q4 (compare perspectives)','Paper 2 Q5 (viewpoint writing: article, letter, speech)','SPaG sweep: sentence variety, punctuation for effect, ambitious vocabulary']
 },
 x:{ // Christmas
  maths:['Fill gaps: redo every question you got wrong this term'], science:['Fill gaps: re-test your weakest 3 topics'], hist:['Fill gaps: timeline from memory 1918–1975 + USA 1919–48'], german:['Fill gaps: vocab decks + 2 written answers'], englit:['Fill gaps: quote retrieval for all 4 texts'], englang:['One Paper 1 Q5 and one Paper 2 Q5, timed']
 },
 2:{ // 4 Jan – 26 Mar: exam technique on every topic
  maths:['Number & proportion: hard problem-solving','Algebra: quadratics, simultaneous, inequalities (grade 7–9)','Graphs & transformations (grade 7–9)','Geometry & circle theorems (proofs)','Trig: sine/cosine rule, 3D, exact values','Vectors & algebraic proof','Probability: Venn, conditional, set notation','Statistics: histograms, cumulative frequency, box plots','Functions, iteration, rates of change','Full Paper 1 (non-calculator), timed','Full Paper 2 (calculator), timed','Full Paper 3 (calculator), timed'],
  science:['B1–B2 exam questions + 6-markers','C1–C2 exam questions','P1 energy calculations + equation sheet drills','B3–B4 exam questions','C3 calculations (moles, concentration) + C4 electrolysis','C5 + P2 circuits and electricity calculations','P3–P4 exam questions','B5–B6 exam questions + genetic crosses','C6–C7 exam questions (rates graphs)','P5 forces calculations','B7 + C8–C10 exam questions','P6–P7 + all 21 required practicals'],
  hist:['IR 1918–39: Q1 outline (5) + Q2 explain (10)','IR: Appeasement interpretations Q3 (25) + Q4 essay (25)','IR: Cold War in Europe 1945–61 questions','IR: Cold War interpretations essay','IR: Cuba + Vietnam questions','USA 1920s: Q5 describe (2) + Q6 explain (10)','USA New Deal: Q7 sources (10)','USA WW2: Q8 essay (18)','Migration: Q1 describe (4), Q2 explain (8), Q3 (14)','Migration: Q4 change/continuity essay (24)','Empire: explain (10) + essay using sources (25)','Spitalfields: explain (10) + source comparison (10)'],
  german:['Listening + dictation (Theme 1)','Reading + translation into English (Theme 1)','Writing 90 + 150 words + translation into German (Theme 1)','Speaking: role-plays + reading aloud','Listening + dictation (Theme 2)','Reading + translation into English (Theme 2)','Writing + translation into German (Theme 2)','Speaking: photo cards (Themes 1–2)','Listening + dictation (Theme 3)','Reading + translation (Theme 3)','Writing + translation (Theme 3)','Full speaking mock (record it)'],
  englit:['An Inspector Calls: timed essay (character)','An Inspector Calls: timed essay (theme)','Romeo and Juliet: extract → whole play essay','Romeo and Juliet: second essay','Jekyll and Hyde: extract → whole novel essay','Jekyll and Hyde: second essay','Power & Conflict: comparison (power of nature / of humans)','Power & Conflict: comparison (war, effects of conflict)','Power & Conflict: comparison (identity, memory)','Unseen poetry 24 + 8 timed','Paper 1 full, timed (1 h 45)','Paper 2 full, timed (2 h 15)'],
  englang:['Paper 1 Section A timed','Paper 1 Q5 timed','Paper 2 Section A timed','Paper 2 Q5 timed','Paper 1 Section A timed','Paper 1 Q5 timed','Paper 2 Section A timed','Paper 2 Q5 timed','Paper 1 Q4 + Q5 timed','Paper 2 Q4 + Q5 timed','Paper 1 full, timed','Paper 2 full, timed']
 },
 3:{ // 29 Mar – 9 May: past papers + speaking exam
  maths:['Paper 1 past paper','Paper 2 past paper','Paper 3 past paper','Paper 1 past paper (different year)','Weakest topics from your mistake log','Paper 1 final run-through (exam 14 May)'],
  science:['Biology 1 + Chemistry 1 past papers','Physics 1 past paper + corrections','Biology 2 + Chemistry 2 past papers','Physics 2 past paper','Required practicals + 6-markers','Biology 1 + Chemistry 1 final run (exams 11 & 17 May)'],
  hist:['Paper 1 Section A (IR) past paper','Paper 1 Section B (USA) past paper','Paper 2 Migration past paper','Paper 3 Empire + Spitalfields past paper','Paper 1 full, timed','Paper 1 final run (exam 20 May)'],
  german:['Speaking: daily role-play + photo card (window opens 12 Apr)','Listening + Reading past papers','Writing past paper','Speaking mock + reading aloud','Listening + Reading timed (exam 10 May)','Writing timed (exam 18 May)'],
  englit:['Paper 1 timed','Paper 2 timed','Quote retrieval: all texts + 15 poems','Paper 1 timed (exam 12 May)','Paper 2 timed (exam 19 May)','Final quote + context sweep'],
  englang:['Paper 1 full','Paper 2 full','Paper 1 Q5 x2','Paper 2 Q5 x2','Paper 1 full (exam 24 May)','Paper 2 full']
 }
};

/* ---------- block recipes (how to spend 45 minutes) ---------- */
const HOW = {
 1:{
  maths:{how:['15 min: Corbett 5-a-day (Higher). Mark it straight away.','25 min: this week’s topic on Maths Genie. Start at grade 5 and climb to grade 8/9. Watch the Corbett video only when stuck.','5 min: turn every mistake into a flashcard: question on the front, method on the back.'], ln:['cm5','mg','cmv']},
  science:{how:['15 min: one video on the sub-topic (Cognito or Freesciencelessons) at 1.25×. Pause and predict before each answer.','10 min: write 8–10 question→answer flashcards. Use exact AQA key words.','15 min: topic questions from Cognito or PMT. Mark them with the mark scheme.','5 min: if there is a required practical, write its method in 5 steps from memory.'], ln:['cog','pmb','pmc','pmp','bbs']},
  hist:{how:['5 min: read the spec bullet for this topic (what OCR can ask).','20 min: Bitesize or Mr Allsop on the topic, then a one-page knowledge organiser: dates, people, 3 causes, 3 consequences.','10 min: close everything and blurt it onto a blank page. Check it and fill the gaps in a second colour.','10 min: one exam question, e.g. "Explain why…" (10 marks) in 12 minutes.'], ln:['bbh','bbusa','bbcwv','bbmig','allsop','ocrspec']},
  german:{how:['10 min: the German deck in Anki (vocab and grammar), or the typing decks on the Practice tab.','15 min: the grammar point on Bitesize, then write 10 sentences of your own using it.','15 min: write 90 words on the week’s topic. Include 3 tenses, a weil clause and an opinion.','5 min: read it aloud twice. Speaking is 25% of the GCSE.'], ln:['app','bbg','aqagspec','easy']},
  englit:{how:['10 min: retrieve 10 quotes for the text from memory, then check them.','20 min: Mr Bruff, Mr Salles or Bitesize on this week’s focus. Annotate each quote: method → effect → context.','15 min: plan an AQA-style essay: a thesis line and 3 paragraphs, each with a quote, a method and context.'], ln:['bblit','bruff','salles','bbaic','bbrj','bbjh','bbpc']},
  englang:{how:['5 min: read the question and the insert of an AQA past paper.','25 min: answer this week’s question type in exam time (Q2 10 min, Q3 10 min, Q4 20 min, Q5 45 min split across two blocks).','15 min: compare with the mark scheme. Rewrite your weakest paragraph.'], ln:['aqalang','bbl','bruff','salles']}
 },
 2:{
  maths:{how:['10 min: Corbett 5-a-day (Higher+).','30 min: exam questions on the focus from Maths Genie (grade 7–9). Timed at about 1 minute per mark.','5 min: corrections and mistake flashcards.'], ln:['cm5','mg','mgp','drf']},
  science:{how:['35 min: exam questions on the focus (PMT topic questions or AQA papers), timed at about 1 minute per mark.','10 min: mark them and copy the mark-scheme wording for anything you missed. Examiners credit exact key words.'], ln:['pmb','pmc','pmp','aqas']},
  hist:{how:['10 min: fact retrieval (dates and people flashcards).','30 min: one timed question of this week’s type.','5 min: mark it against OCR’s levels. Did you explain each point and link it back to the question?'], ln:['ocrpp','ocr','bbh']},
  german:{how:['Listening weeks: an Easy German clip at 0.75×. Write down 3 sentences word for word (dictation practice), then check them.','Reading weeks: a reading section of the sample paper plus one translation into English.','Writing weeks: a 90- or 150-word answer plus one translation into German.','Speaking weeks: record yourself on a role-play and a photo card, then listen back.'], ln:['aqagar','easy','app','bbg']},
  englit:{how:['5 min: plan (thesis + 3 points).','40 min: write the essay to time. Over two blocks for full papers.','Afterwards: mark it with the AQA level descriptors and rewrite one paragraph.'], ln:['aqalit','bruff','salles','pme']},
  englang:{how:['Write the section to time (Section A 60 min, Q5 45 min). Spread it across blocks if needed.','Mark it with the AQA mark scheme and note one target for next time.'], ln:['aqalang','bruff']}
 },
 3:{
  maths:{how:['Timed past-paper section (about 40 marks in 45 min).','Mark it with the mark scheme. Put every lost mark into your mistake log.','Next maths block: redo the mistakes first.'], ln:['mgp','pm1','pm2','pm3']},
  science:{how:['Half a paper (about 35 marks in 37 min). Mark it, then do corrections.','Make a flashcard for every lost mark.'], ln:['aqas','pmb','pmc','pmp']},
  hist:{how:['One timed section of an OCR J410 past paper.','Self-mark it with the mark scheme, then rewrite one answer.'], ln:['ocrpp']},
  german:{how:['Timed sample or past-paper section, or a speaking rehearsal: 2 role-plays and 1 photo card, recorded.','Reading aloud: practise the AQA sound rules (Appendix 1 of the spec).'], ln:['aqagar','aqagspec','app']},
  englit:{how:['Timed essay or full paper section. Mark it with the AQA descriptors.','Quote flashcards to finish.'], ln:['aqalit']},
  englang:{how:['Timed full section from a past paper, then mark it.'], ln:['aqalang']}
 }
};
HOW.x = HOW[1];
const GUIDE = {
 maths:{
  exam:['3 papers × 1 h 30, 80 marks each, Higher tier (grades 4–9).','Paper 1 is non-calculator (14 May). Papers 2 and 3 are calculator (27 May, 14 June).','All three papers cover any topic, so revise everything for every paper.'],
  aids:['A formulae sheet is GIVEN in 2027 (Ofqual decision): trapezium, prism, cylinder/cone/sphere, Pythagoras, trig ratios, compound interest, probability; Higher also gets the quadratic formula, sine and cosine rules, ½ab sin C and conditional probability.','NOT given, so learn them: speed/density/pressure, arc length and sector area, circle area and circumference, exact trig values (sin/cos/tan of 0°, 30°, 45°, 60°, 90°), y = mx + c, the area under a graph.'],
  tips:['Show the method on every question. Method marks are often worth more than the answer.','Grade 7–9 marks come from "show that" and proof questions. Practise writing the steps out fully.','Keep a mistake log: question, what went wrong, the correct method. Redo it after 3 days, then after a week.'],
  ln:['cm5','mg','mgp','cmv','drf','bbm','pear','pm1','pm2','pm3'],
  topics:['Indices, surds, standard form','Bounds and error intervals','Recurring decimals ↔ fractions','Expanding and factorising (incl. ax²+bx+c)','Rearranging formulae','Algebraic fractions','Quadratics: factorise, formula, completing the square','Simultaneous equations (incl. linear + quadratic)','Inequalities (incl. quadratic) and regions','Straight-line graphs, parallel and perpendicular','Quadratic, cubic, reciprocal, exponential graphs','Graph transformations','Direct and inverse proportion','Compound measures','Growth, decay, compound interest','Angles, polygons, circle theorems','Congruence and similarity','Pythagoras and trig (2D + 3D)','Sine rule, cosine rule, ½ab sin C','Exact trig values, trig graphs','Area, volume, arcs and sectors','Vectors and vector proof','Probability: trees, Venn, conditional','Histograms, cumulative frequency, box plots','Functions: composite and inverse','Iteration','Algebraic proof','Sequences (incl. quadratic nth term)','Gradients and area under graphs','Equation of a circle and tangents']
 },
 science:{
  exam:['6 papers × 1 h 15, 70 marks each, Higher tier, grades 4-4 to 9-9 (two GCSEs).','Paper 1s: Biology B1–B4 (11 May), Chemistry C1–C5 (17 May), Physics P1–P4 (25 May).','Paper 2s: Biology B5–B7 (10 June), Chemistry C6–C10 (15 June), Physics P5–P7 (18 June).','At least 15% of marks are maths, and questions on the 21 required practicals appear on every paper.'],
  aids:['An equation sheet is GIVEN in 2027 (Ofqual decision). For Physics, learn how to use the equations: units, symbols and rearranging. Don’t spend time memorising them.','A periodic table is given in Chemistry papers.'],
  tips:['6-mark questions reward a logical sequence: each step leads to the next. Practise them every week.','Use exact AQA vocabulary. The mark scheme accepts precise terms (e.g. "partially permeable membrane") and rejects vague ones.','Required practicals: know the method, variables, risks and how to improve accuracy.'],
  ln:['cog','cogyt','fsl','bbs','pmb','pmc','pmp','aqas','sen'],
  topics:['B1 Cell biology','B2 Organisation','B3 Infection and response','B4 Bioenergetics','B5 Homeostasis and response','B6 Inheritance, variation and evolution','B7 Ecology','C1 Atomic structure and the periodic table','C2 Bonding, structure and properties','C3 Quantitative chemistry','C4 Chemical changes','C5 Energy changes','C6 Rate and extent of chemical change','C7 Organic chemistry','C8 Chemical analysis','C9 Chemistry of the atmosphere','C10 Using resources','P1 Energy','P2 Electricity','P3 Particle model of matter','P4 Atomic structure','P5 Forces','P6 Waves','P7 Magnetism and electromagnetism','RP Biology: microscopy, osmosis, food tests, enzymes, photosynthesis, reaction time, quadrats','RP Chemistry: making salts, electrolysis, temperature changes, rates, chromatography, water purification','RP Physics: specific heat, resistance, I–V, density, springs, acceleration, waves, radiation']
 },
 hist:{
  exam:['Paper 1 (1 h 45, 50%), 20 May: Section A International Relations 1918–1975 (Q1 outline 5, Q2 explain 10, Q3 compare interpretations 25, Q4 essay using interpretations 25 + 5 SPaG). Section B USA 1919–1948 (describe 2, explain 10, sources 10, essay 18).','Paper 2 (1 h, 25%), 28 May: Migration to Britain c.1000–c.2010 (describe 4, explain 8, second-order concept 14, change/continuity essay 24).','Paper 3 (1 h 15, 25%), 9 June pm: Impact of Empire 1688–c.1730 (explain 10, essay using sources 25 + 5 SPaG) and the Spitalfields site study (explain 10, source comparison 10).'],
  aids:['No aids. Learn dates and names as flashcards. Your Anki deck has every date and person, split by paper.','The site study is fixed at Spitalfields, London (OCR spec: "from 2020 onwards"). Know Huguenot weavers, Irish, Eastern European Jews and Bangladeshis, and 59 Brick Lane: Huguenot chapel → Methodist chapel → synagogue → mosque (1976). Also Altab Ali (1978).'],
  tips:['Interpretations questions (Paper 1 Q3/Q4) are worth 50 marks. Practise explaining why historians disagree: when they wrote, what sources they had, the Cold War context, archives opening after 1990.','Every paragraph: Point → Evidence (specific date/name/statistic) → Explain → link back to the question.','The thematic essay needs change AND continuity across at least two eras.','Check with your teacher that your options match these (they match the most common J410 route). If any differ, tell me and I’ll swap them.'],
  ln:['bbh','bbcwv','bbcw','bbusa','bbmig','allsop','ocrspec','ocrpp','tna','app'],
  topics:['Versailles Peace Settlement','League of Nations in the 1920s','1920s agreements: Dawes, Locarno, Kellogg-Briand, Young','Disarmament','Depression and its effects on international relations','1930s: Manchuria, Abyssinia, League failure','Appeasement and the outbreak of war','Interpretations of Appeasement','Yalta, Potsdam, USSR in Eastern Europe 1945–48','Truman Doctrine, Marshall Plan','Berlin Blockade and Airlift; NATO and Warsaw Pact','Berlin Wall 1961','Cuban Missile Crisis 1962','Vietnam: origins 1954–65, tactics, withdrawal, impact','Interpretations of Cold War responsibility','USA: 1920s economy and prosperity','USA: women, Prohibition','USA: KKK, Jim Crow, Red Scare, Sacco & Vanzetti, immigration','USA: Depression, 1932 election, New Deals, reactions','USA: impact of WW2 on society','Migration c.1000–1500','Migration c.1500–1900','Migration 1900–c.2010','Empire: expansion in the British Isles','Empire: economic impact','Empire: political and social impact','Spitalfields site study']
 },
 german:{
  exam:['4 papers, each 25%, all Higher tier.','Listening (45 min, 50 marks), 10 May pm: 40 marks of comprehension + 10 marks of dictation (each sentence heard 3 times).','Reading (1 h, 50 marks), 10 May pm: 40 marks of comprehension + translation of 50+ words into English.','Writing (1 h 15, 50 marks), 18 May pm: translation of 50+ words into German (10), a 90-word task (15), a 150-word task (25).','Speaking (10–12 min + 15 min preparation, 50 marks): role-play (10), reading aloud + conversation (15), photo card + conversation (25). AQA’s window is 12 April – 21 May; your school sets the day.'],
  aids:['In the speaking test you can take the notes you made in the 15-minute preparation time into the room. Practise making fast notes.','No dictionary anywhere.'],
  tips:['Vocabulary is the engine. Your Anki deck has the full AQA 8662 list: German→English for every word and English→German for the Foundation list. The Practice tab adds typing practice.','Dictation is on the Listening paper, and some words are off the vocab list. Learn the sound rules (ei/ie, sch, z, w, ä/ö/ü) so you can spell words you’ve never seen.','Every written answer: 3 time frames (past, present, future), a weil/dass clause, an opinion with a reason.','Themes: 1 People & lifestyle · 2 Popular culture · 3 Communication & the world around us.'],
  ln:['app','bbg','aqagspec','aqagar','aqag','easy','anki'],
  topics:['Identity and relationships with others','Healthy living and lifestyle','Education and work','Free-time activities','Customs, festivals and celebrations','Celebrity culture','Travel and tourism','Media and technology','The environment and where people live','Grammar: present + word order','Grammar: cases, articles, modals','Grammar: perfect tense','Grammar: future + conditional','Grammar: subordinate clauses','Grammar: imperfect, comparatives','Grammar: prepositions, adjective endings','Grammar: pronouns, relative clauses, um…zu','Grammar: passive, pluperfect','Dictation and sound rules','Role-play','Reading aloud','Photo card']
 },
 englit:{
  exam:['Paper 1 (1 h 45), 12 May: Romeo and Juliet (extract → whole play, 30 + 4 SPaG) and Jekyll and Hyde (extract → whole novel, 30).','Paper 2 (2 h 15), 19 May: An Inspector Calls (essay choice, 30 + 4 SPaG), Power and Conflict comparison (one named poem + one of your choice, 30), unseen poetry (24 + 8).','Both papers are closed book, so you need quotes in your head.'],
  aids:['None. Learn about 15 quotes per text and 2–3 per poem as flashcards.'],
  tips:['Spend 50 minutes on each Paper 1 essay and 45 minutes on each Paper 2 text/anthology answer.','AO1 argument, AO2 methods, AO3 context. Context should explain the writer’s purpose, not be a bolt-on history fact.','Comparison: use connectives on every point (whereas, similarly) and compare methods, not just themes.','Set texts confirmed by you: R&J, J&H, AIC, Power and Conflict. The current AQA list still includes all four for 2027.'],
  ln:['bblit','bbaic','bbrj','bbjh','bbpc','bruff','salles','aqalit','grj','gjh','pme'],
  topics:['AIC: plot & characters','AIC: context (1912/1945, socialism)','AIC: themes + quotes','R&J: plot & characters','R&J: context','R&J: themes + quotes','J&H: plot & characters','J&H: context','J&H: themes + quotes','Ozymandias','London','The Prelude (Stealing the Boat)','My Last Duchess','The Charge of the Light Brigade','Exposure','Storm on the Island','Bayonet Charge','Remains','Poppies','War Photographer','Tissue','The Émigrée','Checking Out Me History','Kamikaze','Unseen poetry method']
 },
 englang:{
  exam:['Paper 1 (1 h 45), 24 May: fiction extract. Q1 (4) 5 min, Q2 language (8) 10 min, Q3 structure (8) 10 min, Q4 evaluation (20) 20 min, Q5 descriptive or narrative writing (40) 45 min.','Paper 2 (1 h 45), 8 June: two non-fiction texts. Q1 (4), Q2 summary (8), Q3 language (12), Q4 compare perspectives (16), Q5 viewpoint writing (40).','Spoken Language is a separate endorsement your school runs.'],
  aids:['None. Read the insert first and spend 15 minutes reading before you write.'],
  tips:['Q5 is half the marks on each paper. Plan for 5 minutes, write for 35, check for 5.','Use structure on purpose: a one-line paragraph, a cyclical ending, a zoom from wide to close.','Q4 on Paper 1: evaluate. Say how far you agree and back it with methods and effects.'],
  ln:['bbl','aqalang','bruff','salles','pme'],
  topics:['P1 Q1–Q2 language','P1 Q3 structure','P1 Q4 evaluation','P1 Q5 descriptive','P1 Q5 narrative','P2 Q1–Q2 summary','P2 Q3 language','P2 Q4 compare perspectives','P2 Q5 viewpoint writing','Accuracy: punctuation & spelling']
 }
};
RG.tt = { LINKS: L, WEEK, LIVE, HOLI, TIMES: BLOCK_TIMES, SKIPPED, PLAN, HOW, GUIDE };
})();
