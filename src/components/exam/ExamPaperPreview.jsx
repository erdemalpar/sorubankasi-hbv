import { useState, useEffect, useRef } from 'react';
import { X, Printer, Settings, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Type, AlignVerticalSpaceAround } from 'lucide-react';
// import { PDFDownloadLink } from '@react-pdf/renderer'; // Disabled due to crash
// import { ExamPDFDocument } from './ExamPDFDocument'; // Disabled due to crash

// ==========================================
// YARDIMCI BİLEŞENLER
// ==========================================

const ExamHeader = ({ examInfo }) => (
    <div className="border-2 border-[#8B0000] mb-6 question-header-ref box-border">
        <div className="bg-[#8B0000] text-white border-b-2 border-[#8B0000] p-3 text-center font-bold text-xl leading-tight uppercase tracking-wide">
            ANKARA HACI BAYRAM VELİ ÜNİVERSİTESİ<br />
            <span className="text-lg font-medium opacity-90">{examInfo.academicYear} EĞİTİM – ÖĞRETİM YILI</span>
        </div>

        <div className="bg-[#f8f9fa] border-b border-[#8B0000] p-2 text-center font-bold text-lg text-[#8B0000] uppercase">
            {examInfo.courseName} DERSİ {examInfo.term} {examInfo.type} SORULARI
        </div>

        <div className="flex text-sm border-b border-[#8B0000]">
            {/* Sol */}
            <div className="flex-1 border-r border-[#8B0000]">
                <div className="flex border-b border-[#8B0000]">
                    <div className="w-28 p-1.5 font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]">Adı – Soyadı</div>
                    <div className="flex-1 p-1.5"></div>
                </div>
                <div className="flex border-b border-[#8B0000]">
                    <div className="w-28 p-1.5 font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]">Sınıfı / Şube</div>
                    <div className="flex-1 p-1.5 font-semibold text-gray-800">{examInfo.classLevel}</div>
                </div>
                <div className="flex">
                    <div className="w-28 p-1.5 font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]">Öğrenci No</div>
                    <div className="flex-1 p-1.5"></div>
                </div>
            </div>
            {/* Sağ */}
            <div className="flex-1">
                <div className="flex border-b border-[#8B0000]">
                    <div className="w-32 p-1.5 font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]">Sınav Tarihi</div>
                    <div className="flex-1 p-1.5 font-semibold text-gray-800">{examInfo.date}</div>
                </div>
                <div className="flex border-b border-[#8B0000]">
                    <div className="w-32 p-1.5 font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]">Ders Öğretmeni</div>
                    <div className="flex-1 p-1.5 font-semibold text-gray-800">{examInfo.teacher || 'Erdem ALPAR'}</div>
                </div>
                <div className="flex">
                    <div className="w-32 p-1.5 font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]">ALDIĞI PUAN</div>
                    <div className="flex-1 p-1.5 text-xl font-bold text-[#8B0000]"></div>
                </div>
            </div>
        </div>
    </div>
);

const QuestionItem = ({ q, index, point, onPointChange, cleanTextFn }) => {
    if (!q) return null;
    return (
        <div className="question-item-ref relative group box-border">
            <div className="flex gap-[0.5em]">
                <span className="font-bold text-[#8B0000] w-[1.5em] shrink-0 text-right pr-[0.2em] leading-normal">{index + 1}.</span>
                <div className="flex-1">
                    {/* Soru Metni */}
                    <div className="font-semibold mb-[0.5em] leading-normal text-gray-900 text-justify relative">
                        {cleanTextFn(q.text || '')}

                        {/* Manuel Puan Girişi */}
                        <div className="inline-flex items-center ml-[0.5em] align-middle transform -translate-y-[0.1em] font-bold text-[#8B0000] bg-red-50 rounded border border-[#8B0000]/20 px-[0.3em] hover:border-[#8B0000] transition-colors" style={{ fontSize: '0.85em' }}>
                            <input
                                type="number"
                                className="point-input w-[2em] text-center bg-transparent focus:outline-none h-[1.2em] appearance-none p-0 mx-0 border-none font-bold text-[#8B0000]"
                                value={point}
                                onChange={(e) => onPointChange && onPointChange(q.id, e.target.value)}
                                readOnly={!onPointChange}
                            />
                            <span className="pointer-events-none -ml-[0.1em]">p</span>
                        </div>
                    </div>

                    {/* Seçenekler */}
                    <div className="grid grid-cols-1 gap-[0.2em] pl-[0.2em]">
                        {q.options && q.options.map((opt) => (
                            <div key={opt.id} className="flex gap-[0.5em] items-start rounded hover:bg-gray-50 -ml-[0.2em] pl-[0.2em]">
                                <span
                                    className="font-bold flex items-center justify-center rounded-full border border-gray-400 text-gray-600 leading-none shrink-0"
                                    style={{ width: '1.4em', height: '1.4em', fontSize: '0.9em', marginTop: '0.1em' }}
                                >
                                    {opt.id.toUpperCase()}
                                </span>
                                <span className="text-gray-800 leading-normal">{opt.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// ==========================================
// ANA BİLEŞEN
// ==========================================

// ==========================================
// ANA BİLEŞEN (BASİTLEŞTİRİLMİŞ VERSİYON)
// ==========================================

const ExamPaperPreview = ({ questions = [], examInfo = {}, onClose }) => {
    // State
    const [layout, setLayout] = useState({
        marginTop: 3,
        marginRight: 3,
        marginBottom: 3,
        marginLeft: 3,
        fontSize: 11, // pt
        fontFamily: "'Times New Roman', Times, serif", // Varsayılan Font
        gap: 6, // mm
    });

    // Font Seçenekleri
    const fontOptions = [
        { label: "Times New Roman (Klasik)", value: "'Times New Roman', Times, serif" },
        { label: "Arial (Modern)", value: "Arial, Helvetica, sans-serif" },
        { label: "Calibri (Yumuşak)", value: "'Calibri', 'Segoe UI', sans-serif" },
        { label: "Courier New (Daktilo)", value: "'Courier New', Courier, monospace" },
        { label: "Garamond (Kitap)", value: "'Garamond', 'Georgia', serif" }
    ];

    // Puan State'i
    const [localPoints, setLocalPoints] = useState(() => {
        if (!questions || !Array.isArray(questions)) return {};
        return questions.reduce((acc, q) => ({ ...acc, [q?.id]: q?.points || 10 }), {});
    });

    const [totalScore, setTotalScore] = useState(0);

    // Puan değişimi
    const handlePointChange = (id, newPoints) => {
        if (!id) return;
        const val = parseInt(newPoints) || 0;
        setLocalPoints(prev => ({ ...prev, [id]: val }));
    };

    // Toplam Puan Hesaplama
    useEffect(() => {
        const total = Object.values(localPoints).reduce((sum, p) => sum + p, 0);
        setTotalScore(total);
    }, [localPoints]);

    // Helper
    const cleanQuestionText = (text) => text ? text.replace(/^(Otomatik algılanan soru \d+:)\s*/, '') : '';
    const handlePrint = () => window.print();

    if (!questions) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex text-white overflow-hidden font-sans print:static print:bg-white print:overflow-visible print:block print:h-auto">

            {/* SOL PANEL (Sidebar) */}
            <div className="w-80 bg-[#1e1e24] border-r border-white/10 flex flex-col print:hidden h-full z-20 shadow-2xl shrink-0">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#2d2d35]">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Settings size={18} className="text-blue-400" />
                        Sayfa Düzeni
                    </h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded transition text-muted-foreground hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
                    <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 text-center">
                        <span className="block text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">Toplam Sınav Puanı</span>
                        <div className="text-3xl font-bold text-white flex justify-center items-end gap-1">
                            {totalScore} <span className="text-sm font-medium text-blue-300 mb-1">puan</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Kenar Boşlukları (mm)</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 flex items-center gap-1"><ArrowUp size={12} /> Üst</label>
                                <input type="number" value={layout.marginTop} onChange={(e) => setLayout({ ...layout, marginTop: Number(e.target.value) })} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 flex items-center gap-1"><ArrowDown size={12} /> Alt</label>
                                <input type="number" value={layout.marginBottom} onChange={(e) => setLayout({ ...layout, marginBottom: Number(e.target.value) })} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 flex items-center gap-1"><ArrowLeft size={12} /> Sol</label>
                                <input type="number" value={layout.marginLeft} onChange={(e) => setLayout({ ...layout, marginLeft: Number(e.target.value) })} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 flex items-center gap-1"><ArrowRight size={12} /> Sağ</label>
                                <input type="number" value={layout.marginRight} onChange={(e) => setLayout({ ...layout, marginRight: Number(e.target.value) })} className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Görünüm</h4>
                        <div className="space-y-4 pt-1">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 flex items-center gap-1"><Type size={12} /> Yazı Tipi</label>
                                <select
                                    value={layout.fontFamily}
                                    onChange={(e) => setLayout({ ...layout, fontFamily: e.target.value })}
                                    className="w-full bg-black/30 border border-white/10 rounded px-2 py-2 text-sm focus:border-blue-500 outline-none transition text-white appearance-none cursor-pointer hover:bg-white/5"
                                >
                                    {fontOptions.map((opt, idx) => (
                                        <option key={idx} value={opt.value} className="bg-[#1e1e24] text-white">{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs text-gray-400 flex items-center gap-1"><Type size={12} /> Yazı Boyutu</label>
                                    <span className="text-xs font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">{layout.fontSize}pt</span>
                                </div>
                                <input type="range" min="8" max="16" step="0.5" value={layout.fontSize} onChange={(e) => setLayout({ ...layout, fontSize: Number(e.target.value) })} className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs text-gray-400 flex items-center gap-1"><AlignVerticalSpaceAround size={12} /> Soru Boşluğu</label>
                                    <span className="text-xs font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">{layout.gap}mm</span>
                                </div>
                                <input type="range" min="2" max="20" step="1" value={layout.gap} onChange={(e) => setLayout({ ...layout, gap: Number(e.target.value) })} className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-[#2d2d35]">
                    <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition shadow-lg shadow-blue-600/20 active:scale-95 group mb-3">
                        <Printer size={18} className="group-hover:scale-110 transition" /> YAZDIR / PDF OLARAK KAYDET
                    </button>

                    <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-200/80 leading-relaxed text-left">
                        <strong className="block text-yellow-400 mb-1 font-bold flex items-center gap-1">⚠️ Yazdırma Ayarları Önemli!</strong>
                        Sınav kağıdının ekrandaki gibi tam çıkması için yazdırma penceresinde şu ayarları yapınız:
                        <ul className="list-disc list-inside mt-1.5 space-y-1 opacity-90">
                            <li><span className="text-white font-medium">Kenar Boşlukları:</span> "Yok" seçin.</li>
                            <li><span className="text-white font-medium">Seçenekler:</span> "Arka plan grafikleri"ni işaretleyin.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* SAĞ PANEL (SAYFALAR Önizleme) */}
            <div className="flex-1 overflow-y-auto bg-[#121214] flex flex-col items-center py-10 print:bg-white print:p-0 print:block print:overflow-visible print:h-auto">

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        @page { 
                            size: A4; 
                            margin: 0; 
                        }
                        body, html, #root {
                            height: auto !important;
                            overflow: visible !important;
                            background: white !important;
                        }
                        
                        /* UI Elementlerini Gizle */
                        .print\\:hidden, 
                        .no-print, 
                        .sidebar-settings,
                        button[class*="X"], 
                        div[class*="bg-[#1e1e24]"] { 
                            display: none !important; 
                        }

                        /* Modal ve Wrapper Sıfırlama */
                        .fixed, .absolute, .inset-0 {
                            position: static !important;
                            width: 100% !important;
                            height: auto !important;
                            overflow: visible !important;
                            background: white !important;
                            display: block !important;
                        }

                        /* Scroll Sıfırlama */
                        .overflow-y-auto {
                            overflow: visible !important;
                            height: auto !important;
                        }
                        
                        /* Soru Bölünmesini Engelle */
                        .question-item-ref {
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                    }
                `}} />

                <div
                    className="bg-white text-black shadow-2xl relative transition-transform duration-200 print:shadow-none print:w-full"
                    style={{
                        width: '210mm',
                        minHeight: '297mm',
                        height: 'auto', // Allow height to grow
                        paddingTop: `${layout.marginTop}mm`,
                        paddingRight: `${layout.marginRight}mm`,
                        paddingBottom: `${layout.marginBottom}mm`,
                        paddingLeft: `${layout.marginLeft}mm`,
                        fontFamily: layout.fontFamily,
                        fontSize: `${layout.fontSize}pt`,
                        boxSizing: 'border-box',
                        overflow: 'visible' // Ensure content is not clipped
                    }}
                >
                    {/* Header: Sadece sayfanın en başında görünür (Basitleştirilmiş) */}
                    <ExamHeader examInfo={examInfo} />

                    {/* Sorular Listesi */}
                    <div className="flex flex-col" style={{ gap: `${layout.gap}mm` }}>
                        {questions.map((q, i) => (
                            <div key={q?.id || i} className="question-item-ref" style={{ marginBottom: `${layout.gap}mm` }}>
                                <QuestionItem
                                    q={q}
                                    index={i}
                                    point={localPoints[q?.id] || 0}
                                    onPointChange={handlePointChange}
                                    cleanTextFn={cleanQuestionText}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamPaperPreview;
