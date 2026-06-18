import { Router, type Request, type Response } from 'express';

const router = Router();

interface Appointment {
  id: string;
  funeralHomeId: string;
  funeralHomeName: string;
  contactName: string;
  contactPhone: string;
  contactRelation: string;
  deceasedName: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  remark?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  confirmedAt?: string;
}

let appointments: Appointment[] = [];

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

const validateDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today && !isNaN(date.getTime());
};

const validateTime = (timeStr: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(timeStr);
};

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      funeralHomeId,
      funeralHomeName,
      contactName,
      contactPhone,
      contactRelation,
      deceasedName,
      appointmentDate,
      appointmentTime,
      serviceType,
      remark,
    } = req.body;

    if (!funeralHomeId || !funeralHomeName) {
      res.status(400).json({
        success: false,
        error: '请选择殡仪馆',
      });
      return;
    }

    if (!contactName || contactName.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: '请填写联系人姓名',
      });
      return;
    }

    if (!contactPhone || !validatePhone(contactPhone)) {
      res.status(400).json({
        success: false,
        error: '请填写正确的手机号码',
      });
      return;
    }

    if (!contactRelation || contactRelation.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: '请填写与逝者关系',
      });
      return;
    }

    if (!deceasedName || deceasedName.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: '请填写逝者姓名',
      });
      return;
    }

    if (!appointmentDate || !validateDate(appointmentDate)) {
      res.status(400).json({
        success: false,
        error: '请选择有效的预约日期',
      });
      return;
    }

    if (!appointmentTime || !validateTime(appointmentTime)) {
      res.status(400).json({
        success: false,
        error: '请选择预约时间',
      });
      return;
    }

    if (!serviceType || serviceType.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: '请选择服务类型',
      });
      return;
    }

    const newAppointment: Appointment = {
      id: generateId(),
      funeralHomeId,
      funeralHomeName,
      contactName: contactName.trim(),
      contactPhone,
      contactRelation: contactRelation.trim(),
      deceasedName: deceasedName.trim(),
      appointmentDate,
      appointmentTime,
      serviceType: serviceType.trim(),
      remark: remark?.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    appointments.push(newAppointment);

    res.status(201).json({
      success: true,
      data: newAppointment,
      message: '预约提交成功，我们将尽快与您联系确认',
    });
  } catch (error) {
    console.error('创建预约失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
    });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = appointments.find((a) => a.id === id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        error: '预约记录不存在',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('查询预约失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
    });
  }
});

router.get('/phone/:phone', async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.params;
    const userAppointments = appointments
      .filter((a) => a.contactPhone === phone)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.status(200).json({
      success: true,
      data: userAppointments,
    });
  } catch (error) {
    console.error('查询预约列表失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
    });
  }
});

router.put('/:id/confirm', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointmentIndex = appointments.findIndex((a) => a.id === id);

    if (appointmentIndex === -1) {
      res.status(404).json({
        success: false,
        error: '预约记录不存在',
      });
      return;
    }

    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      data: appointments[appointmentIndex],
      message: '预约已确认',
    });
  } catch (error) {
    console.error('确认预约失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
    });
  }
});

router.put('/:id/cancel', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointmentIndex = appointments.findIndex((a) => a.id === id);

    if (appointmentIndex === -1) {
      res.status(404).json({
        success: false,
        error: '预约记录不存在',
      });
      return;
    }

    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      status: 'cancelled',
    };

    res.status(200).json({
      success: true,
      data: appointments[appointmentIndex],
      message: '预约已取消',
    });
  } catch (error) {
    console.error('取消预约失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
    });
  }
});

export default router;
