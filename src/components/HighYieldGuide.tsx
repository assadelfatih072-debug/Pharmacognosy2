import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Search, 
  FileText, 
  Sprout, 
  Layers, 
  FlaskConical, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Microscope,
  Award
} from 'lucide-react';
import { 
  DRUG_MATRIX, 
  PHYTOHORMONES, 
  EVALUATION_METHODS, 
  CHECKLIST_CATEGORIES,
  DrugMatrixItem 
} from '../data/highYieldData';
import { storage } from '../utils/storage';
import { sound } from '../utils/audio';

export const HighYieldGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'phyto' | 'evaluation' | 'concepts' | 'checklist'>('matrix');
  const [drugSearch, setDrugSearch] = useState<string>('');
  const [checkedIds, setCheckedIds] = useState<string[]>(() => storage.getChecklist());

  const handleToggleCheck = (id: string) => {
    sound.playClick();
    storage.toggleChecklist(id);
    setCheckedIds(storage.getChecklist());
  };

  const totalChecklistItems = CHECKLIST_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedChecklistItems = checkedIds.length;
  const checklistPct = Math.round((completedChecklistItems / totalChecklistItems) * 100);

  // Filter drug matrix
  const filteredDrugs = DRUG_MATRIX.filter((item) => {
    if (!drugSearch.trim()) return true;
    const query = drugSearch.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.botanicalSource.toLowerCase().includes(query) ||
      item.partUsed.toLowerCase().includes(query) ||
      item.majorConstituent.toLowerCase().includes(query) ||
      item.chemicalClass.toLowerCase().includes(query) ||
      item.therapeuticUse.toLowerCase().includes(query) ||
      item.keyExamFact.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top High Yield Hero */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>High-Yield Pharmacognosy II Blueprint</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Lectures 1–10 Master Review Matrix
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Essential botanical sources, active principles, classification matrices, and the high-yield revision checklist compiled for rapid pre-exam mastery.
          </p>
        </div>

        {/* Mini progress tracker */}
        <div className="mt-6 pt-4 border-t border-emerald-700/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            Checklist Completion:{' '}
            <strong className="text-white font-bold">{completedChecklistItems}</strong> /{' '}
            {totalChecklistItems} topics verified ({checklistPct}%)
          </div>
          <div className="w-48 h-2 rounded-full bg-emerald-950/80 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${checklistPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'matrix', label: '🌿 Drug Reference Matrix (17 Monographs)', count: DRUG_MATRIX.length },
          { id: 'phyto', label: '🌱 Phytohormones', count: 5 },
          { id: 'evaluation', label: '🔬 6 Evaluation Methods', count: 6 },
          { id: 'concepts', label: '📑 Core Concepts & Taxonomy', count: null },
          { id: 'checklist', label: '✅ Exam Revision Checklist', count: `${completedChecklistItems}/${totalChecklistItems}` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(tab.id as typeof activeTab);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. MASTER DRUG REFERENCE MATRIX */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search drug, part used, constituent, action..."
                value={drugSearch}
                onChange={(e) => setDrugSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs text-slate-500">
              Showing <strong>{filteredDrugs.length}</strong> of {DRUG_MATRIX.length} high-yield monographs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDrugs.map((drug) => (
              <div
                key={drug.name}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{drug.name}</span>
                    </h3>
                    <p className="text-xs italic text-emerald-700 dark:text-emerald-400 font-medium">
                      {drug.botanicalSource}
                    </p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    {drug.chemicalClass.split('/')[0]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Part Used
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {drug.partUsed}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Major Constituent(s)
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                      {drug.majorConstituent}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Therapeutic & Pharmacological Action
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg font-medium">
                    {drug.therapeuticUse}
                  </p>
                </div>

                <div className="text-xs bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40 p-2.5 rounded-xl space-y-1">
                  <span className="text-amber-800 dark:text-amber-300 font-bold text-[10px] uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Lecture Exam Highlight
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-snug">
                    {drug.keyExamFact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. PHYTOHORMONES */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'phyto' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              Plant Growth Regulators (Phytohormones) Comparison
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Phytohormones regulate plant cell division, elongation, apical dominance, dormancy, and stress responses.
              Pay special attention to primary growth (length via apical meristems) vs secondary growth (diameter via lateral cambium).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PHYTOHORMONES.map((phyto) => (
              <div
                key={phyto.name}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {phyto.name}
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium">
                    {phyto.type}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <span className="font-semibold text-slate-400 uppercase text-[10px]">
                    Primary Physiological Action
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {phyto.primaryAction}
                  </p>
                </div>

                <div className="text-xs space-y-1">
                  <span className="font-semibold text-slate-400 uppercase text-[10px]">
                    Agricultural & Pharma Applications
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    {phyto.agriculturalPharmaUses}
                  </p>
                </div>

                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 p-2.5 rounded-xl text-xs space-y-0.5">
                  <span className="text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase">
                    Exam Trigger:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {phyto.keyExamFact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. THE 6 EVALUATION METHODS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'evaluation' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              The Six Recognized Drug Evaluation Methods
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standardized Pharmacopoeial evaluation establishes true identity, purity, and quality. Note: <em>Economic evaluation is NOT a recognized quality test</em>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EVALUATION_METHODS.map((method) => (
              <div
                key={method.type}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  {method.type}
                </h4>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {method.definition}
                </p>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Key Evaluated Parameters:
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc list-inside space-y-0.5">
                    {method.parameters.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl text-xs space-y-1">
                  <span className="text-slate-500 font-semibold text-[10px] uppercase">
                    High-Yield Examples:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200">
                    {method.keyExamples}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. CORE CONCEPTS & TAXONOMY */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'concepts' && (
        <div className="space-y-6">
          {/* Comparison Cards: Organized vs Unorganized */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Organized Crude Drugs
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Derived directly from cellular parts of plants or animals possessing definite anatomical structure.
              </p>
              <div className="text-xs space-y-1">
                <span className="font-semibold text-slate-500">Diagnostic Identification:</span>
                <p className="text-slate-800 dark:text-slate-200">Morphology (macroscopic form) & Microscopy (histological sections, stomata, trichomes).</p>
              </div>
              <div className="text-xs space-y-1">
                <span className="font-semibold text-slate-500">Representative Examples:</span>
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">Leaves (Senna, Digitalis), Barks (Cinchona, Cinnamon), Roots (Rauwolfia, Ipecac), Flower buds (Clove), Seeds (Nux-vomica).</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                Unorganized Crude Drugs
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Non-cellular acellular products, exudates, and extracts devoid of cell walls or histological structures.
              </p>
              <div className="text-xs space-y-1">
                <span className="font-semibold text-slate-500">Diagnostic Identification:</span>
                <p className="text-slate-800 dark:text-slate-200">Physical constants (solubility, optical rotation, refractive index) & Chemical color tests.</p>
              </div>
              <div className="text-xs space-y-1">
                <span className="font-semibold text-slate-500">Representative Examples:</span>
                <p className="text-teal-700 dark:text-teal-300 font-medium">Gums (Acacia, Tragacanth), Mucilages, Dried latex (Opium), Resins, Dried juices (Aloe), Fixed/Volatile oils, Agar.</p>
              </div>
            </div>
          </div>

          {/* Gums vs Mucilages */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Gums vs Mucilages (Classic Exam Distinction)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">Gums (e.g. Acacia, Tragacanth)</div>
                <p className="text-slate-600 dark:text-slate-300">
                  Produced as <strong>pathological products</strong> resulting from the destruction and breakdown of cell walls (<em>gummosis</em>) triggered by mechanical injury, insect bites, or adverse stress conditions.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="font-bold text-teal-700 dark:text-teal-400 text-sm">Mucilages (e.g. Plantago / Psyllium, Althaea)</div>
                <p className="text-slate-600 dark:text-slate-300">
                  Formed as <strong>normal physiological products</strong> of plant metabolism inside healthy cells. They swell in water to produce thick, slippery colloidal solutions without requiring mechanical injury.
                </p>
              </div>
            </div>
          </div>

          {/* 7-Step Plant to Product & 6 Quality Pillars */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Plant-to-Phytopharmaceutical Sequence & 6 Quality Pillars
            </h4>

            {/* Step Sequence */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              {[
                '1. Selection',
                '2. Collection',
                '3. Authentication',
                '4. Extraction',
                '5. Evaluation',
                '6. Formulation',
                '7. Commercialization',
              ].map((step, idx) => (
                <React.Fragment key={step}>
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {step}
                  </span>
                  {idx < 6 && <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />}
                </React.Fragment>
              ))}
            </div>

            {/* 6 Pillars */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                The 6 Essential Pillars of a Reliable Phytopharmaceutical:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
                {['Identity', 'Purity', 'Quality', 'Efficacy', 'Safety', 'Stability'].map((p) => (
                  <div key={p} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Taxonomic Hierarchy */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Taxonomical Hierarchy (KPCOFGS)
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              {[
                { rank: 'Kingdom', label: 'Plantae' },
                { rank: 'Phylum / Division', label: 'Spermatophyta' },
                { rank: 'Class', label: 'Magnoliopsida' },
                { rank: 'Order', label: 'Gentianales' },
                { rank: 'Family', label: 'Apocynaceae' },
                { rank: 'Genus', label: 'Catharanthus' },
                { rank: 'Species', label: 'roseus' },
              ].map((item, idx) => (
                <React.Fragment key={item.rank}>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">{item.rank}</div>
                    <div className="text-[11px] text-slate-500 italic">{item.label}</div>
                  </div>
                  {idx < 6 && <span className="text-slate-400">→</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Mnemonic: &ldquo;<strong>K</strong>ing <strong>P</strong>hilip <strong>C</strong>ame <strong>O</strong>ver <strong>F</strong>or <strong>G</strong>ood <strong>S</strong>oup&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. INTERACTIVE EXAM REVISION CHECKLIST */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                High-Yield Lecture Revision Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Check off core concepts as you review them. Status is saved automatically.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  const allItemIds = CHECKLIST_CATEGORIES.flatMap((c) => c.items.map((i) => i.id));
                  allItemIds.forEach((id) => {
                    if (!checkedIds.includes(id)) storage.toggleChecklist(id);
                  });
                  setCheckedIds(storage.getChecklist());
                }}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-2 py-1"
              >
                Mark All Complete
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  localStorage.removeItem('pharma_checklist_v1');
                  setCheckedIds([]);
                }}
                className="text-xs text-slate-400 hover:text-rose-500 font-medium px-2 py-1"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {CHECKLIST_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                  {category.title}
                </h4>

                <div className="space-y-2">
                  {category.items.map((item) => {
                    const isChecked = checkedIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleCheck(item.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60'
                            : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 fill-emerald-600 text-white" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <div className="space-y-0.5">
                          <span
                            className={`text-xs sm:text-sm font-semibold block ${
                              isChecked
                                ? 'text-emerald-950 dark:text-emerald-200 line-through decoration-emerald-500/60'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {item.text}
                          </span>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {item.details}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
