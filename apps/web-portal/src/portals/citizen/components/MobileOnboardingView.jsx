import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const MobileOnboardingView = ({
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
  onComplete
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
    <div className="w-full min-h-screen bg-[#FCFCFD] text-[#111111] font-sans flex flex-col justify-between select-none relative overflow-x-hidden">
      {/* iOS Ambient Background Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] h-[340px] pointer-events-none opacity-40 blur-3xl -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(220, 235, 252, 0.8), rgba(240, 245, 250, 0.4) 60%, transparent 80%)'
        }}
      />

      {/* Top Navigation Bar - Apple Translucent Capsule */}
      <header className="sticky top-0 z-30 px-5 pt-4 pb-3 flex items-center justify-between backdrop-blur-xl bg-white/80 border-b border-neutral-200/50 transition-all">
        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 active:scale-95 transition-all -ml-1 mr-0.5"
              aria-label="Back"
            >
              <GoogleIcon name="arrow_back" size={20} />
            </button>
          )}
          <span className="text-xl font-bold tracking-tight text-black flex items-center">
            Setu<span className="w-1.5 h-1.5 rounded-full bg-black ml-0.5 self-baseline mb-0.5 inline-block"></span>
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60 ml-1">
            DHTE Jharkhand
          </span>
        </div>

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-neutral-500 hover:text-black px-3 py-1.5 rounded-full hover:bg-neutral-100 active:scale-95 transition-all"
          >
            Skip
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-neutral-500 hover:text-black px-3 py-1.5 rounded-full hover:bg-neutral-100 active:scale-95 transition-all"
          >
            Login
          </button>
        )}
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col justify-start px-5 py-4 overflow-y-auto">
        {currentStep < 3 ? (
          /* Step 1, 2, 3: Informational Slides */
          <div className="flex flex-col items-center text-center animate-fade-in my-auto py-2">
            {/* Step Counter Pill */}
            <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-[11px] font-bold tracking-wider text-neutral-700 uppercase shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
              Step {currentStep + 1} of {totalSteps}
            </div>

            {/* Editorial Illustration Card */}
            <div className="w-full max-w-[360px] aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-50 to-neutral-100/70 border border-neutral-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-5 p-3 flex items-center justify-center group relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                loading="eager"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5 pointer-events-none" />
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3.5 max-w-sm">
              {slide.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[11px] font-semibold text-neutral-700 bg-neutral-100/90 border border-neutral-200 px-2.5 py-1 rounded-full shadow-2xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 leading-snug mb-2.5 max-w-xs">
              {slide.title} <br />
              <span className="text-black bg-gradient-to-r from-neutral-950 to-neutral-700 bg-clip-text text-transparent">
                {slide.highlight}
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-sm mb-3">
              {slide.subtitle}
            </p>

            {/* Social Proof / Impact Callout */}
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 bg-white border border-neutral-200/70 px-3 py-1 rounded-full shadow-2xs">
              <GoogleIcon name="verified" size={14} className="text-emerald-600" />
              <span>{slide.stat}</span>
            </div>
          </div>
        ) : (
          /* Step 4: Role Selection & Localization Preferences */
          <div className="flex flex-col space-y-5 animate-fade-in pb-4">
            {/* Header Tag */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-[11px] font-bold tracking-wider text-neutral-700 uppercase shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Step 4 of {totalSteps}
              </div>
              <span className="text-[11px] font-medium text-neutral-500">
                Setup your profile
              </span>
            </div>

            {/* Screen Title */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-950 leading-tight">
                How will you use Setu?
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Choose your identity to customize reporting feeds and dashboards.
              </p>
            </div>

            {/* Bento Role Cards */}
            <div className="space-y-3" role="radiogroup" aria-label="Select role">
              {roles.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <article
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer active:scale-[0.985] ${
                      isSelected
                        ? 'border-neutral-950 bg-neutral-50/80 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                        : 'border-neutral-200/90 bg-white hover:border-neutral-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-2xs ${
                            isSelected
                              ? 'bg-neutral-950 text-white'
                              : 'bg-neutral-100 text-neutral-700 border border-neutral-200/60'
                          }`}
                        >
                          <GoogleIcon name={role.icon} size={20} />
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-neutral-950 leading-tight">
                            {role.title}
                          </h2>
                          <span className="text-[11px] text-neutral-500 font-medium">
                            {role.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* Apple Radio Indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 transition-all ${
                          isSelected
                            ? 'border-neutral-950 bg-neutral-950'
                            : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 mt-2.5 pl-1 leading-relaxed">
                      {role.detail}
                    </p>
                  </article>
                );
              })}
            </div>

            {/* Quick Preferences: Language & District */}
            <div className="rounded-2xl p-4 bg-white border border-neutral-200 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <GoogleIcon name="translate" size={15} /> Preferred Language
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">Can change anytime</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setSelectedLang(lang.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between active:scale-95 ${
                      selectedLang === lang.id
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 bg-neutral-50/70 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[10px] opacity-70">{lang.sub}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-neutral-100">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5 mb-2">
                  <GoogleIcon name="location_on" size={15} /> Primary District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                >
                  {districts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist} District
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Interactive Safe Area & Navigation Controls */}
      <footer className="sticky bottom-0 z-30 px-5 pt-3 pb-6 bg-white/95 backdrop-blur-md border-t border-neutral-200/60 flex flex-col items-center gap-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {/* Animated Apple Pill Indicators */}
        <div className="flex items-center justify-center gap-2" id="dots-container">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-8 bg-black'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleNext}
          className="w-full h-13 py-3.5 bg-black text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-900 active:scale-[0.985] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        >
          <span>
            {currentStep === totalSteps - 1
              ? `Continue as ${roles.find((r) => r.id === selectedRole)?.title || 'Citizen'}`
              : 'Continue'}
          </span>
          <GoogleIcon name="arrow_forward" size={18} />
        </button>

        {/* Authentic iOS Home Indicator */}
        <div className="w-32 h-1 bg-neutral-300 rounded-full mt-1"></div>
      </footer>
    </div>
  );
};
