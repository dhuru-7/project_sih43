import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const DesktopOnboardingView = ({
  currentStep,
  setCurrentStep,
  totalSteps,
  slides,
  selectedRole,
  setSelectedRole,
  roles,
  selectedLang,
  setSelectedLang,
  selectedDistrict,
  setSelectedDistrict,
  languages,
  districts,
  onComplete,
  onSwitchToMobile
}) => {
  const navigate = useNavigate();
  const slide = slides[currentStep] || slides[0];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(totalSteps - 1);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#111111] font-sans flex flex-col justify-between selection:bg-neutral-900 selection:text-white relative overflow-hidden">
      {/* Apple Ambient Atmospheric Gradients */}
      <div 
        className="absolute -top-32 left-1/4 w-[700px] h-[500px] pointer-events-none opacity-40 blur-[120px] -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(210, 230, 255, 0.9) 0%, rgba(240, 245, 252, 0.4) 60%, transparent 80%)'
        }}
      />
      <div 
        className="absolute bottom-0 right-10 w-[600px] h-[400px] pointer-events-none opacity-30 blur-[100px] -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(230, 245, 235, 0.8) 0%, rgba(245, 250, 245, 0.3) 60%, transparent 80%)'
        }}
      />

      {/* Top Header Bar - Apple Frosted Glass Header */}
      <header className="w-full max-w-7xl mx-auto px-8 pt-6 pb-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-bold tracking-tight text-neutral-950 flex items-center">
              Setu<span className="w-2 h-2 rounded-full bg-neutral-950 ml-0.5 inline-block"></span>
            </span>
          </div>
          <div className="h-4 w-px bg-neutral-200 mx-1"></div>
          <span className="text-xs font-semibold text-neutral-500 tracking-wide uppercase px-2.5 py-1 rounded-full bg-neutral-100/80 border border-neutral-200/60">
            Govt. of Jharkhand · DHTE
          </span>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          {/* Mobile Preview Mode Toggle */}
          <button
            onClick={onSwitchToMobile}
            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-950 bg-white hover:bg-neutral-50 border border-neutral-200/80 px-3 py-1.5 rounded-full shadow-2xs transition-all active:scale-95"
            title="Preview native mobile viewport framing"
          >
            <GoogleIcon name="smartphone" size={16} />
            <span>Mobile Preview</span>
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleSkip}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 px-3.5 py-1.5 rounded-full hover:bg-neutral-100 transition-all active:scale-95"
            >
              Skip Introduction
            </button>
          ) : null}

          <button
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-neutral-900 hover:text-black bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/60 px-4 py-1.5 rounded-full transition-all active:scale-95"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Dual-Column Apple Bento Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-6 flex items-center justify-center">
        <div className="w-full grid grid-cols-12 gap-8 items-center bg-white/70 backdrop-blur-2xl rounded-[36px] border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_0_1px_1px_rgba(0,0,0,0.03)] p-8 lg:p-10 min-h-[640px]">
          
          {/* Left Column: Visual Storytelling & Atmospheric Illustration */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-between h-full space-y-6 pr-0 lg:pr-4">
            
            {/* Step Pipeline Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {slides.map((s, idx) => {
                const isActive = idx === currentStep;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                      isActive
                        ? 'bg-neutral-950 text-white shadow-sm'
                        : 'bg-neutral-100/90 hover:bg-neutral-200/80 text-neutral-600 border border-neutral-200/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-white' : 'bg-neutral-400'
                      }`}
                    />
                    <span>{s.stepLabel || `0${idx + 1}`}</span>
                  </button>
                );
              })}
            </div>

            {/* Illustration Display Frame with Apple Bevel */}
            <div className="w-full aspect-[16/11] rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-50/90 to-neutral-100/60 border border-neutral-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.04)] p-6 flex items-center justify-center relative group">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain rounded-2xl transition-all duration-700 ease-out group-hover:scale-[1.02]"
                loading="eager"
              />
              
              {/* Subtle glass reflection overlay */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5 pointer-events-none" />

              {/* Floating Status Badge on Illustration */}
              <div className="absolute bottom-4 left-5 bg-white/90 backdrop-blur-md border border-neutral-200/70 rounded-2xl py-1.5 px-3.5 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-semibold text-neutral-800">
                  {slide.floatingBadge || 'DHTE Live Portal'}
                </span>
              </div>
            </div>

            {/* Bottom Proof Metric Card */}
            <div className="rounded-2xl p-4 bg-neutral-50/80 border border-neutral-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-emerald-600 shadow-2xs">
                  <GoogleIcon name="verified_user" size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    Department of Higher & Technical Education
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Connecting 3.8M citizens with 120+ accredited HEI research labs
                  </p>
                </div>
              </div>

              <div className="text-right pl-4">
                <span className="text-xs font-bold text-neutral-950 block">100% Free</span>
                <span className="text-[10px] text-neutral-400">Public Service</span>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Stage & Role Selection */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-between h-full pl-0 lg:pl-4 space-y-6">
            
            {currentStep < 3 ? (
              /* Informational Steps 1, 2, 3 */
              <div className="space-y-6 my-auto">
                <div>
                  {/* Step Tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-[11px] font-bold tracking-wider text-neutral-700 uppercase shadow-2xs mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                    Step {currentStep + 1} of {totalSteps} · {slide.stepName}
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 leading-[1.15] mb-3">
                    {slide.title} <br />
                    <span className="bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                      {slide.highlight}
                    </span>
                  </h1>

                  {/* Detailed Description */}
                  <p className="text-sm lg:text-base text-neutral-600 leading-relaxed max-w-xl">
                    {slide.subtitle}
                  </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {slide.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-900 shadow-2xs mb-2.5">
                        <GoogleIcon name={feat.icon} size={18} />
                      </div>
                      <h3 className="text-xs font-bold text-neutral-900 mb-1">
                        {feat.title}
                      </h3>
                      <p className="text-[11px] text-neutral-500 leading-normal">
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Impact Highlight Card */}
                <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{slide.highlightIcon || '💡'}</span>
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">
                        SIH 26043 Framework Aligned
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {slide.stat}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                    Active in Jharkhand
                  </span>
                </div>
              </div>
            ) : (
              /* Step 4: Role Selection & Localization */
              <div className="space-y-5 my-auto">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-[11px] font-bold tracking-wider text-neutral-700 uppercase shadow-2xs mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                    Step 4 of {totalSteps} · Personalization
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-950">
                    How will you use Setu?
                  </h1>
                  <p className="text-xs text-neutral-500 mt-1">
                    Select your primary stakeholder profile to enter the customized portal workspace.
                  </p>
                </div>

                {/* 4 Role Bento Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roles.map((role) => {
                    const isSelected = selectedRole === role.id;
                    return (
                      <article
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative active:scale-[0.985] ${
                          isSelected
                            ? 'border-neutral-950 bg-neutral-50/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                            : 'border-neutral-200/90 bg-white hover:border-neutral-300 hover:shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-2xs ${
                              isSelected
                                ? 'bg-neutral-950 text-white'
                                : 'bg-neutral-100 text-neutral-700 border border-neutral-200/60'
                            }`}
                          >
                            <GoogleIcon name={role.icon} size={18} />
                          </div>

                          {/* Apple Radio Circle */}
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 transition-all ${
                              isSelected
                                ? 'border-neutral-950 bg-neutral-950'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>

                        <h3 className="text-xs font-bold text-neutral-950 mt-2.5">
                          {role.title}
                        </h3>
                        <p className="text-[11px] text-neutral-500 font-medium line-clamp-1">
                          {role.subtitle}
                        </p>
                        <p className="text-[11px] text-neutral-600 mt-1.5 line-clamp-2 leading-relaxed">
                          {role.detail}
                        </p>
                      </article>
                    );
                  })}
                </div>

                {/* Preferences Strip: Language & District */}
                <div className="rounded-2xl p-4 bg-white border border-neutral-200/80 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Language Selector */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5 mb-2">
                      <GoogleIcon name="translate" size={14} /> Language
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {languages.map((lang) => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => setSelectedLang(lang.id)}
                          className={`py-1.5 px-2.5 rounded-xl text-[11px] font-semibold border transition-all text-left flex items-center justify-between ${
                            selectedLang === lang.id
                              ? 'border-black bg-black text-white'
                              : 'border-neutral-200 bg-neutral-50/70 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <span>{lang.label}</span>
                          <span className="text-[9px] opacity-70">{lang.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* District Selector */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5 mb-2">
                      <GoogleIcon name="location_on" size={14} /> Focus District
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    >
                      {districts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist} District
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Local issues will prioritize this district.
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentStep > 0 ? (
                  <button
                    onClick={handlePrev}
                    className="h-12 px-5 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <GoogleIcon name="arrow_back" size={16} />
                    <span>Back</span>
                  </button>
                ) : (
                  <span className="text-xs text-neutral-400 font-medium">
                    Jharkhand Higher & Technical Education
                  </span>
                )}
              </div>

              {/* Primary Next / Launch Pill Button */}
              <button
                onClick={handleNext}
                className="h-12 px-7 bg-neutral-950 hover:bg-black text-white rounded-2xl font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow active:scale-[0.985] transition-all focus:outline-none focus:ring-2 focus:ring-black/20"
              >
                <span>
                  {currentStep === totalSteps - 1
                    ? `Enter Setu as ${roles.find((r) => r.id === selectedRole)?.title || 'Citizen'}`
                    : 'Continue'}
                </span>
                <GoogleIcon name="arrow_forward" size={16} />
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Bottom Legal & Department Footer */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-200/50">
        <p>
          SETU — Societal Innovation Collaboration Portal · Smart India Hackathon 2024 · PS 26043
        </p>
        <p className="mt-1 sm:mt-0">
          Designed with Apple Human Interface Guidelines for Jharkhand Citizens & Institutions
        </p>
      </footer>
    </div>
  );
};
