/* Which app topics each week's focus (RG.tt.PLAN) covers, so a self-study period can start a lesson on the right topic.
   RG.focus[phase][subject][week] = topic ids. '@<paperId>' means every topic on that paper. An empty list = no fixed focus:
   the planner picks the weakest / most overdue topic for that subject. Hand-matched to the PLAN text, Oct 2026. */
RG.focus = {
  1: {
    maths: [['m-num', 'm-surds', 'm-bounds', 'm-frac'], ['m-alg', 'm-eq'], ['m-quad', 'm-simul', 'm-eq'], ['m-lines', 'm-graphs'], ['m-ratio', 'm-rates', 'm-frac'],
      ['m-angles', 'm-circle', 'm-transf'], ['m-trig'], ['m-area', 'm-vectors'], ['m-prob', 'm-stats'], ['m-proof', 'm-seq', 'm-graphs']],
    science: [['b-cells', 'b-div', 'b-transport', 'c-atoms', 'p-energy'], ['b-digest', 'b-heart', 'b-disease', 'c-bonding', 'p-elec'], ['b-infection', 'c-quant', 'p-elec'],
      ['b-energy', 'c-changes', 'p-particles'], ['c-energy', 'p-atomic', 'p-skills'], ['b-nerves', 'b-hormones', 'c-rates', 'p-forces'], ['b-genetics', 'b-evolution', 'c-organic', 'p-forces'],
      ['b-genetics', 'c-analysis', 'p-waves'], ['b-ecology', 'c-atmos', 'c-resources', 'p-magnet'], ['p-skills']],
    hist: [['h-ir-peace', 'h-mig-med'], ['h-ir-war', 'h-mig-early', 'h-mig-modern'], ['h-ir-interp', 'h-ir-cw1', 'h-mig-early'], ['h-ir-cw1', 'h-mig-modern'], ['h-ir-cw2', 'h-ir-interp', 'h-mig-20c'],
      ['h-ir-cw2', 'h-ir-vietnam', 'h-mig-20c'], ['h-ir-vietnam', 'h-usa-20s'], ['h-usa-prej', 'h-empire'], ['h-usa-30s', 'h-empire-econ'], ['h-usa-war', 'h-empire-soc', 'h-spitalfields']],
    german: [['de-rel', 'de-tenses', 'de-wordorder'], ['de-health', 'de-cases'], ['de-school', 'de-tenses'], ['de-free', 'de-tenses'], ['de-fest', 'de-wordorder'],
      ['de-celeb', 'de-tenses'], ['de-travel', 'de-cases'], ['de-media', 'de-wordorder'], ['de-env', 'de-tenses'], ['de-exam']],
    englit: [['aic-plot'], ['aic-chars'], ['rj-plot'], ['rj-themes'], ['jh-plot'], ['jh-themes'], ['pc-1'], ['pc-2'], ['pc-3'], ['lit-unseen']],
    englang: [['el-p1q1', 'el-lang'], ['el-struct'], ['el-eval'], ['el-creative'], ['el-creative'], ['el-p1q1', 'el-compare'], ['el-lang'], ['el-compare'], ['el-viewpoint'], ['el-spag']],
  },
  x: { maths: [[]], science: [[]], hist: [[]], german: [[]], englit: [[]], englang: [[]] },
  2: {
    maths: [['m-num', 'm-ratio', 'm-frac'], ['m-quad', 'm-simul', 'm-eq'], ['m-graphs', 'm-lines'], ['m-circle', 'm-angles', 'm-transf'], ['m-trig'], ['m-vectors', 'm-proof'],
      ['m-prob'], ['m-stats'], ['m-proof', 'm-graphs'], ['m-exam'], ['m-exam'], ['m-exam']],
    science: [['b-cells', 'b-div', 'b-transport', 'b-digest', 'b-heart', 'b-disease'], ['c-atoms', 'c-bonding'], ['p-energy', 'p-equations'], ['b-infection', 'b-energy'], ['c-quant', 'c-changes'],
      ['c-energy', 'p-elec'], ['p-particles', 'p-atomic'], ['b-nerves', 'b-hormones', 'b-genetics', 'b-evolution'], ['c-rates', 'c-organic'], ['p-forces', 'p-equations'],
      ['b-ecology', 'c-analysis', 'c-atmos', 'c-resources'], ['p-waves', 'p-magnet', 'p-skills']],
    hist: [['h-ir-peace', 'h-ir-war'], ['h-ir-interp', 'h-ir-war'], ['h-ir-cw1'], ['h-ir-interp'], ['h-ir-cw2', 'h-ir-vietnam'], ['h-usa-20s', 'h-usa-prej'], ['h-usa-30s'], ['h-usa-war'],
      ['@h2'], ['@h2'], ['h-empire', 'h-empire-econ', 'h-empire-soc'], ['h-spitalfields']],
    german: [['de-rel', 'de-health', 'de-school', 'de-exam'], ['de-rel', 'de-health', 'de-school', 'de-exam'], ['de-rel', 'de-health', 'de-school', 'de-tenses'], ['de-exam'],
      ['de-free', 'de-fest', 'de-celeb', 'de-exam'], ['de-free', 'de-fest', 'de-celeb', 'de-exam'], ['de-free', 'de-fest', 'de-celeb', 'de-wordorder'], ['de-exam'],
      ['de-travel', 'de-media', 'de-env', 'de-exam'], ['de-travel', 'de-media', 'de-env', 'de-exam'], ['de-travel', 'de-media', 'de-env', 'de-cases'], ['de-exam']],
    englit: [['aic-chars'], ['aic-chars', 'aic-plot'], ['rj-themes'], ['rj-plot', 'rj-themes'], ['jh-themes'], ['jh-plot', 'jh-themes'], ['pc-1'], ['pc-2'], ['pc-3'], ['lit-unseen'], ['@lit1'], ['@lit2']],
    englang: [['el-p1q1', 'el-lang', 'el-struct', 'el-eval'], ['el-creative'], ['el-p1q1', 'el-lang', 'el-compare'], ['el-viewpoint'], ['el-p1q1', 'el-lang', 'el-struct', 'el-eval'], ['el-creative'],
      ['el-p1q1', 'el-lang', 'el-compare'], ['el-viewpoint'], ['el-eval', 'el-creative'], ['el-compare', 'el-viewpoint'], ['@el1'], ['@el2']],
  },
  3: {
    maths: [['m-exam'], ['m-exam'], ['m-exam'], ['m-exam'], [], ['m-exam']],
    science: [['@sb1', '@sc1'], ['@sp1'], ['@sb2', '@sc2'], ['@sp2'], ['p-skills'], ['@sb1', '@sc1']],
    hist: [['h-ir-peace', 'h-ir-war', 'h-ir-interp', 'h-ir-cw1', 'h-ir-cw2', 'h-ir-vietnam'], ['h-usa-20s', 'h-usa-prej', 'h-usa-30s', 'h-usa-war'], ['@h2'], ['@h3'], ['@h1'], ['@h1']],
    german: [['de-exam'], ['de-exam'], ['de-tenses', 'de-wordorder', 'de-cases'], ['de-exam'], ['de-exam'], ['de-tenses', 'de-wordorder', 'de-cases']],
    englit: [['@lit1'], ['@lit2'], [], ['@lit1'], ['@lit2'], []],
    englang: [['@el1'], ['@el2'], ['el-creative'], ['el-viewpoint'], ['@el1'], ['@el2']],
  },
};
