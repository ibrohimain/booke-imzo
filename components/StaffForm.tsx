
import React, { useState } from 'react';
import { BookItem, BookSubmission } from '../types';
import { 
  Send, Plus, Trash2, BookPlus, User, ChevronRight, 
  ChevronLeft, CheckCircle2, Info, Building2, UserCircle2
} from 'lucide-react';

interface StaffFormProps {
  onSubmit: (data: Omit<BookSubmission, 'id' | 'status' | 'submittedAt'>) => Promise<void>;
}

const DEPARTMENTS = [
  "Transport vositalari muhandisligi", "Transport logistikasi", "Umumtexnika fanlari", "Ijtimoiy fanlar",
  "Qurilish muhandisligi", "Yo‘l muhandisligi", "Qurilish materiallari va konstruksiyalari",
  "Muhandislik kommunikatsiyalari", "Kimyoviy texnologiya", "Kimyo", "Arxitekturaviy loyihalash",
  "O‘zbek va xorijiy tillar", "To‘qimqchilik mahsulotlari texnologiyasi",
  "Tabiiy tolalar va matoga ishlov berish texnologiyalari", "Qishloq xo‘jalik va oziq – ovqat texnika texnologiyalari",
  "Ekologiya va mehnat muxofazasi", "Energetika va elektr texnologiyasi", "Metrologiya va standartlashtirish",
  "Fizika", "Oliy matemetika", "Kompyuter va dasturiy injiniring", "Jismoniy tarbiya",
  "Radioelektronika", "Iqtisodiyot va menejment"
];

const BOOK_TYPES = [
  "Darslik", "Uslubiy ko'rsatma", "O'quv qo'llanma", "Badiiy adabiyot", "Uslubiy qo'llanma",
  "Lug'atlar", "Ma'lumotnomalar", "Ma'ruzalar to'plami", "O'quv-uslubiy majmua",
  "Ilmiy maqola", "Ilmiy tezis", "PhD dissertatsiya", "DSc dissertatsiya", "Monografiya", "Boshqa"
];

export const StaffForm: React.FC<StaffFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtherDept, setIsOtherDept] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    isExternal: false,
    institution: 'Jizzax Politexnika Instituti',
    department: '',
    otherDepartment: '',
    position: ''
  });

  const [books, setBooks] = useState<BookItem[]>([
    { title: '', type: 'Darslik', authors: '', quantity: 1, publishedYear: new Date().getFullYear(), isbn: '' }
  ]);

  const validateStep1 = () => {
    const dept = personalInfo.isExternal ? personalInfo.department : (isOtherDept ? personalInfo.otherDepartment : personalInfo.department);
    return personalInfo.fullName && dept && personalInfo.position && personalInfo.institution;
  };

  const addBookRow = () => {
    if (books.length >= 6) return;
    setBooks([...books, { title: '', type: 'Darslik', authors: '', quantity: 1, publishedYear: new Date().getFullYear(), isbn: '' }]);
  };

  const removeBookRow = (index: number) => {
    if (books.length === 1) return;
    setBooks(books.filter((_, i) => i !== index));
  };

  const updateBook = (index: number, field: keyof BookItem, value: any) => {
    const newBooks = [...books];
    newBooks[index] = { ...newBooks[index], [field]: value };
    setBooks(newBooks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return setStep(1);
    
    setIsSubmitting(true);
    const finalData = {
      fullName: personalInfo.fullName,
      isExternal: personalInfo.isExternal,
      institution: personalInfo.institution,
      department: personalInfo.isExternal ? personalInfo.department : (isOtherDept ? personalInfo.otherDepartment : personalInfo.department),
      position: personalInfo.position,
      books: books
    };
    
    try {
      await onSubmit(finalData);
      setPersonalInfo({ 
        fullName: '', 
        isExternal: false, 
        institution: 'Jizzax Politexnika Instituti', 
        department: '', 
        otherDepartment: '', 
        position: '' 
      });
      setBooks([{ title: '', type: 'Darslik', authors: '', quantity: 1, publishedYear: new Date().getFullYear(), isbn: '' }]);
      setIsOtherDept(false);
      setStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10 no-print">
        <div className="flex items-center w-full max-w-xs">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step >= 1 ? 'bg-blue-900 border-blue-900 text-white shadow-lg' : 'border-slate-300 text-slate-400'}`}>
            {step > 1 ? <CheckCircle2 className="h-6 w-6" /> : <User className="h-5 w-5" />}
          </div>
          <div className={`flex-grow h-1 mx-2 transition-all ${step > 1 ? 'bg-blue-900' : 'bg-slate-200'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step === 2 ? 'bg-blue-900 border-blue-900 text-white shadow-lg' : 'border-slate-300 text-slate-400'}`}>
            <BookPlus className="h-5 w-5" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
        {step === 1 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="h-6 w-6 text-blue-900" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Shaxsiy ma'lumotlar</h2>
              </div>
              
              {/* Foydalanuvchi turi selektori */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  type="button"
                  onClick={() => setPersonalInfo({...personalInfo, isExternal: false, institution: 'Jizzax Politexnika Instituti', department: ''})}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${!personalInfo.isExternal ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Building2 className="h-3.5 w-3.5" /> Institut xodimi
                </button>
                <button 
                  type="button"
                  onClick={() => setPersonalInfo({...personalInfo, isExternal: true, institution: '', department: ''})}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${personalInfo.isExternal ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <UserCircle2 className="h-3.5 w-3.5" /> Tashqi foydalanuvchi
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-600">To'liq F.I.Sh</label>
                <input 
                  required 
                  type="text" 
                  value={personalInfo.fullName} 
                  onChange={e => setPersonalInfo({...personalInfo, fullName: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                  placeholder="Masalan: Alisherov Olimjon" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-600">Lavozimingiz / Unvoningiz</label>
                <input 
                  required 
                  type="text" 
                  value={personalInfo.position} 
                  onChange={e => setPersonalInfo({...personalInfo, position: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                  placeholder="Masalan: Dotsent, Mustaqil tadqiqotchi" 
                />
              </div>

              {personalInfo.isExternal ? (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-600">Muassasa / Universitet nomi</label>
                    <input 
                      required 
                      type="text" 
                      value={personalInfo.institution} 
                      onChange={e => setPersonalInfo({...personalInfo, institution: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                      placeholder="Masalan: Toshkent Davlat Texnika Universiteti" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-600">Kafedra / Bo'lim</label>
                    <input 
                      required 
                      type="text" 
                      value={personalInfo.department} 
                      onChange={e => setPersonalInfo({...personalInfo, department: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                      placeholder="Masalan: Mexanika-mashinasozlik kafedrasi" 
                    />
                  </div>
                </>
              ) : (
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-slate-600">Kafedrangiz (JizzPI)</label>
                  {!isOtherDept ? (
                    <select 
                      required 
                      value={personalInfo.department} 
                      onChange={e => e.target.value === "OTHER" ? setIsOtherDept(true) : setPersonalInfo({...personalInfo, department: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">Kafedrani tanlang</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      <option value="OTHER" className="font-bold text-blue-600">+ Boshqa (ro'yxatda yo'q)</option>
                    </select>
                  ) : (
                    <div className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
                      <input 
                        required 
                        autoFocus
                        type="text" 
                        value={personalInfo.otherDepartment} 
                        onChange={e => setPersonalInfo({...personalInfo, otherDepartment: e.target.value})} 
                        className="flex-grow px-4 py-3 rounded-xl border border-blue-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                        placeholder="Kafedra nomini yozing" 
                      />
                      <button type="button" onClick={() => {setIsOtherDept(false); setPersonalInfo({...personalInfo, otherDepartment: ''})}} className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium">Bekor qilish</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="button" 
                onClick={() => validateStep1() ? setStep(2) : alert("Barcha maydonlarni to'ldiring!")}
                className="flex items-center gap-2 px-8 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all font-bold shadow-lg shadow-blue-900/20 active:scale-95"
              >
                <span>Keyingi bosqich</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800 leading-relaxed">
                Bir vaqtning o'zida bir nechta kitob topshirayotgan bo'lsangiz, <b>"Kitob qo'shish"</b> tugmasidan foydalaning. 
                Har bir kitob uchun mualliflarni to'liq ism-sharifi bilan kiriting.
              </p>
            </div>

            {books.map((book, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg relative group transition-all hover:border-blue-300 animate-in zoom-in-95 duration-300">
                <div className="absolute -left-3 top-6 bg-blue-900 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                  {idx + 1}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 ml-4">
                  <div className="md:col-span-8 space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Kitob yoki adabiyot nomi</label>
                    <input 
                      required 
                      type="text" 
                      value={book.title} 
                      onChange={e => updateBook(idx, 'title', e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-800" 
                      placeholder="Sarlavhani kiriting" 
                    />
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Turi</label>
                    <select 
                      value={book.type} 
                      onChange={e => updateBook(idx, 'type', e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    >
                      {BOOK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-6 space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Mualliflar (vergul bilan)</label>
                    <input 
                      required 
                      type="text" 
                      value={book.authors} 
                      onChange={e => updateBook(idx, 'authors', e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                      placeholder="Masalan: Karimov A., Toirov S." 
                    />
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">ISBN / Kod</label>
                    <input 
                      type="text" 
                      value={book.isbn} 
                      onChange={e => updateBook(idx, 'isbn', e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                      placeholder="978-..." 
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Nashr yili</label>
                    <input 
                      type="number" 
                      value={book.publishedYear} 
                      onChange={e => updateBook(idx, 'publishedYear', parseInt(e.target.value))} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                    />
                  </div>

                  <div className="md:col-span-1 flex items-end justify-center">
                    {books.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeBookRow(idx)} 
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all group-hover:scale-110"
                        title="Ushbu kitobni o'chirish"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-200">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 font-bold transition-all active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Orqaga</span>
              </button>

              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  type="button" 
                  onClick={addBookRow} 
                  disabled={books.length >= 6}
                  className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-blue-900 text-blue-900 rounded-xl hover:bg-blue-50 transition-all font-bold disabled:opacity-50"
                >
                  <Plus className="h-5 w-5" />
                  <span>Yana kitob qo'shish</span>
                </button>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-grow md:flex-none flex items-center justify-center gap-2 px-10 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all font-bold shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  <span>{isSubmitting ? "Yuborilmoqda..." : "BAZAGA YUBORISH"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
