import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Folder,
    FileText,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    Plus,
    Hash,
    Type,
    X,
    File
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Yeni Sınav Ekleme Modalı
const AddExamModal = ({ isOpen, onClose, onSave, yearId, semester, courseId }) => {
    const [formData, setFormData] = useState({
        name: '',
        classLevel: '2. Sınıf',
        type: 'Vize',
        file: '',
        date: new Date().toISOString().split('T')[0]
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            yearId,
            semester: Number(semester),
            courseId,
            createdDate: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            lastEditedDate: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            questionIds: [],
            duration: 60
        });
        setFormData({ name: '', classLevel: '2. Sınıf', type: 'Vize', file: '', date: new Date().toISOString().split('T')[0] });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1e1e24] border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
            >
                <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                    <h3 className="font-semibold text-lg">Yeni Sınav Dosyası Ekle</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-white transition"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">Başlık</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Örn: 2.sınıf vize soruları"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">Sınıf</label>
                            <select
                                value={formData.classLevel}
                                onChange={e => setFormData({ ...formData, classLevel: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option>1. Sınıf</option>
                                <option>2. Sınıf</option>
                                <option>3. Sınıf</option>
                                <option>4. Sınıf</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">Sınav Türü</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option>Vize</option>
                                <option>Final</option>
                                <option>Bütünleme</option>
                                <option>Quiz</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">Dosya Adı (Simülasyon)</label>
                        <input
                            type="text"
                            value={formData.file}
                            onChange={e => setFormData({ ...formData, file: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Örn: vize_sorulari.pdf"
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded text-sm hover:bg-white/5 transition">İptal</button>
                        <button type="submit" className="px-4 py-2 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition">Oluştur</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const CourseDetail = ({ course, onBack }) => {
    const { data, createExam } = useApp();
    const [currentPath, setCurrentPath] = useState([]); // ['2023-2024', '1']
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateExam = (newExamData) => {
        createExam(newExamData);
    };

    // Mevcut klasör seviyesine göre içeriği belirle
    const renderContent = () => {
        // 1. Seviye: Yıllar
        if (currentPath.length === 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.years.map((year, index) => (
                        <motion.div
                            key={year.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setCurrentPath([year.id])}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/10 shadow-lg">
                                <div className={`absolute inset-0 bg-gradient-to-br ${index % 3 === 0 ? 'from-purple-500/80 to-blue-600/80' :
                                        index % 3 === 1 ? 'from-orange-500/80 to-red-600/80' :
                                            'from-emerald-500/80 to-teal-600/80'
                                    } mix-blend-multiply group-hover:scale-110 transition duration-700`}></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white drop-shadow-lg tracking-tighter">
                                        {year.id.split('-')[0]}
                                        <span className="text-white/70 mx-1">-</span>
                                        {year.id.split('-')[1]}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText size={16} className="text-muted-foreground group-hover:text-primary transition" />
                                <span className="font-medium text-lg group-hover:text-primary transition">{year.name}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            );
        }

        // 2. Seviye: Yarıyıllar
        if (currentPath.length === 1) {
            const selectedYear = currentPath[0];
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((semester) => (
                        <motion.div
                            key={semester}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setCurrentPath([selectedYear, semester])}
                            className="glass-card p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition border border-white/10 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300 ring-1 ring-white/10 group-hover:ring-blue-500/30">
                                <Folder size={48} className="text-blue-400 fill-blue-400/20" />
                            </div>
                            <h3 className="text-3xl font-bold mb-2">{semester}. Yarıyıl</h3>
                            <p className="text-muted-foreground">
                                {data.exams.filter(e => e.courseId === course.id && e.yearId === selectedYear && e.semester === semester).length} Dosya
                            </p>
                        </motion.div>
                    ))}
                </div>
            );
        }

        // 3. Seviye: Sınav Listesi (Notion-like Table)
        if (currentPath.length === 2) {
            const [yearId, semester] = currentPath;
            const exams = data.exams.filter(e =>
                e.courseId === course.id &&
                e.yearId === yearId &&
                e.semester === Number(semester)
            );

            return (
                <div className="flex flex-col h-full space-y-4">
                    {/* Notion-like Toolbar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="w-2 h-6 rounded-sm bg-blue-500"></span>
                                Sınavlar {yearId}
                            </h2>
                            <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-muted-foreground">{exams.length} kayıt</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-white/5 text-sm text-muted-foreground transition">
                                <Filter size={14} /> Filtrele
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-white/5 text-sm text-muted-foreground transition">
                                <Search size={14} /> Ara
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition shadow-lg shadow-blue-500/20"
                            >
                                <Plus size={16} /> Yeni
                            </button>
                        </div>
                    </div>

                    <div className="border border-white/10 rounded-lg overflow-hidden bg-[#1e1e24]/50 backdrop-blur-md shadow-inner custom-scrollbar overflow-x-auto">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 min-w-[800px] border-b border-white/10 bg-white/5 text-xs text-muted-foreground font-medium">
                            <div className="col-span-1 p-3 border-r border-white/5 flex items-center gap-2"><Hash size={12} /> ID</div>
                            <div className="col-span-2 p-3 border-r border-white/5 flex items-center gap-2"><Type size={12} /> Sınıf</div>
                            <div className="col-span-2 p-3 border-r border-white/5 flex items-center gap-2"><Type size={12} /> S_Tür</div>
                            <div className="col-span-3 p-3 border-r border-white/5 flex items-center gap-2"><File size={12} /> Sınav Soruları</div>
                            <div className="col-span-2 p-3 border-r border-white/5 flex items-center gap-2"><Type size={12} /> Başlık</div>
                            <div className="col-span-2 p-3 flex items-center gap-2"><Calendar size={12} /> Tarih</div>
                        </div>

                        {/* Table Body */}
                        <div>
                            {exams.length > 0 ? exams.map((exam, i) => (
                                <motion.div
                                    key={exam.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="grid grid-cols-12 min-w-[800px] border-b border-white/5 hover:bg-white/[0.02] transition group text-sm"
                                >
                                    <div className="col-span-1 p-3 border-r border-white/5 text-muted-foreground flex items-center truncate">#{i + 1}</div>
                                    <div className="col-span-2 p-3 border-r border-white/5 flex items-center truncate">{exam.classLevel}</div>
                                    <div className="col-span-2 p-3 border-r border-white/5 flex items-center">
                                        <span className={`px-2 py-0.5 rounded textxs whitespace-nowrap ${exam.type === 'Vize' ? 'bg-yellow-500/20 text-yellow-300' :
                                                exam.type === 'Final' ? 'bg-red-500/20 text-red-300' :
                                                    exam.type === 'Bütünleme' ? 'bg-orange-500/20 text-orange-300' :
                                                        'bg-blue-500/20 text-blue-300'
                                            }`}>
                                            {exam.type}
                                        </span>
                                    </div>
                                    <div className="col-span-3 p-3 border-r border-white/5 flex items-center gap-2 truncate text-muted-foreground hover:text-white transition cursor-pointer">
                                        <FileText size={14} className="shrink-0" />
                                        <span className="truncate">{exam.file || 'Dosya yok'}</span>
                                    </div>
                                    <div className="col-span-2 p-3 border-r border-white/5 font-medium flex items-center truncate">{exam.name}</div>
                                    <div className="col-span-2 p-3 text-muted-foreground text-xs flex items-center truncate">{exam.createdDate?.split(' ')[0]}</div>
                                </motion.div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <Folder size={32} className="opacity-50" />
                                    </div>
                                    <p className="mb-4">Bu klasörde henüz sınav dosyası yok.</p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="text-blue-400 hover:text-blue-300 hover:underline text-sm transition"
                                    >
                                        İlk sınav dosyasını oluştur
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <AddExamModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleCreateExam}
                        yearId={yearId}
                        semester={semester}
                        courseId={course.id}
                    />
                </div>
            );
        }
    };

    return (
        <div className="p-8 h-full flex flex-col">
            {/* Header & Breadcrumb */}
            <div className="mb-8 select-none">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
                    <button onClick={onBack} className="hover:text-white transition">Derslerim</button>
                    <ChevronRight size={14} />
                    <span className={currentPath.length === 0 ? "text-primary" : "hover:text-white cursor-pointer transition"} onClick={() => setCurrentPath([])}>
                        {course.code}
                    </span>
                    {currentPath.length > 0 && (
                        <>
                            <ChevronRight size={14} />
                            <span className={currentPath.length === 1 ? "text-primary" : "hover:text-white cursor-pointer transition"} onClick={() => setCurrentPath([currentPath[0]])}>
                                {currentPath[0]}
                            </span>
                        </>
                    )}
                    {currentPath.length > 1 && (
                        <>
                            <ChevronRight size={14} />
                            <span className="text-primary">{currentPath[1]}. Yarıyıl</span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            if (currentPath.length > 0) {
                                const newPath = [...currentPath];
                                newPath.pop();
                                setCurrentPath(newPath);
                            } else {
                                onBack();
                            }
                        }}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition border border-white/5"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">{course.name}</h1>
                </div>
            </div>

            {/* Dynamic Content */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentPath.join('-')}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1"
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CourseDetail;
