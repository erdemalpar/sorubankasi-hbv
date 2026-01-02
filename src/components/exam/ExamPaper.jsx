import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Printer } from 'lucide-react';

const ExamPaper = ({ exam }) => {
    const { data } = useApp();
    const printRef = useRef();

    if (!exam) return null;

    const course = data.courses.find(c => c.id === exam.courseId);
    const questions = exam.questionIds.map(id => data.questions.find(q => q.id === id)).filter(Boolean);

    const handlePrint = () => {
        // Sadece print-area id'li alanı yazdırmak için basit bir yaklaşım
        const printContent = document.getElementById('print-area').innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload(); // React state'ini sıfırlamamak için reload gerekebilir, daha iyi bir yöntem CSS media query kullanmaktır ama hızlı çözüm bu.
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 text-black">
            {/* Kontrol Paneli */}
            <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">Sınav Önizleme</h2>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    <Printer size={18} /> Yazdır
                </button>
            </div>

            {/* A4 Kağıt Görünümü */}
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-200">
                <div
                    id="print-area"
                    className="bg-white w-[210mm] min-h-[297mm] p-[20mm] shadow-xl relative print:w-full print:shadow-none print:p-0"
                >
                    {/* Sınav Başlığı */}
                    <div className="border-2 border-black mb-6">
                        <div className="bg-gray-300 text-center py-2 border-b-2 border-black font-bold">
                            <h1 className="text-lg m-0">{data.schoolInfo?.name}</h1>
                            <h2 className="text-md m-0 text-red-600 uppercase">{data.schoolInfo?.term} {data.schoolInfo?.examTitle}</h2>
                        </div>

                        <div className="grid grid-cols-[100px_1fr_100px_1fr] text-sm print:grid-cols-[100px_1fr_100px_1fr]">
                            <div className="border-r border-b border-black p-1 font-bold">Adı – Soyadı</div>
                            <div className="border-r border-b border-black p-1"></div>
                            <div className="border-r border-b border-black p-1 font-bold">Sınav Tarihi</div>
                            <div className="border-b border-black p-1"></div>

                            <div className="border-r border-b border-black p-1 font-bold">Sınav Sınıfı</div>
                            <div className="border-r border-b border-black p-1"></div>
                            <div className="border-r border-b border-black p-1 font-bold">Ders Öğretmeni</div>
                            <div className="border-b border-black p-1 font-bold">{data.schoolInfo?.teacher}</div>

                            <div className="border-r border-black p-1 font-bold">Okul No</div>
                            <div className="border-r border-black p-1"></div>
                            <div className="border-r border-black p-1 font-bold bg-gray-200">ALDIĞI PUAN</div>
                            <div className="border-black p-1"></div>
                        </div>
                    </div>

                    {/* Sorular Başlığı */}
                    <div className="bg-orange-100 border-2 border-black text-center font-bold py-1 mb-2">
                        SORULAR
                    </div>

                    {/* Yönerge */}
                    <div className="mb-4 text-sm font-bold underline">
                        A. Aşağıda verilen çoktan seçmeli soruları yanıtlayınız ve cevaplarını üzerlerine işaretleyiniz. (puanlar her sorunun yanında yazmaktadır.)
                    </div>

                    {/* Sorular Listesi */}
                    <div className="space-y-6">
                        {questions.map((q, index) => (
                            <div key={q.id} className="break-inside-avoid">
                                <div className="font-bold flex gap-1 items-start mb-1">
                                    <span>S{index + 1}.</span>
                                    <span>{q.text} ({q.points} puan)</span>
                                </div>
                                <div className="ml-6 space-y-1">
                                    {q.options.map((opt) => (
                                        <div key={opt.id} className="flex gap-2">
                                            <span className="font-bold min-w-[20px]">{opt.id.toUpperCase()}.</span>
                                            <span>{opt.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ExamPaper;
