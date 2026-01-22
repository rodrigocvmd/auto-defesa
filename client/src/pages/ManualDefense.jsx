import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { 
  AlertCircle, User, Car, FileText, ArrowLeft, Loader2, 
  CheckCircle, Copy, Search, MapPin, Gauge, FileCheck,
  Scale, Gavel, FileWarning, HelpCircle, X, ArrowDown, Upload,
  PenTool, Download, Send, RotateCcw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { jsPDF } from 'jspdf';

const ManualDefense = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState('selection'); // 'selection' | 'form'
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [searchingCode, setSearchingCode] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  
  const [result, setResult] = useState(null);
  
  const [isRefining, setIsRefining] = useState(false);
  const [refinementText, setRefinementText] = useState('');
  
  const [formData, setFormData] = useState({
    defenseType: '', 
    name: '',
    nationality: 'Brasileiro(a)',
    maritalStatus: '',
    profession: '',
    rg: '',
    rgIssuer: '',
    cpf: '',
    cnh: '',
    cnhCategory: '',
    address: '',
    addressNumber: '',
    addressComplement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    plate: '',
    plateUF: '',
    vehicleModel: '',
    issuingBody: '',
    aitNumber: '',
    date: '',
    time: '',
    location: '',
    article: '',
    infractionCode: '', 
    infractionSplit: '', 
    description: '', 
    equipmentNumber: '',
    lastCalibration: '',
    signCity: '',
    signDate: new Date().toLocaleDateString('pt-BR')
  });

  // Atualiza cidade da assinatura automaticamente
  useEffect(() => {
    if (formData.city && !formData.signCity) {
      setFormData(prev => ({ ...prev, signCity: prev.city }));
    }
  }, [formData.city]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    // Prevenção de uncontrolled input
    if (value === undefined || value === null) value = '';

    // Máscaras
    if (name === 'cpf') {
      value = value.replace(/\D/g, '').slice(0, 11);
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 11);
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    if (name === 'date') {
      value = value.replace(/\D/g, '').slice(0, 8);
      if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
      else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      alert("Por favor, insira um e-mail válido.");
      return false;
    }
    // CPF simples check
    if (formData.cpf.length < 14) {
      alert("CPF inválido.");
      return false;
    }
    return true;
  };

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
          signCity: data.localidade || prev.signCity
        }));
      } else {
        alert("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSearchCode = async () => {
    if (!formData.infractionCode) return;
    setSearchingCode(true);
    try {
      const response = await api.getInfraction({ 
        code: formData.infractionCode, 
        desdobramento: formData.infractionSplit 
      });
      if (response && response.success) {
        const { article, description } = response.data;
        setFormData(prev => ({
          ...prev,
          article: article || prev.article,
          description: prev.description ? prev.description : `Autuado por: ${description}. ` 
        }));
      }
    } catch (error) {
      alert("Código não encontrado.");
    } finally {
      setSearchingCode(false);
    }
  };

  const handleSelectType = (type) => {
    setFormData(prev => ({ ...prev, defenseType: type }));
    setStep('form');
    // Scroll para o topo para garantir visibilidade
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.generateDefense(formData);
      if (response.success) {
        setResult(response.data.defenseText);
      }
    } catch (err) {
      alert("Erro ao gerar defesa.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefinementSubmit = async () => {
    if (!refinementText.trim()) return;
    setRefining(true);
    try {
      const response = await api.generateDefense({
        ...formData,
        previousDefense: result,
        refinementInstructions: refinementText
      });
      if (response.success) {
        setResult(response.data.defenseText);
        setIsRefining(false); 
        setRefinementText(''); 
        alert("Defesa atualizada!");
      }
    } catch (err) {
      alert("Erro ao atualizar.");
    } finally {
      setRefining(false);
    }
  };

  const handleFinalizePDF = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(result, 160);
    let cursorY = 25;
    splitText.forEach(line => {
      if (cursorY > 270) { doc.addPage(); cursorY = 25; }
      const isTitle = line.length < 50 && line === line.toUpperCase() && line.trim().length > 0;
      if (isTitle) {
        doc.setFont("times", "bold");
        doc.text(line, 105, cursorY, { align: "center" });
        doc.setFont("times", "normal");
      } else {
        doc.text(line, 25, cursorY, { align: "justify", maxWidth: 160 });
      }
      cursorY += 6;
    });
    const fileName = `Defesa_${formData.plate || 'Recurso'}.pdf`;
    doc.save(fileName);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert("Copiado!");
    }
  };

  const HelpModal = () => (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button onClick={() => setShowHelpModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-500" /></button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4"><HelpCircle className="text-blue-600" /> Entenda as Fases da Defesa</h2>
          <div className="space-y-4">
            <div className="p-5 bg-yellow-50 rounded-2xl border border-yellow-100 shadow-sm"><h3 className="font-bold text-lg text-yellow-900 mb-2 flex items-center gap-2"><FileWarning size={22} /> 1. Defesa Prévia</h3><p className="text-sm text-yellow-800 leading-relaxed"><strong>Quando:</strong> Você recebeu apenas a "Notificação de Autuação".<br/><strong>Objetivo:</strong> Apontar erros formais antes da multa virar penalidade.<br/><span className="block mt-2 font-bold flex items-center gap-1 italic">👉 Caso negada, permite a interposição de Recurso à JARI.</span></p></div>
            <div className="flex justify-center text-gray-300"><ArrowDown size={32} /></div>
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm"><h3 className="font-bold text-lg text-blue-900 mb-2 flex items-center gap-2"><Gavel size={22} /> 2. Recurso à JARI</h3><p className="text-sm text-blue-800 leading-relaxed"><strong>Quando:</strong> Recebeu a multa com boleto ou perdeu a prévia.<br/><strong>Objetivo:</strong> Discutir o mérito da infração.<br/><span className="block mt-2 font-bold flex items-center gap-1 italic">👉 Caso negado, permite a interposição de Recurso ao CETRAN/CONTRADIFE.</span></p></div>
            <div className="flex justify-center text-gray-300"><ArrowDown size={32} /></div>
            <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm"><h3 className="font-bold text-lg text-purple-900 mb-2 flex items-center gap-2"><Scale size={22} /> 3. Recurso ao CETRAN/CONTRADIFE</h3><p className="text-sm text-purple-800 leading-relaxed"><strong>Quando:</strong> Recurso na JARI indeferido.<br/><strong>Objetivo:</strong> Última tentativa administrativa.</p></div>
          </div>
          <div className="mt-10 p-6 bg-blue-600 rounded-2xl text-white text-center space-y-4 shadow-xl">
             <p className="font-medium text-blue-50">Ainda não sabe a fase da defesa em que se encontra? <br className="hidden md:block"/>Faça o upload do seu Auto de Infração que nossa IA fará tudo por você!</p>
             <button onClick={() => navigate('/upload')} className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto shadow-sm"><Upload size={18} /> Ir para Upload com IA</button>
          </div>
          <div className="mt-6 text-center"><button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors">Fechar explicação</button></div>
        </div>
      </div>
    </div>
  );

  // --- RENDERIZAÇÃO CONDICIONAL ROBUSTA ---

  // CASO 1: RESULTADO GERADO
  if (result) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-8">
          <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-in slide-in-from-top-4">
            <div><h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><CheckCircle className="text-green-500" /> Defesa Gerada</h2><p className="text-xs text-gray-500">Revise o documento abaixo antes de finalizar.</p></div>
            <div className="flex gap-3">
              <button onClick={() => setIsRefining(!isRefining)} disabled={refining} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2">{refining ? <Loader2 className="animate-spin" size={18} /> : <PenTool size={18} />}{isRefining ? 'Cancelar Alteração' : 'Apontar Alterações'}</button>
              <button onClick={handleFinalizePDF} className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-md hover:shadow-green-200"><Download size={18} /> Baixar PDF Final</button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-2 ${isRefining ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}><div className="bg-white p-12 shadow-2xl min-h-[800px] font-serif text-gray-900 leading-relaxed text-justify border border-gray-200 relative"><div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div><div className="whitespace-pre-wrap">{result}</div></div></div>
            <div className="lg:col-span-1 space-y-6">
              {isRefining && (<div className="bg-blue-600 p-6 rounded-2xl shadow-xl text-white animate-in slide-in-from-right sticky top-40"><h3 className="font-bold text-lg mb-2 flex items-center gap-2"><PenTool size={20} /> O que deseja mudar?</h3><textarea value={refinementText} onChange={(e) => setRefinementText(e.target.value)} rows={6} className="w-full p-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-4 focus:ring-blue-400/50" placeholder="Ex: 'Adicione que havia uma árvore tapando a placa'..." /><div className="mt-4 flex justify-end"><button onClick={handleRefinementSubmit} disabled={!refinementText.trim() || refining} className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">{refining ? 'Reescrevendo...' : 'Atualizar Documento'} <Send size={16} /></button></div></div>)}
              {!isRefining && (<div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sticky top-40"><div className="flex items-center gap-2 mb-4"><FileCheck className="text-amber-600" /><h3 className="font-bold text-amber-900">Checklist Final</h3></div><ul className="space-y-3 text-sm"><li className="flex gap-2">✓ Imprimir e Assinar</li><li className="flex gap-2">✓ Anexar Cópia CNH/RG</li><li className="flex gap-2">✓ Anexar Cópia CRLV</li><li className="flex gap-2">✓ Anexar Notificação</li></ul><button onClick={() => setResult(null)} className="mt-6 w-full py-2 text-amber-700 hover:bg-amber-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"><RotateCcw size={14} /> Começar do Zero</button></div>)}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 2. TELA DE FORMULÁRIO (STEP === 'form')
  if (step === 'form') {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <button onClick={() => setStep('selection')} className="text-gray-500 hover:text-blue-600 flex items-center mb-4 transition-colors font-medium"><ArrowLeft size={20} className="mr-1" /> Mudar fase do recurso</button>
            <h1 className="text-3xl font-bold text-gray-900">{formData.defenseType === 'previa' ? 'Defesa Prévia' : formData.defenseType === 'jari' ? 'Recurso JARI' : 'Recurso CETRAN'}</h1>
            <div className="flex items-center gap-2 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 max-w-2xl"><AlertCircle size={18} className="shrink-0" /><p>Os dados solicitados abaixo são obrigatórios conforme a <strong>Resolução CONTRAN nº 900/2022</strong>.</p></div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            {loading && (<div className="fixed inset-0 bg-white/80 z-[100] flex flex-col items-center justify-center"><Loader2 size={60} className="text-blue-600 animate-spin mb-4" /><h2 className="text-2xl font-bold text-gray-800">Processando sua defesa...</h2><p className="text-gray-500">Nossa IA está fundamentando seu recurso.</p></div>)}

            {/* 1. DADOS PESSOAIS */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 border-b pb-4"><User className="text-blue-600" /><h3 className="text-xl font-bold text-gray-800">1. Qualificação do Recorrente</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2"><label className="label-form">Nome Completo <span className="text-red-500">*</span></label><input name="name" value={formData.name} onChange={handleChange} className="input-form focus:bg-white" required /></div>
                <div><label className="label-form">CPF <span className="text-red-500">*</span></label><input name="cpf" value={formData.cpf} onChange={handleChange} className="input-form focus:bg-white" placeholder="000.000.000-00" required /></div>
                <div><label className="label-form">RG <span className="text-red-500">*</span></label><input name="rg" value={formData.rg} onChange={handleChange} className="input-form focus:bg-white" placeholder="1.234.567" required /></div>
                <div><label className="label-form">Órgão Emissor <span className="text-red-500">*</span></label><input name="rgIssuer" value={formData.rgIssuer} onChange={handleChange} className="input-form focus:bg-white" placeholder="SSP/DF" required /></div>
                <div><label className="label-form">Nacionalidade <span className="text-red-500">*</span></label><input name="nationality" value={formData.nationality} onChange={handleChange} className="input-form focus:bg-white" required /></div>
                <div><label className="label-form">Estado Civil <span className="text-red-500">*</span></label><select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input-form focus:bg-white" required><option value="">Selecione...</option><option value="Solteiro(a)">Solteiro(a)</option><option value="Casado(a)">Casado(a)</option><option value="Divorciado(a)">Divorciado(a)</option><option value="Viúvo(a)">Viúvo(a)</option></select></div>
                <div><label className="label-form">Profissão</label><input name="profession" value={formData.profession} onChange={handleChange} className="input-form focus:bg-white" /></div>
                <div><label className="label-form">Número CNH <span className="text-red-500">*</span></label><input name="cnh" value={formData.cnh} onChange={handleChange} className="input-form focus:bg-white" placeholder="Obrigatório" required /></div>
                <div><label className="label-form">Categoria CNH</label><input name="cnhCategory" value={formData.cnhCategory} onChange={handleChange} className="input-form focus:bg-white" placeholder="Ex: AB" /></div>
                <div className="md:col-span-1"><label className="label-form">Telefone <span className="text-red-500">*</span></label><input name="phone" value={formData.phone} onChange={handleChange} className="input-form focus:bg-white" placeholder="(61) 99999-9999" required /></div>
                <div className="md:col-span-2"><label className="label-form">E-mail <span className="text-red-500">*</span></label><input name="email" value={formData.email} onChange={handleChange} type="email" className="input-form focus:bg-white" placeholder="seu@email.com" required /></div>
              </div>
              <div className="pt-6 border-t border-gray-100 mt-4">
                <h4 className="text-sm font-bold text-blue-600 mb-6 uppercase tracking-widest flex items-center gap-2"><MapPin size={16} /> Endereço Residencial Completo</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div><label className="label-form">CEP (Busca Automática) <span className="text-red-500">*</span></label><div className="relative"><input name="zipCode" value={formData.zipCode} onChange={handleChange} onBlur={handleCepBlur} className="input-form focus:bg-white" placeholder="00000-000" required />{loadingCep && <Loader2 className="animate-spin absolute right-3 top-3 text-blue-600" size={20} />}</div></div>
                  <div className="md:col-span-3"><label className="label-form">Logradouro (Rua/Av) <span className="text-red-500">*</span></label><input name="address" value={formData.address} onChange={handleChange} className="input-form focus:bg-white" required /></div>
                  <div><label className="label-form">Número <span className="text-red-500">*</span></label><input name="addressNumber" value={formData.addressNumber} onChange={handleChange} className="input-form focus:bg-white" required /></div>
                  <div><label className="label-form">Complemento</label><input name="addressComplement" value={formData.addressComplement} onChange={handleChange} className="input-form focus:bg-white" placeholder="Ex: Apto 101" /></div>
                  <div className="md:col-span-2"><label className="label-form">Bairro <span className="text-red-500">*</span></label><input name="neighborhood" value={formData.neighborhood} onChange={handleChange} className="input-form focus:bg-white" required /></div>
                  <div className="md:col-span-2"><label className="label-form">Cidade <span className="text-red-500">*</span></label><input name="city" value={formData.city} onChange={handleChange} className="input-form focus:bg-white" required /></div>
                  <div className="md:col-span-2"><label className="label-form">UF <span className="text-red-500">*</span></label><input name="state" value={formData.state} onChange={handleChange} className="input-form focus:bg-white uppercase" maxLength={2} required /></div>
                </div>
              </div>
            </section>

            {/* 2. DADOS DO VEÍCULO */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 border-b pb-4"><Car className="text-blue-600" /><h3 className="text-xl font-bold text-gray-800">2. Qualificação do Veículo</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div><label className="label-form">Placa <span className="text-red-500">*</span></label><input name="plate" value={formData.plate} onChange={handleChange} className="input-form focus:bg-white uppercase" placeholder="ABC-1234" required /></div>
                <div><label className="label-form">UF Placa <span className="text-red-500">*</span></label><input name="plateUF" value={formData.plateUF} onChange={handleChange} className="input-form focus:bg-white uppercase" maxLength={2} required /></div>
                <div><label className="label-form">Marca/Modelo <span className="text-red-500">*</span></label><input name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} className="input-form focus:bg-white" placeholder="Ex: VW Gol 1.0" required /></div>
              </div>
            </section>

            {/* 3. DADOS DA INFRAÇÃO */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 border-b pb-4"><MapPin className="text-blue-600" /><h3 className="text-xl font-bold text-gray-800">3. Qualificação da Infração</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div><label className="label-form">Número do Auto (AIT) <span className="text-red-500">*</span></label><input name="aitNumber" value={formData.aitNumber} onChange={handleChange} className="input-form focus:bg-white uppercase" placeholder="YE123456" required /></div>
                
                {/* CÓDIGO DA INFRAÇÃO INTEGRADO */}
                <div>
                  <label className="label-form">Código da Infração <span className="text-red-500">*</span></label>
                  <div className="flex gap-1">
                    <input name="infractionCode" value={formData.infractionCode} onChange={handleChange} className="input-form focus:bg-white w-2/3" placeholder="5010" required />
                    <input name="infractionSplit" value={formData.infractionSplit} onChange={handleChange} className="input-form focus:bg-white w-1/3 text-center" placeholder="0" />
                    <button type="button" onClick={handleSearchCode} className="bg-blue-100 text-blue-600 p-3 rounded-xl hover:bg-blue-200 transition-colors">{searchingCode ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}</button>
                  </div>
                </div>

                <div><label className="label-form">Órgão Autuador <span className="text-red-500">*</span></label><input name="issuingBody" value={formData.issuingBody} onChange={handleChange} className="input-form focus:bg-white" placeholder="Ex: DETRAN/DF" required /></div>
                <div><label className="label-form">Data <span className="text-red-500">*</span></label><input type="text" name="date" value={formData.date} onChange={handleChange} className="input-form focus:bg-white" placeholder="DD/MM/AAAA" maxLength={10} required /></div>
                <div><label className="label-form">Horário <span className="text-red-500">*</span></label><input name="time" type="time" value={formData.time} onChange={handleChange} className="input-form focus:bg-white" required /></div>
                <div className="md:col-span-3"><label className="label-form">Local da Infração <span className="text-red-500">*</span></label><input name="location" value={formData.location} onChange={handleChange} className="input-form focus:bg-white" placeholder="Endereço, KM ou referência próxima" required /></div>
                <div className="md:col-span-3"><label className="label-form">Amparo Legal (Preenchimento Automático)</label><input name="article" value={formData.article} readOnly className="input-form bg-gray-50 text-gray-500 cursor-not-allowed border-gray-100" placeholder="Use a lupa acima para preencher" /></div>
              </div>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 border-b pb-4"><Gauge className="text-blue-600" /><h3 className="text-xl font-bold text-gray-800">4. Argumentação</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="label-form">Nº de Série do Equipamento</label><input name="equipmentNumber" value={formData.equipmentNumber} onChange={handleChange} className="input-form focus:bg-white" placeholder="Radar ou Etilômetro" /></div>
                <div><label className="label-form">Data da Última Aferição</label><input name="lastCalibration" type="text" value={formData.lastCalibration} onChange={handleChange} className="input-form focus:bg-white" placeholder="Ex: 20/05/2023" /></div>
                <div className="md:col-span-2">
                  <label className="label-form text-blue-900 font-bold mb-2 block text-lg">Relato e Motivos da Defesa</label>
                  <p className="text-sm text-gray-500 mb-2">Descreva o que aconteceu e por que você acha que a multa deve ser invalidada. Se não souber os termos técnicos, não se preocupe: a IA fará a fundamentação jurídica por você.</p>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={8} className="input-form focus:bg-white resize-none text-gray-700 leading-relaxed" placeholder="Ex: 'Não havia placa no local', 'O veículo não estava lá nesse horário'..." />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 border-b pb-4"><PenTool className="text-blue-600" /><h3 className="text-xl font-bold text-gray-800">5. Finalização</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="label-form">Cidade Assinatura <span className="text-red-500">*</span></label><input name="signCity" value={formData.signCity} onChange={handleChange} className="input-form focus:bg-white" required /></div>
                <div><label className="label-form">Data Assinatura <span className="text-red-500">*</span></label><input name="signDate" value={formData.signDate} onChange={handleChange} className="input-form focus:bg-white" required /></div>
              </div>
            </section>

            <div className="flex flex-col items-center gap-4 py-8">
              <button type="submit" className="w-full max-w-xl bg-blue-600 text-white text-2xl font-black py-6 rounded-3xl shadow-2xl hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50">Gerar Defesa Profissional</button>
              <p className="text-sm text-gray-400">Ao clicar em gerar, você concorda com nossos Termos de Uso.</p>
            </div>
          </form>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .input-form { width: 100%; padding: 0.875rem 1rem; background-color: #fcfcfd; border: 1.5px solid #f1f3f5; border-radius: 1rem; font-size: 1rem; transition: all 0.25s ease; }
          .input-form:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08); background-color: white; }
          .label-form { font-size: 0.875rem; font-weight: 500; }
        `}} />
      </MainLayout>
    );
  }

  // 3. TELA DE SELEÇÃO (DEFAULT)
  return (
    <MainLayout>
      {showHelpModal && <HelpModal />}
      <div className="max-w-4xl mx-auto py-10">
         <header className="mb-12 text-center">
          <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"><ArrowLeft size={20} className="mr-1" /> Início</Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Qual fase da defesa?</h1>
          <p className="text-gray-600 max-w-lg mx-auto text-lg">Selecione o tipo de recurso para que a IA enderece o documento à autoridade correta.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button onClick={() => { setFormData(prev => ({...prev, defenseType: 'previa'})); setStep('form'); }} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-yellow-400 hover:shadow-2xl transition-all group text-left flex flex-col h-full"><div className="bg-yellow-100 w-14 h-14 rounded-2xl flex items-center justify-center text-yellow-600 mb-6 group-hover:rotate-12 transition-transform"><FileWarning size={28} /></div><h3 className="text-xl font-bold text-gray-800 mb-2">Defesa Prévia</h3><p className="text-sm text-gray-500 flex-1">Recebi a notificação mas ainda <strong>não recebi o boleto</strong>.</p></button>
          <button onClick={() => { setFormData(prev => ({...prev, defenseType: 'jari'})); setStep('form'); }} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-2xl transition-all group text-left flex flex-col h-full"><div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:rotate-12 transition-transform"><Gavel size={28} /></div><h3 className="text-xl font-bold text-gray-800 mb-2">Recurso à JARI</h3><p className="text-sm text-gray-500 flex-1">Já recebi a <strong>multa com boleto</strong> ou perdi a prévia.</p></button>
          <button onClick={() => { setFormData(prev => ({...prev, defenseType: 'cetran'})); setStep('form'); }} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-purple-500 hover:shadow-2xl transition-all group text-left flex flex-col h-full"><div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:rotate-12 transition-transform"><Scale size={28} /></div><h3 className="text-xl font-bold text-gray-800 mb-2">Recurso CETRAN</h3><p className="text-sm text-gray-500 flex-1">Meu recurso na JARI foi negado e quero recorrer à <strong>2ª instância</strong>.</p></button>
        </div>
        <div className="text-center"><button onClick={() => setShowHelpModal(true)} className="text-blue-600 font-bold flex items-center gap-2 mx-auto"><HelpCircle size={20} /> Ajuda</button></div>
      </div>
    </MainLayout>
  );
};

export default ManualDefense;