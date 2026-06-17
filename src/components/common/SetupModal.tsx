import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils/progressUtils';
import { Heart, Calendar, User, ArrowRight } from 'lucide-react';

interface SetupModalProps {
  onComplete?: (
    deceasedInfo: { name: string; birthDate: string; deathDate: string; relationship: string },
    currentUserInfo: { name: string; role: string }
  ) => void;
}

export const SetupModal = ({ onComplete }: SetupModalProps) => {
  const { showSetup, setShowSetup, initializeFromTemplate, addMember, setCurrentUser } = useStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [relationship, setRelationship] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !birthDate || !deathDate || !relationship || !memberName.trim()) return;

    if (onComplete) {
      onComplete(
        { name, birthDate, deathDate, relationship },
        { name: memberName, role: memberRole }
      );
    } else {
      const deceased = {
        id: generateId(),
        name: name.trim(),
        birthDate,
        deathDate,
        relationship: relationship.trim(),
      };

      const memberId = generateId();
      const newMember = {
        id: memberId,
        name: memberName.trim(),
        role: memberRole.trim() || '家庭成员',
        color: '#3f51b5',
      };

      addMember(newMember);
      setCurrentUser(newMember);
      initializeFromTemplate(deceased);
      localStorage.setItem('funeral_planner_initialized', 'true');
      setShowSetup(false);
    }
  };

  const canProceed =
    step === 1 ? name.trim() && birthDate && deathDate && relationship : memberName.trim();

  if (!showSetup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,193,7,0.3),transparent_70%)]" />
      </div>

      <div className="relative w-full max-w-lg animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-700 to-primary-900 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-gold-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white font-serif">
              身后事事务清单
            </h2>
            <p className="text-primary-200 mt-2">温暖陪伴 · 有序前行</p>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 2 && (
                    <div
                      className={`w-16 h-1 transition-all ${
                        step > s ? 'bg-primary-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {step === 1 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 font-serif mb-4">
                  逝者信息
                </h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="请输入逝者姓名"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      出生日期 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      逝世日期 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={deathDate}
                      onChange={(e) => setDeathDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    与您的关系 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="input-field"
                  >
                    <option value="">请选择</option>
                    <option value="父亲">父亲</option>
                    <option value="母亲">母亲</option>
                    <option value="配偶">配偶</option>
                    <option value="儿子">儿子</option>
                    <option value="女儿">女儿</option>
                    <option value="兄弟">兄弟</option>
                    <option value="姐妹">姐妹</option>
                    <option value="其他">其他</option>
                  </select>
                </div>

                <button
                  onClick={() => canProceed && setStep(2)}
                  disabled={!canProceed}
                  className="w-full btn-primary flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一步
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 font-serif mb-4">
                  您的信息
                </h3>

                <div className="p-4 bg-slate-50 rounded-xl mb-4">
                  <p className="text-sm text-slate-600">
                    逝者：<span className="font-medium text-slate-800">{name}</span>
                    <br />
                    生卒：{birthDate} — {deathDate}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    您的姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="input-field"
                    placeholder="请输入您的姓名"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    您的身份
                  </label>
                  <input
                    type="text"
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    placeholder="如：长子、女儿、配偶等"
                    className="input-field"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary flex-1"
                  >
                    上一步
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    开始使用
                  </button>
                </div>

                <p className="text-xs text-slate-500 text-center mt-4">
                  系统将自动加载预设的身后事办理清单模板
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
