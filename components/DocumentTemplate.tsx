
import React, { useEffect, useState } from 'react';
import { BookSubmission } from '../types';
import QRCode from 'qrcode';

interface DocumentTemplateProps {
  type: 'ref' | 'consent';
  submission: BookSubmission;
}

export const DocumentTemplate: React.FC<DocumentTemplateProps> = ({ type, submission }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  
  // SubmissionDate dan foydalanish (YYYY-MM-DD formatida keladi)
  const dateObj = submission.submissionDate ? new Date(submission.submissionDate) : new Date();
  const currentYear = dateObj.getFullYear();
  const currentDay = dateObj.getDate().toString().padStart(2, '0');
  const currentMonthName = new Intl.DateTimeFormat('uz-UZ', { month: 'long' }).format(dateObj);
  const formattedDateString = `${currentDay}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${currentYear}`;

  useEffect(() => {
    const generateQR = async () => {
      try {
        const verifyUrl = `${window.location.origin}${window.location.pathname}?verify=${submission.id}`;
        const url = await QRCode.toDataURL(verifyUrl, {
          margin: 1,
          width: 100,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error(err);
      }
    };
    generateQR();
  }, [submission.id]);
  
  if (type === 'ref') {
    return (
      <div className="font-times w-[210mm] h-[297mm] mx-auto bg-white text-black p-[15mm_20mm] box-border overflow-hidden flex flex-col text-[12pt]">
        <div className="text-right mb-4">
          <p className="font-bold">“ {currentDay} ” {currentMonthName} {currentYear} yil</p>
        </div>

        <div className="text-center mb-4 space-y-1 border-b-2 border-black pb-4">
          <h1 className="text-[11pt] font-bold uppercase leading-tight">O’ZBEKISTON RESPUBLIKASI OLIY TA’LIM, FAN VA INNOVATSIYALAR VAZIRLIGI</h1>
          <h2 className="text-[15pt] font-bold uppercase leading-tight">{submission.institution.toUpperCase() || "JIZZAX POLITEXNIKA INSTITUTI"}</h2>
          <p className="text-[10pt] italic leading-tight mt-1">
            Axborot resurs markazi “Elektron axborot resurslari” bo’limiga topshirilgan <br/>
            elektron adabiyotlar to’g’risida
          </p>
        </div>

        <div className="text-center mb-6 pt-2">
          <h3 className="text-[26pt] font-bold uppercase tracking-[6px] border-y-2 border-black py-3 inline-block w-full">MA’LUMOTNOMA</h3>
        </div>

        <div className="flex-grow overflow-hidden">
          <table className="w-full border-collapse border-[1.5pt] border-black text-[12pt]">
            <thead>
              <tr className="bg-gray-50 h-14">
                <th className="border-[1.5pt] border-black p-2 text-center w-10">№</th>
                <th className="border-[1.5pt] border-black p-2 text-center w-1/3">Muallifi (lar)</th>
                <th className="border-[1.5pt] border-black p-2 text-center">Adabiyotning nomi va turi</th>
                <th className="border-[1.5pt] border-black p-2 text-center w-32">ISBN kodi</th>
              </tr>
            </thead>
            <tbody>
              {submission.books.map((book, idx) => (
                <tr key={idx} className="h-16">
                  <td className="border-[1pt] border-black p-2 text-center font-bold">{idx + 1}</td>
                  <td className="border-[1pt] border-black p-2 leading-tight">{book.authors}</td>
                  <td className="border-[1pt] border-black p-2 leading-tight">
                    <span className="font-bold">{book.type}:</span> "{book.title}" ({book.publishedYear})
                  </td>
                  <td className="border-[1pt] border-black p-2 text-center text-[11pt]">{book.isbn || '-'}</td>
                </tr>
              ))}
              {Array.from({ length: Math.max(0, 8 - submission.books.length) }).map((_, i) => (
                <tr key={i + 10} className="h-16">
                  <td className="border-[1pt] border-black p-2 text-center">{submission.books.length + i + 1}</td>
                  <td className="border-[1pt] border-black p-2"></td>
                  <td className="border-[1pt] border-black p-2"></td>
                  <td className="border-[1pt] border-black p-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8 relative">
          <div className="space-y-8">
            <div className="flex flex-col">
              <span className="font-bold">Topshirdi: </span>
              <div className="flex justify-between items-end border-b border-black pb-1">
                <span className="uppercase font-bold text-[11pt]">{submission.fullName}</span>
                <span className="text-[9pt] italic">/ imzo /</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Qabul qildi: </span>
              <div className="flex justify-between items-end border-b border-black pb-1">
                <span className="text-[11pt]">ARM xodimi</span>
                <span className="text-[9pt] italic">/ imzo /</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-slate-200 rounded-xl p-2 bg-slate-50">
            {qrDataUrl && <img src={qrDataUrl} alt="Verification QR Code" className="w-24 h-24 mb-1" />}
            <p className="text-[8pt] font-bold text-center uppercase leading-tight">Elektron Imzo<br/>(Haqiqiyligini tekshirish)</p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-[10pt] italic text-gray-500 border-t pt-2">
          Hujjat JizzPI ARM elektron tizimi orqali tayyorlandi. ID: {submission.id.substring(0, 8)}
        </div>
      </div>
    );
  }

  const isLongText = submission.books.length > 3 || submission.fullName.length > 25;
  const fontSizeClass = isLongText ? "text-[11pt]" : "text-[12pt]";
  const lineHeightClass = isLongText ? "leading-[1.5]" : "leading-[1.8]";

  return (
    <div className={`font-times w-[210mm] h-[297mm] mx-auto bg-white text-black p-[25mm_30mm] box-border overflow-hidden flex flex-col ${fontSizeClass}`}>
      <div className="flex flex-col items-end mb-10 text-right w-full">
        <div className="max-w-[450px] space-y-1">
          <p className="font-bold text-[14pt] uppercase border-b-2 border-black pb-1 inline-block">
            {submission.fullName}
          </p>
          <p className="text-[12pt] leading-tight">
            {submission.institution}, « {submission.department} » {submission.position.toLowerCase()}i
          </p>
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-[28pt] font-bold uppercase tracking-[12px] border-b-4 border-double border-black inline-block px-16 pb-2">ROZILIK XATI</h1>
      </div>

      <div className={`flex-grow space-y-6 text-justify ${lineHeightClass}`}>
        <p className="indent-12">
          Men, <span className="font-bold underline">{submission.fullName}</span>, quyidagi elektron adabiyotlarim: 
          {submission.books.map((b, i) => (
            <span key={i} className="font-bold italic"> «{b.title}» ({b.type}){i < submission.books.length - 1 ? ', ' : ''} </span>
          ))} 
          bo'yicha O‘zbekiston Respublikasining <span className="font-bold italic">“Mualliflik huquqi va turdosh huquqlar to‘g‘risida”gi</span> qonunining 18-19 moddalari talablaridan 
          kelib chiqqan holda, Jizzax politexnika instituti Axborot resurs markazi hamda Oliy ta’lim, fan va innovatsiyalar vazirligi huzurida tashkil etilgan <span className="font-bold underline">“Elektron 
          kutubxona” platformasiga</span> joylashtirishga va foydalanishga rozilik bildiraman.
        </p>

        <p className="indent-12">
          Mazkur adabiyotlardan talabalar, tadqiqotchilar, professor-o’qituvchilar va 
          boshqa xodimlarning bepul foydalanishiga, o'quv va ilmiy maqsadlarda yuklab olishlariga hech qanday e'tirozim yo'q.
        </p>

        <div className="indent-12 italic border-l-4 border-black pl-6 bg-gray-50 py-4 mt-4 rounded-r-lg">
          <p className="text-[10pt]">
            <span className="font-bold">Eslatma:</span> Mazkur rozilik xati mualliflik ob’yektiga nisbatan mulkiy huquqlarni o’zga shaxslarga 
            berishni anglatmaydi va faqatgina muassasa ta'lim jarayonlari samaradorligini oshirish maqsadida foydalanish uchun mo'ljallangan.
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center gap-10">
        <div className="flex-1 flex flex-col items-center p-3 border-2 border-dashed border-slate-300 rounded-2xl">
          {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-28 h-28 mb-2" />}
          <p className="text-[9pt] font-black uppercase text-slate-500 tracking-tight text-center">Elektron Imzo & ID</p>
        </div>

        <div className="flex-1 space-y-8">
          <div className="text-[13pt] font-bold">
            Sana: {formattedDateString} y.
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="w-full border-b-2 border-black mb-2 flex justify-between items-end h-10">
               <span className="text-[9pt] italic text-slate-400 pl-2">imzo:</span>
               <span className="font-bold uppercase pr-2 text-[11pt]">{submission.fullName}</span>
            </div>
            <p className="text-[10pt] uppercase font-bold tracking-widest text-slate-600">Topshiruvchi F.I.Sh</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-[9pt] text-gray-400 italic">
        JizzPI ARM elektron tizimi orqali tasdiqlandi. Verification ID: {submission.id}
      </div>
    </div>
  );
};
