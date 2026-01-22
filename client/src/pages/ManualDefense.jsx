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
  
  const [step, setStep] = useState('selection');
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

  useEffect(() => {
    if (formData.city && !formData.signCity) {
      setFormData(prev => ({ ...prev, signCity: prev.city }));
    }
  }, [formData.city]);

  // --- VALIDADOR DE CPF ---
  const isValidCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    return true;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    value = value || '';

    // MÁSCARAS
    if (name === 'cpf') {
      value = value.replace(/\D/g, '').slice(0, 11);
      if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 11);
      if (value.length > 10) value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    // Datas (Infração e Assinatura)
    if (name === 'date' || name === 'signDate') {
      value = value.replace(/\D/g, '').slice(0, 8);
      if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
      else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    // Horário (24h forçado)
    if (name === 'time') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length > 2) value = `${value.slice(0, 2)}:${value.slice(2)}`;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email.includes('@')) {
      alert("E-mail inválido.");
      return false;
    }
    if (!isValidCPF(formData.cpf)) {
      alert("CPF inválido. Verifique os números digitados.");
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
      }
    } catch (error) {
      console.error("Erro CEP", error);
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
        setFormData(prev => ({
          ...prev,
          article: response.data.article || '',
          description: prev.description ? prev.description : `Autuado por: ${response.data.description}. ` 
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
    doc.save(`Defesa_${formData.plate || 'Recurso'}.pdf`);
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
            <div className="p-5 bg-yellow-50 rounded-2xl border border-yellow-100 shadow-sm"><h3 className="font-bold text-lg text-yellow-900 mb-2 flex items-center gap-2"><FileWarning size={22} /> 1. Defesa Prévia</h3><p className="text-sm text-yellow-800">Apontar erros formais antes da multa virar penalidade.<br/><strong>👉 Caso negada, permite Recurso à JARI.</strong></p></div>
            <div className="flex justify-center text-gray-300"><ArrowDown size={32} /></div>
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm"><h3 className="font-bold text-lg text-blue-900 mb-2 flex items-center gap-2"><Gavel size={22} /> 2. Recurso à JARI</h3><p className="text-sm text-blue-800">Discutir o mérito da infração.<br/><strong>👉 Caso negado, permite Recurso ao CETRAN/CONTRADIFE.</strong></p></div>
            <div className="flex justify-center text-gray-300"><ArrowDown size={32} /></div>
            <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm"><h3 className="font-bold text-lg text-purple-900 mb-2 flex items-center gap-2"><Scale size={22} /> 3. Recurso ao CETRAN</h3><p className="text-sm text-purple-800">Última tentativa administrativa.</p></div>
          </div>
          <div className="mt-8 text-center">
             <p className="mb-4 text-gray-600 font-medium">Ainda não sabe a fase? Deixe a IA analisar seu documento.</p>
             <button onClick={() => navigate('/upload')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 mx-auto"><Upload size={18} /> Ir para Upload com IA</button>
          </div>
        </div>
      </div>
    </div>
  );

  if (result) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-8">
          <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-in slide-in-from-top-4">
            <div><h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><CheckCircle className="text-green-500" /> Defesa Gerada</h2><p className="text-xs text-gray-500">Revise o documento abaixo antes de finalizar.</p></div>
            <div className="flex gap-3">
              <button onClick={() => setIsRefining(!isRefining)} disabled={refining} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 flex items-center gap-2">{refining ? <Loader2 className="animate-spin" size={18} /> : <PenTool size={18} />}{isRefining ? 'Cancelar' : 'Alterar'}</button>
              <button onClick={handleFinalizePDF} className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 flex items-center gap-2 shadow-md"><Download size={18} /> Baixar PDF Final</button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"><div className="bg-white p-12 shadow-2xl min-h-[800px] font-serif text-gray-900 leading-relaxed text-justify border border-gray-200 whitespace-pre-wrap">{result}</div></div>
            <div className="lg:col-span-1 space-y-6">
              {isRefining ? (<div className="bg-blue-600 p-6 rounded-2xl shadow-xl text-white sticky top-40"><textarea value={refinementText} onChange={(e) => setRefinementText(e.target.value)} rows={6} className="w-full p-3 rounded-xl text-gray-900 text-sm" placeholder="O que deseja mudar?" /><div className="mt-4 flex justify-end"><button onClick={handleRefinementSubmit} disabled={!refinementText.trim() || refining} className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">Atualizar <Send size={16} /></button></div></div>) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sticky top-40"><div className="flex items-center gap-2 mb-4"><FileCheck className="text-amber-600" /><h3 className="font-bold text-amber-900">Checklist</h3></div><ul className="space-y-3 text-sm text-gray-700"><li>✓ Imprimir e Assinar</li><li>✓ Anexar Cópia CNH/RG e CRLV</li><li>✓ Anexar Notificação</li></ul><button onClick={() => setResult(null)} className="mt-6 w-full py-2 text-amber-700 hover:bg-amber-100 rounded-lg text-sm font-medium flex items-center justify-center gap-2"><RotateCcw size={14} /> Reiniciar</button></div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (step === 'form') {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <button onClick={() => setStep('selection')} className="text-gray-500 hover:text-blue-600 flex items-center mb-4 font-medium"><ArrowLeft size={20} className="mr-1" /> Voltar</button>
            <h1 className="text-3xl font-bold text-gray-900">{formData.defenseType === 'previa' ? 'Defesa Prévia' : formData.defenseType === 'jari' ? 'Recurso JARI' : 'Recurso CETRAN'}</h1>
            <div className="flex items-center gap-2 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 max-w-2xl"><AlertCircle size={18} className="shrink-0" /><p>Os dados solicitados abaixo são obrigatórios conforme a <strong>Resolução CONTRAN nº 900/2022</strong>.</p></div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            {loading && (<div className="fixed inset-0 bg-white/80 z-[100] flex flex-col items-center justify-center"><Loader2 size={60} className="text-blue-600 animate-spin mb-4" /><h2 className="text-2xl font-bold text-gray-800">Processando...</h2></div>)}

            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 border-b pb-4"><User className="text-blue-600" /><h3 className="text-xl font-bold text-gray-800">1. Qualificação</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2"><label className="label-form">Nome Completo *</label><input name="name" value={formData.name} onChange={handleChange} className="input-form" required /></div>
                <div><label className="label-form">CPF *</label><input name="cpf" value={formData.cpf} onChange={handleChange} className="input-form" placeholder="000.000.000-00" required /></div>
                <div><label className="label-form">RG *</label><input name="rg" value={formData.rg} onChange={handleChange} className="input-form" required /></div>
                <div><label className="label-form">Órgão Emissor *</label><input name="rgIssuer" value={formData.rgIssuer} onChange={handleChange} className="input-form" required /></div>
                <div><label className="label-form">Nacionalidade *</label><input name="nationality" value={formData.nationality} onChange={handleChange} className="input-form" required /></div>
                
                {/* ESTADO CIVIL COM 'OUTRO' */}
                <div>
                  <label className="label-form">Estado Civil *</label>
                  <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input-form" required>
                    <option value="">Selecione...</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                
                <div><label className="label-form">Profissão</label><input name="profession" value={formData.profession} onChange={handleChange} className="input-form" /></div>
                <div><label className="label-form">CNH *</label><input name="cnh" value={formData.cnh} onChange={handleChange} className="input-form" required /></div>
                <div><label className="label-form">Categoria CNH</label><input name="cnhCategory" value={formData.cnhCategory} onChange={handleChange} className="input-form" /></div>
                <div className="md:col-span-1"><label className="label-form">Telefone *</label><input name="phone" value={formData.phone} onChange={handleChange} className="input-form" placeholder="(00) 00000-0000" required /></div>
                <div className="md:col-span-2"><label className="label-form">E-mail *</label><input name="email" value={formData.email} onChange={handleChange} type="email" className="input-form" required /></div>
              </div>
              <div className="pt-4 border-t border-gray-100 mt-2">
                <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase">Endereço Completo</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div><label className="label-form">CEP *</label><div className="relative"><input name="zipCode" value={formData.zipCode} onChange={handleChange} onBlur={handleCepBlur} className="input-form" required />{loadingCep && <Loader2 className="animate-spin absolute right-3 top-3 text-blue-600" size={20} />}</div></div>
                  <div className="md:col-span-3"><label className="label-form">Logradouro *</label><input name="address" value={formData.address} onChange={handleChange} className="input-form" required /></div>
                  <div><label className="label-form">Número *</label><input name="addressNumber" value={formData.addressNumber} onChange={handleChange} className="input-form" required /></div>
                  <div><label className="label-form">Complemento</label><input name="addressComplement" value={formData.addressComplement} onChange={handleChange} className="input-form" /></div>
                  <div className="md:col-span-2"><label className="label-form">Bairro *</label><input name="neighborhood" value={formData.neighborhood} onChange={handleChange} className="input-form" required /></div>
                  <div className="md:col-span-2"><label className="label-form">Cidade *</label><input name="city" value={formData.city} onChange={handleChange} className="input-form" required /></div>
                  <div className="md:col-span-2"><label className="label-form">UF *</label><input name="state" value={formData.state} onChange={handleChange} className="input-form" required /></div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 border-b pb-4"><Car className="text-blue-600" /><h3 className="text-xl font-bold text-gray-800">2. Veículo</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div><label className="label-form">Placa *</label><input name="plate" value={formData.plate} onChange={handleChange} className="input-form" required /></div>
                <div><label className="label-form">UF Placa *</label><input name="plateUF" value={formData.plateUF} onChange={handleChange} className="input-form" required /></div>
                <div><label className="label-form">Marca/Modelo *</label><input name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} className="input-form" required /></div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 border-b pb-4"><MapPin className="text-blue-600" /><h3 className="text-xl font-bold text-gray-800">3. Infração</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div><label className="label-form">AIT (Nº do Auto) *</label><input name="aitNumber" value={formData.aitNumber} onChange={handleChange} className="input-form" required /></div>
                <div><label className="label-form">Cód. Infração *</label><div className="flex gap-1"><input name="infractionCode" value={formData.infractionCode} onChange={handleChange} className="input-form w-2/3" required /><input name="infractionSplit" value={formData.infractionSplit} onChange={handleChange} className="input-form w-1/3 text-center" placeholder="0" /><button type="button" onClick={handleSearchCode} className="bg-blue-100 text-blue-600 p-3 rounded-xl hover:bg-blue-200 transition-colors">{searchingCode ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}</button></div></div>
                <div><label className="label-form">Órgão Autuador *</label><input name="issuingBody" value={formData.issuingBody} onChange={handleChange} className="input-form" required /></div>
                <div><label className="label-form">Data *</label><input type="text" name="date" value={formData.date} onChange={handleChange} className="input-form" placeholder="DD/MM/AAAA" maxLength={10} required /></div>
                
                {/* HORÁRIO 24H (Input Texto com Máscara) */}
                <div><label className="label-form">Horário (24h) *</label><input name="time" value={formData.time} onChange={handleChange} className="input-form" placeholder="HH:MM" maxLength={5} required /></div>
                
                <div className="md:col-span-3"><label className="label-form">Local *</label><input name="location" value={formData.location} onChange={handleChange} className="input-form" required /></div>
                <div className="md:col-span-3"><label className="label-form">Amparo Legal</label><input name="article" value={formData.article} readOnly className="input-form bg-gray-50" /></div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 border-b pb-4"><Gauge className="text-blue-600" /><h3 className="text-xl font-bold text-gray-800">4. Argumentação</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="label-form">Nº Equipamento</label><input name="equipmentNumber" value={formData.equipmentNumber} onChange={handleChange} className="input-form" /></div>
                <div><label className="label-form">Aferição</label><input name="lastCalibration" value={formData.lastCalibration} onChange={handleChange} className="input-form" /></div>
                
                {/* RELATO SIMPLIFICADO */}
                <div className="md:col-span-2">
                  <label className="label-form text-blue-900 font-bold mb-2">Relato *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="input-form resize-none" placeholder="Ex: 'Não havia placa no local', 'O carro não estava nesse horário', 'Estava socorrendo alguém'..." required />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 border-b pb-4"><PenTool className="text-blue-600" /><h3 className="text-xl font-bold text-gray-800">5. Finalização</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="label-form">Cidade Assinatura *</label><input name="signCity" value={formData.signCity} onChange={handleChange} className="input-form" required /></div>
                <div><label className="label-form">Data Assinatura *</label><input name="signDate" value={formData.signDate} onChange={handleChange} className="input-form" placeholder="DD/MM/AAAA" required /></div>
              </div>
            </section>

            <div className="flex flex-col items-center gap-4 py-8">
              <button type="submit" className="w-full max-w-xl bg-blue-600 text-white text-2xl font-black py-6 rounded-3xl shadow-2xl hover:bg-blue-700 active:scale-95 transition-all">Gerar Defesa</button>
            </div>
          </form>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `.input-form { width: 100%; padding: 0.8rem; background: #fcfcfd; border: 1px solid #e5e7eb; border-radius: 0.8rem; } .label-form { font-size: 0.85rem; font-weight: 600; color: #4b5563; margin-bottom: 0.3rem; display: block; }` }} />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Qual fase da defesa?</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button onClick={() => { setFormData(prev => ({...prev, defenseType: 'previa'})); setStep('form'); }} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-yellow-400 transition-all text-left">
            <div className="bg-yellow-100 w-12 h-12 rounded-xl flex items-center justify-center text-yellow-600 mb-4"><FileWarning size={24} /></div><h3 className="font-bold text-lg text-gray-800">Defesa Prévia</h3><p className="text-sm text-gray-500 mt-2">Ainda não recebi boleto.</p>
          </button>
          <button onClick={() => { setFormData(prev => ({...prev, defenseType: 'jari'})); setStep('form'); }} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all text-left">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4"><Gavel size={24} /></div><h3 className="font-bold text-lg text-gray-800">Recurso JARI</h3><p className="text-sm text-gray-500 mt-2">Já recebi boleto.</p>
          </button>
          <button onClick={() => { setFormData(prev => ({...prev, defenseType: 'cetran'})); setStep('form'); }} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-purple-500 transition-all text-left">
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-4"><Scale size={24} /></div><h3 className="font-bold text-lg text-gray-800">CETRAN</h3><p className="text-sm text-gray-500 mt-2">Recorrer da JARI.</p>
          </button>
        </div>
        
        {/* BOTÃO DE AJUDA ATUALIZADO */}
        <div className="text-center">
          <button onClick={() => setShowHelpModal(true)} className="text-blue-600 font-bold flex items-center gap-2 mx-auto">
            <HelpCircle size={20} /> Preciso de ajuda para identificar em que fase da defesa estou
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ManualDefense;
