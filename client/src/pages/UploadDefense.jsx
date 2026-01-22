import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, File, X, ArrowLeft, Loader2, 
  CheckCircle, Copy, AlertTriangle, PenTool, Download, Send, RotateCcw, FileCheck, User, MapPin, Gauge, Info 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { api } from '../services/api';
import { jsPDF } from 'jspdf';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const UploadDefense = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refinementText, setRefinementText] = useState('');
  const [refining, setRefining] = useState(false);

  const [formData, setFormData] = useState({
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
    description: '', // Novo campo de relato
    signCity: '',
    signDate: new Date().toLocaleDateString('pt-BR')
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cpf') {
      value = value.replace(/\D/g, '').slice(0, 11);
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 11);
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (formData.city && !formData.signCity) {
      setFormData(prev => ({ ...prev, signCity: prev.city }));
    }
  }, [formData.city]);

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
          address: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
      }
    } finally {
      setLoadingCep(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => { const base64String = reader.result.split(',')[1]; resolve(base64String); };
      reader.onerror = (error) => reject(error);
    });
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) { setError("Formato inválido. Envie apenas JPG, PNG ou PDF."); return; }
    if (selectedFile.size > 4 * 1024 * 1024) { setError("Arquivo muito grande. Máximo 4MB."); return; }
    setFile(selectedFile); setError(null);
  };

  const handleFileChange = (e) => { if (e.target.files && e.target.files[0]) processFile(e.target.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); };
  const handleRemove = () => { setFile(null); setResult(null); setError(null); };
  const handleUploadNext = () => { if (file) setStep('form'); };

  const validateForm = () => {
    if (!formData.email.includes('@') || !formData.email.includes('.')) { alert("Por favor, insira um e-mail válido."); return false; }
    if (formData.cpf.length < 14) { alert("CPF inválido."); return false; }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true); setError(null);
    try {
      const base64 = await fileToBase64(file);
      const response = await api.analyzeDocument(base64, file.type, formData);
      if (response.success) { 
        setResult(response.data.defenseText); 
        
        // Save to Firestore if user is logged in
        if (currentUser) {
            try {
                await addDoc(collection(db, 'defenses'), {
                    userId: currentUser.uid,
                    infractionType: 'Análise de Upload',
                    licensePlate: 'Verificar documento',
                    defenseText: response.data.defenseText,
                    status: 'completed',
                    createdAt: serverTimestamp(),
                    fileName: file.name
                });
            } catch (fsError) {
                console.error("Erro ao salvar no histórico:", fsError);
            }
        }

        setStep('result'); 
      }
    } catch (err) { setError(err.message || "Falha ao processar o arquivo."); setStep('upload'); } finally { setLoading(false); }
  };

  const handleRefinementSubmit = async () => {
    if (!refinementText.trim()) return;
    setRefining(true);
    try {
      const response = await api.generateDefense({ ...formData, previousDefense: result, refinementInstructions: refinementText });
      if (response.success) { setResult(response.data.defenseText); setIsRefining(false); setRefinementText(''); alert("Atualizado!"); }
    } catch (err) { alert("Erro ao atualizar."); } finally { setRefining(false); }
  };

  const handleFinalizePDF = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    doc.setFont("times", "normal"); doc.setFontSize(12);
    const splitText = doc.splitTextToSize(result, 160);
    let cursorY = 25;
    splitText.forEach(line => {
      if (cursorY > 270) { doc.addPage(); cursorY = 25; }
      const isTitle = line.length < 50 && line === line.toUpperCase() && line.trim().length > 0;
      if (isTitle) { doc.setFont("times", "bold"); doc.text(line, 105, cursorY, { align: "center" }); doc.setFont("times", "normal"); } else { doc.text(line, 25, cursorY, { align: "justify", maxWidth: 160 }); }
      cursorY += 6;
    });
    doc.save("Defesa_Upload.pdf");
    navigate('/profile');
  };

  if (step === 'result' && result) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-8">
          <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div><h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><CheckCircle className="text-green-500" /> Defesa Gerada</h2><p className="text-xs text-gray-500">Revise o documento gerado.</p></div>
            <div className="flex gap-3">
              <button onClick={() => setIsRefining(!isRefining)} disabled={refining} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 flex items-center gap-2">{refining ? <Loader2 className="animate-spin" size={18} /> : <PenTool size={18} />}{isRefining ? 'Cancelar' : 'Alterar'}</button>
              <button onClick={handleFinalizePDF} className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 flex items-center gap-2 shadow-md"><Download size={18} /> Baixar PDF</button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-2 ${isRefining ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}><div className="bg-white p-12 shadow-2xl min-h-[800px] font-serif text-gray-900 leading-relaxed text-justify border border-gray-200 relative"><div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div><div className="whitespace-pre-wrap">{result}</div></div></div>
            <div className="lg:col-span-1 space-y-6">
              {isRefining ? (<div className="bg-blue-600 p-6 rounded-2xl shadow-xl text-white sticky top-40"><h3 className="font-bold text-lg mb-2 flex items-center gap-2"><PenTool size={20} /> Ajustes</h3><textarea value={refinementText} onChange={(e) => setRefinementText(e.target.value)} rows={6} className="w-full p-3 rounded-xl text-gray-900 text-sm" placeholder="O que deseja mudar?" /><div className="mt-4 flex justify-end"><button onClick={handleRefinementSubmit} disabled={!refinementText.trim() || refining} className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">{refining ? '...' : 'Atualizar'} <Send size={16} /></button></div></div>) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sticky top-40"><div className="flex items-center gap-2 mb-4"><FileCheck className="text-amber-600" /><h3 className="font-bold text-amber-900">Checklist Final</h3></div><ul className="space-y-3 text-sm"><li className="flex gap-2">✓ Imprimir e Assinar</li><li className="flex gap-2">✓ Anexar Documentos</li></ul><button onClick={() => {setResult(null); setStep('upload'); setFile(null);}} className="mt-6 w-full py-2 text-amber-700 hover:bg-amber-100 rounded-lg text-sm font-medium flex items-center justify-center gap-2"><RotateCcw size={14} /> Novo Upload</button></div>
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
        <div className="max-w-4xl mx-auto py-8">
          <header className="mb-8">
            <button onClick={() => setStep('upload')} className="text-gray-500 hover:text-blue-600 flex items-center mb-4 transition-colors font-medium"><ArrowLeft size={20} className="mr-1" /> Voltar</button>
            <h1 className="text-3xl font-bold text-gray-900">Dados do Condutor</h1>
            <p className="text-gray-600">A multa não contém seus dados pessoais completos. Preencha para finalizar.</p>
            <div className="flex items-center gap-2 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 max-w-2xl"><Info size={18} className="shrink-0" /><p>Os dados solicitados abaixo são obrigatórios conforme a <strong>Resolução CONTRAN nº 900/2022</strong>.</p></div>
          </header>

          <form onSubmit={handleFormSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            {loading && (
              <div className="fixed inset-0 bg-white/80 z-[100] flex flex-col items-center justify-center p-4 text-center">
                <Loader2 size={60} className="text-blue-600 animate-spin mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Processando...</h2>
                <p className="text-gray-600 max-w-md">Nossa IA está analisando todos os dados e montando a melhor defesa legal para a sua infração.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2"><label className="label-form">Nome Completo <span className="text-red-500">*</span></label><input name="name" value={formData.name} onChange={handleChange} className="input-form" required /></div>
              <div><label className="label-form">CPF <span className="text-red-500">*</span></label><input name="cpf" value={formData.cpf} onChange={handleChange} className="input-form" placeholder="000.000.000-00" required /></div>
              <div><label className="label-form">RG <span className="text-red-500">*</span></label><input name="rg" value={formData.rg} onChange={handleChange} className="input-form" required /></div>
              <div><label className="label-form">Órgão Emissor <span className="text-red-500">*</span></label><input name="rgIssuer" value={formData.rgIssuer} onChange={handleChange} className="input-form" required /></div>
              <div><label className="label-form">Nacionalidade <span className="text-red-500">*</span></label><input name="nationality" value={formData.nationality} onChange={handleChange} className="input-form" required /></div>
              <div>
                  <label className="label-form">Estado Civil <span className="text-red-500">*</span></label>
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
              <div><label className="label-form">Número CNH <span className="text-red-500">*</span></label><input name="cnh" value={formData.cnh} onChange={handleChange} className="input-form" required /></div>
              <div><label className="label-form">Categoria CNH</label><input name="cnhCategory" value={formData.cnhCategory} onChange={handleChange} className="input-form" placeholder="Ex: AB" /></div>
              <div className="md:col-span-1"><label className="label-form">Telefone <span className="text-red-500">*</span></label><input name="phone" value={formData.phone} onChange={handleChange} className="input-form" placeholder="(61) 99999-9999" required /></div>
              <div className="md:col-span-2"><label className="label-form">E-mail <span className="text-red-500">*</span></label><input name="email" value={formData.email} onChange={handleChange} type="email" className="input-form" placeholder="seu@email.com" required /></div>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-2">
              <h4 className="text-sm font-bold text-blue-600 mb-4 uppercase tracking-widest flex items-center gap-2"><MapPin size={16} /> Endereço</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div><label className="label-form">CEP <span className="text-red-500">*</span></label><div className="relative"><input name="zipCode" value={formData.zipCode} onChange={handleChange} onBlur={handleCepBlur} className="input-form" required />{loadingCep && <Loader2 className="animate-spin absolute right-3 top-3 text-blue-600" size={20} />}</div></div>
                <div className="md:col-span-3"><label className="label-form">Logradouro <span className="text-red-500">*</span></label><input name="address" value={formData.address} onChange={handleChange} className="input-form" required /></div>
                <div><label className="label-form">Número <span className="text-red-500">*</span></label><input name="addressNumber" value={formData.addressNumber} onChange={handleChange} className="input-form" required /></div>
                <div className="md:col-span-2"><label className="label-form">Bairro <span className="text-red-500">*</span></label><input name="neighborhood" value={formData.neighborhood} onChange={handleChange} className="input-form" required /></div>
                <div className="md:col-span-2"><label className="label-form">Cidade <span className="text-red-500">*</span></label><input name="city" value={formData.city} onChange={handleChange} className="input-form" required /></div>
                <div className="md:col-span-2"><label className="label-form">UF <span className="text-red-500">*</span></label><input name="state" value={formData.state} onChange={handleChange} className="input-form" required /></div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-2">
              <h4 className="text-sm font-bold text-blue-600 mb-4 uppercase tracking-widest flex items-center gap-2"><Gauge size={16} /> Argumentação</h4>
              <div className="grid grid-cols-1">
                <div>
                  <label className="label-form text-blue-900 font-bold mb-2 block text-lg">Relato e Motivos da Defesa</label>
                  <p className="text-sm text-gray-500 mb-2">Descreva o que aconteceu e por que a multa deve ser anulada. A IA combinará isso com os dados técnicos da imagem.</p>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="input-form resize-none" placeholder="Ex: 'Não havia placa no local', 'O veículo não estava lá nesse horário'..." />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-blue-600 mb-4 uppercase tracking-widest">Finalização</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="label-form">Cidade Assinatura <span className="text-red-500">*</span></label><input name="signCity" value={formData.signCity} onChange={handleChange} className="input-form" required /></div>
                <div><label className="label-form">Data Assinatura <span className="text-red-500">*</span></label><input name="signDate" value={formData.signDate} onChange={handleChange} className="input-form" required /></div>
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" className="w-full bg-blue-600 text-white text-xl font-bold py-5 rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">{loading ? '...' : 'Gerar Defesa com IA'}</button>
            </div>
          </form>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `.input-form { width: 100%; padding: 0.875rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; } .label-form { font-size: 0.875rem; font-weight: 500; color: #374151; display: block; margin-bottom: 0.25rem; }` }} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-10">
        <div className="mb-8 text-center"><Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"><ArrowLeft size={20} className="mr-1" /> Início</Link><h1 className="text-3xl font-bold text-gray-900">Análise de Documento</h1><p className="text-gray-500 mt-2">Envie a foto da multa. No próximo passo, pediremos seus dados pessoais.</p></div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="p-6 md:p-10">
            {error && (<div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-700 items-start"><AlertTriangle className="shrink-0" /><p>{error}</p></div>)}
            <form onSubmit={(e) => { e.preventDefault(); handleUploadNext(); }} className="space-y-8">
              <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[300px] relative ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'} ${file ? 'border-blue-500 bg-blue-50/30' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                {!file ? (
                  <label className="w-full h-full absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4"><UploadCloud size={40} className="text-blue-600" /></div><span className="font-semibold text-lg text-gray-700">Clique ou arraste aqui</span><input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md flex items-center gap-4 animate-in fade-in zoom-in duration-300 z-20"><div className="bg-blue-100 p-3 rounded-lg"><File size={32} className="text-blue-600" /></div><div className="flex-1 min-w-0 text-left"><p className="font-semibold text-gray-800 truncate">{file.name}</p></div><button type="button" onClick={handleRemove} className="text-gray-400 hover:text-red-500 transition-colors p-2"><X size={20} /></button></div>
                )}
              </div>
              <div className="flex justify-center pt-4 border-t border-gray-100"><button type="submit" disabled={!file} className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all w-full md:w-auto ${file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}>Continuar para Dados Pessoais</button></div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadDefense;