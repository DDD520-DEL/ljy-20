import { useState, useMemo, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import {
  FileText,
  User,
  Calendar,
  MapPin,
  Phone,
  Heart,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Clock,
  Building2,
  UserCircle,
  BookOpen,
} from 'lucide-react';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const calculateAge = (birthDate: string, deathDate: string) => {
  if (!birthDate || !deathDate) return '';
  const birth = new Date(birthDate);
  const death = new Date(deathDate);
  let age = death.getFullYear() - birth.getFullYear();
  const monthDiff = death.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
    age--;
  }
  return age.toString();
};

export const ObituaryGenerator = () => {
  const { deceased } = useStore();

  const [formData, setFormData] = useState({
    name: deceased?.name || '',
    gender: '男',
    birthDate: deceased?.birthDate || '',
    deathDate: deceased?.deathDate || '',
    birthPlace: '',
    deathPlace: '',
    occupation: '',
    achievements: '',
    relationship: deceased?.relationship || '',
    funeralHome: '',
    memorialHall: '',
    farewellDate: '',
    farewellTime: '',
    funeralType: '火化',
    burialPlace: '',
    familyRep: '',
    contactPhone: '',
    specialNote: '',
  });

  const [copied, setCopied] = useState(false);
  const [template, setTemplate] = useState<'standard' | 'simple' | 'solemn'>('standard');

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const age = useMemo(
    () => calculateAge(formData.birthDate, formData.deathDate),
    [formData.birthDate, formData.deathDate]
  );

  const generateObituary = useCallback(() => {
    const {
      name,
      gender,
      birthDate,
      deathDate,
      birthPlace,
      deathPlace,
      occupation,
      achievements,
      relationship,
      funeralHome,
      memorialHall,
      farewellDate,
      farewellTime,
      funeralType,
      burialPlace,
      familyRep,
      contactPhone,
      specialNote,
    } = formData;

    const birthStr = birthDate ? formatDate(birthDate) : '';
    const deathStr = deathDate ? formatDate(deathDate) : '';
    const farewellDateStr = farewellDate ? formatDate(farewellDate) : '';

    const honorific = gender === '男' ? '先生' : '女士';
    const pronoun = gender === '男' ? '他' : '她';
    const NL = '\n';

    const lines: string[] = [];

    if (template === 'standard') {
      lines.push('【讣告】');
      lines.push('');

      let line1 = `${name}${honorific}，`;
      if (birthPlace) line1 += `原籍${birthPlace}，`;
      if (occupation) line1 += `生前系${occupation}。`;
      lines.push(line1);
      lines.push('');

      let line2 = '';
      if (birthStr) line2 += `${birthStr}出生，`;
      if (deathStr) {
        line2 += `${deathStr}`;
        if (deathPlace) line2 += `在${deathPlace}`;
        line2 += '不幸逝世';
      }
      if (age) line2 += `，享年${age}岁`;
      line2 += '。';
      if (line2 !== '。') lines.push(line2);
      lines.push('');

      let line3 = `${pronoun}一生勤勤恳恳、任劳任怨，`;
      if (achievements) line3 += `${achievements}，`;
      line3 += '为家庭和社会做出了积极贡献。';
      lines.push(line3);
      lines.push('');

      if (farewellDateStr || funeralHome || memorialHall) {
        let line4 = '兹定于';
        if (farewellDateStr) line4 += farewellDateStr;
        if (farewellTime) line4 += ` ${farewellTime}`;
        if (funeralHome) line4 += `在${funeralHome}`;
        if (memorialHall) line4 += ` ${memorialHall}`;
        line4 += '举行告别仪式。';
        lines.push(line4);
        lines.push('');
      }

      if (funeralType || burialPlace) {
        let line5 = '';
        if (funeralType) {
          line5 += `遵其遗愿，${funeralType}后`;
          if (burialPlace) line5 += `安葬于${burialPlace}`;
          line5 += '。';
        } else if (burialPlace) {
          line5 = `安葬于${burialPlace}。`;
        }
        if (line5) lines.push(line5);
        lines.push('');
      }

      if (familyRep || contactPhone || relationship) {
        let line6 = '';
        if (familyRep) {
          line6 += `由${familyRep}`;
          if (relationship) line6 += `（${relationship}）`;
        } else if (relationship) {
          line6 += `由${relationship}`;
        }
        if (familyRep || relationship) line6 += ' 率全家 ';
        line6 += '谨此讣告。';
        lines.push(line6);
      }

      if (contactPhone) {
        lines.push(`联系电话：${contactPhone}`);
      }
      lines.push('');

      if (specialNote) {
        lines.push(`注：${specialNote}`);
        lines.push('');
      }

      if (familyRep || relationship) {
        lines.push(`${familyRep ? familyRep : relationship} 携全家哀告`);
      }
    } else if (template === 'simple') {
      lines.push('【讣告】');
      lines.push('');

      let line1 = `${name}${honorific}，`;
      if (birthStr) line1 += `${birthStr}出生，`;
      if (deathStr) line1 += `${deathStr}逝世`;
      if (age) line1 += `，享年${age}岁`;
      line1 += '。';
      lines.push(line1);
      lines.push('');

      if (farewellDateStr || funeralHome) {
        let line2 = '告别仪式定于';
        if (farewellDateStr) line2 += farewellDateStr;
        if (farewellTime) line2 += ` ${farewellTime}`;
        if (funeralHome) line2 += `在${funeralHome}举行`;
        line2 += '。';
        lines.push(line2);
        lines.push('');
      }

      if (contactPhone) {
        lines.push(`联系电话：${contactPhone}`);
        lines.push('');
      }
      lines.push('特此讣告。');
    } else {
      lines.push('━━━━━━━━━━━━━━━━━━');
      lines.push('        【 讣  告 】');
      lines.push('━━━━━━━━━━━━━━━━━━');
      lines.push('');
      lines.push(`${name}${honorific}`);
      lines.push('');

      if (birthPlace) lines.push(`  籍贯：${birthPlace}`);
      if (occupation) lines.push(`  生前职业：${occupation}`);
      lines.push(`  生卒：${birthStr || '不详'} — ${deathStr || '不详'}`);
      lines.push(`  享年：${age || '不详'}岁`);
      lines.push('');
      lines.push('━━━━━━━━━━━━━━━━━━');
      lines.push('');
      lines.push(`  ${name}${honorific}，一生忠厚善良，勤劳俭朴，`);
      lines.push('');

      if (achievements) {
        lines.push(`  ${achievements}。`);
      } else {
        lines.push('  为家庭和社会贡献了毕生精力。');
      }
      lines.push('  其高尚品德，永远铭记在我们心中。');
      lines.push('');
      lines.push('━━━━━━━━━━━━━━━━━━');
      lines.push('');
      lines.push('  告别仪式');
      lines.push(`  时间：${farewellDateStr || '待定'}${farewellTime ? ' ' + farewellTime : ''}`);
      lines.push(`  地点：${funeralHome || memorialHall || '待定'}`);
      lines.push('');

      if (funeralType) lines.push(`  安葬方式：${funeralType}`);
      if (burialPlace) lines.push(`  安葬地：${burialPlace}`);
      lines.push('');
      lines.push('━━━━━━━━━━━━━━━━━━');
      lines.push('');
      lines.push(`  联系人：${familyRep || relationship || '家属'}`);
      lines.push(`  电话：${contactPhone || '待定'}`);
      lines.push('');

      if (specialNote) {
        lines.push(`  备注：${specialNote}`);
        lines.push('━━━━━━━━━━━━━━━━━━');
        lines.push('');
      }
      lines.push('  谨此讣告，望周知。');
      lines.push('');
      lines.push('  家属泣告');
    }

    return lines.join(NL).trim();
  }, [formData, template, age]);

  const obituaryText = useMemo(() => generateObituary(), [generateObituary]);

  const handleCopy = async () => {
    const textToCopy = obituaryText;

    console.log('=== 讣告内容调试 ===');
    console.log('原始文本:', JSON.stringify(textToCopy));
    console.log('字符数:', textToCopy.length);
    console.log('换行符数量:', (textToCopy.match(/\n/g) || []).length);
    console.log('是否包含 \\n 字面量:', textToCopy.includes('\\n'));
    console.log('==================');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      console.log('复制成功（使用 Clipboard API）');
    } catch (err) {
      console.warn('Clipboard API 不可用，使用后备方案:', err);
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.style.whiteSpace = 'pre-wrap';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        console.log('复制成功（使用 execCommand）');
      } else {
        alert('复制失败，请手动选择文本复制');
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: deceased?.name || '',
      gender: '男',
      birthDate: deceased?.birthDate || '',
      deathDate: deceased?.deathDate || '',
      birthPlace: '',
      deathPlace: '',
      occupation: '',
      achievements: '',
      relationship: deceased?.relationship || '',
      funeralHome: '',
      memorialHall: '',
      farewellDate: '',
      farewellTime: '',
      funeralType: '火化',
      burialPlace: '',
      familyRep: '',
      contactPhone: '',
      specialNote: '',
    });
  };

  const templates = [
    { id: 'standard', name: '标准格式', desc: '传统正式的讣告格式', icon: FileText },
    { id: 'simple', name: '简洁格式', desc: '简明扼要的通知格式', icon: BookOpen },
    { id: 'solemn', name: '庄重格式', desc: '边框装饰的庄重格式', icon: Sparkles },
  ] as const;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800 font-serif">
                  讣告信息填写
                </h2>
                <p className="text-sm text-slate-500">
                  填写逝者信息，自动生成规范讣告
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                讣告模板
              </label>
              <div className="grid grid-cols-3 gap-3">
                {templates.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        template === t.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mb-2 ${
                          template === t.id ? 'text-primary-600' : 'text-slate-400'
                        }`}
                      />
                      <p
                        className={`text-sm font-medium ${
                          template === t.id ? 'text-primary-700' : 'text-slate-700'
                        }`}
                      >
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium text-slate-600 flex items-center gap-2 pt-2">
                <User className="w-4 h-4" />
                <span>逝者信息</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="逝者姓名"
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    性别
                  </label>
                  <div className="flex gap-2">
                    {['男', '女'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleChange('gender', g)}
                        className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                          formData.gender === g
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    出生日期
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    逝世日期
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={formData.deathDate}
                      onChange={(e) => handleChange('deathDate', e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>

              {age && (
                <div className="p-3 bg-primary-50 rounded-lg text-sm text-primary-700">
                  享年：<span className="font-semibold">{age} 岁</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    籍贯/出生地
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.birthPlace}
                      onChange={(e) => handleChange('birthPlace', e.target.value)}
                      placeholder="如：山东济南"
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    逝世地点
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.deathPlace}
                      onChange={(e) => handleChange('deathPlace', e.target.value)}
                      placeholder="如：家中/医院"
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  生前职业/身份
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  placeholder="如：退休教师、工程师等"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  生平简介/主要成就
                </label>
                <textarea
                  value={formData.achievements}
                  onChange={(e) => handleChange('achievements', e.target.value)}
                  placeholder="简要描述逝者生平或主要贡献"
                  rows={3}
                  className="input resize-none"
                />
              </div>

              <div className="text-sm font-medium text-slate-600 flex items-center gap-2 pt-4 border-t border-slate-100">
                <Building2 className="w-4 h-4" />
                <span>治丧信息</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    殡仪馆/丧葬服务处
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.funeralHome}
                      onChange={(e) => handleChange('funeralHome', e.target.value)}
                      placeholder="殡仪馆名称"
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    告别厅/灵堂
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.memorialHall}
                      onChange={(e) => handleChange('memorialHall', e.target.value)}
                      placeholder="如：XX厅"
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    告别仪式日期
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={formData.farewellDate}
                      onChange={(e) => handleChange('farewellDate', e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    告别仪式时间
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="time"
                      value={formData.farewellTime}
                      onChange={(e) => handleChange('farewellTime', e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    安葬方式
                  </label>
                  <select
                    value={formData.funeralType}
                    onChange={(e) => handleChange('funeralType', e.target.value)}
                    className="input"
                  >
                    <option value="火化">火化</option>
                    <option value="土葬">土葬</option>
                    <option value="海葬">海葬</option>
                    <option value="树葬">树葬</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    安葬地点
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.burialPlace}
                      onChange={(e) => handleChange('burialPlace', e.target.value)}
                      placeholder="公墓/陵园名称"
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="text-sm font-medium text-slate-600 flex items-center gap-2 pt-4 border-t border-slate-100">
                <UserCircle className="w-4 h-4" />
                <span>家属信息</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    与逝者关系
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.relationship}
                      onChange={(e) => handleChange('relationship', e.target.value)}
                      placeholder="如：长子、女儿等"
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    家属代表姓名
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.familyRep}
                      onChange={(e) => handleChange('familyRep', e.target.value)}
                      placeholder="家属代表姓名"
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  联系电话
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    placeholder="联系电话，方便亲友咨询"
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  特别说明
                </label>
                <textarea
                  value={formData.specialNote}
                  onChange={(e) => handleChange('specialNote', e.target.value)}
                  placeholder="如：特殊注意事项、答谢安排等"
                  rows={2}
                  className="input resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center gap-2 flex-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  重置表单
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!formData.name.trim()}
                  className="btn-primary flex items-center gap-2 flex-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      一键复制讣告
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 h-fit">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 font-serif">
                    讣告预览
                  </h2>
                  <p className="text-sm text-slate-500">
                    {templates.find((t) => t.id === template)?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCopy}
                disabled={!formData.name.trim()}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <pre className="whitespace-pre-wrap font-sans text-slate-700 text-sm leading-relaxed font-serif">
                {obituaryText || '请填写左侧信息以生成讣告...'}
              </pre>
            </div>

            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800">
                <span className="font-medium">💡 温馨提示：</span>
                生成的讣告可直接复制分享到微信、短信等平台通知亲友。请仔细核对信息后再发送。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
