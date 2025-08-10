import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentAdded: () => void;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

const AddAppointmentDialog = ({ open, onOpenChange, onAppointmentAdded }: AddAppointmentDialogProps) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: '30',
    notes: ''
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      fetchDoctors();
    }
  }, [open]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialization')
        .eq('status', 'available')
        .order('name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors.",
        variant: "destructive",
      });
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
    if (!selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select a doctor.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_name: formData.patientName,
          patient_phone: formData.patientPhone,
          patient_email: formData.patientEmail || null,
          doctor_id: formData.doctorId,
          doctor_name: selectedDoctor.name,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          duration_minutes: parseInt(formData.duration),
          notes: formData.notes || null,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Appointment booked successfully.",
      });

      setFormData({
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        duration: '30',
        notes: ''
      });
      onAppointmentAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book New Appointment</DialogTitle>
          <DialogDescription>
            Schedule a new appointment for a patient.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name *</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder="John Smith"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientPhone">Phone *</Label>
              <Input
                id="patientPhone"
                value={formData.patientPhone}
                onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientEmail">Email</Label>
              <Input
                id="patientEmail"
                type="email"
                value={formData.patientEmail}
                onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                placeholder="patient@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctorId">Doctor *</Label>
            <Select
              value={formData.doctorId}
              onValueChange={(value) => setFormData({ ...formData, doctorId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingDoctors ? "Loading doctors..." : "Select doctor"} />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Date *</Label>
              <Input
                id="appointmentDate"
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                min={today}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Time *</Label>
              <Input
                id="appointmentTime"
                type="time"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => setFormData({ ...formData, duration: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special instructions or notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
              disabled={loading || loadingDoctors}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentDialog;