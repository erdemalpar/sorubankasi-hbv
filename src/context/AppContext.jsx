import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data/mockData';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const APP_VERSION = '2.1'; // Versiyonu değiştirdik, eski veriyi silecek.

    const [data, setData] = useState(() => {
        try {
            const savedData = localStorage.getItem('soruBankasiData');
            const savedVersion = localStorage.getItem('appVersion');

            // Versiyon kontrolü: Eğer versiyon farklıysa veya hiç veri yoksa sıfırla
            if (!savedData || savedVersion !== APP_VERSION) {
                console.log("Versiyon değişti, yeni veri yükleniyor...");
                localStorage.removeItem('soruBankasiData');
                localStorage.setItem('appVersion', APP_VERSION);
                return initialData;
            }

            const parsed = JSON.parse(savedData);
            if (!parsed || !Array.isArray(parsed.courses)) {
                return initialData;
            }
            return parsed;
        } catch (e) {
            console.error("Veri yükleme hatası:", e);
            return initialData;
        }
    });

    const [activeYearId, setActiveYearId] = useState(() => {
        // Varsayılan olarak 2025-2026'yı (isActive=true) seç
        const defaultYear = initialData.years.find(y => y.isActive)?.id || initialData.years[0].id;
        return defaultYear;
    });

    // Veri her değiştiğinde localStorage'a kaydet
    useEffect(() => {
        localStorage.setItem('soruBankasiData', JSON.stringify(data));
    }, [data]);

    // Yardımcı Fonksiyonlar

    // Ders Ekle
    const addCourse = (course) => {
        setData(prev => ({
            ...prev,
            courses: [...prev.courses, { ...course, id: crypto.randomUUID(), yearId: activeYearId }]
        }));
    };

    // Konu Ekle
    const addTopic = (topic) => {
        setData(prev => ({
            ...prev,
            topics: [...prev.topics, { ...topic, id: crypto.randomUUID() }]
        }));
    };

    // Soru Ekle
    const addQuestion = (question) => {
        setData(prev => ({
            ...prev,
            questions: [...prev.questions, { ...question, id: crypto.randomUUID() }]
        }));
    };

    // Soru Sil (Tekil)
    const deleteQuestion = (questionId) => {
        setData(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q.id !== questionId)
        }));
    };

    // Çoklu Soru Sil
    const deleteQuestions = (questionIds) => {
        setData(prev => ({
            ...prev,
            questions: prev.questions.filter(q => !questionIds.includes(q.id))
        }));
    };

    // Soru Güncelle
    const updateQuestion = (updatedQuestion) => {
        setData(prev => ({
            ...prev,
            questions: prev.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
        }));
    };

    // Sınav Oluştur
    const createExam = (exam) => {
        setData(prev => ({
            ...prev,
            exams: [...prev.exams, { ...exam, id: crypto.randomUUID() }]
        }));
    };

    // Yıl Ekle
    const addYear = (yearName) => {
        const newYearId = yearName.trim(); // ID olarak ismi kullanalım basitlik için
        const newYear = { id: newYearId, name: yearName + ' Akademik Yılı', isActive: false };

        setData(prev => ({
            ...prev,
            years: [...prev.years, newYear].sort((a, b) => a.id.localeCompare(b.id))
        }));
    };

    // Veriyi Tamamen Sıfırla
    const resetData = () => {
        if (window.confirm('Tüm veriler silinecek ve varsayılan ayarlara dönülecek. Emin misiniz?')) {
            setData(initialData);
            setActiveYearId(initialData.years.find(y => y.isActive)?.id);
        }
    };

    const value = {
        data,
        setData,
        activeYearId,
        setActiveYearId,
        addCourse,
        addTopic,
        addQuestion,
        deleteQuestion,
        deleteQuestions,
        updateQuestion,
        createExam,
        addYear,
        resetData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
