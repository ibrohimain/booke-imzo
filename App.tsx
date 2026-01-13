
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StaffForm } from './components/StaffForm';
import { AdminDashboard } from './components/AdminDashboard';
import { BookSubmission, ViewType, SubmissionStatus } from './types';
import { db } from './firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { Clock, Book, CheckCircle2, History, ShieldCheck, XCircle, Calendar, User, Building } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('staff');
  const [submissions, setSubmissions] = useState<BookSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedData, setVerifiedData] = useState<BookSubmission | null>(null);

  useEffect(() => {
    // URL dan verify parametrini tekshirish
    const params = new URLSearchParams(window.location.search);
    const verifyId = params.get('verify');
    if (verifyId) {
      setVerifyingId(verifyId);
      fetchVerification(verifyId);
    }

    const q = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs: BookSubmission[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as BookSubmission);
      });
      setSubmissions(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchVerification = async (id: string) => {
    try {
      const docRef = doc(db, "submissions", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setVerifiedData({ id: docSnap.id, ...docSnap.data() } as BookSubmission);
      } else {
        setVerifiedData(null);
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  const handleAddSubmission = async (data: Omit<BookSubmission, 'id' | 'status' | 'submittedAt'>) => {
    try {
      await addDoc(collection(db, "submissions"), {
        ...data,
        status: SubmissionStatus.PENDING,
        submittedAt: new Date().toISOString(),
      });
      alert("Arizangiz qabul qilindi! ARM xodimi tekshirgandan so'ng hujjatlarni olishingiz mumkin.");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Xatolik yuz berdi. Iltimos qaytadan urunib ko'ring.");
      throw error;
    }
  };

  const handleUpdateStatus = async (id: string, status: SubmissionStatus) => {
    try {
      const docRef = doc(db, "submissions", id);
      await updateDoc(docRef, {
        status,
        receivedAt: status === SubmissionStatus.RECEIVED ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    try {
      const docRef = doc(db, "submissions", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("O'chirishda xatolik yuz berdi.");
    }
  };

  // Tekshirish ko'rinishi (Verification View)
  if (verifyingId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="bg-blue-900 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-4">
              {verifiedData ? (
                <ShieldCheck className="h-10 w-10 text-white" />
              ) : (
                <XCircle className="h-10 w-10 text-white" />
              )}
            </div>
            <h1 className="text-xl font-bold text-white uppercase tracking-wider">Hujjat Haqiqiyligi</h1>
          </div>
          
          <div className="p-8">
            {verifiedData ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-bold text-green-800">TASDIQLANDI</p>
                    <p className="text-xs text-green-600">Ushbu hujjat ARM bazasida mavjud</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-slate-400 mt-1" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Topshiruvchi</p>
                      <p className="font-bold text-slate-800">{verifiedData.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-slate-400 mt-1" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Muassasa va Bo'lim</p>
                      <p className="font-medium text-slate-800 text-sm">{verifiedData.institution}</p>
                      <p className="text-xs text-slate-500">{verifiedData.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-slate-400 mt-1" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Topshirilgan vaqt</p>
                      <p className="font-medium text-slate-800">
                        {new Date(verifiedData.submittedAt).toLocaleString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Book className="h-5 w-5 text-slate-400 mt-1" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Kitoblar soni</p>
                      <p className="font-medium text-slate-800">{verifiedData.books.length} ta adabiyot</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = window.location.pathname}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                >
                  Bosh sahifaga qaytish
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <p className="text-slate-500">Kechirasiz, ushbu ID bilan bog'liq ma'lumot topilmadi yoki hujjat bekor qilingan.</p>
                <button 
                  onClick={() => window.location.href = window.location.pathname}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all active:scale-95"
                >
                  Qayta urinish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={view} setView={setView}>
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-900"></div>
            <p className="text-slate-500 font-medium animate-pulse">Ma'lumotlar yuklanmoqda...</p>
          </div>
        ) : view === 'staff' ? (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Kitob topshirish tizimi</h2>
              <p className="text-slate-500 text-lg">
                Elektron adabiyotlarni ARM bazasiga topshiring va avtomatik tarzda ma'lumotnoma hamda rozilik xatiga ega bo'ling.
              </p>
            </div>

            <StaffForm onSubmit={handleAddSubmission} />
            
            <div className="mt-20 pt-12 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <History className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Oxirgi yuborilgan arizalar</h3>
              </div>

              {submissions.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                  Hozircha arizalar yo'q. Birinchilardan bo'lib ariza topshiring!
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {submissions.slice(0, 6).map(sub => (
                    <div key={sub.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          sub.status === SubmissionStatus.RECEIVED ? 'bg-green-100 text-green-700' :
                          sub.status === SubmissionStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {sub.status === SubmissionStatus.RECEIVED ? 'Qabul qilindi' : 
                           sub.status === SubmissionStatus.PENDING ? 'Kutilmoqda' : 'Rad etildi'}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Clock className="h-3 w-3" />
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-blue-900">
                          <Book className="h-4 w-4" />
                          <h4 className="font-bold text-slate-800 line-clamp-1">
                            {sub.books && sub.books.length > 0 ? sub.books[0].title : 'Nomsiz kitob'}
                          </h4>
                        </div>
                        
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-slate-300" />
                          <span>{sub.fullName}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[150px]">
                          {sub.department}
                        </span>
                        <div className="bg-slate-100 px-2 py-1 rounded-md text-[10px] font-black text-slate-500">
                          {sub.books?.length || 0} TA KITOB
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <AdminDashboard 
            submissions={submissions} 
            onUpdateStatus={handleUpdateStatus} 
            onDelete={handleDeleteSubmission}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
