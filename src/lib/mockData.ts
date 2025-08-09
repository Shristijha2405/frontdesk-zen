export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  gender: 'male' | 'female' | 'other';
  location: string;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  status: 'available' | 'busy' | 'offline';
  currentPatients: number;
  maxPatients: number;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'booked' | 'completed' | 'cancelled' | 'rescheduled';
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
}

export interface QueueItem {
  id: string;
  queueNumber: number;
  patientName: string;
  phone: string;
  checkInTime: string;
  waitTime: string;
  status: 'waiting' | 'with-doctor' | 'completed' | 'urgent';
  priority: boolean;
  doctorId?: string;
  estimatedTime?: string;
}

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'General Practice',
    gender: 'female',
    location: 'Room 101',
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
    ],
    status: 'available',
    currentPatients: 3,
    maxPatients: 8
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Cardiology',
    gender: 'male',
    location: 'Room 205',
    availability: [
      { day: 'Monday', startTime: '10:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '16:00' },
      { day: 'Friday', startTime: '10:00', endTime: '16:00' },
    ],
    status: 'busy',
    currentPatients: 5,
    maxPatients: 6
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrics',
    gender: 'female',
    location: 'Room 102',
    availability: [
      { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Friday', startTime: '08:00', endTime: '16:00' },
    ],
    status: 'available',
    currentPatients: 2,
    maxPatients: 10
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialization: 'Orthopedics',
    gender: 'male',
    location: 'Room 301',
    availability: [
      { day: 'Monday', startTime: '11:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '11:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '11:00', endTime: '18:00' },
    ],
    status: 'offline',
    currentPatients: 0,
    maxPatients: 6
  }
];

export const mockQueue: QueueItem[] = [
  {
    id: '1',
    queueNumber: 1,
    patientName: 'John Smith',
    phone: '+1-555-0101',
    checkInTime: '09:15 AM',
    waitTime: '15 min',
    status: 'waiting',
    priority: false,
    doctorId: '1',
    estimatedTime: '10 min'
  },
  {
    id: '2',
    queueNumber: 2,
    patientName: 'Maria Garcia',
    phone: '+1-555-0102',
    checkInTime: '09:30 AM',
    waitTime: '30 min',
    status: 'with-doctor',
    priority: false,
    doctorId: '2'
  },
  {
    id: '3',
    queueNumber: 3,
    patientName: 'Robert Brown',
    phone: '+1-555-0103',
    checkInTime: '09:45 AM',
    waitTime: '5 min',
    status: 'urgent',
    priority: true,
    doctorId: '1',
    estimatedTime: '5 min'
  },
  {
    id: '4',
    queueNumber: 4,
    patientName: 'Lisa Chen',
    phone: '+1-555-0104',
    checkInTime: '10:00 AM',
    waitTime: '2 min',
    status: 'waiting',
    priority: false,
    doctorId: '3',
    estimatedTime: '15 min'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Alice Johnson',
    patientPhone: '+1-555-0201',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    time: '10:30 AM',
    status: 'booked',
    type: 'consultation',
    notes: 'Regular checkup'
  },
  {
    id: '2',
    patientName: 'David Wilson',
    patientPhone: '+1-555-0202',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    date: '2024-01-15',
    time: '02:00 PM',
    status: 'booked',
    type: 'follow-up',
    notes: 'Heart condition follow-up'
  },
  {
    id: '3',
    patientName: 'Emma Davis',
    patientPhone: '+1-555-0203',
    doctorId: '3',
    doctorName: 'Dr. Emily Rodriguez',
    date: '2024-01-15',
    time: '11:00 AM',
    status: 'completed',
    type: 'consultation',
    notes: 'Child vaccination'
  },
  {
    id: '4',
    patientName: 'Michael Turner',
    patientPhone: '+1-555-0204',
    doctorId: '4',
    doctorName: 'Dr. James Wilson',
    date: '2024-01-16',
    time: '03:30 PM',
    status: 'booked',
    type: 'consultation',
    notes: 'Knee pain assessment'
  }
];

export const dashboardStats = {
  totalPatientsToday: 28,
  currentQueue: 4,
  completedToday: 15,
  urgentCases: 1,
  availableDoctors: 2,
  totalAppointments: 12,
  trendsData: {
    patientsToday: { value: 12, isPositive: true },
    queueTime: { value: -8, isPositive: true },
    appointments: { value: 5, isPositive: true },
    satisfaction: { value: 3, isPositive: true }
  }
};