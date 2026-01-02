import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    FileText,
    Upload,
    Check,
    Trash2,
    MoreHorizontal,
    Pencil,
    Image as ImageIcon,
    FileType,
    Loader2,
    Printer,
    X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ExamPaperPreview from '../exam/ExamPaperPreview';

// --- MANUEL SORU EKLEME/DÜZENLEME MODALI ---
const ManualQuestionModal = ({ isOpen, onClose, courseId, editingQuestion }) => {
    const { addQuestion, updateQuestion } = useApp();
    const [formData, setFormData] = useState({
        text: '',
        options: [
            { id: 'a', text: '', isCorrect: false },
            { id: 'b', text: '', isCorrect: false },
            { id: 'c', text: '', isCorrect: false },
            { id: 'd', text: '', isCorrect: false },
            { id: 'e', text: '', isCorrect: false },
        ],
        points: 10,
        difficulty: 'medium'
    });

    // Modal açıldığında form verilerini ayarla
    useEffect(() => {
        if (isOpen) {
            if (editingQuestion) {
                setFormData({
                    text: editingQuestion.text,
                    options: editingQuestion.options,
                    points: editingQuestion.points,
                    difficulty: editingQuestion.difficulty
                });
            } else {
                // Yeni soru için formu sıfırla
                setFormData({
                    text: '',
                    options: [
                        { id: 'a', text: '', isCorrect: false },
                        { id: 'b', text: '', isCorrect: false },
                        { id: 'c', text: '', isCorrect: false },
                        { id: 'd', text: '', isCorrect: false },
                        { id: 'e', text: '', isCorrect: false },
                    ],
                    points: 10,
                    difficulty: 'medium'
                });
            }
        }
    }, [isOpen, editingQuestion]);

    const handleOptionChange = (id, text) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map(opt => opt.id === id ? { ...opt, text } : opt)
        }));
    };

    const handleCorrectOptionChange = (id) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map(opt => ({ ...opt, isCorrect: opt.id === id }))
        }));
    };

    const handleSubmit = () => {
        if (!formData.text || !formData.options.some(o => o.text)) {
            alert('Lütfen soru metnini ve en az bir şıkkı doldurun.');
            return;
        }

        if (!formData.options.some(o => o.isCorrect)) {
            alert('Lütfen doğru cevabı işaretleyin.');
            return;
        }

        if (editingQuestion) {
            // Güncelleme
            updateQuestion({
                ...editingQuestion,
                ...formData,
                // courseId değişmiyor
            });
        } else {
            // Yeni Ekleme
            addQuestion({
                ...formData,
                courseId,
                type: 'multiple_choice',
                createdDate: new Date().toISOString()
            });
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1e1e24] border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="font-semibold text-lg">
                        {editingQuestion ? 'Soruyu Düzenle' : 'Yeni Soru Ekle (Manuel)'}
                    </h3>
                    <button onClick={onClose}><div className="p-1 hover:bg-white/10 rounded transition"><X size={20} /></div></button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    {/* Soru Metni */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Soru Metni</label>
                        <textarea
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            className="w-full h-32 bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none transition resize-none"
                            placeholder="Sorunuzu buraya yazın..."
                        />
                    </div>

                    {/* Seçenekler */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">Seçenekler</label>
                        <div className="grid gap-3">
                            {formData.options.map((option) => (
                                <div key={option.id} className="flex gap-3 items-center group">
                                    <button
                                        onClick={() => handleCorrectOptionChange(option.id)}
                                        className={`w-10 h-10 rounded-lg border flex items-center justify-center transition ${option.isCorrect
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-white/10 hover:border-white/30 text-muted-foreground'}`}
                                        title="Doğru cevap olarak işaretle"
                                    >
                                        {option.isCorrect ? <Check size={20} /> : option.id.toUpperCase()}
                                    </button>
                                    <input
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                        className={`flex-1 bg-black/20 border rounded-lg px-4 py-2.5 text-sm focus:outline-none transition ${option.isCorrect
                                            ? 'border-green-500/50 bg-green-500/5'
                                            : 'border-white/10 focus:border-blue-500'}`}
                                        placeholder={`${option.id.toUpperCase()} şıkkı...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ayarlar */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Zorluk Seviyesi</label>
                            <div className="flex bg-black/20 rounded-lg p-1 border border-white/10">
                                {['easy', 'medium', 'hard'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setFormData({ ...formData, difficulty: level })}
                                        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${formData.difficulty === level
                                            ? (level === 'easy' ? 'bg-green-500/20 text-green-400' :
                                                level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400')
                                            : 'text-muted-foreground hover:text-white'}`}
                                    >
                                        {level === 'easy' ? 'Kolay' : level === 'medium' ? 'Orta' : 'Zor'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Puan Değeri</label>
                            <input
                                type="number"
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded text-sm hover:bg-white/5 transition">İptal</button>
                    <button onClick={handleSubmit} className="px-6 py-2 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/20 transition">
                        {editingQuestion ? 'Değişiklikleri Kaydet' : 'Soruyu Kaydet'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// --- DOSYA YÜKLEME MODALI (SIMULATION) ---
const UploadQuestionModal = ({ isOpen, onClose, courseId }) => {
    const { addQuestion } = useApp();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFiles = (files) => {
        if (files.length === 0) return;
        setIsAnalyzing(true);

        // Simüle edilmiş analiz süreci (3 saniye)
        setTimeout(() => {
            // Mock veriler oluştur
            const mockQuestionsFromDoc = [
                {
                    text: 'Otomatik algılanan soru 1: Tapu sicilinin ana unsurları nelerdir?',
                    options: [
                        { id: 'a', text: 'Tapu kütüğü, Kat mülkiyeti kütüğü, Yevmiye defteri', isCorrect: true },
                        { id: 'b', text: 'Sadece yevmiye defteri', isCorrect: false },
                        { id: 'c', text: 'Kadastro planları', isCorrect: false },
                        { id: 'd', text: 'Azil defteri', isCorrect: false },
                        { id: 'e', text: 'Hiçbiri', isCorrect: false }
                    ],
                    points: 10,
                    difficulty: 'medium',
                    type: 'multiple_choice',
                    createdDate: new Date().toISOString()
                },
                {
                    text: 'Otomatik algılanan soru 2: Aşağıdakilerden hangisi TAKBİS bileşenidir?',
                    options: [
                        { id: 'a', text: 'Yemekhane sistemi', isCorrect: false },
                        { id: 'b', text: 'Mekansal Gayrimenkul Sistemi', isCorrect: true },
                        { id: 'c', text: 'Personel takip', isCorrect: false },
                        { id: 'd', text: 'Randevu sistemi', isCorrect: false },
                        { id: 'e', text: 'Arşiv odası', isCorrect: false }
                    ],
                    points: 15,
                    difficulty: 'hard',
                    type: 'multiple_choice',
                    createdDate: new Date().toISOString()
                },
                {
                    text: 'Otomatik algılanan soru 3: Web-Tapu sistemi üzerinden hangi işlem yapılamaz?',
                    options: [
                        { id: 'a', text: 'Başvuru yapma', isCorrect: false },
                        { id: 'b', text: 'Tapu senedi alma', isCorrect: false },
                        { id: 'c', text: 'Harç ödeme', isCorrect: false },
                        { id: 'd', text: 'Taşınmaz satışı (Tapuya gitmeden)', isCorrect: true },
                        { id: 'e', text: 'Yetki verme', isCorrect: false }
                    ],
                    points: 10,
                    difficulty: 'easy',
                    type: 'multiple_choice',
                    createdDate: new Date().toISOString()
                },
                {
                    text: 'Otomatik algılanan soru 4: MEGSİS projesinin temel amacı nedir?',
                    options: [
                        { id: 'a', text: 'Kadastro verilerinin sayısal ortamda toplanması ve sunulması', isCorrect: true },
                        { id: 'b', text: 'Personel maaşlarının hesaplanması', isCorrect: false },
                        { id: 'c', text: 'Tapu arşivlerinin imhası', isCorrect: false },
                        { id: 'd', text: 'Yabancıların mülk edinimini engellemek', isCorrect: false },
                        { id: 'e', text: 'Belediye emlak vergilerini toplamak', isCorrect: false }
                    ],
                    points: 10,
                    difficulty: 'medium',
                    type: 'multiple_choice',
                    createdDate: new Date().toISOString()
                },
                {
                    text: 'Otomatik algılanan soru 5: Tapu müdürlüklerinde kullanılan "Sıramatik" entegrasyonu ne işe yarar?',
                    options: [
                        { id: 'a', text: 'Vatandaşların rastgele işlem yapmasını sağlar', isCorrect: false },
                        { id: 'b', text: 'Randevu saatine göre işlem sırasını düzenler', isCorrect: true },
                        { id: 'c', text: 'Sadece öğle arası çalışır', isCorrect: false },
                        { id: 'd', text: 'Personelin izinlerini takip eder', isCorrect: false },
                        { id: 'e', text: 'Hiçbiri', isCorrect: false }
                    ],
                    points: 5,
                    difficulty: 'easy',
                    type: 'multiple_choice',
                    createdDate: new Date().toISOString()
                },
                {
                    text: 'Otomatik algılanan soru 6: Aşağıdakilerden hangisi Tapu ve Kadastro Genel Müdürlüğü görevlerinden biri değildir?',
                    options: [
                        { id: 'a', text: 'Devletin sorumluluğu altındaki tapu sicillerini tutmak', isCorrect: false },
                        { id: 'b', text: 'Ülke kadastrosunu yapmak', isCorrect: false },
                        { id: 'c', text: 'Gayrimenkul değerleme standartlarını belirlemek', isCorrect: false },
                        { id: 'd', text: 'Belediye imar planlarını hazırlamak', isCorrect: true },
                        { id: 'e', text: 'Lisanslı harita bürolarını denetlemek', isCorrect: false }
                    ],
                    points: 20,
                    difficulty: 'hard',
                    type: 'multiple_choice',
                    createdDate: new Date().toISOString()
                },
                {
                    text: 'Otomatik algılanan soru 7: E-Devlet kapısı üzerinden sunulan tapu hizmeti hangisidir?',
                    options: [
                        { id: 'a', text: 'Tapu Bilgileri Sorgulama', isCorrect: true },
                        { id: 'b', text: 'Tapu iptal davası açma', isCorrect: false },
                        { id: 'c', text: 'Komşunun tapusunu görme', isCorrect: false },
                        { id: 'd', text: 'Tapu senedi basımı (Resmi olmayan)', isCorrect: false },
                        { id: 'e', text: 'Miras reddi', isCorrect: false }
                    ],
                    points: 10,
                    difficulty: 'easy',
                    type: 'multiple_choice',
                    createdDate: new Date().toISOString()
                },
                {
                    text: 'Otomatik algılanan soru 8: Lisanslı Harita Kadastro Büroları (LİHKAB) temel görevi nedir?',
                    options: [
                        { id: 'a', text: 'Yeni tapu senedi basmak', isCorrect: false },
                        { id: 'b', text: 'Kadastro teknik hizmetlerini (aplikasyon vb.) yürütmek', isCorrect: true },
                        { id: 'c', text: 'Emlak vergisi toplamak', isCorrect: false },
                        { id: 'd', text: 'İmar barışı başvurusu almak', isCorrect: false },
                        { id: 'e', text: 'Yabancı satış onayı vermek', isCorrect: false }
                    ],
                    points: 15,
                    difficulty: 'hard',
                    type: 'multiple_choice',
                    createdDate: new Date().toISOString()
                },
                {
                    text: 'Otomatik algılanan soru 9: "2B Arazisi" terimi neyi ifade eder?',
                    options: [
                        { id: 'a', text: 'İkinci derece sit alanı', isCorrect: false },
                        { id: 'b', text: 'İki bloklu site arazisi', isCorrect: false },
                        { id: 'c', text: 'Orman kualitesini kaybetmiş ve orman dışına çıkarılmış araziler', isCorrect: true },
                        { id: 'd', text: 'Tarım yapılamayan kurak alanlar', isCorrect: false },
                        { id: 'e', text: 'Hiçbiri', isCorrect: false }
                    ],
                    points: 10,
                    difficulty: 'medium',
                    type: 'multiple_choice',
                    createdDate: new Date().toISOString()
                },
                {
                    text: 'Otomatik algılanan soru 10: Osmanlı döneminden kalan tapu kayıtları nerede saklanır?',
                    options: [
                        { id: 'a', text: 'Sadece İstanbul\'da', isCorrect: false },
                        { id: 'b', text: 'Devlet Arşivleri ve Tapu Kadastro Arşiv Dairesi', isCorrect: true },
                        { id: 'c', text: 'TBMM Kütüphanesi', isCorrect: false },
                        { id: 'd', text: 'Belediyelerde', isCorrect: false },
                        { id: 'e', text: 'Müzelerde', isCorrect: false }
                    ],
                    points: 20,
                    difficulty: 'hard',
                    type: 'multiple_choice',
                    createdDate: new Date().toISOString()
                }
            ];

            mockQuestionsFromDoc.forEach(q => addQuestion({ ...q, courseId }));
            setIsAnalyzing(false);
            onClose();
            alert(`Dosya başarıyla analiz edildi! ${mockQuestionsFromDoc.length} soru veritabanına eklendi.`);
        }, 3000);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1e1e24] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl p-6 relative overflow-hidden"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white"><div className="p-1">Kapat</div></button>

                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Upload size={24} className="text-blue-400" />
                    Dosyadan Soru Yükle
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Word, PDF veya Resim dosyalarınızı yükleyin. Yapay zeka soruları ve cevapları otomatik olarak ayrıştıracaktır.
                </p>

                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 size={48} className="text-blue-500 animate-spin" />
                        <div className="text-center">
                            <p className="font-medium text-white">Dosya Analiz Ediliyor...</p>
                            <p className="text-sm text-muted-foreground">Sorular ve cevap anahtarları ayıklanıyor</p>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition cursor-pointer group ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                            }`}
                        onDragEnter={() => setDragActive(true)}
                        onDragLeave={() => setDragActive(false)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            multiple
                            accept=".docx,.doc,.pdf,.png,.jpg,.jpeg"
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                            <FileType size={32} className="text-blue-400" />
                        </div>
                        <p className="font-medium text-lg mb-1">Dosyayı buraya sürükleyin</p>
                        <p className="text-sm text-muted-foreground">veya seçmek için tıklayın</p>
                        <div className="flex gap-2 mt-4">
                            <span className="text-xs border border-white/10 px-2 py-1 rounded text-muted-foreground">DOCX</span>
                            <span className="text-xs border border-white/10 px-2 py-1 rounded text-muted-foreground">PDF</span>
                            <span className="text-xs border border-white/10 px-2 py-1 rounded text-muted-foreground">JPG/PNG</span>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// --- SINAV AYARLARI MODALI ---
const ExamSettingsModal = ({ isOpen, onClose, onConfirm, initialData }) => {
    const [settings, setSettings] = useState({
        academicYear: '2025 - 2026',
        term: '1. DÖNEM',
        type: '1. VİZE',
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        teacher: 'Erdem ALPAR', // Varsayılan veya boş
        classLevel: '2. Sınıf'
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1e1e24] border border-white/10 rounded-xl w-full max-w-md shadow-2xl p-6"
            >
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h3 className="font-semibold text-lg">Sınav Kağıdı Ayarları</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-white"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">Akademik Yıl</label>
                        <input
                            type="text"
                            value={settings.academicYear}
                            onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Örn: 2025 - 2026"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">Dönem</label>
                            <select
                                value={settings.term}
                                onChange={(e) => setSettings({ ...settings, term: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option>1. DÖNEM</option>
                                <option>2. DÖNEM</option>
                                <option>YAZ OKULU</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">Sınav Türü</label>
                            <select
                                value={settings.type}
                                onChange={(e) => setSettings({ ...settings, type: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option>1. VİZE</option>
                                <option>2. VİZE</option>
                                <option>FİNAL</option>
                                <option>BÜTÜNLEME</option>
                                <option>MAZERET</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">Sınav Tarihi</label>
                        <input
                            type="date"
                            value={settings.date}
                            onChange={(e) => setSettings({ ...settings, date: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-white scheme-dark"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">Ders Öğretmeni</label>
                            <input
                                type="text"
                                value={settings.teacher}
                                onChange={(e) => setSettings({ ...settings, teacher: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">Sınıf</label>
                            <select
                                value={settings.classLevel}
                                onChange={(e) => setSettings({ ...settings, classLevel: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option>1. Sınıf</option>
                                <option>2. Sınıf</option>
                                <option>3. Sınıf</option>
                                <option>4. Sınıf</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded text-sm hover:bg-white/5 transition">İptal</button>
                    <button
                        type="button"
                        onClick={() => onConfirm(settings)}
                        className="px-6 py-2 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/20 transition"
                    >
                        Önizlemeyi Aç
                    </button>
                </div>

            </motion.div>
        </div>
    );
};

// --- ANA GÖRÜNÜM ---
const QuestionBankView = () => {
    const { data, deleteQuestion, deleteQuestions, updateQuestion } = useApp();
    const [selectedCourseId, setSelectedCourseId] = useState(data.courses[0]?.id || null);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]); // SEÇİLEN SORULAR
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null); // DÜZENLENEN SORU

    // Sınav Ayar ve Önizleme State'leri
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isExamPreviewOpen, setIsExamPreviewOpen] = useState(false); // SINAV ÖNİZLEME VAR MI?
    const [examSettings, setExamSettings] = useState(null);

    const courseQuestions = data.questions.filter(q => q.courseId === selectedCourseId);
    const selectedCourse = data.courses.find(c => c.id === selectedCourseId);

    // Soru Seçimi Toggle
    const toggleQuestionSelection = (qId) => {
        setSelectedQuestionIds(prev =>
            prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
        );
    };

    const handleSelectAll = () => {
        if (selectedQuestionIds.length === courseQuestions.length) {
            setSelectedQuestionIds([]);
        } else {
            setSelectedQuestionIds(courseQuestions.map(q => q.id));
        }
    };

    // Ayarları onayla ve önizlemeyi aç
    const handleSettingsConfirm = (settings) => {
        console.log("Settings confirmed, processing...", settings);
        try {
            // Tarihi formatla (YYYY-MM-DD -> DD.MM.YYYY)
            let formattedDate = settings.date;
            try {
                if (settings.date) {
                    const dateObj = new Date(settings.date);
                    formattedDate = dateObj.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                }
            } catch (e) {
                console.error("Date parse error", e);
            }

            setExamSettings({
                ...settings,
                date: formattedDate
            });
            setIsSettingsModalOpen(false);

            // Modal kapandıktan hemen sonra preview'ı aç (Render cycle safe)
            setTimeout(() => {
                console.log("Opening preview now.");
                setIsExamPreviewOpen(true);
            }, 50);

        } catch (error) {
            console.error("Handle settings confirm error:", error);
            alert("Sınav ayarları işlenirken hata oluştu: " + error.message);
        }
    };

    // Tekil Silme
    const handleDelete = (e, id) => {
        e.stopPropagation(); // Tıklama olayının parent'a (seçime) gitmesini engelle
        if (window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
            deleteQuestion(id);
            // Eğer seçiliyse seçimden de kaldır
            if (selectedQuestionIds.includes(id)) {
                setSelectedQuestionIds(prev => prev.filter(qId => qId !== id));
            }
        }
    };

    // Düzenleme
    const handleEdit = (e, question) => {
        e.stopPropagation();
        setEditingQuestion(question);
        setIsManualModalOpen(true);
    };

    // Manuel Modal Kapatma
    const handleCloseManualModal = () => {
        setIsManualModalOpen(false);
        setTimeout(() => setEditingQuestion(null), 200);
    };

    // Toplu Silme
    const handleBulkDelete = () => {
        if (window.confirm(`Seçilen ${selectedQuestionIds.length} soruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
            deleteQuestions(selectedQuestionIds);
            setSelectedQuestionIds([]);
        }
    };

    // Metni formatla (Otomatik algılanan kısmını silik yap)
    const formatQuestionText = (text) => {
        const regex = /^(Otomatik algılanan soru \d+:)(.*)/;
        const match = text.match(regex);
        if (match) {
            return (
                <span>
                    <span className="text-muted-foreground/50 text-sm font-normal block mb-1">
                        {match[1]}
                    </span>
                    {match[2]}
                </span>
            );
        }
        return text;
    };

    return (
        <div className="flex h-full">
            {/* Sol Panel: Ders Listesi */}
            <div className="w-64 border-r border-white/10 p-4 flex flex-col bg-black/20">
                <h2 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider px-2">Dersler</h2>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                    {data.courses.map(course => (
                        <button
                            key={course.id}
                            onClick={() => {
                                setSelectedCourseId(course.id);
                                setSelectedQuestionIds([]); // Ders değişince seçimleri sıfırla
                            }}
                            className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition flex items-center justify-between group ${selectedCourseId === course.id
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="truncate">{course.name}</span>
                            {selectedCourseId === course.id && <motion.div layoutId="active-course" className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sağ Panel: Soru Listesi ve İşlemler */}
            <div className="flex-1 flex flex-col p-8 overflow-hidden relative">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{selectedCourse?.name || 'Ders Seçiniz'}</h1>
                        <p className="text-muted-foreground">
                            Toplam <span className="text-white font-medium">{courseQuestions.length}</span> soru.
                            {selectedQuestionIds.length > 0 && <span className="text-green-400 ml-2 font-bold">{selectedQuestionIds.length} soru seçildi.</span>}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsManualModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition"
                        >
                            <Plus size={18} />
                            <span>Manuel Ekle</span>
                        </button>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-600/20 transition"
                        >
                            <Upload size={18} />
                            <span>Dosyadan Yükle (AI)</span>
                        </button>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex justify-between items-center gap-4 mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSelectAll}
                            className="flex items-center gap-2 text-sm font-medium hover:text-white text-muted-foreground transition"
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${courseQuestions.length > 0 && selectedQuestionIds.length === courseQuestions.length
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-white/20'
                                }`}>
                                {courseQuestions.length > 0 && selectedQuestionIds.length === courseQuestions.length && <Check size={14} />}
                            </div>
                            Tümünü Seç
                        </button>
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input type="text" placeholder="Sorular içinde ara..." className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                        </div>
                    </div>

                    {/* SEÇİLİ AKSİYONLAR: SİL ve SINAV OLUŞTUR */}
                    <div className="flex gap-3">
                        <AnimatePresence>
                            {selectedQuestionIds.length > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={handleBulkDelete}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-bold transition"
                                >
                                    <Trash2 size={18} />
                                    Seçilenleri Sil ({selectedQuestionIds.length})
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {selectedQuestionIds.length > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={() => setIsSettingsModalOpen(true)}
                                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-600/20 transition animate-pulse"
                                >
                                    <Printer size={18} />
                                    Sınav Kağıdı Oluştur ({selectedQuestionIds.length})
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Soru Listesi */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-20">
                    {courseQuestions.length > 0 ? (
                        courseQuestions.map((question, i) => {
                            const isSelected = selectedQuestionIds.includes(question.id);
                            return (
                                <motion.div
                                    key={question.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`glass-card p-6 rounded-xl border transition group relative cursor-pointer ${isSelected ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5 hover:border-white/10'
                                        }`}
                                    onClick={() => toggleQuestionSelection(question.id)}
                                >
                                    {/* Selection Overlay Checkbox */}
                                    <div className="absolute top-6 left-4">
                                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/20 hover:border-blue-400'
                                            }`}>
                                            {isSelected && <Check size={16} />}
                                        </div>
                                    </div>

                                    <div className="pl-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 rounded bg-white/5 text-xs text-muted-foreground font-mono">#{i + 1}</span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${question.difficulty === 'hard' ? 'bg-red-500/20 text-red-300' :
                                                    question.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                                                        'bg-yellow-500/20 text-yellow-300'
                                                    }`}>
                                                    {question.difficulty === 'hard' ? 'Zor' : question.difficulty === 'easy' ? 'Kolay' : 'Orta'}
                                                </span>
                                                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 text-xs font-medium">{question.points} Puan</span>
                                            </div>

                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition z-10 bg-[#1e1e24]/80 p-1 rounded-lg backdrop-blur text-white">
                                                {/* DÜZENLEME BUTONU */}
                                                <button
                                                    className="text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 p-2 rounded transition"
                                                    onClick={(e) => handleEdit(e, question)}
                                                    title="Soruyu Düzenle"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                {/* TEKİL SİLME BUTONU */}
                                                <button
                                                    className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 p-2 rounded transition"
                                                    onClick={(e) => handleDelete(e, question.id)}
                                                    title="Soruyu Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-lg font-medium mb-4 pr-10">
                                            {formatQuestionText(question.text)}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {question.options?.map(opt => (
                                                <div
                                                    key={opt.id}
                                                    className={`p-3 rounded-lg border text-sm flex items-center gap-3 ${opt.isCorrect
                                                        ? 'bg-green-500/10 border-green-500/30 text-green-200'
                                                        : 'bg-black/20 border-white/5 text-muted-foreground'
                                                        }`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${opt.isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-white/20'
                                                        }`}>
                                                        {opt.isCorrect ? <Check size={12} /> : opt.id.toUpperCase()}
                                                    </div>
                                                    {opt.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                            <FileText size={48} className="mb-4" />
                            <p>Bu derste henüz soru bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modallar */}
            <ManualQuestionModal
                isOpen={isManualModalOpen}
                onClose={handleCloseManualModal}
                courseId={selectedCourseId}
                editingQuestion={editingQuestion}
            />
            <UploadQuestionModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                courseId={selectedCourseId}
            />

            {/* Sınav Ayar Modalı */}
            <ExamSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                onConfirm={handleSettingsConfirm}
            />

            {/* Sınav Önizleme Modalı */}
            {isExamPreviewOpen && examSettings && (
                <ExamPaperPreview
                    questions={courseQuestions.filter(q => selectedQuestionIds.includes(q.id))}
                    examInfo={{
                        courseName: selectedCourse?.name,
                        academicYear: examSettings.academicYear,
                        term: examSettings.term,
                        type: examSettings.type,
                        classLevel: examSettings.classLevel,
                        date: examSettings.date,
                        teacher: examSettings.teacher
                    }}
                    onClose={() => setIsExamPreviewOpen(false)}
                />
            )}
        </div>
    );
};

export default QuestionBankView;

