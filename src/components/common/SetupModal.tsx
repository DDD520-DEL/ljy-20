import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils/progressUtils';
import { Heart, Calendar, User, ArrowRight, ArrowLeft, FileText, Trash2, Save, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { TaskTemplateEditor } from '@/components/tasks/TaskTemplateEditor';
import type { TemplateTaskItem, SavedTemplate } from '@/types';
import { DEFAULT_TEMPLATE_ID } from '@/data/taskTemplate';

interface SetupModalProps {
  onComplete?: (
    deceasedInfo: { name: string; birthDate: string; deathDate: string; relationship: string },
    currentUserInfo: { name: string; role: string },
    templateTasks: TemplateTaskItem[]
  ) => void;
}

export const SetupModal = ({ onComplete }: SetupModalProps) => {
  const {
    showSetup,
    setShowSetup,
    initializeFromTemplate,
    addMember,
    setCurrentUser,
    savedTemplates,
    saveTemplate,
    deleteTemplate,
    members,
    currentUser,
  } = useStore();

  const isAddMode = members.length > 0 && currentUser !== null;

  const [step, setStep] = useState(isAddMode ? 1 : 1);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [relationship, setRelationship] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATE_ID);
  const [customTasks, setCustomTasks] = useState<TemplateTaskItem[]>([]);
  const [showTemplateList, setShowTemplateList] = useState(true);
  const [saveTemplateName, setSaveTemplateName] = useState('');
  const [saveTemplateDesc, setSaveTemplateDesc] = useState('');
  const [showSaveTemplateForm, setShowSaveTemplateForm] = useState(false);
  const [templateSaved, setTemplateSaved] = useState(false);

  useEffect(() => {
    if (showSetup) {
      setStep(isAddMode ? 1 : 1);
      setName('');
      setBirthDate('');
      setDeathDate('');
      setRelationship('');
      setMemberName(currentUser?.name || '');
      setMemberRole(currentUser?.role || '');
      setSelectedTemplateId(DEFAULT_TEMPLATE_ID);
      setCustomTasks([]);
      setShowTemplateList(true);
      setShowSaveTemplateForm(false);
      setTemplateSaved(false);
    }
  }, [showSetup, isAddMode, currentUser]);

  const selectedTemplate = useMemo(
    () => savedTemplates.find((t) => t.id === selectedTemplateId),
    [savedTemplates, selectedTemplateId]
  );

  const handleSelectTemplate = (template: SavedTemplate) => {
    setSelectedTemplateId(template.id);
    setCustomTasks([...template.tasks]);
    setShowTemplateList(false);
  };

  const handleDeleteSavedTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('确定要删除这个模板吗？删除后不可恢复。')) return;
    deleteTemplate(templateId);
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId(DEFAULT_TEMPLATE_ID);
      const defaultTemplate = savedTemplates.find((t) => t.id === DEFAULT_TEMPLATE_ID);
      if (defaultTemplate) {
        setCustomTasks([...defaultTemplate.tasks]);
      }
    }
  };

  const handleSaveAsTemplate = () => {
    if (!saveTemplateName.trim()) return;
    saveTemplate(saveTemplateName.trim(), saveTemplateDesc.trim(), customTasks);
    setSaveTemplateName('');
    setSaveTemplateDesc('');
    setShowSaveTemplateForm(false);
    setTemplateSaved(true);
    setTimeout(() => setTemplateSaved(false), 2500);
  };

  const handleSubmit = () => {
    if (!name.trim() || !birthDate || !deathDate || !relationship) return;
    if (!isAddMode && !memberName.trim()) return;
    if (customTasks.length === 0) {
      alert('任务列表不能为空，请至少添加一个任务。');
      return;
    }

    const deceasedData = {
      id: generateId(),
      name: name.trim(),
      birthDate,
      deathDate,
      relationship: relationship.trim(),
    };

    if (isAddMode) {
      initializeFromTemplate(deceasedData, customTasks);
      setShowSetup(false);
      return;
    }

    if (onComplete) {
      onComplete(
        { name, birthDate, deathDate, relationship },
        { name: memberName, role: memberRole },
        customTasks
      );
    } else {
      const memberId = generateId();
      const newMember = {
        id: memberId,
        name: memberName.trim(),
        role: memberRole.trim() || '家庭成员',
        color: '#3f51b5',
      };

      addMember(newMember);
      setCurrentUser(newMember);
      initializeFromTemplate(deceasedData, customTasks);
      localStorage.setItem('funeral_planner_initialized', 'true');
      setShowSetup(false);
    }
  };

  const canProceedStep1 = name.trim() && birthDate && deathDate && relationship;
  const canProceedStep2 = isAddMode ? true : memberName.trim();
  const canProceedStep3 = customTasks.length > 0;

  const totalSteps = isAddMode ? 2 : 3;

  const handleNextFromStep1 = () => {
    if (!canProceedStep1) return;
    if (isAddMode) {
      setStep(2);
      if (!selectedTemplate || customTasks.length === 0) {
        const defaultTemplate = savedTemplates.find((t) => t.id === DEFAULT_TEMPLATE_ID);
        if (defaultTemplate) {
          setCustomTasks([...defaultTemplate.tasks]);
        }
      }
    } else {
      setStep(2);
    }
  };

  const handleNextFromStep2 = () => {
    if (!canProceedStep2) return;
    setStep(isAddMode ? 2 : 3);
    if (!isAddMode && (!selectedTemplate || customTasks.length === 0)) {
      const defaultTemplate = savedTemplates.find((t) => t.id === DEFAULT_TEMPLATE_ID);
      if (defaultTemplate) {
        setCustomTasks([...defaultTemplate.tasks]);
      }
    }
  };

  if (!showSetup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 overflow-y-auto">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,193,7,0.3),transparent_70%)]" />
      </div>

      <div className="relative w-full max-w-3xl my-8 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-700 to-primary-900 p-8 text-center relative">
            <button
              onClick={() => setShowSetup(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors text-sm"
            >
              取消
            </button>
            <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-gold-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white font-serif">
              {isAddMode ? '添加新逝者' : '身后事事务清单'}
            </h2>
            <p className="text-primary-200 mt-2">温暖陪伴 · 有序前行</p>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s, idx, arr) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isAddMode ? (s === 2 ? 2 : s) : s}
                  </div>
                  {idx < arr.length - 1 && (
                    <div
                      className={`w-16 h-1 transition-all ${
                        step > s ? 'bg-primary-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
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
                  onClick={handleNextFromStep1}
                  disabled={!canProceedStep1}
                  className="w-full btn-primary flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一步
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && !isAddMode && (
              <div className="space-y-4 animate-fade-in">
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
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    上一步
                  </button>
                  <button
                    onClick={handleNextFromStep2}
                    disabled={!canProceedStep2}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一步
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {(step === 3 || (step === 2 && isAddMode)) && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-800 font-serif">
                    <FileText className="w-5 h-5 inline mr-2 text-primary-600" />
                    任务模板设置
                  </h3>
                </div>

                <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-100">
                  <p className="text-sm text-slate-600">
                    选择适合的任务模板，您可以增删任务或拖拽调整顺序。
                    自定义后的任务清单将用于生成该逝者的任务列表。
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-700 text-sm">
                      选择模板
                    </h4>
                    <button
                      onClick={() => setShowTemplateList(!showTemplateList)}
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      {showTemplateList ? (
                        <>
                          收起列表 <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          展开列表 <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {showTemplateList && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {savedTemplates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => handleSelectTemplate(template)}
                          className={`card cursor-pointer transition-all relative ${
                            selectedTemplateId === template.id
                              ? 'ring-2 ring-primary-500 bg-primary-50/50'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {selectedTemplateId === template.id && (
                                  <CheckCircle2 className="w-4 h-4 text-primary-600" />
                                )}
                                <h5 className="font-medium text-slate-800">
                                  {template.name}
                                </h5>
                                {template.isDefault && (
                                  <span className="badge bg-primary-100 text-primary-700 text-xs">
                                    系统
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                {template.description || `${template.tasks.length} 项任务`}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                共 {template.tasks.length} 项任务
                              </p>
                            </div>
                            {!template.isDefault && (
                              <button
                                onClick={(e) => handleDeleteSavedTemplate(template.id, e)}
                                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="删除模板"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedTemplate && (
                    <div className="card bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary-600" />
                          <span className="font-medium text-slate-800 text-sm">
                            当前模板：{selectedTemplate.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({customTasks.length} 项任务)
                          </span>
                        </div>
                        <button
                          onClick={() => setShowSaveTemplateForm(!showSaveTemplateForm)}
                          className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          另存为模板
                        </button>
                      </div>

                      {templateSaved && (
                        <div className="mb-3 p-2 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                          <CheckCircle2 className="w-4 h-4" />
                          模板已保存成功！
                        </div>
                      )}

                      {showSaveTemplateForm && (
                        <div className="mb-3 p-3 bg-white rounded-xl border border-slate-200 animate-fade-in">
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                模板名称 <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={saveTemplateName}
                                onChange={(e) => setSaveTemplateName(e.target.value)}
                                className="input-field text-sm py-1.5"
                                placeholder="如：父亲身后事精简版"
                                autoFocus
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                模板说明
                              </label>
                              <input
                                type="text"
                                value={saveTemplateDesc}
                                onChange={(e) => setSaveTemplateDesc(e.target.value)}
                                className="input-field text-sm py-1.5"
                                placeholder="简要描述该模板的特点"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setShowSaveTemplateForm(false)}
                                className="btn-secondary text-sm py-1.5 flex-1"
                              >
                                取消
                              </button>
                              <button
                                onClick={handleSaveAsTemplate}
                                disabled={!saveTemplateName.trim()}
                                className="btn-primary text-sm py-1.5 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                保存模板
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-4 mt-2">
                  <h4 className="font-medium text-slate-700 text-sm mb-3">
                    自定义任务清单
                  </h4>
                  <div className="max-h-[400px] overflow-y-auto pr-2 -mr-2">
                    <TaskTemplateEditor tasks={customTasks} onChange={setCustomTasks} />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setStep(isAddMode ? 1 : 2)}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    上一步
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceedStep3}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isAddMode ? '创建事务空间' : '开始使用'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
