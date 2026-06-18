import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import type { FuneralHome, Appointment } from '@/types';
import { APPOINTMENT_SERVICE_TYPES } from '@/types';
import { Calendar, Clock, User, Phone, UserCircle, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  funeralHome: FuneralHome | null;
}

interface FormData {
  contactName: string;
  contactPhone: string;
  contactRelation: string;
  deceasedName: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  remark: string;
}

interface FormErrors {
  contactName?: string;
  contactPhone?: string;
  contactRelation?: string;
  deceasedName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  serviceType?: string;
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00',
];

export const AppointmentModal = ({ isOpen, onClose, funeralHome }: AppointmentModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    contactName: '',
    contactPhone: '',
    contactRelation: '',
    deceasedName: '',
    appointmentDate: '',
    appointmentTime: '',
    serviceType: '',
    remark: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    appointment?: Appointment;
  } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.contactName.trim()) {
      newErrors.contactName = '请填写联系人姓名';
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = '请填写联系电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = '请填写正确的手机号码';
    }

    if (!formData.contactRelation.trim()) {
      newErrors.contactRelation = '请填写与逝者关系';
    }

    if (!formData.deceasedName.trim()) {
      newErrors.deceasedName = '请填写逝者姓名';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = '请选择预约日期';
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = '请选择预约时间';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = '请选择服务类型';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !funeralHome) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          funeralHomeId: funeralHome.id,
          funeralHomeName: funeralHome.name,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitResult({
          success: true,
          message: data.message,
          appointment: data.data,
        });
      } else {
        setSubmitResult({
          success: false,
          message: data.error || '预约提交失败，请重试',
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: '网络错误，请稍后重试',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleClose = () => {
    setFormData({
      contactName: '',
      contactPhone: '',
      contactRelation: '',
      deceasedName: '',
      appointmentDate: '',
      appointmentTime: '',
      serviceType: '',
      remark: '',
    });
    setErrors({});
    setSubmitResult(null);
    onClose();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!funeralHome) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="在线预约" size="lg">
      {submitResult && submitResult.success ? (
        <div className="text-center py-8 animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">预约提交成功</h3>
          <p className="text-slate-600 mb-6">{submitResult.message}</p>

          {submitResult.appointment && (
            <div className="bg-slate-50 rounded-xl p-5 text-left mb-6">
              <h4 className="font-medium text-slate-700 mb-3">预约信息</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">预约编号</span>
                  <span className="font-medium text-primary-700">{submitResult.appointment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">殡仪馆</span>
                  <span className="font-medium">{submitResult.appointment.funeralHomeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">服务类型</span>
                  <span className="font-medium">{submitResult.appointment.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">预约时间</span>
                  <span className="font-medium">
                    {submitResult.appointment.appointmentDate} {submitResult.appointment.appointmentTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">联系人</span>
                  <span className="font-medium">{submitResult.appointment.contactName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">联系电话</span>
                  <span className="font-medium">{submitResult.appointment.contactPhone}</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-gold-50 rounded-xl border border-gold-200 mb-6">
            <p className="text-sm text-gold-700">
              温馨提示：殡仪馆工作人员将在1个工作日内与您联系确认预约详情，请保持电话畅通。
            </p>
          </div>

          <button onClick={handleClose} className="btn-primary w-full">
            完成
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-primary-800">{funeralHome.name}</h4>
                <p className="text-sm text-primary-600">{funeralHome.address}</p>
              </div>
            </div>
          </div>

          {submitResult && !submitResult.success && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{submitResult.message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <User className="w-4 h-4 inline mr-1" />
                联系人姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="请输入联系人姓名"
                className={`input-field ${errors.contactName ? 'border-red-400 focus:ring-red-500' : ''}`}
              />
              {errors.contactName && (
                <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <Phone className="w-4 h-4 inline mr-1" />
                联系电话 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="请输入手机号码"
                className={`input-field ${errors.contactPhone ? 'border-red-400 focus:ring-red-500' : ''}`}
              />
              {errors.contactPhone && (
                <p className="text-xs text-red-500 mt-1">{errors.contactPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <UserCircle className="w-4 h-4 inline mr-1" />
                与逝者关系 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contactRelation}
                onChange={(e) => handleInputChange('contactRelation', e.target.value)}
                placeholder="如：子女、配偶、亲属等"
                className={`input-field ${errors.contactRelation ? 'border-red-400 focus:ring-red-500' : ''}`}
              />
              {errors.contactRelation && (
                <p className="text-xs text-red-500 mt-1">{errors.contactRelation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <User className="w-4 h-4 inline mr-1" />
                逝者姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.deceasedName}
                onChange={(e) => handleInputChange('deceasedName', e.target.value)}
                placeholder="请输入逝者姓名"
                className={`input-field ${errors.deceasedName ? 'border-red-400 focus:ring-red-500' : ''}`}
              />
              {errors.deceasedName && (
                <p className="text-xs text-red-500 mt-1">{errors.deceasedName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <Calendar className="w-4 h-4 inline mr-1" />
                预约日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.appointmentDate}
                min={getTodayDate()}
                onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                className={`input-field ${errors.appointmentDate ? 'border-red-400 focus:ring-red-500' : ''}`}
              />
              {errors.appointmentDate && (
                <p className="text-xs text-red-500 mt-1">{errors.appointmentDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <Clock className="w-4 h-4 inline mr-1" />
                预约时间 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.appointmentTime}
                onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
                className={`input-field ${errors.appointmentTime ? 'border-red-400 focus:ring-red-500' : ''}`}
              >
                <option value="">请选择时间</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.appointmentTime && (
                <p className="text-xs text-red-500 mt-1">{errors.appointmentTime}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              服务类型 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {APPOINTMENT_SERVICE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleInputChange('serviceType', type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.serviceType === type
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {errors.serviceType && (
              <p className="text-xs text-red-500 mt-1">{errors.serviceType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              备注信息
            </label>
            <textarea
              value={formData.remark}
              onChange={(e) => handleInputChange('remark', e.target.value)}
              placeholder="如有特殊需求请在此说明（选填）"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="p-4 bg-gold-50 rounded-xl border border-gold-200">
            <p className="text-sm text-gold-700">
              <strong>温馨提示：</strong>提交预约后，殡仪馆工作人员将在1个工作日内与您联系确认。
              如需紧急服务，请直接拨打殡仪馆电话：
              <a href={`tel:${funeralHome.phone}`} className="text-primary-600 hover:underline ml-1">
                {funeralHome.phone}
              </a>
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '提交预约'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
