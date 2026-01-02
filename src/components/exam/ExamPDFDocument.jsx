import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Türkçe karakter desteği için font kaydı
// Not: Gerçek projede font dosyasını import etmeniz veya URL vermeniz gerekir.
// Şimdilik standart font kullanacağız ama Türkçe karakter sorunu olmaması için
// font register işlemini basit tutuyoruz.
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
});

// Stiller - CSS'e benzer ama React Native tarzı
const styles = StyleSheet.create({
    page: {
        padding: 40, // Kenar boşluğu
        fontFamily: 'Helvetica', // Standart font
        fontSize: 10,
        lineHeight: 1.5,
    },
    headerBox: {
        borderWidth: 2,
        borderColor: '#8B0000',
        marginBottom: 20,
    },
    headerTitle: {
        backgroundColor: '#8B0000',
        color: 'white',
        padding: 8,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    headerSubTitle: {
        backgroundColor: '#f8f9fa',
        color: '#8B0000',
        padding: 5,
        textAlign: 'center',
        fontSize: 11,
        borderBottomWidth: 1,
        borderBottomColor: '#8B0000',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    infoRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#8B0000',
    },
    infoColLeft: {
        width: '50%',
        borderRightWidth: 1,
        borderRightColor: '#8B0000',
    },
    infoColRight: {
        width: '50%',
    },
    infoItem: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#8B0000',
    },
    infoLabel: {
        width: 100,
        padding: 4,
        backgroundColor: '#fef2f2', // red-50
        color: '#8B0000',
        fontWeight: 'bold',
        fontSize: 9,
        borderRightWidth: 1,
        borderRightColor: '#8B0000',
    },
    infoValue: {
        flex: 1,
        padding: 4,
        fontSize: 9,
        color: '#333',
    },
    // Sorular
    questionContainer: {
        marginBottom: 15,
        break: false, // Sorunun sayfa ortasında bölünmesini engellemeye çalışır
    },
    questionTextRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    questionNumber: {
        width: 25,
        color: '#8B0000',
        fontWeight: 'bold',
        fontSize: 11,
    },
    questionContent: {
        flex: 1,
        textAlign: 'justify',
    },
    pointsBox: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fca5a5',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 3,
        marginLeft: 5,
        fontSize: 8,
        color: '#8B0000',
    },
    optionsContainer: {
        marginLeft: 25,
    },
    optionRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    optionLetter: {
        width: 15,
        height: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#9ca3af',
        textAlign: 'center',
        fontSize: 8,
        marginRight: 5,
        color: '#4b5563',
        paddingTop: 1, // Dikey ortalamak için
    },
    optionText: {
        flex: 1,
        fontSize: 10,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 9,
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'gray',
    }
});

// PDF Doküman Bileşeni
export const ExamPDFDocument = ({ questions, examInfo, localPoints }) => {

    // Yardımcı: Metin Temizleme
    const cleanText = (text) => text ? text.replace(/^(Otomatik algılanan soru \d+:)\s*/, '') : '';

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.headerBox} fixed>
                    <View style={styles.headerTitle}>
                        <Text>ANKARA HACI BAYRAM VELİ ÜNİVERSİTESİ</Text>
                        <Text style={{ fontSize: 10, marginTop: 2, opacity: 0.9 }}>{examInfo.academicYear} EĞİTİM – ÖĞRETİM YILI</Text>
                    </View>

                    <View style={styles.headerSubTitle}>
                        <Text>{examInfo.courseName} DERSİ {examInfo.term} {examInfo.type} SORULARI</Text>
                    </View>

                    <View style={styles.infoRow}>
                        {/* Sol Kolon */}
                        <View style={styles.infoColLeft}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Adı – Soyadı</Text>
                                <Text style={styles.infoValue}></Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Sınıfı / Şube</Text>
                                <Text style={styles.infoValue}>{examInfo.classLevel}</Text>
                            </View>
                            <View style={{ ...styles.infoItem, borderBottomWidth: 0 }}>
                                <Text style={styles.infoLabel}>Öğrenci No</Text>
                                <Text style={styles.infoValue}></Text>
                            </View>
                        </View>

                        {/* Sağ Kolon */}
                        <View style={styles.infoColRight}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Sınav Tarihi</Text>
                                <Text style={styles.infoValue}>{examInfo.date}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Ders Öğretmeni</Text>
                                <Text style={styles.infoValue}>{examInfo.teacher}</Text>
                            </View>
                            <View style={{ ...styles.infoItem, borderBottomWidth: 0 }}>
                                <Text style={styles.infoLabel}>ALDIĞI PUAN</Text>
                                <Text style={styles.infoValue}></Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Sorular */}
                {questions.map((q, i) => (
                    <View key={q.id} style={styles.questionContainer} wrap={false}>
                        <View style={styles.questionTextRow}>
                            <Text style={styles.questionNumber}>{i + 1}.</Text>
                            <Text style={styles.questionContent}>
                                {cleanText(q.text)}
                                {/* React-PDF'de inline styling sınırlıdır, manuel boşluk bırakıyoruz */}
                                {"   "}[{localPoints[q.id] || 10} p]
                            </Text>
                        </View>

                        <View style={styles.optionsContainer}>
                            {q.options.map((opt) => (
                                <View key={opt.id} style={styles.optionRow}>
                                    <Text style={styles.optionLetter}>{opt.id.toUpperCase()}</Text>
                                    <Text style={styles.optionText}>{opt.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Sayfa Numarası */}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `Sayfa ${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
};
