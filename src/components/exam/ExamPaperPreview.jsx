import { useState, useEffect, useRef } from 'react';
import { X, Printer, Settings, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Type, AlignVerticalSpaceAround } from 'lucide-react';
// import { PDFDownloadLink } from '@react-pdf/renderer'; // Disabled due to crash
// import { ExamPDFDocument } from './ExamPDFDocument'; // Disabled due to crash

// ==========================================
// YARDIMCI BİLEŞENLER
// ==========================================

const ExamHeader = ({ examInfo, layout }) => (
    <div className="border-2 border-[#8B0000] mb-6 question-header-ref box-border" style={{ borderColor: '#8B0000 !important' }}>
        <div
            className="bg-[#8B0000] text-white border-b-2 border-[#8B0000] p-3 text-center font-bold text-xl leading-tight uppercase tracking-wide"
            style={{
                fontSize: '1.4em',
                backgroundColor: '#8B0000 !important',
                color: 'white !important',
                borderColor: '#8B0000 !important',
                printColorAdjust: 'exact',
                WebkitPrintColorAdjust: 'exact'
            }}
        >
            ANKARA HACI BAYRAM VELİ ÜNİVERSİTESİ<br />
            <span className="font-medium opacity-90" style={{ fontSize: '0.8em', color: 'rgba(255,255,255,0.9) !important' }}>{examInfo.academicYear} EĞİTİM – ÖĞRETİM YILI</span>
        </div>

        <div
            className="bg-[#f8f9fa] border-b border-[#8B0000] p-2 text-center font-bold text-[#8B0000] uppercase"
            style={{
                fontSize: '1.2em',
                backgroundColor: '#f8f9fa !important',
                color: '#8B0000 !important',
                borderColor: '#8B0000 !important',
                printColorAdjust: 'exact',
                WebkitPrintColorAdjust: 'exact'
            }}
        >
            {examInfo.courseName} DERSİ {examInfo.term} {examInfo.type} SORULARI
        </div>

        <div className="flex text-sm border-b border-[#8B0000]" style={{ borderColor: '#8B0000 !important' }}>
            {/* Sol */}
            <div className="flex-1 border-r border-[#8B0000]" style={{ borderColor: '#8B0000 !important' }}>
                <div className="flex border-b border-[#8B0000]" style={{ borderColor: '#8B0000 !important' }}>
                    <div className="font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]" style={{ width: `${layout.headerLabelWidth}mm`, padding: `${layout.headerRowPadding}mm`, backgroundColor: '#fef2f2 !important', color: '#8B0000 !important', borderColor: '#8B0000 !important', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>Adı – Soyadı</div>
                    <div className="flex-1" style={{ padding: `${layout.headerRowPadding}mm` }}></div>
                </div>
                <div className="flex border-b border-[#8B0000]" style={{ borderColor: '#8B0000 !important' }}>
                    <div className="font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]" style={{ width: `${layout.headerLabelWidth}mm`, padding: `${layout.headerRowPadding}mm`, backgroundColor: '#fef2f2 !important', color: '#8B0000 !important', borderColor: '#8B0000 !important', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>Sınıfı / Şube</div>
                    <div className="flex-1 font-semibold text-gray-800" style={{ padding: `${layout.headerRowPadding}mm` }}>{examInfo.classLevel}</div>
                </div>
                <div className="flex">
                    <div className="font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]" style={{ width: `${layout.headerLabelWidth}mm`, padding: `${layout.headerRowPadding}mm`, backgroundColor: '#fef2f2 !important', color: '#8B0000 !important', borderColor: '#8B0000 !important', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>Öğrenci No</div>
                    <div className="flex-1" style={{ padding: `${layout.headerRowPadding}mm` }}></div>
                </div>
            </div>
            {/* Sağ */}
            <div className="flex-1">
                <div className="flex border-b border-[#8B0000]" style={{ borderColor: '#8B0000 !important' }}>
                    <div className="font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]" style={{ width: `${layout.headerLabelWidth}mm`, padding: `${layout.headerRowPadding}mm`, backgroundColor: '#fef2f2 !important', color: '#8B0000 !important', borderColor: '#8B0000 !important', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>Sınav Tarihi</div>
                    <div className="flex-1 font-semibold text-gray-800" style={{ padding: `${layout.headerRowPadding}mm` }}>{examInfo.date}</div>
                </div>
                <div className="flex border-b border-[#8B0000]" style={{ borderColor: '#8B0000 !important' }}>
                    <div className="font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]" style={{ width: `${layout.headerLabelWidth}mm`, padding: `${layout.headerRowPadding}mm`, backgroundColor: '#fef2f2 !important', color: '#8B0000 !important', borderColor: '#8B0000 !important', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>Ders Öğretmeni</div>
                    <div className="flex-1 font-semibold text-gray-800" style={{ padding: `${layout.headerRowPadding}mm` }}>{examInfo.teacher || 'Erdem ALPAR'}</div>
                </div>
                <div className="flex">
                    <div className="font-bold border-r border-[#8B0000] bg-red-50 text-[#8B0000]" style={{ width: `${layout.headerLabelWidth}mm`, padding: `${layout.headerRowPadding}mm`, backgroundColor: '#fef2f2 !important', color: '#8B0000 !important', borderColor: '#8B0000 !important', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>ALDIĞI PUAN</div>
                    <div className="flex-1 text-xl font-bold text-[#8B0000]" style={{ padding: `${layout.headerRowPadding}mm`, color: '#8B0000 !important' }}></div>
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
                                className="point-input w-[2.5em] text-center bg-transparent focus:outline-none h-[1.2em] appearance-none p-0 mx-0 border-none font-bold text-[#8B0000]"
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

// Cetvel Bileşeni (Yatay)
const HorizontalRuler = ({ top = 0 }) => (
    <div
        className="absolute left-0 h-[30px] bg-gray-50 border-b border-gray-300 flex select-none pointer-events-none z-30 print:hidden"
        style={{ width: '100%', top: top }}
    >
        {Array.from({ length: 22 }).map((_, cm) => (
            <div key={cm} className="flex-1 border-l border-gray-400 h-full relative group">
                {cm > 0 && <span className="absolute -top-1 -left-2 text-[10px] text-gray-500">{cm}</span>}
                {/* mm ticks */}
                <div className="absolute bottom-0 left-0 w-full h-[5px] flex">
                    {Array.from({ length: 9 }).map((_, mm) => (
                        <div key={mm} className="flex-1 border-r border-gray-300 h-full" />
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// Cetvel Bileşeni (Dikey)
const VerticalRuler = ({ heightMm }) => {
    // Sayfa boyu kadar cm (örn: 29.7 -> 30)
    const cmCount = Math.ceil(heightMm / 10);

    return (
        <div
            className="absolute top-0 left-0 w-[30px] bg-gray-50 border-r border-gray-300 flex flex-col select-none pointer-events-none z-30 print:hidden overflow-hidden"
            style={{ height: `${heightMm}mm` }}
        >
            {Array.from({ length: cmCount + 1 }).map((_, cm) => (
                <div key={cm} className="border-t border-gray-300 w-full relative h-[10mm] shrink-0">
                    {cm > 0 && <span className="absolute -left-1 top-0.5 text-[10px] text-gray-500 transform -rotate-90 origin-top-left w-6 text-center">{cm}</span>}
                    {/* mm ticks */}
                    <div className="absolute top-0 right-0 h-full w-[5px] flex flex-col">
                        {Array.from({ length: 9 }).map((_, mm) => (
                            <div key={mm} className="flex-1 border-b border-gray-200 w-full" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// ==========================================
// ANA BİLEŞEN
// ==========================================

const ExamPaperPreview = ({ questions = [], examInfo = {}, onClose }) => {
    // State
    const [layout, setLayout] = useState({
        marginTop: 3,
        marginRight: 3,
        marginBottom: 3,
        marginLeft: 3,
        fontSize: 10, // İSTEK: 10pt
        fontFamily: "'Times New Roman', Times, serif", // Varsayılan Font
        gap: 1, // İSTEK: 1mm
        headerLabelWidth: 38, // İSTEK: 38mm
        headerRowPadding: 1, // YENİ: Başlık Satır Yüksekliği (mm)
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

    // Manuel Boşluk (Enter Mantığı) State
    const [manualMargins, setManualMargins] = useState({});

    // Toplam Sayfa Sayısını Hesaplama
    // Varsayılan minimum 1 sayfa
    const [pageCount, setPageCount] = useState(1);
    const paperRef = useRef(null);
    const contentRef = useRef(null); // İçeriğin gerçek boyunu ölçmek için

    // İçerik değiştikçe sayfa sayısını güncelle
    useEffect(() => {
        if (contentRef.current) {
            const observer = new ResizeObserver(entries => {
                for (let entry of entries) {
                    // İçeriğin saf yüksekliği (Header + Sorular)
                    const contentHeightPx = entry.contentRect.height;
                    // Pixel to MM (yaklaşık)
                    const contentHeightMm = contentHeightPx * 0.264583;

                    // Toplam "Dolu" Alan: İçerik + Üst/Alt Marginler
                    // Not: Paddingler contentRect'e dahil değilse eklemeliyiz, ama contentRef içeride olduğu için container padding'i dışarıda kalıyor.
                    // Bu yüzden layout.margin değerlerini ekleyerek "Kağıt üzerinde kaplanan toplam dikey alan"ı buluyoruz.
                    const totalUsedHeightMm = contentHeightMm + layout.marginTop + layout.marginBottom;

                    // Her 297mm bir sayfa demektir.
                    const count = Math.ceil(totalUsedHeightMm / 297) || 1;

                    setPageCount(Math.max(count, 1));
                }
            });
            observer.observe(contentRef.current);
            return () => observer.disconnect();
        }
    }, [questions, manualMargins, layout]);

    const handleMarginChange = (qId, delta) => {
        setManualMargins(prev => {
            const current = prev[qId] || 0;
            const newVal = Math.max(0, current + delta); // Sıfırın altına düşmesin
            return { ...prev, [qId]: newVal };
        });
    };

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
        <div id="main-preview-container" className="fixed inset-0 z-[100] bg-[#e4e4e7] flex text-white overflow-hidden font-sans print:static print:bg-white print:overflow-visible print:block print:h-auto">

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
                                <input type="range" min="0" max="20" step="0.1" value={layout.gap} onChange={(e) => setLayout({ ...layout, gap: Number(e.target.value) })} className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs text-gray-400 flex items-center gap-1"><AlignVerticalSpaceAround size={12} /> Başlık Etiket Genişliği</label>
                                    <span className="text-xs font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">{layout.headerLabelWidth}mm</span>
                                </div>
                                <input type="range" min="20" max="60" step="1" value={layout.headerLabelWidth} onChange={(e) => setLayout({ ...layout, headerLabelWidth: Number(e.target.value) })} className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs text-gray-400 flex items-center gap-1"><AlignVerticalSpaceAround size={12} /> Başlık Satır Yüksekliği</label>
                                    <span className="text-xs font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">{layout.headerRowPadding}mm</span>
                                </div>
                                <input type="range" min="1" max="10" step="0.5" value={layout.headerRowPadding} onChange={(e) => setLayout({ ...layout, headerRowPadding: Number(e.target.value) })} className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-[#2d2d35]">
                    <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition shadow-lg shadow-blue-600/20 active:scale-95 group mb-3">
                        <Printer size={18} className="group-hover:scale-110 transition" /> YAZDIR / PDF OLARAK KAYDET
                    </button>


                </div>
            </div>

            {/* SAĞ PANEL (SAYFALAR Önizleme) - Ruler Wrapper */}
            <div className="flex-1 overflow-auto bg-gray-700 relative flex flex-col items-center py-10 print:bg-white print:p-0 print:block print:overflow-visible print:h-auto custom-scrollbar">

                {/* Print Stil Bloğu (Aynı Kalabilir) */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        /* 1. HTML ve BODY Sıfırlama */
                        html, body {
                            width: 100%;
                            height: 100%;
                            margin: 0 !important;
                            padding: 0 !important;
                            overflow: visible !important;
                            background: white !important;
                        }

                        /* 2. Her Şeyi Gizle */
                        body * {
                            visibility: hidden;
                        }

                        /* 2.1 ANA KAPSAYICIYI SIFIRLA (Layout Kaymasını Önle) */
                        #main-preview-container {
                            position: static !important;
                            display: block !important;
                            overflow: visible !important;
                            background: white !important;
                            width: 100% !important;
                            height: auto !important;
                            z-index: auto !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            left: auto !important;
                            top: auto !important;
                            transform: none !important;
                        }

                        /* 3. Sadece Sınav Kağıdını ve İçeriğini Göster */
                        #exam-paper-container, #exam-paper-container * {
                            visibility: visible;
                        }

                        /* 4.1 Wrapper Sıfırlama (Çok Önemli) */
                        /* Kağıdı saran relative div'in baskıda etkisi olmamalı */
                        #exam-paper-wrapper {
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 100% !important;
                            position: static !important;
                            left: 0 !important;
                            top: 0 !important;
                            transform: none !important;
                        }

                        /* 4.2 Sınav Kağıdı Konumlandırma */
                        #exam-paper-container {
                            /* Çok sayfalı baskı için 'static' veya 'relative' şarttır. */
                            position: relative !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 210mm !important; /* A4 Genişliği */
                            min-height: 297mm !important;
                            
                            /* ORTALAMAYI KALDIR: Sola yasla */
                            margin: 0 !important; 
                            padding: 0 !important;
                            
                            /* Stil Temizliği */
                            background: white !important;
                            background-image: none !important; /* Aradaki gri boşlukları kaldır */
                            box-shadow: none !important;
                            transform: none !important;
                            z-index: 999999 !important;
                            
                            /* Flow */
                            display: block !important;
                        }
                        
                        /* Layout Marginlerini Sıfırla (React inline style ile gelenleri) */
                        /* Kullanıcının margin ayarları kalsın istiyorsak buraya dokunmayalım. Ama Wrapper sıfırlanmalı. */

                        /* Soru Bölünmesini Engelle */
                        .question-item-ref {
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                        
                        /* Sayfa Ayarı */
                        @page {
                            size: A4 portrait;
                            margin: 0; /* Tarayıcı marginlerini sıfırla */
                        }
                    }
                `}} />

                {/* WRAPPER: Tam Kağıt Boyutunda (210mm) Relative Kapsayıcı */}
                {/* Bu kapsayıcı kağıdın kendisini temsil eder. Cetveller bunun dışına (negatif margin gibi) taşar. */}
                <div id="exam-paper-wrapper" className="relative pb-20 mt-10 ml-10" style={{ width: '210mm' }}>

                    {/* CETVELLER (Kağıdın kenarlarına yapışık, dışarı taşan) */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 print:hidden">
                        {Array.from({ length: pageCount }).map((_, idx) => (
                            <div key={idx} className="absolute left-0 w-full" style={{ top: `${idx * 317}mm` }}>

                                {/* KÖŞE BİRLEŞİM NOKTASI (-30px, -30px) */}
                                <div className="absolute -top-[30px] -left-[30px] w-[30px] h-[30px] bg-gray-50 border-r border-b border-gray-300 z-30 flex items-center justify-center select-none text-[10px] text-gray-400">
                                    <div className="w-2 h-2 border-r border-b border-gray-400 mt-1 ml-1"></div>
                                </div>

                                {/* YATAY CETVEL: Kağıdın Üstünde (-30px) */}
                                <div className="absolute -top-[30px] left-0 w-full">
                                    <HorizontalRuler top={0} />
                                </div>

                                {/* DİKEY CETVEL: Kağıdın Solunda (-30px) */}
                                <div className="absolute top-0 -left-[30px] h-full">
                                    <VerticalRuler heightMm={297} />
                                </div>

                                {/* Sayfa Numarası (Daha da Solda) */}
                                <div className="absolute -left-16 top-4 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full text-xs font-bold shadow-lg text-white">
                                    {idx + 1}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TEK PARÇA A4 GÖRÜNÜMÜ (Word Tarzı) */}
                    <div className="relative shadow-2xl print:shadow-none bg-transparent transition-transform duration-200 z-20">
                        <div
                            id="exam-paper-container"
                            ref={paperRef}
                            className="bg-transparent text-black relative print-paper"
                            style={{
                                width: '100%', /* Wrapper'ı doldur (210mm) */
                                /* Yüksekliği Sayfa Sayısına Göre Zorla (Her sayfa tam A4 + boşluk görünsün diye) */
                                minHeight: `${pageCount * 317}mm`,
                                height: `${pageCount * 317}mm`,
                                paddingTop: `${layout.marginTop}mm`,
                                paddingRight: `${layout.marginRight}mm`,
                                paddingBottom: `${layout.marginBottom}mm`,
                                paddingLeft: `${layout.marginLeft}mm`,

                                fontFamily: layout.fontFamily,
                                fontSize: `${layout.fontSize}pt`,
                                boxSizing: 'border-box',
                                overflow: 'visible',

                                margin: 0, /* Margin yok, wrapper içinde tam oturur */

                                /* MS WORD GÖRÜNÜMÜ */
                                backgroundImage: `linear-gradient(
                                    to bottom,
                                    white 0mm,
                                    white 297mm,       /* Kağıt Sonu */
                                    #374151 297mm,     /* Boşluk Rengi (Koyu Gri) */
                                    #374151 317mm      /* Boşluk Sonu */
                                )`,
                                backgroundSize: '100% 317mm',
                                backgroundRepeat: 'repeat-y',
                            }}
                        >
                            {/* İÇERİK WRAPPER (Observer bunu izler) */}
                            {/* flow-root: Margin collapsing'i engeller, böylece içerideki marginler yüksekliğe dahil olur. */}
                            <div ref={contentRef} className="w-full flow-root">
                                {/* Header */}
                                <div className="mb-6">
                                    <ExamHeader examInfo={examInfo} layout={layout} />
                                </div>

                                {/* Sorular Listesi */}
                                <div className="flex flex-col" style={{ gap: `${layout.gap}mm` }}>
                                    {questions.map((q, i) => (
                                        <div
                                            key={q?.id || i}
                                            className="question-item-ref relative group transition-all duration-200"
                                            style={{
                                                marginTop: `${manualMargins[q.id] || 0}mm`,
                                                marginBottom: `${layout.gap}mm`
                                            }}
                                        >
                                            {/* Manuel Boşluk Kontrolü */}
                                            <div className="absolute -left-20 top-0 h-full w-20 print:hidden hidden group-hover:flex items-start justify-end pr-3 z-30 pt-1">
                                                <div className="bg-[#1e1e24] text-white text-[10px] p-1 rounded shadow flex flex-col items-center gap-1 border border-white/10 pointer-events-auto hover:bg-black transition-colors">
                                                    <button
                                                        onClick={() => handleMarginChange(q.id, -5)}
                                                        className="p-1 hover:bg-white/20 rounded disabled:opacity-30 text-blue-300"
                                                        disabled={!manualMargins[q.id]}
                                                        title="Boşluğu Azalt"
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <span className="font-mono text-[9px] text-gray-400 select-none">{manualMargins[q.id] || 0}mm</span>
                                                    <button
                                                        onClick={() => handleMarginChange(q.id, 10)}
                                                        className="p-1 hover:bg-white/20 rounded text-green-300"
                                                        title="Boşluk Ekle"
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                </div>
                                            </div>

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
                </div>

                {/* Bilgilendirme */}
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/50 font-mono print:hidden bg-black/80 px-4 py-2 rounded-full pointer-events-none z-50 shadow-xl backdrop-blur-sm border border-white/10">
                    * Word Görünümü: Gri alanlar sayfa boşluklarını temsil eder. Baskıda sadece beyaz sayfalar çıkar.
                </div>
            </div>
        </div>
    );
};

export default ExamPaperPreview;

