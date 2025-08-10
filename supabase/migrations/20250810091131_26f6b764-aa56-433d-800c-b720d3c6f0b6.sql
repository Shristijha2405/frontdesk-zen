-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
  max_patients INTEGER DEFAULT 10,
  current_patients INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  doctor_name TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'booked' CHECK (status IN ('booked', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create queue table
CREATE TABLE public.queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  queue_number INTEGER NOT NULL,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'with-doctor', 'completed', 'urgent')),
  priority BOOLEAN DEFAULT false,
  estimated_time_minutes INTEGER DEFAULT 15,
  notes TEXT,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for doctors
CREATE POLICY "Users can view all doctors" 
ON public.doctors 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can insert doctors" 
ON public.doctors 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update doctors" 
ON public.doctors 
FOR UPDATE 
TO authenticated
USING (true);

-- Create RLS policies for appointments
CREATE POLICY "Users can view all appointments" 
ON public.appointments 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can insert appointments" 
ON public.appointments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update appointments" 
ON public.appointments 
FOR UPDATE 
TO authenticated
USING (true);

-- Create RLS policies for queue
CREATE POLICY "Users can view all queue items" 
ON public.queue 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can insert queue items" 
ON public.queue 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update queue items" 
ON public.queue 
FOR UPDATE 
TO authenticated
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_queue_updated_at
BEFORE UPDATE ON public.queue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();