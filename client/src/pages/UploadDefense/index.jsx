import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import SEO from '../../components/SEO';
import { NavigationBlocker } from '../../components/NavigationBlocker';
import { useDefenseLogic } from './hooks/useDefenseLogic';

import { UploadStep } from './steps/UploadStep';
import { FormStep } from './steps/FormStep';
import { PhaseConfirmationStep } from './steps/PhaseConfirmationStep';
import { PhaseSelectionStep } from './steps/PhaseSelectionStep';
import { AnalysisStep } from './steps/AnalysisStep';
import { ResultStep } from './steps/ResultStep';
import { HelpModal } from './components/modals/HelpModal';
import { HardBlockModal } from './components/modals/HardBlockModal';
import { LimitExceededModal } from './components/modals/LimitExceededModal';
import { LoginPromptModal } from './components/modals/LoginPromptModal';
import { DivergenceWarningModal } from './components/modals/DivergenceWarningModal';

const UploadDefense = () => {
    const { step: routeStep } = useParams();
    const step = routeStep || "upload";
    
    const logic = useDefenseLogic(step);
    
    const { 
        result, 
        showHelpModal, 
        setShowHelpModal, 
        showHardBlockModal, 
        setShowHardBlockModal,
        hardBlockInfo,
        showLimitModal,
        setShowLimitModal,
        showLoginPrompt,
        setShowLoginPrompt,
        showDivergenceModal,
        setShowDivergenceModal,
        analysisData,
        handleUploadAndExtract,
        handlePreAnalysis,
        formData
    } = logic;

    const renderStep = () => {
        switch (step) {
            case "upload":
                return <UploadStep {...logic} resetDefense={logic.resetDefense} />;
            case "form":
                return <FormStep {...logic} />;
            case "phaseConfirmation":
                return <PhaseConfirmationStep formData={logic.formData} />;
            case "phaseSelection":
                return <PhaseSelectionStep setFormData={logic.setFormData} setShowHelpModal={setShowHelpModal} />;
            case "analysis":
                return <AnalysisStep {...logic} />;
            case "result":
                return <ResultStep {...logic} />;
            default:
                return <UploadStep {...logic} resetDefense={logic.resetDefense} />;
        }
    };

    return (
        <MainLayout>
            <SEO
                title="Focado em Análise de Multa por Foto"
                description="Envie a foto da sua notificação de autuação e nossa IA extrairá os dados e analisará a viabilidade do recurso gratuitamente."
                keywords="analise multa foto, ocr multa, recurso ia, defesa transito"
            />
            <NavigationBlocker when={!!result} />
            
            {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
            {showHardBlockModal && <HardBlockModal hardBlockInfo={hardBlockInfo} onClose={() => setShowHardBlockModal(false)} />}
            
            {showLimitModal && (
                <LimitExceededModal 
                    onClose={() => setShowLimitModal(false)} 
                    onProceed={(e) => {
                        setShowLimitModal(false);
                        if (step === "form") {
                            handlePreAnalysis(e, true);
                        } else {
                            handleUploadAndExtract(true);
                        }
                    }}
                    step={step}
                />
            )}

            {showLoginPrompt && (
                <LoginPromptModal 
                    onClose={() => setShowLoginPrompt(false)} 
                    formData={formData}
                    source="upload"
                />
            )}

            {showDivergenceModal && (
                <DivergenceWarningModal 
                    onClose={() => setShowDivergenceModal(false)} 
                    analysisData={analysisData}
                />
            )}
            
            {renderStep()}
        </MainLayout>
    );
};

export default UploadDefense;
