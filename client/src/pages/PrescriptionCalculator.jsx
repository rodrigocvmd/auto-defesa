import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { Calendar, AlertTriangle, CheckCircle, Info, ArrowRight, Clock } from 'lucide-react';

const PrescriptionCalculator = () => {
  const [dates, setDates] = useState({
    infractionDate: '',
    notificationDate: '',
    autoDate: ''
  });

  const [results, setResults] = useState({
    decadence: null, // Art. 281
    prescription: null // 5 anos
  });

  const handleDateChange = (e) => {
    let { name, value } = e.target;
    value = value.replace(/\D/g, "").slice(0, 8);
    if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    setDates(prev => ({ ...prev, [name]: value }));
  };

  const parseDate = (dateStr) => {
    if (!dateStr || dateStr.length < 10) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const calculatePrescription = () => {
    const infraction = parseDate(dates.infractionDate);
    const notification = parseDate(dates.notificationDate);
    const auto = parseDate(dates.autoDate);
    const today = new Date();

    let decadenceResult = null;
    let prescriptionResult = null;

    // Lógica 1: Decadência (Art. 281, II - 30 dias para expedir a notificação)
    if (infraction && notification) {
      const diffTime = Math.abs(notification - infraction);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 30) {
        decadenceResult = {
          status: 'warning',
          title: 'Provável Decadência Detectada',
          message: `A notificação foi expedida ${diffDays} dias após a infração. Segundo o Art. 281, II do CTB, o auto de infração deve ser arquivado se a notificação não for expedida em no máximo 30 dias.`,
          law: 'Art. 281, Parágrafo Único, II do CTB'
        };
      } else {
        decadenceResult = {
          status: 'success',
          title: 'Prazo de Notificação Regular',
          message: `A notificação foi expedida dentro do prazo legal de 30 dias (${diffDays} dias).`,
          law: 'Art. 281, II do CTB'
        };
      }
    }

    // Lógica 2: Prescrição da Pretensão Punitiva (5 anos)
    if (auto) {
      const fiveYearsInMs = 5 * 365.25 * 24 * 60 * 60 * 1000;
      const diffTime = today - auto;

      if (diffTime > fiveYearsInMs) {
        prescriptionResult = {
          status: 'warning',
          title: 'Prescrição de 5 Anos Detectada',
          message: 'Já se passaram mais de 5 anos desde a data do auto de infração sem uma decisão definitiva. A pretensão punitiva do Estado provavelmente está prescrita.',
          law: 'Lei 9.873/99 e Resolução CONTRAN'
        };
      } else {
        const yearsRemaining = ((fiveYearsInMs - diffTime) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
        prescriptionResult = {
          status: 'success',
          title: 'Dentro do Prazo de 5 Anos',
          message: `A infração ainda está dentro do prazo prescricional. Faltam aproximadamente ${yearsRemaining} anos para a prescrição total.`,
          law: 'Lei 9.873/99'
        };
      }
    }

    if (!decadenceResult && !prescriptionResult) {
        alert("Por favor, preencha as datas corretamente (DD/MM/AAAA).");
        return;
    }

    setResults({ decadence: decadenceResult, prescription: prescriptionResult });
  };

  return (
    <MainLayout>
      <SEO 
        title="Calculadora de Prescrição de Multas | Auto Defesa" 
        description="Verifique se sua multa de trânsito está prescrita ou se houve decadência no prazo de notificação conforme o CTB."
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-2xl mb-6">
            <Clock size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Calculadora de <span className="text-blue-600">Prescrição e Decadência</span>
          </h1>
          <p className="text-lg text-gray-600">
            Descubra se o Estado perdeu o prazo para te multar ou cobrar a penalidade.
          </p>
        </header>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Seção Decadência */}
              <div className="space-y-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600" />
                  Prazo de Notificação (30 dias)
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data da Infração</label>
                  <input 
                    type="text"
                    name="infractionDate"
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={dates.infractionDate}
                    onChange={handleDateChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data da Expedição da Notificação</label>
                  <input 
                    type="text"
                    name="notificationDate"
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={dates.notificationDate}
                    onChange={handleDateChange}
                  />
                </div>
              </div>

              {/* Seção Prescrição */}
              <div className="space-y-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Clock size={20} className="text-blue-600" />
                  Prescrição Punitiva (5 anos)
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data do Auto de Infração</label>
                  <input 
                    type="text"
                    name="autoDate"
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={dates.autoDate}
                    onChange={handleDateChange}
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <Info size={14} className="inline mr-1 mb-0.5" />
                    A data do auto geralmente é a mesma da infração. A prescrição de 5 anos ocorre se o processo administrativo ficar parado ou demorar demais para ser julgado.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={calculatePrescription}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2"
            >
              Verificar Prazos Legais
            </button>

            {/* Resultados */}
            {(results.decadence || results.prescription) && (
              <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                {results.decadence && (
                  <div className={`p-6 rounded-2xl border ${results.decadence.status === 'warning' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-start gap-4">
                      {results.decadence.status === 'warning' ? (
                        <AlertTriangle className="text-orange-600 shrink-0" size={24} />
                      ) : (
                        <CheckCircle className="text-green-600 shrink-0" size={24} />
                      )}
                      <div>
                        <h4 className={`font-bold text-lg mb-1 ${results.decadence.status === 'warning' ? 'text-orange-900' : 'text-green-900'}`}>
                          {results.decadence.title}
                        </h4>
                        <p className={`text-sm mb-3 ${results.decadence.status === 'warning' ? 'text-orange-800' : 'text-green-800'}`}>
                          {results.decadence.message}
                        </p>
                        <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                          Base Legal: {results.decadence.law}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {results.prescription && (
                  <div className={`p-6 rounded-2xl border ${results.prescription.status === 'warning' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-start gap-4">
                      {results.prescription.status === 'warning' ? (
                        <AlertTriangle className="text-orange-600 shrink-0" size={24} />
                      ) : (
                        <CheckCircle className="text-green-600 shrink-0" size={24} />
                      )}
                      <div>
                        <h4 className={`font-bold text-lg mb-1 ${results.prescription.status === 'warning' ? 'text-orange-900' : 'text-green-900'}`}>
                          {results.prescription.title}
                        </h4>
                        <p className={`text-sm mb-3 ${results.prescription.status === 'warning' ? 'text-orange-800' : 'text-green-800'}`}>
                          {results.prescription.message}
                        </p>
                        <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                          Base Legal: {results.prescription.law}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-blue-600 rounded-3xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Sua multa está irregular?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Se você identificou uma possível prescrição ou decadência, nós podemos gerar o recurso técnico específico para pedir o arquivamento imediato.
            </p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-4 px-10 rounded-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1"
            >
              Gerar Recurso de Prescrição <ArrowRight size={20} />
            </Link>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-400 rounded-full opacity-20"></div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrescriptionCalculator;
