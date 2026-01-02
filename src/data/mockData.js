export const initialData = {
    years: [
        { id: '2022-2023', name: '2022-2023 Akademik Yılı', isActive: false },
        { id: '2023-2024', name: '2023-2024 Akademik Yılı', isActive: false },
        { id: '2024-2025', name: '2024-2025 Akademik Yılı', isActive: false },
        { id: '2025-2026', name: '2025-2026 Akademik Yılı', isActive: true },
    ],
    schoolInfo: {
        name: 'ANKARA HACI BAYRAM VELİ ÜNİVERSİTESİ',
        term: '2023 – 2024 EĞİTİM – ÖĞRETİM YILI 1. DÖNEM',
        examTitle: '1. VİZE SORULARI',
        teacher: 'Erdem ALPAR'
    },
    courses: [
        { id: 'c1', code: 'DERS1', name: 'Tapu ve Kadastroda Dijitalleşme', description: '' },
        { id: 'c2', code: 'DERS2', name: 'Tapu ve Kadastro Bilgi Sistemi (TAKBİS)', description: '' },
        { id: 'c3', code: 'DERS3', name: '3Boyutlu Kent Modelleri ve Kadastro Projesi', description: '' },
        { id: 'c4', code: 'DERS4', name: '3Boyutlu bilgi sistemi', description: '' },
        { id: 'c5', code: 'DERS5', name: 'Mekânsal gayrimenkul sistemi (MEGSİS)', description: '' },
        { id: 'c6', code: 'DERS6', name: 'Tapu arşiv bilgi sistemi (TARBİS)', description: '' },
        { id: 'c7', code: 'DERS7', name: 'Harita bilgi bankası', description: '' },
        { id: 'c8', code: 'DERS8', name: 'Web tapu', description: '' },
        { id: 'c9', code: 'DERS9', name: 'Türkiye ulusal coğrafi bilgi sistemi', description: '' },
        { id: 'c10', code: 'DERS10', name: 'Askı ilanı sorgulama', description: '' },
        { id: 'c11', code: 'DERS11', name: 'Tapu ve Kadastro Bilgi Sistemi', description: '' },
        { id: 'c12', code: 'DERS12', name: 'Tapu ve kadastro modernizasyonu', description: '' },
        { id: 'c13', code: 'DERS13', name: 'Tapu kadastro alanında yazılımcılık', description: '' },
        { id: 'c14', code: 'DERS14', name: 'Genel Tekrar', description: '' },
    ],
    topics: [],
    questions: [],
    exams: [
        {
            id: 'e1',
            courseId: 'c1',
            yearId: '2023-2024',
            semester: 1,
            classLevel: '2. Sınıf',
            type: 'Vize',
            name: '2.sınıf vize soruları',
            file: '2.sınıf vize soruları.pdf',
            createdDate: '25.07.2025',
            lastEditedDate: '25.07.2025',
            questionIds: [],
            duration: 60
        },
        {
            id: 'e2',
            courseId: 'c1',
            yearId: '2024-2025',
            semester: 2,
            classLevel: '3. Sınıf',
            type: 'Final',
            name: '3.sınıf final soruları',
            file: 'final.pdf',
            createdDate: '25.07.2026',
            lastEditedDate: '25.07.2026',
            questionIds: [],
            duration: 90
        }
    ]
};
