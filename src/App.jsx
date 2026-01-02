
import { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Library,
  Settings,
  FileText,
  Printer,
  Calendar
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion } from 'framer-motion';
import CourseDetail from './components/course/CourseDetail';
import ExamPaper from './components/exam/ExamPaper';
import QuestionBankView from './components/question/QuestionBankView';

// Placeholder bileşenler (sonra ayrı dosyalara taşınacak)
const DashboardView = ({ onYearClick }) => {
  const { data, activeYearId, setActiveYearId } = useApp();

  // Yılları sıralayalım
  const sortedYears = [...data.years].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
        Genel Bakış
      </h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { title: 'Aktif Dersler', value: data.courses.filter(c => c.yearId === activeYearId).length, icon: BookOpen },
          { title: 'Toplam Soru', value: data.questions.length, icon: Library },
          { title: 'Hazırlanan Sınav', value: data.exams.length, icon: FileText },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card flex items-center gap-4 text-card-foreground hover:bg-white/5 transition"
          >
            <div className="p-3 bg-primary/20 rounded-lg text-primary">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Zaman Çizelgesi (Timeline) */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Calendar size={20} className="text-blue-400" />
          Akademik Yıl Çizelgesi
        </h2>
        <div className="glass-card p-10 overflow-x-auto custom-scrollbar">
          <div className="relative min-w-[700px] flex items-center justify-between px-10 pt-4 pb-2">
            {/* Arka Plan Çizgisi */}
            <div className="absolute left-10 right-10 top-[26px] h-1 bg-white/10 rounded-full"></div>

            {/* İlerleme Çizgisi (Aktif yıla kadar dolu) */}
            <div
              className="absolute left-10 top-[26px] h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
              style={{
                width: `${(sortedYears.findIndex(y => y.id === activeYearId) / (sortedYears.length - 1)) * 100}%`
              }}
            ></div>

            {sortedYears.map((year, index) => {
              const isActive = year.id === activeYearId;
              const isPast = activeYearId && year.id < activeYearId;

              return (
                <div
                  key={year.id}
                  className="relative z-10 flex flex-col items-center group cursor-pointer"
                  onClick={() => onYearClick(year.id)}
                >
                  {/* Etiket (Üstte) - Aktifse göster */}
                  <div className={cn(
                    "absolute -top-10 transition-all duration-300 opacity-0 transform translate-y-2",
                    isActive ? "opacity-100 translate-y-0" : "group-hover:opacity-100 group-hover:translate-y-0"
                  )}>
                    <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-blue-400">
                      {isActive ? 'SEÇİLİ YIL' : 'GÖRÜNTÜLE'}
                    </div>
                    {/* Ok işareti */}
                    <div className="w-2 h-2 bg-blue-600 rotate-45 transform mx-auto -mt-1"></div>
                  </div>

                  {/* Nokta */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isActive ? 1.3 : 1 }}
                    whileHover={{ scale: 1.2 }}
                    className={cn(
                      "w-4 h-4 rounded-full border-4 transition-all duration-300 z-20 box-content",
                      isActive ? "bg-black border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" :
                        isPast ? "bg-blue-500 border-blue-500" :
                          "bg-black border-white/20 hover:border-white/60"
                    )}
                  ></motion.div>

                  {/* Yıl Yazısı (Altta) */}
                  <div className={cn(
                    "mt-4 px-3 py-1 rounded text-sm font-medium transition-all duration-300 select-none",
                    isActive ? "text-blue-300 bg-blue-500/10 border border-blue-500/20" :
                      isPast ? "text-muted-foreground" :
                        "text-muted-foreground/60"
                  )}>
                    {year.id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

import { useApp } from './context/AppContext';
import { ChevronRight, Plus } from 'lucide-react';

const CoursesView = ({ selectedCourse, setSelectedCourse }) => {
  const { data, addCourse } = useApp();
  // Dersler artık yıldan yıla değişmiyor, hepsi sabit.
  const courses = data.courses;

  if (selectedCourse) {
    return <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Derslerim
        </h1>
        <button
          onClick={() => {
            const name = prompt('Ders Adı:');
            const code = prompt('Ders Kodu:');
            if (name && code) addCourse({ name, code, description: '' });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          <Plus size={18} /> Yeni Ders Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedCourse(course)}
            className="glass-card hover:bg-card/80 transition cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300">
                {course.code}
              </span>
              <ChevronRight className="text-muted-foreground group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-xl font-bold mb-2">{course.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.description || 'Açıklama girilmemiş.'}
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-sm text-muted-foreground">
              <span>{data.topics.filter(t => t.courseId === course.id).length} Konu</span>
              <span>{data.exams.filter(e => e.courseId === course.id).length} Sınav</span>
            </div>
          </motion.div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Bu akademik yıl için henüz ders eklenmemiş.
        </div>
      )}
    </div>
  );
};


const ExamBuilderView = () => {
  const { data } = useApp();
  const [selectedExam, setSelectedExam] = useState(null);

  if (selectedExam) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-background p-4 border-b border-white/10 flex justify-between">
          <button onClick={() => setSelectedExam(null)} className="text-muted-foreground hover:text-white">← Geri Dön</button>
        </div>
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
          <ExamPaper exam={selectedExam} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
        Sınav Kağıtları
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.exams.map(exam => (
          <motion.div
            key={exam.id}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 cursor-pointer hover:border-primary/50"
            onClick={() => setSelectedExam(exam)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-orange-500/20 text-orange-400">
                <Printer size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{exam.name}</h3>
                <p className="text-sm text-muted-foreground">{data.courses.find(c => c.id === exam.courseId)?.name}</p>
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-white/10">
              <span>{exam.date}</span>
              <span>{exam.duration} dk</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SettingsView = () => {
  const { data, addYear } = useApp();
  const [newYearName, setNewYearName] = useState('');

  const handleAddYear = (e) => {
    e.preventDefault();
    if (newYearName && !data.years.find(y => y.id === newYearName)) {
      addYear(newYearName);
      setNewYearName('');
    } else {
      alert('Geçersiz veya zaten var olan bir yıl girdiniz.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
        Ayarlar
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar size={20} /> Yeni Eğitim Yılı Ekle
          </h2>
          <form onSubmit={handleAddYear} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Dönem Adı (Örn: 2025-2026)</label>
              <input
                type="text"
                value={newYearName}
                onChange={(e) => setNewYearName(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="2025-2026"
              />
            </div>
            <button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
              Ekle
            </button>
          </form>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Mevcut Dönemler</h2>
          <div className="space-y-2">
            {data.years.map(year => (
              <div key={year.id} className="p-3 bg-white/5 rounded border border-white/5 flex justify-between items-center">
                <span>{year.name}</span>
                {year.isActive && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Aktif</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


function App() {
  const { data, activeYearId, setActiveYearId } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleYearClick = (yearId) => {
    setActiveYearId(yearId);
    setActiveTab('courses');
    setSelectedCourse(null);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Genel Bakış',
      icon: LayoutDashboard,
      component: () => <DashboardView onYearClick={handleYearClick} />
    },
    {
      id: 'courses',
      label: 'Derslerim',
      icon: BookOpen,
      component: () => <CoursesView selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />
    },
    { id: 'questions', label: 'Soru Bankası', icon: Library, component: QuestionBankView },
    { id: 'exams', label: 'Sınav Hazırla', icon: FileText, component: ExamBuilderView },
    { id: 'settings', label: 'Ayarlar', icon: Settings, component: SettingsView },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onYearClick={handleYearClick} />;
      case 'courses':
        return <CoursesView selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />;
      case 'questions':
        return <QuestionBankView />;
      case 'exams':
        return <ExamBuilderView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onYearClick={handleYearClick} />;
    }
  };

  // Menü tıklama işleyicisi - Özel mantıklar buraya
  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);

    // Derslerim'e tıklandığında listeyi açmak için course seçimini sıfırla
    if (itemId === 'courses') {
      setSelectedCourse(null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="text-white" size={24} />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Akademik<span className="text-primary">Asistan</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Aktif Dönem</p>
            <p className="text-sm font-semibold">{activeYearId} Akademik Yılı</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>

        {renderContent()}
      </main>
    </div>
  );
}

export default App;
